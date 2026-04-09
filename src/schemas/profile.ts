import { z } from "zod";

export const updateProfileSchema = z.object({
  title: z
    .string()
    .max(50, { message: "El título es muy largo" })
    .optional()
    .nullable(),
  bio: z
    .string()
    .max(300, { message: "La descripción es muy larga" })
    .optional()
    .nullable(),
  accent_color: z.string().optional().nullable(),
  button_style: z.enum(["pill", "rounded", "square"]).optional().nullable(),
  font_family: z.string().optional().nullable(),
  theme: z.string().optional().nullable(),
  background_color: z.string().optional().nullable(),
});

// For updating avatar, we usually handle FormData file directly or base64
// We can define a schema to validate file size/type if needed
export const updateAvatarSchema = z.object({
  // Accept standard FormData File wrapper, but zod validations for File on SSR can be tricky if not defined well.
  // We'll keep it simple or validate in the action handler itself to avoid issues.
  fileSize: z
    .number()
    .max(5 * 1024 * 1024, "Image must be less than 5MB")
    .optional(),
});
