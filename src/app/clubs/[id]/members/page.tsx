"use client";

import { use } from "react";
import { useClub } from "@/hooks/clubs/useClubs";
import { useClubMembers } from "@/hooks/clubs/useClubs";
import { useAuth } from "@/hooks/auth/useAuth";
import { useRouter } from "next/navigation";
import { Users, Crown, Shield, User, ChevronLeft, Loader2, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface ClubMembersPageProps {
    params: Promise<{ id: string }>;
}

const ROLE_LABELS: Record<string, string> = {
    OWNER: "Kurucu",
    ADMIN: "Yönetici",
    MODERATOR: "Moderatör",
    MEMBER: "Üye",
};

const ROLE_ICONS: Record<string, React.ReactNode> = {
    OWNER: <Crown className="h-3.5 w-3.5" />,
    ADMIN: <Shield className="h-3.5 w-3.5" />,
    MODERATOR: <Shield className="h-3.5 w-3.5" />,
    MEMBER: <User className="h-3.5 w-3.5" />,
};

const ROLE_STYLES: Record<string, string> = {
    OWNER: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    ADMIN: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    MODERATOR: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    MEMBER: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

export default function ClubMembersPage({ params }: ClubMembersPageProps) {
    const { id: clubId } = use(params);
    const router = useRouter();
    const { data: club, isLoading: clubLoading } = useClub(clubId);
    const { data: members, isLoading: membersLoading } = useClubMembers(clubId);
    const { sessionQuery } = useAuth();
    const user = sessionQuery.data;

    const isLoading = clubLoading || membersLoading;

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href={`/clubs/${clubId}`}
                    className="mb-3 flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                    <ChevronLeft className="h-4 w-4" />
                    {club?.name}
                </Link>
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                        <Users className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Üyeler</h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {members?.length || 0} üye
                        </p>
                    </div>
                </div>
            </div>

            {/* Members List */}
            {!members || members.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 py-20 dark:border-zinc-800">
                    <Users className="h-10 w-10 text-zinc-300 dark:text-zinc-700" />
                    <p className="mt-4 font-medium text-zinc-500">Henüz üye yok.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
                    <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {members.map((member) => {
                            const isMe = member.userId === user?.id;
                            const initial =
                                member.user?.username?.charAt(0)?.toUpperCase() || "?";

                            return (
                                <li
                                    key={member.id}
                                    className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                >
                                    {/* Avatar */}
                                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                                        {member.user?.avatarUrl ? (
                                            <img
                                                src={member.user.avatarUrl}
                                                alt={member.user.username}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-zinc-500 dark:text-zinc-300">
                                                {initial}
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="truncate font-semibold text-zinc-900 dark:text-zinc-100">
                                                {member.user?.username || "Kullanıcı"}
                                            </p>
                                            {isMe && (
                                                <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">
                                                    Ben
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                                            <Calendar className="h-3 w-3" />
                                            <span>
                                                {format(new Date(member.joinedAt), "d MMMM yyyy", { locale: tr })} tarihinde katıldı
                                            </span>
                                        </div>
                                    </div>

                                    {/* Role Badge */}
                                    <span
                                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${ROLE_STYLES[member.role]}`}
                                    >
                                        {ROLE_ICONS[member.role]}
                                        {ROLE_LABELS[member.role]}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
