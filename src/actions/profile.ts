"use server";

import { revalidatePath } from "next/cache";
import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";
import { updateProfileSchema, uploadAvatarSchema } from "@/schemas/profile";
import { z } from "zod";

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

    // El título de profile es full_name en la BD
    const updateData: Record<string, string | null | undefined> = {};
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

    // Solo actualizar si hay datos
    if (Object.keys(updateData).length > 0) {
      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);

      if (error) {
        throw new Error("Error al actualizar la apariencia");
      }
    }

    revalidatePath("/[locale]/admin/appearance", "page");
    revalidatePath("/[locale]/[username]", "page");

    return { success: true };
  });

// No validamos File con Zod en la action porque next-safe-action y Files a veces
// tienen quirks, en su lugar usamos una action genérica envuelta o FormData.
// Como el usuario debe pasar un string base64 o subir directamente,
// Usaremos FormData estándar para file uploads validada por zod-form-data
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

    // SCALE-012: Clean up previous avatar before uploading new one
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();

    if (currentProfile?.avatar_url) {
      // Extract file path from the public URL
      const urlParts = currentProfile.avatar_url.split("/avatars/");
      if (urlParts.length > 1) {
        const oldFilePath = decodeURIComponent(urlParts[1]);
        await supabase.storage.from("avatars").remove([oldFilePath]);
      }
    }

    // Subir fichero a Storage (bucket 'avatars')
    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      throw new Error("Error al subir la imagen");
    }

    // Obtener URL pública
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    // Actualizar profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);

    if (updateError) {
      throw new Error("Error al actualizar la foto de perfil");
    }

    revalidatePath("/[locale]/admin/appearance", "page");
    revalidatePath("/[locale]/[username]", "page");

    return { success: true, avatar_url: publicUrl };
  });
