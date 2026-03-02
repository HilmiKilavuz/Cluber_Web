import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell
      title="ClubHub hesabı oluştur"
      description="Yeni kulüpler keşfetmek, topluluklara katılmak ve etkinlikleri takip etmek için kayıt ol."
    >
      <RegisterForm />
    </AuthShell>
  );
}

