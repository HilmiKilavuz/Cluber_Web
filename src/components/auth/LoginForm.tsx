"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowRight, Loader2 } from "lucide-react";

import { useAuth } from "@/hooks/auth/useAuth";
import { type LoginFormValues, loginSchema } from "@/lib/auth/authSchemas";

export function LoginForm() {
  const router = useRouter();
  const { loginMutation } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    try {
      await loginMutation.mutateAsync(values);
      router.push("/");
    } catch {
      // Hata yönetimi mutation tarafından ele alınıyor
    }
  };

  const isLoading = isSubmitting || loginMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      style={{ display: "flex", flexDirection: "column", gap: "20px" }}
    >
      {/* E-posta */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label
          htmlFor="email"
          style={{
            fontSize: "13px",
            fontWeight: 500,
            fontFamily: "var(--font-sans)",
            color: "var(--color-ink)",
          }}
        >
          E-posta
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="ornek@email.com"
          className="input-base"
          {...register("email")}
          style={{
            border: errors.email
              ? "1px solid var(--color-error)"
              : "1px solid var(--color-border)",
          }}
        />
        {errors.email && (
          <p
            style={{
              fontSize: "12px",
              color: "var(--color-error)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Şifre */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label
          htmlFor="password"
          style={{
            fontSize: "13px",
            fontWeight: 500,
            fontFamily: "var(--font-sans)",
            color: "var(--color-ink)",
          }}
        >
          Şifre
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="input-base"
          {...register("password")}
          style={{
            border: errors.password
              ? "1px solid var(--color-error)"
              : "1px solid var(--color-border)",
          }}
        />
        {errors.password && (
          <p
            style={{
              fontSize: "12px",
              color: "var(--color-error)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Error alert */}
      {loginMutation.isError && loginMutation.error && (
        <div
          role="alert"
          style={{
            padding: "12px 16px",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--color-error-bg)",
            border: "1px solid",
            borderColor: "color-mix(in srgb, var(--color-error) 30%, transparent)",
            fontSize: "13px",
            fontFamily: "var(--font-sans)",
            color: "var(--color-error)",
          }}
        >
          {loginMutation.error.message}
        </div>
      )}

      {/* Beni Hatırla */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <input
          id="rememberMe"
          type="checkbox"
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "4px",
            accentColor: "var(--color-accent)",
            cursor: "pointer",
          }}
          {...register("rememberMe")}
        />
        <label
          htmlFor="rememberMe"
          style={{
            fontSize: "13px",
            fontFamily: "var(--font-sans)",
            color: "var(--color-ink-secondary)",
            cursor: "pointer",
          }}
        >
          Beni Hatırla
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary btn-lg"
        style={{
          width: "100%",
          opacity: isLoading ? 0.7 : 1,
          cursor: isLoading ? "not-allowed" : "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        {isLoading ? (
          <>
            <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
            Giriş yapılıyor...
          </>
        ) : (
          <>
            Giriş Yap
            <ArrowRight size={16} />
          </>
        )}
      </button>

      {/* Register link */}
      <p
        style={{
          textAlign: "center",
          fontSize: "13px",
          fontFamily: "var(--font-sans)",
          color: "var(--color-ink-secondary)",
        }}
      >
        Hesabın yok mu?{" "}
        <Link
          href="/register"
          className="link-underline"
          style={{
            fontWeight: 500,
            color: "var(--color-ink)",
          }}
        >
          Kayıt ol
        </Link>
      </p>
    </form>
  );
}
