import { z } from "zod";
import { zfd } from "zod-form-data";

export const loginSchema = zfd.formData({
  email: zfd.text(z.string().email("Email inválido")),
  password: zfd.text(
    z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
  ),
});

export const signupSchema = zfd.formData({
  email: zfd.text(z.string().email("Email inválido")),
  password: zfd.text(
    z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
  ),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
