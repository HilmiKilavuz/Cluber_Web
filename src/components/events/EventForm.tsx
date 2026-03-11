"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateEvent } from "@/hooks/events/useEvents";
import { Calendar, MapPin, AlignLeft, Image as ImageIcon, Users } from "lucide-react";

const eventSchema = z.object({
    title: z.string().min(3, "Başlık en az 3 karakter olmalıdır."),
    description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır."),
    date: z.string().min(1, "Başlangıç tarihi seçilmelidir."),
    location: z.string().min(3, "Konum belirtilmelidir."),
    imageUrl: z.string().url("Geçerli bir görsel URL'si girin.").optional().or(z.literal("")),
    maxParticipants: z.string().optional().refine(v => !v || !isNaN(Number(v)), "Geçerli bir sayı girin."),
    category: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;



interface EventFormProps {
    clubId: string;
    onSuccess?: () => void;
}

export function EventForm({ clubId, onSuccess }: EventFormProps) {
    const createEventMutation = useCreateEvent();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<EventFormValues>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            title: "",
            description: "",
            date: "",
            location: "",
            imageUrl: "",
            maxParticipants: "",
            category: "",
        },
    });

    const onSubmit = async (values: EventFormValues) => {
        try {
            const payload = {
                ...values,
                clubId,
                maxParticipants: values.maxParticipants ? parseInt(values.maxParticipants) : undefined,
                imageUrl: values.imageUrl || undefined,
            };
            await createEventMutation.mutateAsync(payload);
            onSuccess?.();
        } catch {
            // Error is already handled by the mutation's onError callback and axios interceptor
        }
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
                <label className="text-sm font-medium">Etkinlik Başlığı</label>
                <div className="relative">
                    <input
                        {...register("title")}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
                        placeholder="Örn: Haftalık Buluşma"
                    />
                </div>
                {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium">Açıklama</label>
                <div className="relative">
                    <textarea
                        {...register("description")}
                        rows={3}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
                        placeholder="Etkinlik hakkında detaylı bilgi..."
                    />
                </div>
                {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium">Tarih ve Saat</label>
                    <div className="relative">
                        <input
                            type="datetime-local"
                            {...register("date")}
                            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
                        />
                    </div>
                    {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium">Kontenjan (Opsiyonel)</label>
                    <input
                        type="number"
                        {...register("maxParticipants")}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
                        placeholder="Örn: 20"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium">Konum</label>
                <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
                    <input
                        {...register("location")}
                        className="w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 py-2.5 outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
                        placeholder="Kafeterya, Zoom, vb."
                    />
                </div>
                {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium">Görsel URL (Opsiyonel)</label>
                <div className="relative">
                    <ImageIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
                    <input
                        {...register("imageUrl")}
                        className="w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 py-2.5 outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>
                {errors.imageUrl && <p className="text-xs text-red-500">{errors.imageUrl.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isSubmitting || createEventMutation.isPending}
                className="w-full rounded-xl bg-zinc-900 py-3 text-sm font-bold text-white transition-all hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
                {isSubmitting || createEventMutation.isPending ? "Oluşturuluyor..." : "Etkinlik Oluştur"}
            </button>
        </form>
    );
}
