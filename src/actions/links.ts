"use server";

import { revalidatePath } from "next/cache";
import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";
import {
  createLinkSchema,
  deleteLinkSchema,
  reorderLinksSchema,
  toggleLinkVisibilitySchema,
  updateLinkSchema,
} from "@/schemas/links";

export const createLink = actionClient
  .schema(createLinkSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("No estás autenticado");
    }

    // Get highest position to append at the end
    const { data: highestLink } = await supabase
      .from("links")
      .select("position")
      .eq("user_id", user.id)
      .order("position", { ascending: false })
      .limit(1)
      .single();

    const nextPosition = highestLink ? (highestLink.position || 0) + 1 : 0;

    const { data, error } = await supabase
      .from("links")
      .insert({
        user_id: user.id,
        title: parsedInput.title,
        url: parsedInput.url,
        icon: parsedInput.icon || "link",
        position: nextPosition,
        visible: true,
      })
      .select()
      .single();

    if (error) {
      throw new Error("Error al crear el link");
    }

    revalidatePath("/[locale]/admin/links", "page");
    revalidatePath("/[locale]/[username]", "page");

    return data;
  });

export const updateLink = actionClient
  .schema(updateLinkSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("No estás autenticado");

    const { data, error } = await supabase
      .from("links")
      .update({
        title: parsedInput.title,
        url: parsedInput.url,
        icon: parsedInput.icon,
        ...(parsedInput.visible !== undefined && {
          visible: parsedInput.visible,
        }),
      })
      .eq("id", parsedInput.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      throw new Error("Error al actualizar el link");
    }

    revalidatePath("/[locale]/admin/links", "page");
    revalidatePath("/[locale]/[username]", "page");

    return data;
  });

export const deleteLink = actionClient
  .schema(deleteLinkSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("No estás autenticado");

    const { error } = await supabase
      .from("links")
      .delete()
      .eq("id", parsedInput.id)
      .eq("user_id", user.id);

    if (error) {
      throw new Error("Error al eliminar el link");
    }

    revalidatePath("/[locale]/admin/links", "page");
    revalidatePath("/[locale]/[username]", "page");

    return { success: true };
  });

export const toggleLinkVisibility = actionClient
  .schema(toggleLinkVisibilitySchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("No estás autenticado");

    const { data, error } = await supabase
      .from("links")
      .update({ visible: parsedInput.visible })
      .eq("id", parsedInput.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      throw new Error("Error al cambiar la visibilidad");
    }

    revalidatePath("/[locale]/admin/links", "page");
    revalidatePath("/[locale]/[username]", "page");

    return data;
  });

export const reorderLinks = actionClient
  .schema(reorderLinksSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("No estás autenticado");

    // Supabase JS doesn't have a bulk update by default that works cleanly,
    // so we'll do it sequentially or via an upsert approach. Sequential is fine given small N.
    const promises = parsedInput.links.map((link) =>
      supabase
        .from("links")
        .update({ position: link.position })
        .eq("id", link.id)
        .eq("user_id", user.id)
    );

    await Promise.all(promises);

    revalidatePath("/[locale]/admin/links", "page");
    revalidatePath("/[locale]/[username]", "page");

    return { success: true };
  });
