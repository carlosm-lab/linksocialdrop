"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { usernameSchema } from "@/schemas/username";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";

/**
 * Check if a username is available (not taken by another user).
 * Returns { available: boolean }.
 */
export const checkUsername = actionClient
  .schema(usernameSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", parsedInput.username.toLowerCase())
      .maybeSingle();

    return { available: !data };
  });

/**
 * Claim a username for the currently authenticated user.
 * Updates the profiles table. Fails if username is taken (unique constraint).
 */
export const claimUsername = actionClient
  .schema(usernameSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    const { error } = await supabase
      .from("profiles")
      .update({ username: parsedInput.username.toLowerCase() })
      .eq("id", user.id);

    if (error) {
      if (error.code === "23505") {
        throw new Error("Username already taken");
      }
      throw new Error(error.message);
    }

    revalidatePath("/", "layout");
    return { success: true, username: parsedInput.username.toLowerCase() };
  });

/**
 * Check if a username is available for a specific user (excludes their own current username).
 * Used in the appearance page where the user already has a username.
 */
export const checkUsernameForUser = actionClient
  .schema(
    z.object({
      username: usernameSchema.shape.username,
      userId: z.string().uuid(),
    })
  )
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", parsedInput.username.toLowerCase())
      .neq("id", parsedInput.userId)
      .maybeSingle();

    return { available: !data };
  });
