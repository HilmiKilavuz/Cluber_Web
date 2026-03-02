import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell
      title="ClubHub'a giriş yap"
      description="Kulüplerine, sohbetlerine ve etkinliklerine kaldığın yerden devam et."
    >
      <LoginForm />
    </AuthShell>
  );
}

