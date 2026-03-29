"use client";

import { useClub, useJoinClub, useLeaveClub, useJoinedClubs } from "@/hooks/clubs/useClubs";
import { useAuth } from "@/hooks/auth/useAuth";
import { useEvents } from "@/hooks/events/useEvents";
import { useParams, useRouter } from "next/navigation";
import { EventCard } from "@/components/events/EventCard";
import {
    Users,
    Calendar,
    MessageSquare,
    Settings,
    ChevronLeft,
    Loader2,
    UserPlus,
    LogOut,
    Clock,
    LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ClubDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { data: club, isLoading: clubLoading, error } = useClub(id);
    const { sessionQuery } = useAuth();
    const { data: joinedClubs, isLoading: joinedLoading } = useJoinedClubs();
    const joinMutation = useJoinClub();
    const leaveMutation = useLeaveClub();

    const user = sessionQuery.data;
    const isMember = joinedClubs?.some((c) => c.id === id) || false;
    const isOwner = user?.id === club?.creatorId;
    const isLoading = clubLoading || joinedLoading;

    const { data: eventsData } = useEvents({ clubId: id });
    const events = eventsData?.pages.flatMap((page: any) => Array.isArray(page.data) ? page.data : (Array.isArray(page) ? page : [])) || [];

    const handleJoin = async () => {
        try {
            await joinMutation.mutateAsync(id);
            toast.success("Kulübe başarıyla katıldınız!");
        } catch (err) {
            // Error is handled by axios interceptor
        }
    };

    const handleLeave = async () => {
        try {
            await leaveMutation.mutateAsync(id);
            toast.success("Kulüpten ayrıldınız.");
        } catch (err) {
            // Error is handled by axios interceptor
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    if (error || !club) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Kulüp bulunamadı</h2>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">İstediğiniz kulüp silinmiş veya taşınmış olabilir.</p>
                <Link href="/clubs" className="mt-6 font-semibold text-blue-600 hover:underline">
                    Tüm kulüplere dön
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Cover Banner */}
            <div className="relative h-64 w-full bg-zinc-200 dark:bg-zinc-900 lg:h-80">
                {club.bannerUrl && (
                    <img
                        src={club.bannerUrl}
                        alt={club.name}
                        className="h-full w-full object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
                >
                    <ChevronLeft size={24} />
                </button>
            </div>

            <div className="container mx-auto max-w-6xl px-4 lg:px-8">
                <div className="relative -mt-20 flex flex-col items-start gap-6 lg:-mt-24 lg:flex-row lg:items-end">
                    {/* Avatar */}
                    <div className="h-32 w-32 overflow-hidden rounded-3xl border-4 border-white bg-zinc-100 shadow-xl dark:border-zinc-950 dark:bg-zinc-800 lg:h-40 lg:w-40">
                        {club.avatarUrl ? (
                            <img src={club.avatarUrl} alt={club.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-zinc-400">
                                {club.name?.charAt(0) || "C"}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 pb-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                {club.category}
                            </span>
                        </div>
                        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                            {club.name}
                        </h1>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            <div className="flex items-center gap-1.5">
                                <Users size={18} className="text-zinc-400" />
                                <span>{club._count?.memberships || club.memberships?.length || 0} Üye</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock size={18} className="text-zinc-400" />
                                <span>Oluşturulma: {new Date(club.createdAt).toLocaleDateString('tr-TR')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex w-full flex-wrap gap-3 lg:w-auto lg:pb-4">
                        {isOwner ? (
                            <Link
                                href={`/clubs/${club.id}/settings`}
                                className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-sm font-bold text-zinc-900 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                            >
                                <Settings size={18} />
                                Kulüp Ayarları
                            </Link>
                        ) : isMember ? (
                            <button
                                onClick={handleLeave}
                                className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-sm font-bold text-red-600 transition-all hover:bg-red-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-red-900/10"
                            >
                                <LogOut size={18} />
                                Ayrıl
                            </button>
                        ) : (
                            <button
                                onClick={handleJoin}
                                className="flex items-center gap-2 rounded-xl bg-zinc-900 px-8 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900"
                            >
                                <UserPlus size={18} />
                                Katıl
                            </button>
                        )}
                    </div>
                </div>

                {/* Tab-like Navigation for internal club features */}
                <div className="mt-12 flex flex-wrap gap-6 border-b border-zinc-200 dark:border-zinc-800">
                    <Link href={`/clubs/${club.id}`} className="group relative border-b-2 border-blue-600 pb-4 text-sm font-bold text-blue-600">
                        Genel Bakış
                    </Link>
                    <Link href={`/clubs/${club.id}/chat`} className="group flex items-center gap-2 pb-4 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                        <MessageSquare size={18} />
                        Sohbet
                    </Link>
                    <Link href={`/clubs/${club.id}/events`} className="group flex items-center gap-2 pb-4 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                        <Calendar size={18} />
                        Etkinlikler
                    </Link>
                    <Link href={`/clubs/${club.id}/members`} className="group flex items-center gap-2 pb-4 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                        <LayoutDashboard size={18} />
                        Üyeler
                    </Link>
                </div>

                <div className="grid gap-10 py-10 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <section className="rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900/50">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Hakkında</h2>
                            <p className="mt-4 whitespace-pre-wrap leading-relaxed text-zinc-600 dark:text-zinc-400">
                                {club.description}
                            </p>
                        </section>

                        {/* Upcoming Events */}
                        <section className="mt-10">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Yaklaşan Etkinlikler</h2>
                                <Link href={`/clubs/${club.id}/events`} className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">
                                    Tümünü Gör →
                                </Link>
                            </div>
                            {events && events.length > 0 ? (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                    {[...events]
                                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                        .slice(0, 3)
                                        .map((event) => (
                                            <EventCard key={event.id} event={event} />
                                        ))}
                                </div>
                            ) : (
                                <div className="rounded-3xl border-2 border-dashed border-zinc-200 p-12 text-center dark:border-zinc-800">
                                    <Calendar className="mx-auto mb-4 text-zinc-300 dark:text-zinc-700" size={48} />
                                    <p className="font-medium text-zinc-500">Henüz planlanmış bir etkinlik bulunmuyor.</p>
                                    <Link href={`/clubs/${club.id}/events`} className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">
                                        Etkinlik oluştur →
                                    </Link>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <section className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Kulüp Sahibi</h3>
                            <div className="mt-4 flex items-center gap-3">
                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-800">
                                    {club.creator?.avatarUrl ? (
                                        <img src={club.creator.avatarUrl} alt={club.creator.displayName} className="h-full w-full rounded-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center font-bold text-zinc-400">
                                            {club.creator?.displayName?.charAt(0) || club.creatorId?.charAt(0) || "U"}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                        {club.creator?.displayName || "Admin"}
                                    </p>
                                    <p className="text-xs text-zinc-500">Kurucu Üye</p>
                                </div>
                            </div>
                        </section>

                        {/* Quick Stats/Info */}
                        <div className="overflow-hidden rounded-3xl bg-zinc-900 p-8 text-white dark:bg-zinc-100 dark:text-zinc-900">
                            <h3 className="text-lg font-bold">Resmi Kulüp</h3>
                            <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">
                                Bu kulüp topluluk kurallarına uygun olarak oluşturulmuştur.
                            </p>
                            <button className="mt-6 w-full rounded-xl bg-white py-3 text-sm font-bold text-zinc-900 transition-opacity hover:opacity-90 dark:bg-zinc-900 dark:text-white">
                                Paylaş
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
