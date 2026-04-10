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
  accent_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, {
      message: "Must be a valid hex color (#RRGGBB)",
    })
    .optional()
    .nullable(),
  button_style: z.enum(["pill", "rounded", "square"]).optional().nullable(),
  font_family: z.string().optional().nullable(),
  theme: z.string().optional().nullable(),
  background_color: z.string().optional().nullable(),
});

import { zfd } from "zod-form-data";

export const uploadAvatarSchema = zfd.formData({
  file: zfd
    .file()
    .refine(
      (file) => file.size < 5 * 1024 * 1024,
      "Image must be less than 5MB"
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only .jpg, .png y .webp son permitidos"
    ),
});
