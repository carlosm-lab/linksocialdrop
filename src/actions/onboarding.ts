"use server";

import { revalidatePath } from "next/cache";
import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";
import { onboardingSchema } from "@/schemas/onboarding";

export const completeOnboarding = actionClient
  .schema(onboardingSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No estás autenticado");
    }

    // 1. Check if username is already taken by another user
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", parsedInput.username)
      .neq("id", user.id)
      .single();

    if (existingUser) {
      throw new Error("El username ya está en uso");
    }

    // 2. Update profile
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        username: parsedInput.username,
        full_name: parsedInput.full_name,
        bio: parsedInput.bio,
      })
      .eq("id", user.id);

    if (profileError) {
      throw new Error("Error al actualizar el perfil");
    }

    // 3. Create the first link
    const { error: linkError } = await supabase.from("links").insert({
      user_id: user.id,
      title: parsedInput.link_title,
      url: parsedInput.link_url,
      position: 0,
      is_active: true,
    });

    if (linkError) {
      throw new Error("Error al crear el primer enlace");
    }

    revalidatePath("/[locale]/dashboard", "layout");

    return { success: true };
  });
