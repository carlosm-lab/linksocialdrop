import { z } from "zod";

export const subscribeNewsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
  profileId: z.string().uuid("Invalid profile ID"),
});
