"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import { useJoinedClubs } from "@/hooks/clubs/useClubs";
import { useUpdateProfile } from "@/hooks/users/useUser";
import { Users, Calendar, Award, Pencil, X, Loader2, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const profileSchema = z.object({
    username: z.string().min(2, "Kullanıcı adı en az 2 karakter olmalıdır."),
    bio: z.string().max(200, "Bio en fazla 200 karakter olabilir.").optional().or(z.literal("")),
    avatarUrl: z
        .string()
        .url("Geçerli bir resim URL'si girin.")
        .optional()
        .or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileHeader() {
    const { sessionQuery } = useAuth();
    const user = sessionQuery.data;
    const [isEditing, setIsEditing] = useState(false);
    const updateProfileMutation = useUpdateProfile();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: user?.username || "",
            bio: (user as any)?.bio || "",
            avatarUrl: user?.avatarUrl || "",
        },
    });

    if (!user) return null;

    const handleEdit = () => {
        reset({
            username: user.username || "",
            bio: (user as any)?.bio || "",
            avatarUrl: user.avatarUrl || "",
        });
        setIsEditing(true);
    };

    const onSubmit = async (values: ProfileFormValues) => {
        await updateProfileMutation.mutateAsync({
            username: values.username,
            bio: values.bio || undefined,
            avatarUrl: values.avatarUrl || undefined,
        });
        setIsEditing(false);
    };

    return (
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            {!isEditing ? (
                /* View Mode */
                <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                    <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-full border-4 border-blue-100 bg-zinc-100 dark:border-blue-900/30 dark:bg-zinc-800">
                        {user.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt={user.username}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-zinc-400">
                                {user.username?.charAt(0).toUpperCase() || "U"}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                                {user.username}
                            </h1>
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                {user.role}
                            </span>
                        </div>
                        <p className="mt-1 font-medium text-zinc-500 dark:text-zinc-400">
                            {user.email}
                        </p>
                        {(user as any)?.bio && (
                            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                                {(user as any).bio}
                            </p>
                        )}
                        <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900"
                            >
                                <Pencil className="h-4 w-4" />
                                Profili Düzenle
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* Edit Mode */
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                            Profili Düzenle
                        </h2>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Username */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            Kullanıcı Adı
                        </label>
                        <input
                            {...register("username")}
                            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-400"
                            placeholder="Kullanıcı adınız"
                        />
                        {errors.username && (
                            <p className="text-xs text-red-500">{errors.username.message}</p>
                        )}
                    </div>

                    {/* Bio */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            Bio <span className="text-zinc-400">(Opsiyonel)</span>
                        </label>
                        <textarea
                            {...register("bio")}
                            rows={3}
                            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-400"
                            placeholder="Kendinizden kısaca bahsedin..."
                        />
                        {errors.bio && (
                            <p className="text-xs text-red-500">{errors.bio.message}</p>
                        )}
                    </div>

                    {/* Avatar URL */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            Avatar URL <span className="text-zinc-400">(Opsiyonel)</span>
                        </label>
                        <input
                            {...register("avatarUrl")}
                            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-400"
                            placeholder="https://example.com/avatar.jpg"
                        />
                        {errors.avatarUrl && (
                            <p className="text-xs text-red-500">{errors.avatarUrl.message}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting || updateProfileMutation.isPending}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-900 py-2.5 text-sm font-bold text-white transition-all hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
                        >
                            {isSubmitting || updateProfileMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Check className="h-4 w-4" />
                            )}
                            {isSubmitting || updateProfileMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-bold text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                            İptal
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export function ProfileStats() {
    const { data: joinedClubs } = useJoinedClubs();

    const stats = [
        {
            label: "Katılınan Kulüpler",
            value: joinedClubs?.length || 0,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50 dark:bg-blue-900/20",
        },
        {
            label: "Etkinlikler",
            value: 0,
            icon: Calendar,
            color: "text-emerald-600",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
        },
        {
            label: "Rozetler",
            value: 1,
            icon: Award,
            color: "text-amber-600",
            bg: "bg-amber-50 dark:bg-amber-900/20",
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat, idx) => (
                <div
                    key={idx}
                    className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
                >
                    <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}
                    >
                        <stat.icon size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                            {stat.label}
                        </p>
                        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                            {stat.value}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
