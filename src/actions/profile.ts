"use server";

import { revalidatePath } from "next/cache";
import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";
import { updateProfileSchema, uploadAvatarSchema } from "@/schemas/profile";

export const updateProfile = actionClient
  .schema(updateProfileSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No estás autenticado");
    }

    const updateData: Record<string, string | null | undefined | boolean> = {};
    if (parsedInput.title !== undefined)
      updateData.full_name = parsedInput.title;
    if (parsedInput.bio !== undefined) updateData.bio = parsedInput.bio;
    if (parsedInput.accent_color !== undefined)
      updateData.accent_color = parsedInput.accent_color;
    if (parsedInput.button_style !== undefined)
      updateData.button_style = parsedInput.button_style;
    if (parsedInput.font_family !== undefined)
      updateData.font_family = parsedInput.font_family;
    if (parsedInput.theme !== undefined) updateData.theme = parsedInput.theme;
    if (parsedInput.background_color !== undefined)
      updateData.background_color = parsedInput.background_color;
    if (parsedInput.layout_mode !== undefined)
      updateData.layout_mode = parsedInput.layout_mode;

    if (Object.keys(updateData).length > 0) {
      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);

      if (error) {
        throw new Error("Error al actualizar la apariencia");
      }
    }

    revalidatePath("/[locale]/dashboard/appearance", "page");
    revalidatePath("/[locale]/[username]", "page");

    return { success: true };
  });

export const updateAvatar = actionClient
  .schema(uploadAvatarSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No estás autenticado");
    }

    const file = parsedInput.file as File;

    // Clean up previous avatar before uploading new one
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();

    if (currentProfile?.avatar_url) {
      const urlParts = currentProfile.avatar_url.split("/avatars/");
      if (urlParts.length > 1) {
        const oldFilePath = decodeURIComponent(urlParts[1]);
        await supabase.storage.from("avatars").remove([oldFilePath]);
      }
    }

    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      throw new Error("Error al subir la imagen");
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);

    if (updateError) {
      throw new Error("Error al actualizar la foto de perfil");
    }

    revalidatePath("/[locale]/dashboard/appearance", "page");
    revalidatePath("/[locale]/[username]", "page");

    return { success: true, avatar_url: publicUrl };
  });
