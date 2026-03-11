"use client";

import { use, useEffect } from "react";
import { useClub, useUpdateClub, useDeleteClub } from "@/hooks/clubs/useClubs";
import { useAuth } from "@/hooks/auth/useAuth";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Settings,
    ChevronLeft,
    Loader2,
    Save,
    Trash2,
    Image as ImageIcon,
    AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface ClubSettingsPageProps {
    params: Promise<{ id: string }>;
}

const settingsSchema = z.object({
    name: z.string().min(3, "Kulüp adı en az 3 karakter olmalıdır."),
    description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır."),
    category: z.string().min(1, "Kategori seçilmelidir."),
    avatarUrl: z
        .string()
        .url("Geçerli bir URL girin.")
        .optional()
        .or(z.literal("")),
    bannerUrl: z
        .string()
        .url("Geçerli bir URL girin.")
        .optional()
        .or(z.literal("")),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const CATEGORIES = [
    "Teknoloji",
    "Spor",
    "Müzik",
    "Sanat",
    "Bilim",
    "İş & Kariyer",
    "Oyun",
    "Edebiyat",
    "Sinema",
    "Diğer",
];

export default function ClubSettingsPage({ params }: ClubSettingsPageProps) {
    const { id: clubId } = use(params);
    const router = useRouter();
    const { sessionQuery } = useAuth();
    const user = sessionQuery.data;

    const { data: club, isLoading } = useClub(clubId);
    const updateClubMutation = useUpdateClub(clubId);
    const deleteClubMutation = useDeleteClub();

    const isOwner = !!user && !!club && user.id === club.ownerId;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            name: "",
            description: "",
            category: "",
            avatarUrl: "",
            bannerUrl: "",
        },
    });

    // Kulüp verisi gelince formu doldur
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

    // Sahip değilse yönlendir
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
        } catch {
            // Hata axios interceptor tarafından yönetilir
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
        );
    }

    if (!isOwner) return null;

    return (
        <div className="mx-auto max-w-2xl px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href={`/clubs/${clubId}`}
                    className="mb-3 flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                    <ChevronLeft className="h-4 w-4" />
                    {club?.name}
                </Link>
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                        <Settings className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                            Kulüp Ayarları
                        </h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Kulüp bilgilerini düzenle
                        </p>
                    </div>
                </div>
            </div>

            {/* Settings Form */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50 md:p-8"
            >
                {/* Name */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        Kulüp Adı
                    </label>
                    <input
                        {...register("name")}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
                        placeholder="Kulüp adı"
                    />
                    {errors.name && (
                        <p className="text-xs text-red-500">{errors.name.message}</p>
                    )}
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        Açıklama
                    </label>
                    <textarea
                        {...register("description")}
                        rows={4}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
                        placeholder="Kulüp hakkında detaylı bilgi..."
                    />
                    {errors.description && (
                        <p className="text-xs text-red-500">{errors.description.message}</p>
                    )}
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        Kategori
                    </label>
                    <select
                        {...register("category")}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
                    >
                        <option value="">Kategori seçin...</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    {errors.category && (
                        <p className="text-xs text-red-500">{errors.category.message}</p>
                    )}
                </div>

                {/* Avatar URL */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        Avatar URL (Opsiyonel)
                    </label>
                    <div className="relative">
                        <ImageIcon className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                        <input
                            {...register("avatarUrl")}
                            className="w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
                            placeholder="https://example.com/avatar.jpg"
                        />
                    </div>
                    {errors.avatarUrl && (
                        <p className="text-xs text-red-500">{errors.avatarUrl.message}</p>
                    )}
                </div>

                {/* Banner URL */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        Banner URL (Opsiyonel)
                    </label>
                    <div className="relative">
                        <ImageIcon className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                        <input
                            {...register("bannerUrl")}
                            className="w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
                            placeholder="https://example.com/banner.jpg"
                        />
                    </div>
                    {errors.bannerUrl && (
                        <p className="text-xs text-red-500">{errors.bannerUrl.message}</p>
                    )}
                </div>

                {/* Save Button */}
                <button
                    type="submit"
                    disabled={isSubmitting || updateClubMutation.isPending || !isDirty}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-sm font-bold text-white transition-all hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                    {isSubmitting || updateClubMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4" />
                    )}
                    {isSubmitting || updateClubMutation.isPending ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </button>
            </form>

            {/* Danger Zone */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20 md:p-8">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertTriangle className="h-5 w-5" />
                    <h2 className="font-bold">Tehlikeli Bölge</h2>
                </div>
                <p className="mt-2 text-sm text-red-600/80 dark:text-red-400/80">
                    Kulübü silmek geri alınamaz. Tüm üyeler, etkinlikler ve mesajlar kalıcı olarak silinir.
                </p>
                <button
                    onClick={handleDelete}
                    disabled={deleteClubMutation.isPending}
                    className="mt-4 flex items-center gap-2 rounded-xl border border-red-300 bg-white px-5 py-2.5 text-sm font-bold text-red-600 transition-all hover:bg-red-100 disabled:opacity-50 dark:border-red-800 dark:bg-transparent dark:hover:bg-red-900/20"
                >
                    {deleteClubMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Trash2 className="h-4 w-4" />
                    )}
                    {deleteClubMutation.isPending ? "Siliniyor..." : "Bu Kulübü Kalıcı Olarak Sil"}
                </button>
            </div>
        </div>
    );
}
