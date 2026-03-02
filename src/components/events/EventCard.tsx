"use client";

import { Calendar, MapPin, Users, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import type { Event } from "@/types/event";
import { useRSVP, useCancelRSVP } from "@/hooks/events/useEvents";
import { useAuth } from "@/hooks/auth/useAuth";
import { toast } from "sonner";

interface EventCardProps {
    event: Event;
}

export function EventCard({ event }: EventCardProps) {
    const { sessionQuery } = useAuth();
    const user = sessionQuery.data;

    if (!event) return null;

    const rsvpMutation = useRSVP(event.id);

    const cancelRSVPMutation = useCancelRSVP(event.id);

    const isParticipant = event.participants?.some((p) => p.userId === user?.id);
    const participantCount = event._count?.participants || event.participants?.length || 0;
    const isFull = event.maxParticipants ? participantCount >= event.maxParticipants : false;

    const handleRSVP = async () => {
        if (!user) {
            toast.error("Katılmak için giriş yapmalısınız.");
            return;
        }
        if (isParticipant) {
            await cancelRSVPMutation.mutateAsync();
        } else {
            if (isFull) {
                toast.error("Bu etkinlik maalesef dolu.");
                return;
            }
            await rsvpMutation.mutateAsync("GOING");
        }
    };

    return (
        <div className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
            {event.imageUrl && (
                <div className="aspect-video w-full overflow-hidden">
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
            )}

            <div className="p-5">
                <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        {event.category || "Genel"}
                    </span>
                </div>

                <h3 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                    {event.title}
                </h3>

                <div className="mb-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(event.startDate), "d MMMM yyyy, HH:mm", { locale: tr })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>
                            {participantCount} Katılımcı
                            {event.maxParticipants && ` / ${event.maxParticipants} (Kontenjan)`}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleRSVP}
                    disabled={rsvpMutation.isPending || cancelRSVPMutation.isPending}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${isParticipant
                        ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400"
                        : isFull
                            ? "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                            : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
                        }`}
                >
                    {isParticipant ? (
                        <>
                            <CheckCircle2 className="h-4 w-4" />
                            Katılıyorsun
                        </>
                    ) : isFull ? (
                        "Kontenjan Dolu"
                    ) : (
                        "Katıl"
                    )}
                </button>
            </div>
        </div>
    );
}
