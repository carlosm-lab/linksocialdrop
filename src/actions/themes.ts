"use server";

import { revalidatePath } from "next/cache";
import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";
import {
  applyThemeSchema,
  createThemeSchema,
  updateThemeSchema,
  toggleThemeSchema,
} from "@/schemas/themes";

/**
 * Apply a theme to the current user's profile.
 * For free themes: auto-adds to user_themes and activates.
 * For premium themes: checks if already purchased.
 */
export const applyTheme = actionClient
  .schema(applyThemeSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    // Fetch theme details
    const { data: theme } = await supabase
      .from("themes")
      .select("*")
      .eq("id", parsedInput.theme_id)
      .single();

    if (!theme || !theme.is_active) throw new Error("Theme not found");

    // Check if user already has this theme
    const { data: existingUT } = await supabase
      .from("user_themes")
      .select("id")
      .eq("user_id", user.id)
      .eq("theme_id", theme.id)
      .maybeSingle();

    if (!existingUT) {
      // For premium themes that aren't purchased, block (payment not implemented yet)
      if (theme.price > 0) {
        throw new Error("Theme requires purchase (coming soon)");
      }

      // Add to user_themes
      const { error: insertErr } = await supabase.from("user_themes").insert({
        user_id: user.id,
        theme_id: theme.id,
        is_active: true,
      });
      if (insertErr) throw new Error("Could not acquire theme");
    }

    // Deactivate all other user themes
    await supabase
      .from("user_themes")
      .update({ is_active: false })
      .eq("user_id", user.id);

    // Activate this theme
    await supabase
      .from("user_themes")
      .update({ is_active: true })
      .eq("user_id", user.id)
      .eq("theme_id", theme.id);

    // Apply the theme config to the profile
    const config = theme.config as Record<string, string>;
    const profileUpdate: Record<string, string | null> = {
      active_theme_id: theme.id,
    };
    if (config.accent_color) profileUpdate.accent_color = config.accent_color;
    if (config.button_style) profileUpdate.button_style = config.button_style;
    if (config.font_family) profileUpdate.font_family = config.font_family;
    if (config.background_color)
      profileUpdate.background_color = config.background_color;
    if (config.layout_mode) profileUpdate.layout_mode = config.layout_mode;

    const { error: profileErr } = await supabase
      .from("profiles")
      .update(profileUpdate)
      .eq("id", user.id);

    if (profileErr) throw new Error("Could not apply theme to profile");

    revalidatePath("/[locale]/dashboard/appearance", "page");
    revalidatePath("/[locale]/[username]", "page");

    return { success: true, themeName: theme.name };
  });

/**
 * Admin-only: Create a new theme
 */
export const createTheme = actionClient
  .schema(createThemeSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.email !== process.env.ADMIN_EMAIL) {
      throw new Error("Unauthorized");
    }

    const { error } = await supabase.from("themes").insert({
      name: parsedInput.name,
      slug: parsedInput.slug,
      description: parsedInput.description || null,
      price: parsedInput.price,
      preview_image_url: parsedInput.preview_image_url || null,
      config: parsedInput.config,
      is_active: parsedInput.is_active ?? true,
    });

    if (error) throw new Error("Could not create theme: " + error.message);

    revalidatePath("/[locale]/admin/temas", "page");
    revalidatePath("/[locale]/dashboard/marketplace", "page");

    return { success: true };
  });

/**
 * Admin-only: Update an existing theme
 */
export const updateTheme = actionClient
  .schema(updateThemeSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.email !== process.env.ADMIN_EMAIL) {
      throw new Error("Unauthorized");
    }

    const updates: Record<string, unknown> = {};
    if (parsedInput.name !== undefined) updates.name = parsedInput.name;
    if (parsedInput.slug !== undefined) updates.slug = parsedInput.slug;
    if (parsedInput.description !== undefined)
      updates.description = parsedInput.description;
    if (parsedInput.price !== undefined) updates.price = parsedInput.price;
    if (parsedInput.preview_image_url !== undefined)
      updates.preview_image_url = parsedInput.preview_image_url;
    if (parsedInput.config !== undefined) updates.config = parsedInput.config;
    if (parsedInput.is_active !== undefined)
      updates.is_active = parsedInput.is_active;

    const { error } = await supabase
      .from("themes")
      .update(updates)
      .eq("id", parsedInput.id);

    if (error) throw new Error("Could not update theme");

    revalidatePath("/[locale]/admin/temas", "page");
    revalidatePath("/[locale]/dashboard/marketplace", "page");

    return { success: true };
  });

/**
 * Admin-only: Toggle theme active status
 */
export const toggleThemeActive = actionClient
  .schema(toggleThemeSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.email !== process.env.ADMIN_EMAIL) {
      throw new Error("Unauthorized");
    }

    const { error } = await supabase
      .from("themes")
      .update({ is_active: parsedInput.is_active })
      .eq("id", parsedInput.id);

    if (error) throw new Error("Could not toggle theme");

    revalidatePath("/[locale]/admin/temas", "page");
    return { success: true };
  });
