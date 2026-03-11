import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
  rememberMe: z.boolean(),
});

export const registerSchema = z
  .object({
    email: z.string().email("Geçerli bir e-posta adresi girin."),
    username: z
      .string()
      .min(2, "Kullanıcı adı en az 2 karakter olmalıdır.")
      .max(50, "Kullanıcı adı en fazla 50 karakter olabilir."),
    password: z.string().min(8, "Şifre en az 8 karakter olmalıdır."),
    confirmPassword: z.string().min(8, "Şifre tekrarı zorunludur."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Şifreler eşleşmiyor.",
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
