"use server";

import { actionClient } from "@/lib/safe-action";
import { subscribeNewsletterSchema } from "@/schemas/newsletter";

export const subscribeToNewsletter = actionClient
  .schema(subscribeNewsletterSchema)
  .action(async ({ parsedInput }) => {
    // Aquí puedes incluir la inserción de Supabase a futuro:
    // const supabase = await createClient();
    // await supabase.from('newsletter_subscribers').insert({ email: parsedInput.email, profile_id: parsedInput.profileId });

    // Simulamos un delay de red y éxito temporalmente
    await new Promise((resolve) => setTimeout(resolve, 800));

    return { success: true, message: "Subscribed successfully" };
  });
