"use server";

import { revalidatePath } from "next/cache";
import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";
import { updateProfileSchema } from "@/schemas/profile";
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
    const updateData: any = {};
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
// aquí expondremos un action que recibe FormData directamente sin actionClient
// o un actionClient que recibe el formData envuelto.
// Usaremos FormData estándar para file uploads.
export async function updateAvatar(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No estás autenticado" };
  }

  const file = formData.get("file") as File;
  if (!file) {
    return { error: "No se proporcionó archivo" };
  }

  // Subir fichero a Storage (bucket 'avatars')
  const fileExt = file.name.split(".").pop();
  const filePath = `${user.id}-${Math.random()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    return { error: "Error al subir la imagen" };
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
    return { error: "Error al actualizar la foto de perfil" };
  }

  revalidatePath("/[locale]/admin/appearance", "page");
  revalidatePath("/[locale]/[username]", "page");

  return { success: true, avatar_url: publicUrl };
}
