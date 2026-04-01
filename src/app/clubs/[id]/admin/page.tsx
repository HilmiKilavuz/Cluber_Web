"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
    ChevronLeft,
    Loader2,
    Users,
    ShieldAlert,
    Trash2,
    UserMinus,
    Crown,
    Calendar,
    AlertTriangle,
    X,
    ShieldCheck,
} from "lucide-react";
import { useClub, useClubMembers, useDeleteClub, useRemoveMember } from "@/hooks/clubs/useClubs";
import { useAuth } from "@/hooks/auth/useAuth";
import { useEvents } from "@/hooks/events/useEvents";
import type { ClubMember } from "@/types/club";

/* ─── Onay Modalı ──────────────────────────────────────── */
function ConfirmModal({
    isOpen,
    title,
    description,
    confirmLabel,
    danger,
    onConfirm,
    onClose,
}: {
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    danger?: boolean;
    onConfirm: () => void;
    onClose: () => void;
}) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-start justify-between gap-4">
                    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${danger ? "bg-red-100 dark:bg-red-900/30" : "bg-amber-100 dark:bg-amber-900/30"}`}>
                        <AlertTriangle size={24} className={danger ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"} />
                    </div>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                        <X size={20} />
                    </button>
                </div>
                <h3 className="mt-4 text-xl font-bold text-zinc-900 dark:text-zinc-100">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{description}</p>
                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-zinc-200 bg-white py-2.5 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                        İptal
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 rounded-xl py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 ${danger ? "bg-red-600" : "bg-amber-500"}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Üye Satırı ────────────────────────────────────────── */
function MemberRow({
    member,
    isCreator,
    onKick,
    isPending,
}: {
    member: ClubMember;
    isCreator: boolean;
    onKick: (member: ClubMember) => void;
    isPending: boolean;
}) {
    const roleBadge: Record<string, string> = {
        OWNER: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        ADMIN: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        MODERATOR: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        MEMBER: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    };

    const roleLabel: Record<string, string> = {
        OWNER: "Sahip",
        ADMIN: "Admin",
        MODERATOR: "Moderatör",
        MEMBER: "Üye",
    };

    return (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 transition-colors hover:bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800/50">
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                    {member.user?.avatarUrl ? (
                        <img src={member.user.avatarUrl} alt={member.user.displayName} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-bold text-zinc-500 dark:text-zinc-400">
                            {member.user?.displayName?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                    )}
                    {isCreator && (
                        <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400">
                            <Crown size={9} className="text-white" />
                        </div>
                    )}
                </div>

                {/* İsim & Rol */}
                <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {member.user?.displayName || "Bilinmeyen Kullanıcı"}
                        {isCreator && <span className="ml-2 text-xs font-medium text-amber-500">(Siz)</span>}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {new Date(member.joinedAt).toLocaleDateString("tr-TR")} tarihinde katıldı
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${roleBadge[member.role] || roleBadge.MEMBER}`}>
                    {roleLabel[member.role] || member.role}
                </span>
                {!isCreator && (
                    <button
                        onClick={() => onKick(member)}
                        disabled={isPending}
                        title="Üyeyi çıkar"
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-colors hover:bg-red-100 hover:text-red-700 disabled:opacity-50 dark:bg-red-900/20 dark:hover:bg-red-900/40"
                    >
                        {isPending ? <Loader2 size={14} className="animate-spin" /> : <UserMinus size={14} />}
                    </button>
                )}
            </div>
        </div>
    );
}

/* ─── Admin Sayfası ─────────────────────────────────────── */
export default function ClubAdminPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const { sessionQuery } = useAuth();
    const { data: club, isLoading: clubLoading } = useClub(id);
    const { data: members, isLoading: membersLoading } = useClubMembers(id);
    const { data: eventsData } = useEvents({ clubId: id });
    const deleteMutation = useDeleteClub();
    const removeMemberMutation = useRemoveMember(id);

    const [kickTarget, setKickTarget] = useState<ClubMember | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    const user = sessionQuery.data;
    const isOwner = user?.id === club?.creatorId;
    const isLoading = clubLoading || membersLoading || sessionQuery.isLoading;

    const totalEvents =
        eventsData?.pages.flatMap((page: any) =>
            Array.isArray(page.data) ? page.data : Array.isArray(page) ? page : []
        ).length ?? 0;

    // Yetkisiz kullanıcıları yönlendir
    useEffect(() => {
        if (!isLoading && club && user && !isOwner) {
            toast.error("Bu sayfaya erişim yetkiniz yok.");
            router.replace(`/clubs/${id}`);
        }
    }, [isLoading, club, user, isOwner, id, router]);

    /* ── Handlers ── */
    const handleKickConfirm = async () => {
        if (!kickTarget) return;
        try {
            await removeMemberMutation.mutateAsync(kickTarget.userId);
            toast.success(`${kickTarget.user?.displayName || "Üye"} kulüpten çıkarıldı.`);
        } catch {
            // axios interceptor handles toast
        } finally {
            setKickTarget(null);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteMutation.mutateAsync(id);
            toast.success("Kulüp başarıyla silindi.");
            router.push("/clubs");
        } catch {
            // axios interceptor handles toast
        } finally {
            setDeleteConfirmOpen(false);
        }
    };

    /* ── Loading ── */
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    if (!club || !isOwner) return null;

    const nonOwnerMembers = (members || []).filter((m) => m.userId !== club.creatorId);

    /* ── UI ── */
    return (
        <>
            {/* Kick Onay Modalı */}
            <ConfirmModal
                isOpen={!!kickTarget}
                title="Üyeyi Çıkar"
                description={`${kickTarget?.user?.displayName || "bu üyeyi"} kulüpten çıkarmak istediğinize emin misiniz? Bu işlem geri alınamaz.`}
                confirmLabel="Evet, Çıkar"
                danger
                onConfirm={handleKickConfirm}
                onClose={() => setKickTarget(null)}
            />

            {/* Silme Onay Modalı */}
            <ConfirmModal
                isOpen={deleteConfirmOpen}
                title="Kulübü Sil"
                description={`"${club.name}" adlı kulübü kalıcı olarak silmek istediğinize emin misiniz? Tüm üyeler, etkinlikler ve mesajlar silinecek. Bu işlem GERİ ALINAMAZ.`}
                confirmLabel="Evet, Kalıcı Olarak Sil"
                danger
                onConfirm={handleDeleteConfirm}
                onClose={() => setDeleteConfirmOpen(false)}
            />

            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
                <div className="container mx-auto max-w-4xl px-4 py-10 lg:px-8">

                    {/* Üst Bar */}
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <Link
                                href={`/clubs/${id}`}
                                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                            >
                                <ChevronLeft size={20} />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                                    Yönetim Paneli
                                </h1>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">{club.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-2 dark:bg-amber-900/20">
                            <ShieldCheck size={16} className="text-amber-600 dark:text-amber-400" />
                            <span className="text-sm font-bold text-amber-700 dark:text-amber-400">Kulüp Sahibi</span>
                        </div>
                    </div>

                    {/* İstatistik Kartları */}
                    <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
                            <Users size={24} className="mb-3 text-blue-500" />
                            <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                                {members?.length ?? 0}
                            </p>
                            <p className="mt-1 text-sm font-medium text-zinc-500">Toplam Üye</p>
                        </div>
                        <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
                            <Calendar size={24} className="mb-3 text-purple-500" />
                            <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                                {totalEvents}
                            </p>
                            <p className="mt-1 text-sm font-medium text-zinc-500">Etkinlik</p>
                        </div>
                        <div className="col-span-2 rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50 sm:col-span-1">
                            <ShieldAlert size={24} className="mb-3 text-emerald-500" />
                            <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                                {nonOwnerMembers.length}
                            </p>
                            <p className="mt-1 text-sm font-medium text-zinc-500">Yönetilebilir Üye</p>
                        </div>
                    </div>

                    {/* Üye Yönetimi */}
                    <section className="mb-8 rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/20">
                                <Users size={20} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Üye Yönetimi</h2>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Üyeleri görüntüle ve kulüpten çıkar
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {/* Kulüp sahibi (siz) */}
                            {members
                                ?.filter((m) => m.userId === club.creatorId)
                                .map((m) => (
                                    <MemberRow
                                        key={m.id}
                                        member={m}
                                        isCreator={true}
                                        onKick={() => {}}
                                        isPending={false}
                                    />
                                ))}

                            {/* Diğer üyeler */}
                            {nonOwnerMembers.length > 0 ? (
                                nonOwnerMembers.map((m) => (
                                    <MemberRow
                                        key={m.id}
                                        member={m}
                                        isCreator={false}
                                        onKick={(member) => setKickTarget(member)}
                                        isPending={
                                            removeMemberMutation.isPending &&
                                            removeMemberMutation.variables === m.userId
                                        }
                                    />
                                ))
                            ) : (
                                <div className="rounded-2xl border-2 border-dashed border-zinc-200 p-8 text-center dark:border-zinc-800">
                                    <Users className="mx-auto mb-3 text-zinc-300 dark:text-zinc-700" size={32} />
                                    <p className="text-sm font-medium text-zinc-500">
                                        Henüz başka üye yok.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Tehlikeli Bölge */}
                    <section className="rounded-3xl border-2 border-red-200 bg-red-50/50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/30">
                                <ShieldAlert size={20} className="text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-red-700 dark:text-red-400">Tehlikeli Bölge</h2>
                                <p className="text-sm text-red-500 dark:text-red-500">
                                    Bu işlemler geri alınamaz, dikkatli olun
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="font-bold text-zinc-900 dark:text-zinc-100">Kulübü Sil</p>
                                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                                    Kulübü ve tüm içeriğini (üyeler, etkinlikler, sohbet) kalıcı olarak sil.
                                </p>
                            </div>
                            <button
                                onClick={() => setDeleteConfirmOpen(true)}
                                disabled={deleteMutation.isPending}
                                className="flex flex-shrink-0 items-center gap-2 rounded-2xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                            >
                                {deleteMutation.isPending ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Trash2 size={16} />
                                )}
                                Kulübü Sil
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
