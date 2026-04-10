import { z } from "zod";

/**
 * Username validation:
 * - Only letters (a-z, A-Z), numbers (0-9), dots (.) and underscores (_)
 * - Minimum 3 characters, maximum 30
 */
export const usernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9._]+$/,
      "Only letters, numbers, dots and underscores are allowed"
    ),
});

export type UsernameInput = z.infer<typeof usernameSchema>;
