import { z } from "zod";

export const recordPageViewSchema = z.object({
  profile_id: z.string().uuid(),
  referrer: z.string().optional().nullable(),
});

export const recordLinkClickSchema = z.object({
  link_id: z.string().uuid(),
  user_id: z.string().uuid(),
  referrer: z.string().optional().nullable(),
});
