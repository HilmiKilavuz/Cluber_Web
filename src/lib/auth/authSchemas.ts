import { z } from "zod";

/**
 * Strong password validation regex.
 * Must contain at least:
 * - 8 characters
 * - One uppercase letter
 * - One lowercase letter
 * - One digit
 * - One special character
 */
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/~`])[A-Za-z\d@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/~`]{8,72}$/;

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin."),
  password: z.string().min(8, "Şifre en az 8 karakter olmalıdır."),
  rememberMe: z.boolean(),
});

export const registerSchema = z
  .object({
    email: z.string().email("Geçerli bir e-posta adresi girin."),
    username: z
      .string()
      .min(2, "Kullanıcı adı en az 2 karakter olmalıdır.")
      .max(50, "Kullanıcı adı en fazla 50 karakter olabilir."),
    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalıdır.")
      .max(72, "Şifre en fazla 72 karakter olabilir.")
      .regex(
        strongPasswordRegex,
        "Şifre en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir."
      ),
    confirmPassword: z.string().min(8, "Şifre tekrarı zorunludur."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Şifreler eşleşmiyor.",
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

/**
 * Şifre değiştirme formu validation schema.
 * Mevcut şifre + yeni şifre (güçlü şifre politikası) + şifre tekrarı
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Mevcut şifre gereklidir."),
    newPassword: z
      .string()
      .min(8, "Yeni şifre en az 8 karakter olmalıdır.")
      .max(72, "Yeni şifre en fazla 72 karakter olabilir.")
      .regex(
        strongPasswordRegex,
        "Şifre en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir."
      ),
    confirmNewPassword: z
      .string()
      .min(1, "Yeni şifre tekrarı gereklidir."),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Şifreler eşleşmiyor.",
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
