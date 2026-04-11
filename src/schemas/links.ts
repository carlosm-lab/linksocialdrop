import { z } from "zod";

const hexColor = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, {
    message: "Must be a valid hex color (#RRGGBB)",
  })
  .optional()
  .nullable();

export const createLinkSchema = z.object({
  title: z
    .string()
    .min(1, { message: "El título es requerido" })
    .max(100, { message: "El título es muy largo" }),
  url: z
    .string()
    .url({ message: "Debe ser una URL válida" })
    .max(500, { message: "La URL es muy larga" })
    .refine((url) => url.startsWith("https://") || url.startsWith("http://"), {
      message: "Solo URLs HTTP/HTTPS permitidas",
    }),
  icon: z.string().optional(),
  bg_color: hexColor,
  text_color: hexColor,
});

export const updateLinkSchema = createLinkSchema.extend({
  id: z.string().uuid({ message: "ID inválido" }),
  visible: z.boolean().optional(),
});

export const deleteLinkSchema = z.object({
  id: z.string().uuid({ message: "ID inválido" }),
});

export const toggleLinkVisibilitySchema = z.object({
  id: z.string().uuid({ message: "ID inválido" }),
  visible: z.boolean(),
});

export const reorderLinksSchema = z.object({
  links: z.array(
    z.object({
      id: z.string().uuid(),
      position: z.number().int(),
    })
  ),
});
