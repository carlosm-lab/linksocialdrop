import { z } from "zod";

export const onboardingSchema = z.object({
  username: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(30, "Máximo 30 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "Solo letras, números y guiones bajos"),
  full_name: z.string().min(1, "El nombre es obligatorio"),
  bio: z.string().max(160, "Máximo 160 caracteres").optional().default(""),
  link_title: z.string().min(1, "El título del enlace es obligatorio"),
  link_url: z.string().url("URL inválida"),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;
