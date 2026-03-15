import Link from "next/link";
import type { Club } from "@/types/club";
import { Users } from "lucide-react";

interface ClubCardProps {
    club: Club;
}

export const ClubCard = ({ club }: ClubCardProps) => {
    return (
        <div className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            {/* Banner */}
            <div className="relative h-24 w-full bg-zinc-100 dark:bg-zinc-800">
                {club.bannerUrl ? (
                    <img
                        src={club.bannerUrl}
                        alt={club.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10" />
                )}

                {/* Avatar */}
                <div className="absolute -bottom-6 left-4">
                    <div className="h-14 w-14 overflow-hidden rounded-xl border-4 border-white bg-zinc-100 shadow-sm dark:border-zinc-900 dark:bg-zinc-800">
                        {club.avatarUrl ? (
                            <img src={club.avatarUrl} alt={club.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-zinc-200 text-lg font-bold text-zinc-500 dark:bg-zinc-700">
                                {club.name?.charAt(0) || "C"}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-4 pt-8">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            <Link href={`/clubs/${club.id}`}>
                                {club.name}
                            </Link>
                        </h3>
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                            {club.category}
                        </span>
                    </div>
                </div>

                <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {club.description}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        <Users size={14} />
                        <span>{club._count?.memberships || club.memberships?.length || 0} üye</span>
                    </div>

                    <Link
                        href={`/clubs/${club.id}`}
                        className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900"
                    >
                        İncele
                    </Link>
                </div>
            </div>
        </div>
    );
};
