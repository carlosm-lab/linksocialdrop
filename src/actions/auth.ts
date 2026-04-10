"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, signupSchema } from "@/schemas/auth";
import { actionClient } from "@/lib/safe-action";

export const login = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: parsedInput.email,
      password: parsedInput.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/", "layout");
    return { success: true };
  });

export const signup = actionClient
  .schema(signupSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const { error } = await supabase.auth.signUp({
      email: parsedInput.email,
      password: parsedInput.password,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/", "layout");
    return { success: true };
  });

export async function signInWithGoogle() {
  const supabase = await createClient();
  const locale = await getLocale();

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl}/auth/callback?next=/${locale}/admin/links`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");

  const locale = await getLocale();
  redirect(`/${locale}/login`);
}
