"use client";

import { useState, useEffect } from "react";
import { EventForm } from "@/components/events/EventForm";
import { ChevronLeft, CalendarPlus, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import { useJoinedClubs } from "@/hooks/clubs/useClubs";
import Link from "next/link";

export default function CreateEventPage() {
    const router = useRouter();
    const { sessionQuery } = useAuth();
    const user = sessionQuery.data;
    const isLoadingAuth = sessionQuery.isLoading;

    const { data: joinedClubs, isLoading: isLoadingClubs } = useJoinedClubs();
    // Filter out clubs that the user does not own, since the backend enforces "Only club creator can create events"
    const ownedClubs = joinedClubs?.filter((club) => club.creatorId === user?.id) || [];
    
    const [selectedClubId, setSelectedClubId] = useState<string>("");

    useEffect(() => {
        if (!isLoadingAuth && !user) {
            router.push("/login"); // Middleware also catches this, but local check is good
        }
    }, [user, isLoadingAuth, router]);

    // Automatically select the first club if available
    useEffect(() => {
        if (ownedClubs.length > 0 && !selectedClubId) {
            setSelectedClubId(ownedClubs[0].id);
        }
    }, [ownedClubs, selectedClubId]);

    const handleSuccess = () => {
        if (selectedClubId) {
            router.push(`/clubs/${selectedClubId}/events`);
        } else {
            router.push("/clubs");
        }
    };

    if (isLoadingAuth || !user || isLoadingClubs) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
        );
    }

    return (
        <main className="container mx-auto max-w-3xl px-4 py-12 sm:px-6">
            {/* Navigation */}
            <div className="mb-10">
                <button
                    onClick={() => router.back()}
                    className="group flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                    <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
                    Geri Dön
                </button>
            </div>

            {/* Header */}
            <div className="mb-12">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-1.5 text-sm font-semibold text-violet-600 dark:bg-violet-900/20 dark:text-violet-400">
                    <CalendarPlus size={16} />
                    <span>Yeni Etkinlik</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
                    Etkinlik Oluştur
                </h1>
                <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                    Üyesi olduğunuz kulüp adına etkinlikler planlayın ve duyurun.
                </p>
            </div>

            {/* Form Container */}
            <div className="relative">
                {/* Decorative background element */}
                <div className="pointer-events-none absolute -left-12 -top-12 h-64 w-64 rounded-full bg-violet-500/5 blur-3xl" />
                <div className="pointer-events-none absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-fuchsia-500/5 blur-3xl" />

                {(ownedClubs.length === 0) ? (
                    <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
                        <AlertCircle className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
                        <h2 className="text-xl font-bold mb-2">Etkinlik oluşturma yetkiniz yok</h2>
                        <p className="text-zinc-500 mb-6">Etkinlik oluşturabilmek için bir kulübün kurucusu olmanız gerekmektedir. Hemen kendi kulübünüzü kurabilirsiniz.</p>
                        <Link 
                            href="/clubs/create" 
                            className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
                        >
                            Yeni Kulüp Kur
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
                        {/* Club Selection */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Hangi kulüp adına oluşturulacak?</label>
                            <div className="relative">
                                <select
                                    value={selectedClubId}
                                    onChange={(e) => setSelectedClubId(e.target.value)}
                                    className="w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/50 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
                                >
                                    <option value="" disabled>Lütfen bir kulüp seçin</option>
                                    {ownedClubs.map((club) => (
                                        <option key={club.id} value={club.id}>
                                            {club.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                    <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Event Form */}
                        {selectedClubId && (
                            <EventForm clubId={selectedClubId} onSuccess={handleSuccess} />
                        )}
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <div className="mt-12 rounded-3xl bg-zinc-50 p-6 text-center dark:bg-zinc-900/50">
                <p className="text-sm text-zinc-500">
                    Etkinlik oluşturduğunuzda, kulüp üyelerine ve detay sayfasına otomatik olarak eklenecektir.
                </p>
            </div>
        </main>
    );
}
