import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Cluber'a katıl"
      description="Yeni kulüpler keşfet, topluluklara katıl ve etkinlikleri takip et."
    >
      <RegisterForm />
    </AuthShell>
  );
}

