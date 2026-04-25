"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { ArrowRight, Loader2, MailCheck } from "lucide-react";

import { useAuth } from "@/hooks/auth/useAuth";
import {
  type RegisterFormValues,
  registerSchema,
} from "@/lib/auth/authSchemas";
import { PasswordStrengthIndicator } from "@/components/ui/PasswordStrengthIndicator";

/* Reusable field wrapper */
function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label
        htmlFor={htmlFor}
        style={{
          fontSize: "13px",
          fontWeight: 500,
          fontFamily: "var(--font-sans)",
          color: "var(--color-ink)",
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p style={{ fontSize: "12px", color: "var(--color-error)", fontFamily: "var(--font-sans)" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const { registerMutation, verifyEmailMutation } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const {
    register,
    handleSubmit,
    watch,
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

  const password = watch("password", "");

  const onSubmit = async (values: RegisterFormValues): Promise<void> => {
    try {
      await registerMutation.mutateAsync({
        email: values.email,
        displayName: values.username,
        password: values.password,
      });
      setRegisteredEmail(values.email);
      setIsVerifying(true);
    } catch {
      // Hata yönetimi mutation tarafından ele alınıyor
    }
  };

  /* ── Verify step ── */
  if (isVerifying) {
    return (
      <form
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const code = formData.get("code") as string;
          if (!code || code.length !== 6) return;
          try {
            await verifyEmailMutation.mutateAsync({ email: registeredEmail, code });
            router.push("/");
          } catch {
            // Hata yönetimi mutation tarafından ele alınıyor
          }
        }}
      >
        {/* Success notice */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            padding: "16px",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--color-success-bg)",
            border: "1px solid color-mix(in srgb, var(--color-success) 25%, transparent)",
          }}
        >
          <MailCheck
            size={20}
            style={{ color: "var(--color-success)", flexShrink: 0, marginTop: "1px" }}
          />
          <div>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--color-success)",
                fontFamily: "var(--font-sans)",
                marginBottom: "4px",
              }}
            >
              E-postanı kontrol et
            </p>
            <p style={{ fontSize: "12px", color: "var(--color-success)", fontFamily: "var(--font-sans)", opacity: 0.8 }}>
              <strong>{registeredEmail}</strong> adresine 6 haneli bir kod gönderdik.
            </p>
          </div>
        </div>

        {/* Code input */}
        <Field label="Doğrulama Kodu" htmlFor="code">
          <input
            id="code"
            name="code"
            type="text"
            maxLength={6}
            placeholder="123456"
            className="input-base"
            style={{ letterSpacing: "0.15em", fontSize: "18px", textAlign: "center" }}
            required
          />
        </Field>

        {verifyEmailMutation.isError && verifyEmailMutation.error && (
          <div
            role="alert"
            style={{
              padding: "12px 16px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--color-error-bg)",
              border: "1px solid color-mix(in srgb, var(--color-error) 30%, transparent)",
              fontSize: "13px",
              fontFamily: "var(--font-sans)",
              color: "var(--color-error)",
            }}
          >
            {verifyEmailMutation.error.message}
          </div>
        )}

        <button
          type="submit"
          disabled={verifyEmailMutation.isPending}
          className="btn btn-primary btn-lg"
          style={{
            width: "100%",
            opacity: verifyEmailMutation.isPending ? 0.7 : 1,
            cursor: verifyEmailMutation.isPending ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {verifyEmailMutation.isPending ? (
            <>
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
              Doğrulanıyor...
            </>
          ) : (
            <>
              Doğrula ve Giriş Yap
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    );
  }

  /* ── Register step ── */
  return (
    <form
      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <Field label="E-posta" htmlFor="email" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="ornek@email.com"
          className="input-base"
          style={{ border: errors.email ? "1px solid var(--color-error)" : undefined }}
          {...register("email")}
        />
      </Field>

      <Field label="Kullanıcı Adı" htmlFor="username" error={errors.username?.message}>
        <input
          id="username"
          type="text"
          autoComplete="username"
          placeholder="kullanici_adi"
          className="input-base"
          style={{ border: errors.username ? "1px solid var(--color-error)" : undefined }}
          {...register("username")}
        />
      </Field>

      <Field label="Şifre" htmlFor="password" error={errors.password?.message}>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          className="input-base"
          style={{ border: errors.password ? "1px solid var(--color-error)" : undefined }}
          {...register("password")}
        />
        <PasswordStrengthIndicator password={password} />
      </Field>

      <Field label="Şifre (Tekrar)" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          className="input-base"
          style={{ border: errors.confirmPassword ? "1px solid var(--color-error)" : undefined }}
          {...register("confirmPassword")}
        />
      </Field>

      {/* Password hint */}
      <div
        style={{
          padding: "12px 16px",
          borderRadius: "var(--radius-md)",
          backgroundColor: "var(--color-bg-secondary)",
          border: "1px solid var(--color-border)",
        }}
      >
        <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-ink-secondary)", fontFamily: "var(--font-sans)", marginBottom: "6px" }}>
          Şifre gereksinimleri:
        </p>
        <ul style={{ margin: 0, paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "2px" }}>
          {["En az 8 karakter", "En az bir büyük harf (A-Z)", "En az bir küçük harf (a-z)", "En az bir rakam (0-9)", "En az bir özel karakter (!@#$%...)"].map((req) => (
            <li key={req} style={{ fontSize: "11px", color: "var(--color-ink-tertiary)", fontFamily: "var(--font-sans)" }}>
              {req}
            </li>
          ))}
        </ul>
      </div>

      {registerMutation.isError && registerMutation.error && (
        <div
          role="alert"
          style={{
            padding: "12px 16px",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--color-error-bg)",
            border: "1px solid color-mix(in srgb, var(--color-error) 30%, transparent)",
            fontSize: "13px",
            fontFamily: "var(--font-sans)",
            color: "var(--color-error)",
          }}
        >
          {registerMutation.error.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || registerMutation.isPending}
        className="btn btn-primary btn-lg"
        style={{
          width: "100%",
          marginTop: "4px",
          opacity: isSubmitting || registerMutation.isPending ? 0.7 : 1,
          cursor: isSubmitting || registerMutation.isPending ? "not-allowed" : "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        {isSubmitting || registerMutation.isPending ? (
          <>
            <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
            Hesap oluşturuluyor...
          </>
        ) : (
          <>
            Kayıt Ol
            <ArrowRight size={16} />
          </>
        )}
      </button>

      <p
        style={{
          textAlign: "center",
          fontSize: "13px",
          fontFamily: "var(--font-sans)",
          color: "var(--color-ink-secondary)",
        }}
      >
        Zaten hesabın var mı?{" "}
        <Link
          href="/login"
          className="link-underline"
          style={{ fontWeight: 500, color: "var(--color-ink)" }}
        >
          Giriş yap
        </Link>
      </p>
    </form>
  );
}