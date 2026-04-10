"use server";

import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";
import { supportMessageSchema } from "@/schemas/support";

export const submitSupportMessage = actionClient
  .schema(supportMessageSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const { error } = await supabase.from("support_messages").insert({
      name: parsedInput.name,
      email: parsedInput.email,
      subject: parsedInput.subject,
      message: parsedInput.message,
    });

    if (error) {
      throw new Error("Error al enviar el mensaje de soporte");
    }

    return { success: true };
  });
