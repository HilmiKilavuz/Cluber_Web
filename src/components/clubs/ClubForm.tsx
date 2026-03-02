"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateClub, useUpdateClub } from "@/hooks/clubs/useClubs";
import { Loader2, Image as ImageIcon, Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Club, CreateClubDto } from "@/types/club";

const clubSchema = z.object({
    name: z.string().min(3, "En az 3 karakter olmalı").max(50, "En fazla 50 karakter"),
    description: z.string().min(10, "En az 10 karakter olmalı").max(500, "En fazla 500 karakter"),
    category: z.string().min(1, "Kategori seçiniz"),
    avatarUrl: z.string().url("Geçerli bir URL giriniz").optional().or(z.literal("")),
    bannerUrl: z.string().url("Geçerli bir URL giriniz").optional().or(z.literal("")),
});

type ClubFormValues = z.infer<typeof clubSchema>;

interface ClubFormProps {
    initialData?: Club;
}

export const ClubForm = ({ initialData }: ClubFormProps) => {
    const router = useRouter();
    const createMutation = useCreateClub();
    const updateMutation = useUpdateClub(initialData?.id || "");

    const categories = ["Teknoloji", "Spor", "Müzik", "Sanat", "Oyun", "Eğitim", "Diğer"];

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ClubFormValues>({
        resolver: zodResolver(clubSchema),
        defaultValues: initialData
            ? {
                name: initialData.name,
                description: initialData.description,
                category: initialData.category,
                avatarUrl: initialData.avatarUrl || "",
                bannerUrl: initialData.bannerUrl || "",
            }
            : {
                name: "",
                description: "",
                category: "",
                avatarUrl: "",
                bannerUrl: "",
            },
    });

    const onSubmit = async (data: ClubFormValues) => {
        try {
            if (initialData) {
                await updateMutation.mutateAsync(data);
                toast.success("Kulüp başarıyla güncellendi.");
            } else {
                const newClub = await createMutation.mutateAsync(data as CreateClubDto);
                toast.success("Kulüp başarıyla oluşturuldu!");
                router.push(`/clubs/${newClub.id}`);
            }
        } catch (error) {
            // Error handled by interceptor
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900/50">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    {initialData ? "Kulüp Bilgilerini Düzenle" : "Yeni Kulüp Oluştur"}
                </h2>

                {/* Name */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                        Kulüp Adı
                    </label>
                    <input
                        {...register("name")}
                        placeholder="Örn: Python Yazılımcıları"
                        className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900"
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                        Kategori
                    </label>
                    <select
                        {...register("category")}
                        className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <option value="">Kategori Seçin</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                        Açıklama
                    </label>
                    <textarea
                        {...register("description")}
                        placeholder="Kulübünüzün amacını ve neler yapacağını anlatın..."
                        rows={4}
                        className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900"
                    />
                    {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Avatar URL */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                            <ImageIcon size={16} /> Profil Resmi URL
                        </label>
                        <input
                            {...register("avatarUrl")}
                            placeholder="https://..."
                            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900"
                        />
                        {errors.avatarUrl && <p className="text-xs text-red-500">{errors.avatarUrl.message}</p>}
                    </div>

                    {/* Banner URL */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                            <ImageIcon size={16} /> Kapak Resmi URL
                        </label>
                        <input
                            {...register("bannerUrl")}
                            placeholder="https://..."
                            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900"
                        />
                        {errors.bannerUrl && <p className="text-xs text-red-500">{errors.bannerUrl.message}</p>}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-xl px-8 py-3 text-sm font-bold text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                    İptal
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 rounded-xl bg-zinc-900 px-10 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                    {initialData ? "Güncelle" : "Kulübü Oluştur"}
                </button>
            </div>
        </form>
    );
};
