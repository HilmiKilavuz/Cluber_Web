"use client";

import { useAuth } from "@/hooks/auth/useAuth";
import { useJoinedClubs } from "@/hooks/clubs/useClubs";
import { Users, Calendar, Award } from "lucide-react";

export function ProfileHeader() {
    const { sessionQuery } = useAuth();
    const user = sessionQuery.data;

    if (!user) return null;

    return (
        <div className="flex flex-col items-center gap-6 p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm md:flex-row md:items-start">
            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-blue-100 bg-zinc-100 dark:border-blue-900/30 dark:bg-zinc-800">
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
                <p className="mt-2 text-zinc-600 dark:text-zinc-400 font-medium">
                    {user.email}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-4 md:justify-start">
                    <button className="rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900">
                        Profili Düzenle
                    </button>
                    <button className="rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-sm font-bold text-zinc-900 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">
                        Ayarlar
                    </button>
                </div>
            </div>
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
            bg: "bg-blue-50 dark:bg-blue-900/20"
        },
        {
            label: "Etkinlikler",
            value: 0, // Placeholder
            icon: Calendar,
            color: "text-emerald-600",
            bg: "bg-emerald-50 dark:bg-emerald-900/20"
        },
        {
            label: "Rozetler",
            value: 1, // Placeholder
            icon: Award,
            color: "text-amber-600",
            bg: "bg-amber-50 dark:bg-amber-900/20"
        }
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                        <stat.icon size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
