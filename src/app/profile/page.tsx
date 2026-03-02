"use client";

import { useJoinedClubs } from "@/hooks/clubs/useClubs";
import { ProfileHeader, ProfileStats } from "@/components/profile/ProfileComponents";
import { ClubCard } from "@/components/clubs/ClubCard";
import { Loader2, Compass } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    const { data: joinedClubs, isLoading } = useJoinedClubs();

    return (
        <div className="container mx-auto max-w-6xl px-4 py-12 lg:px-8">
            <div className="space-y-10">
                {/* Header Section */}
                <ProfileHeader />

                {/* Stats Section */}
                <ProfileStats />

                {/* Clubs Section */}
                <section>
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Katıldığım Kulüpler</h2>
                        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                            {joinedClubs?.length || 0} Kulüp
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="flex h-64 items-center justify-center rounded-3xl border border-zinc-200 dark:border-zinc-800">
                            <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                        </div>
                    ) : !joinedClubs || joinedClubs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 py-20 dark:border-zinc-800">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-900">
                                <Compass className="h-8 w-8 text-zinc-300 dark:text-zinc-700" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Henüz bir kulübe katılmadınız</h3>
                            <p className="mt-1 text-zinc-500 dark:text-zinc-400">Yeni maceralar için keşfetmeye başlayın!</p>
                            <Link
                                href="/clubs"
                                className="mt-6 rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900"
                            >
                                Kulüpleri Keşfet
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {joinedClubs.map((club) => (
                                <ClubCard key={club.id} club={club} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
