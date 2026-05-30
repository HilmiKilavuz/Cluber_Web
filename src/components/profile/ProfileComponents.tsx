"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import { useUpdateProfile } from "@/hooks/users/useUser";
import { useJoinedClubs } from "@/hooks/clubs/useClubs";
import { Pencil, X, Loader2, Check, Key, Sparkles } from "lucide-react";
import { useForm, useController } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { ChangePasswordModal } from "@/components/profile/ChangePasswordModal";

const profileSchema = z.object({
    displayName: z.string().min(2, "Görünen ad en az 2 karakter olmalıdır."),
    username: z.string().min(2, "Kullanıcı adı en az 2 karakter olmalıdır.").optional().or(z.literal("")),
    bio: z.string().max(200, "Bio en fazla 200 karakter olabilir.").optional().or(z.literal("")),
    avatarUrl: z.string().optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileHeaderProps {
    onOpenAI: () => void;
}

export function ProfileHeader({ onOpenAI }: ProfileHeaderProps) {
    const { sessionQuery } = useAuth();
    const user = sessionQuery.data;
    const [isEditing, setIsEditing] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const updateProfileMutation = useUpdateProfile();

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            displayName: user?.displayName || "",
            username: (user as any)?.username || "",
            bio: (user as any)?.bio || "",
            avatarUrl: user?.avatarUrl || "",
        },
    });

    const { field: avatarField } = useController({ name: "avatarUrl", control });

    if (!user) return null;

    const handleEdit = () => {
        reset({
            displayName: user.displayName || "",
            username: (user as any)?.username || "",
            bio: (user as any)?.bio || "",
            avatarUrl: user.avatarUrl || "",
        });
        setIsEditing(true);
    };

    const onSubmit = async (values: ProfileFormValues) => {
        await updateProfileMutation.mutateAsync({
            displayName: values.displayName,
            username: values.username || undefined,
            bio: values.bio || undefined,
            avatarUrl: values.avatarUrl || undefined,
        });
        setIsEditing(false);
    };

    return (
        <div className="card-base" style={{ padding: "32px" }}>
            {!isEditing ? (
                /* ── View Mode ── */
                <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                    {/* Avatar */}
                    <div
                        style={{
                            width: "96px",
                            height: "96px",
                            flexShrink: 0,
                            borderRadius: "var(--radius-full)",
                            border: "3px solid var(--color-border)",
                            backgroundColor: "var(--color-bg-secondary)",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {user.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt={user.displayName}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        ) : (
                            <span
                                style={{
                                    fontSize: "32px",
                                    fontWeight: 600,
                                    color: "var(--color-ink-secondary)",
                                    fontFamily: "var(--font-sans)",
                                }}
                            >
                                {user.displayName?.charAt(0).toUpperCase() || "U"}
                            </span>
                        )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, textAlign: "left" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                            <h1 className="heading-lg" style={{ color: "var(--color-ink)" }}>
                                {user.displayName}
                            </h1>
                            <span className="badge-base">{user.role}</span>
                        </div>
                        <p className="body-sm" style={{ color: "var(--color-ink-secondary)" }}>
                            {user.email}
                        </p>
                        {(user as any)?.bio && (
                            <p className="body-sm" style={{ color: "var(--color-ink-secondary)", marginTop: "8px", lineHeight: 1.6 }}>
                                {(user as any).bio}
                            </p>
                        )}

                        {/* Actions */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "20px" }}>
                            <button
                                onClick={handleEdit}
                                className="btn btn-primary btn-sm"
                                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                            >
                                <Pencil size={14} />
                                Profili Düzenle
                            </button>
                            <button
                                onClick={() => setShowChangePassword(true)}
                                className="btn btn-ghost btn-sm"
                                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                            >
                                <Key size={14} />
                                Şifre Değiştir
                            </button>
                            {/* AI Insight Button */}
                            <button
                                onClick={onOpenAI}
                                className="btn btn-ghost btn-sm"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))",
                                    border: "1px solid rgba(99,102,241,0.25)",
                                    color: "#6366f1",
                                }}
                            >
                                <Sparkles size={14} />
                                AI Yorumu &amp; Öneriler
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* ── Edit Mode ── */
                <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <h2 className="heading-sm" style={{ color: "var(--color-ink)" }}>
                            Profili Düzenle
                        </h2>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            style={{
                                width: "32px",
                                height: "32px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "var(--radius-md)",
                                color: "var(--color-ink-secondary)",
                                border: "none",
                                backgroundColor: "transparent",
                                cursor: "pointer",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-secondary)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {[
                        { id: "displayName", label: "Görünen Ad", placeholder: "Adınız Soyadınız", required: true },
                        { id: "username", label: "Kullanıcı Adı (Opsiyonel)", placeholder: "kullanici_adi", required: false },
                    ].map(({ id, label, placeholder }) => (
                        <div key={id} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label
                                htmlFor={id}
                                style={{ fontSize: "13px", fontWeight: 500, fontFamily: "var(--font-sans)", color: "var(--color-ink)" }}
                            >
                                {label}
                            </label>
                            <input
                                id={id}
                                {...register(id as any)}
                                className="input-base"
                                placeholder={placeholder}
                            />
                            {errors[id as keyof typeof errors] && (
                                <p style={{ fontSize: "12px", color: "var(--color-error)", fontFamily: "var(--font-sans)" }}>
                                    {errors[id as keyof typeof errors]?.message as string}
                                </p>
                            )}
                        </div>
                    ))}

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "13px", fontWeight: 500, fontFamily: "var(--font-sans)", color: "var(--color-ink)" }}>
                            Bio <span style={{ color: "var(--color-ink-tertiary)" }}>(Opsiyonel)</span>
                        </label>
                        <textarea
                            {...register("bio")}
                            rows={3}
                            className="input-base"
                            placeholder="Kendinizden kısaca bahsedin..."
                            style={{ resize: "vertical" }}
                        />
                        {errors.bio && (
                            <p style={{ fontSize: "12px", color: "var(--color-error)", fontFamily: "var(--font-sans)" }}>
                                {errors.bio.message}
                            </p>
                        )}
                    </div>

                    <ImageUpload
                        label="Profil Fotoğrafı"
                        shape="circle"
                        value={avatarField.value}
                        onChange={avatarField.onChange}
                    />

                    <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
                        <button
                            type="submit"
                            disabled={isSubmitting || updateProfileMutation.isPending}
                            className="btn btn-primary btn-md"
                            style={{
                                flex: 1,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                opacity: isSubmitting || updateProfileMutation.isPending ? 0.7 : 1,
                            }}
                        >
                            {isSubmitting || updateProfileMutation.isPending ? (
                                <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
                            ) : (
                                <Check size={15} />
                            )}
                            {isSubmitting || updateProfileMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="btn btn-ghost btn-md"
                        >
                            İptal
                        </button>
                    </div>
                </form>
            )}

            <ChangePasswordModal
                isOpen={showChangePassword}
                onClose={() => setShowChangePassword(false)}
            />
        </div>
    );
}

export function ProfileStats() {
    const { data: joinedClubs } = useJoinedClubs();

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "20px 24px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface)",
            }}
        >
            <div
                style={{
                    paddingLeft: "20px",
                    borderLeft: "2px solid var(--color-ink)",
                }}
            >
                <p
                    style={{
                        fontSize: "28px",
                        fontWeight: 700,
                        fontFamily: "var(--font-sans)",
                        color: "var(--color-ink)",
                        letterSpacing: "-0.02em",
                        lineHeight: 1,
                        marginBottom: "4px",
                    }}
                >
                    {joinedClubs?.length || 0}
                </p>
                <p className="caption" style={{ color: "var(--color-ink-tertiary)" }}>
                    Katılınan Kulüp
                </p>
            </div>
        </div>
    );
}
