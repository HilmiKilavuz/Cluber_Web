"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import { useAuth } from "@/hooks/auth/useAuth";
import {
  type RegisterFormValues,
  registerSchema,
} from "@/lib/auth/authSchemas";

export function RegisterForm() {
  const router = useRouter();
  const { registerMutation } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Log errors whenever they change
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form errors:", errors);
    }
  }, [errors]);

  const onSubmit = async (values: RegisterFormValues): Promise<void> => {
    console.log("Registering with:", values);
    try {
      await registerMutation.mutateAsync({
        email: values.email,
        username: values.username,
        displayName: values.username, // Using username as displayName too
        password: values.password,
      });
      console.log("Registration successful");
      router.push("/");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
        >
          E-posta
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-200 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:ring-zinc-700"
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="username"
          className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
        >
          Kullanıcı Adı
        </label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-200 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:ring-zinc-700"
          {...register("username")}
        />
        {errors.username ? (
          <p className="text-xs text-red-500">{errors.username.message}</p>
        ) : null}
      </div>


      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
        >
          Şifre
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-200 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:ring-zinc-700"
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
        >
          Şifre (Tekrar)
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-200 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:ring-zinc-700"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword ? (
          <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || registerMutation.isPending}
        className="inline-flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {isSubmitting || registerMutation.isPending
          ? "Kayıt oluşturuluyor..."
          : "Kayıt Ol"}
      </button>

      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Zaten hesabın var mı?{" "}
        <Link href="/login" className="font-medium underline underline-offset-2">
          Giriş yap
        </Link>
      </p>
    </form>
  );
}

