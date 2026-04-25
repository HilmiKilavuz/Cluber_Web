"use client";

import { use, useEffect } from "react";
import { useClub, useUpdateClub, useDeleteClub } from "@/hooks/clubs/useClubs";
import { useAuth } from "@/hooks/auth/useAuth";
import { useRouter } from "next/navigation";
import { useForm, useController } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    ChevronLeft,
    Loader2,
    Save,
    Trash2,
    AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/ImageUpload";

interface ClubSettingsPageProps {
    params: Promise<{ id: string }>;
}

const settingsSchema = z.object({
    name: z.string().min(3, "Kulüp adı en az 3 karakter olmalıdır."),
    description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır."),
    category: z.string().min(1, "Kategori seçilmelidir."),
    avatarUrl: z.string().optional().or(z.literal("")),
    bannerUrl: z.string().optional().or(z.literal("")),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const CATEGORIES = [
    "Teknoloji", "Spor", "Müzik", "Sanat", "Bilim",
    "İş & Kariyer", "Oyun", "Edebiyat", "Sinema", "Diğer",
];

function FormField({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
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

export default function ClubSettingsPage({ params }: ClubSettingsPageProps) {
    const { id: clubId } = use(params);
    const router = useRouter();
    const { sessionQuery } = useAuth();
    const user = sessionQuery.data;

    const { data: club, isLoading } = useClub(clubId);
    const updateClubMutation = useUpdateClub(clubId);
    const deleteClubMutation = useDeleteClub();

    const isOwner = !!user && !!club && user.id === club.creatorId;

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: { name: "", description: "", category: "", avatarUrl: "", bannerUrl: "" },
    });

    const { field: avatarField } = useController({ name: "avatarUrl", control });
    const { field: bannerField } = useController({ name: "bannerUrl", control });

    useEffect(() => {
        if (club) {
            reset({
                name: club.name,
                description: club.description,
                category: club.category,
                avatarUrl: club.avatarUrl ?? "",
                bannerUrl: club.bannerUrl ?? "",
            });
        }
    }, [club, reset]);

    useEffect(() => {
        if (!isLoading && club && user && !isOwner) {
            toast.error("Bu sayfaya erişim yetkiniz yok.");
            router.push(`/clubs/${clubId}`);
        }
    }, [isLoading, club, user, isOwner, clubId, router]);

    const onSubmit = async (values: SettingsFormValues) => {
        await updateClubMutation.mutateAsync({
            ...values,
            avatarUrl: values.avatarUrl || undefined,
            bannerUrl: values.bannerUrl || undefined,
        });
        toast.success("Kulüp ayarları kaydedildi!");
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `"${club?.name}" kulübünü kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`
        );
        if (!confirmed) return;
        try {
            await deleteClubMutation.mutateAsync(clubId);
            toast.success("Kulüp silindi.");
            router.push("/clubs");
        } catch { }
    };

    if (isLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "60vh",
                    backgroundColor: "var(--color-bg)",
                }}
            >
                <Loader2
                    size={28}
                    strokeWidth={1.5}
                    style={{ color: "var(--color-ink-tertiary)", animation: "spin 1s linear infinite" }}
                />
            </div>
        );
    }

    if (!isOwner) return null;

    return (
        <main
            style={{
                minHeight: "100vh",
                backgroundColor: "var(--color-bg)",
                padding: "clamp(40px, 6vw, 80px) var(--container-padding) var(--section-padding-y)",
            }}
        >
            <div style={{ maxWidth: "640px", margin: "0 auto" }}>

                {/* ── Back nav ── */}
                <Link
                    href={`/clubs/${clubId}`}
                    className="body-sm"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        color: "var(--color-ink-tertiary)",
                        textDecoration: "none",
                        marginBottom: "12px",
                        transition: "color var(--transition-fast)",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-ink)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-ink-tertiary)"; }}
                >
                    <ChevronLeft size={14} />
                    {club?.name}
                </Link>

                {/* ── Page title ── */}
                <p className="label" style={{ color: "var(--color-ink-tertiary)", marginBottom: "8px" }}>
                    (ayarlar)
                </p>
                <h1 className="display-sm" style={{ color: "var(--color-ink)", marginBottom: "40px" }}>
                    Kulüp Ayarları
                </h1>

                {/* ── Settings Form ── */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    style={{ display: "flex", flexDirection: "column", gap: "20px" }}
                >
                    <div className="card-base" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>

                        <FormField label="Kulüp Adı" error={errors.name?.message}>
                            <input
                                {...register("name")}
                                className="input-base"
                                placeholder="Kulüp adı"
                            />
                        </FormField>

                        <FormField label="Açıklama" error={errors.description?.message}>
                            <textarea
                                {...register("description")}
                                rows={4}
                                className="input-base"
                                placeholder="Kulüp hakkında detaylı bilgi..."
                                style={{ resize: "vertical", minHeight: "100px" }}
                            />
                        </FormField>

                        <FormField label="Kategori" error={errors.category?.message}>
                            <select
                                {...register("category")}
                                className="input-base"
                            >
                                <option value="">Kategori seçin...</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </FormField>

                        {/* Divider */}
                        <div style={{ height: "1px", backgroundColor: "var(--color-border)" }} />

                        <div>
                            <p className="label" style={{ color: "var(--color-ink-tertiary)", marginBottom: "16px" }}>
                                Medya
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                <ImageUpload
                                    label="Kulüp Avatarı (Opsiyonel)"
                                    shape="circle"
                                    value={avatarField.value}
                                    onChange={avatarField.onChange}
                                    placeholder="Avatar yükle"
                                />
                                <ImageUpload
                                    label="Kulüp Banneri (Opsiyonel)"
                                    shape="rectangle"
                                    value={bannerField.value}
                                    onChange={bannerField.onChange}
                                    placeholder="Banner görseli yükle"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || updateClubMutation.isPending || !isDirty}
                        className="btn btn-primary btn-lg"
                        style={{
                            width: "100%",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            opacity: isSubmitting || updateClubMutation.isPending || !isDirty ? 0.6 : 1,
                            cursor: isSubmitting || updateClubMutation.isPending || !isDirty ? "not-allowed" : "pointer",
                        }}
                    >
                        {isSubmitting || updateClubMutation.isPending ? (
                            <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                        ) : (
                            <Save size={16} />
                        )}
                        {isSubmitting || updateClubMutation.isPending ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                    </button>
                </form>

                {/* ── Danger Zone ── */}
                <div
                    style={{
                        marginTop: "40px",
                        borderRadius: "var(--radius-lg)",
                        border: "1px solid color-mix(in srgb, var(--color-error) 25%, transparent)",
                        backgroundColor: "var(--color-error-bg)",
                        padding: "28px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "8px",
                            color: "var(--color-error)",
                        }}
                    >
                        <AlertTriangle size={16} strokeWidth={1.5} />
                        <h2 className="heading-sm" style={{ color: "var(--color-error)" }}>
                            Tehlikeli Bölge
                        </h2>
                    </div>
                    <p
                        className="body-sm"
                        style={{
                            color: "var(--color-error)",
                            opacity: 0.75,
                            marginBottom: "20px",
                        }}
                    >
                        Kulübü silmek geri alınamaz. Tüm üyeler, etkinlikler ve mesajlar kalıcı olarak silinir.
                    </p>
                    <button
                        onClick={handleDelete}
                        disabled={deleteClubMutation.isPending}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "10px 20px",
                            borderRadius: "var(--radius-md)",
                            fontSize: "13px",
                            fontWeight: 500,
                            fontFamily: "var(--font-sans)",
                            color: "var(--color-error)",
                            border: "1px solid color-mix(in srgb, var(--color-error) 35%, transparent)",
                            backgroundColor: "transparent",
                            cursor: deleteClubMutation.isPending ? "not-allowed" : "pointer",
                            opacity: deleteClubMutation.isPending ? 0.6 : 1,
                            transition: "all var(--transition-fast)",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = "color-mix(in srgb, var(--color-error) 12%, transparent)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                        }}
                    >
                        {deleteClubMutation.isPending ? (
                            <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
                        ) : (
                            <Trash2 size={15} strokeWidth={1.5} />
                        )}
                        {deleteClubMutation.isPending ? "Siliniyor..." : "Bu Kulübü Kalıcı Olarak Sil"}
                    </button>
                </div>
            </div>
        </main>
    );
}
