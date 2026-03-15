"use client";

import { useState, use } from "react";
import { useEvents } from "@/hooks/events/useEvents";
import { useClub } from "@/hooks/clubs/useClubs";
import { EventCard } from "@/components/events/EventCard";
import { EventForm } from "@/components/events/EventForm";
import { Plus, Calendar, ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuth";

interface ClubEventsPageProps {
    params: Promise<{ id: string }>;
}

export default function ClubEventsPage({ params }: ClubEventsPageProps) {
    const { id: clubId } = use(params);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const { data: club, isLoading: isLoadingClub } = useClub(clubId);
    const { data: events, isLoading: isLoadingEvents } = useEvents({ clubId });
    const { sessionQuery } = useAuth();
    const user = sessionQuery.data;

    // Group and sort events
    const sortedEvents = events ? [...events].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    ) : [];

    const isOwner = user?.id === club?.creatorId;

    if (isLoadingClub || isLoadingEvents) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-8">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <Link
                        href={`/clubs/${clubId}`}
                        className="mb-2 flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        {club?.name} Geri Dön
                    </Link>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Etkinlik Takvimi</h1>
                    <p className="mt-1 text-zinc-500 dark:text-zinc-400">
                        Kulübün planlanan tüm etkinliklerini buradan takip edebilirsiniz.
                    </p>
                </div>

                {isOwner && (
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
                    >
                        {showCreateForm ? (
                            "Formu Kapat"
                        ) : (
                            <>
                                <Plus className="h-4 w-4" />
                                Yeni Etkinlik
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Create Form Section */}
            {isOwner && showCreateForm && (
                <div className="mb-12 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Yeni Etkinlik Oluştur</h2>
                        <p className="text-sm text-zinc-500">Üyelerin katılabileceği bir etkinlik planlayın.</p>
                    </div>
                    <EventForm
                        clubId={clubId}
                        onSuccess={() => setShowCreateForm(false)}
                    />
                </div>
            )}

            {/* Events Grid */}
            {(!sortedEvents || sortedEvents.length === 0) ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 py-20 dark:border-zinc-800">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-900">
                        <Calendar className="h-8 w-8 text-zinc-300 dark:text-zinc-700" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Henüz etkinlik yok</h3>
                    <p className="mt-1 text-zinc-500 dark:text-zinc-400">
                        {isOwner ? "İlk etkinliği sen oluşturabilirsin!" : "Bu kulüp henüz bir etkinlik planlamadı."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {sortedEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
}
