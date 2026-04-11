import { z } from "zod";

export const applyThemeSchema = z.object({
  theme_id: z.string().uuid(),
});

export const createThemeSchema = z.object({
  name: z.string().min(2).max(50),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().max(200).optional(),
  price: z.number().min(0).max(999),
  preview_image_url: z.string().optional(),
  config: z.object({
    accent_color: z.string().optional(),
    button_style: z.string().optional(),
    font_family: z.string().optional(),
    background_color: z.string().optional(),
    layout_mode: z.string().optional(),
  }),
  is_active: z.boolean().optional(),
});

export const updateThemeSchema = createThemeSchema.partial().extend({
  id: z.string().uuid(),
});

export const toggleThemeSchema = z.object({
  id: z.string().uuid(),
  is_active: z.boolean(),
});

export type ApplyThemeInput = z.infer<typeof applyThemeSchema>;
export type CreateThemeInput = z.infer<typeof createThemeSchema>;
export type UpdateThemeInput = z.infer<typeof updateThemeSchema>;
