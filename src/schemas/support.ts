import { z } from "zod";

export const supportMessageSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100),
  email: z.string().email("Correo electrónico inválido"),
  subject: z
    .string()
    .min(3, "El asunto debe tener al menos 3 caracteres")
    .max(150),
  message: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(500, "El mensaje no puede superar los 500 caracteres"),
});
