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

/* ─── Confirm Modal ────────────────────────────────────── */
function ConfirmModal({
    isOpen, title, description, confirmLabel, danger, onConfirm, onClose,
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
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(8px)",
                padding: "24px",
            }}
        >
            <div
                className="card-base animate-fade-in-up"
                style={{ width: "100%", maxWidth: "440px", padding: "32px" }}
            >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
                    <div
                        style={{
                            width: "44px",
                            height: "44px",
                            flexShrink: 0,
                            borderRadius: "var(--radius-md)",
                            backgroundColor: danger ? "var(--color-error-bg)" : "var(--color-warning-bg, #FEF9C3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: danger ? "var(--color-error)" : "var(--color-warning)",
                        }}
                    >
                        <AlertTriangle size={20} strokeWidth={1.5} />
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            color: "var(--color-ink-tertiary)",
                            backgroundColor: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px",
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>
                <h3 className="heading-sm" style={{ color: "var(--color-ink)", marginTop: "16px", marginBottom: "8px" }}>
                    {title}
                </h3>
                <p className="body-sm" style={{ color: "var(--color-ink-secondary)", lineHeight: 1.6 }}>
                    {description}
                </p>
                <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
                    <button onClick={onClose} className="btn btn-ghost btn-md" style={{ flex: 1 }}>
                        İptal
                    </button>
                    <button
                        onClick={onConfirm}
                        className="btn btn-md"
                        style={{
                            flex: 1,
                            backgroundColor: danger ? "var(--color-error)" : "var(--color-warning)",
                            color: "#FFFFFF",
                            fontWeight: 500,
                        }}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Member Row ─────────────────────────────────────── */
function MemberRow({ member, isCreator, onKick, isPending }: {
    member: ClubMember;
    isCreator: boolean;
    onKick: (member: ClubMember) => void;
    isPending: boolean;
}) {
    const roleLabel: Record<string, string> = {
        OWNER: "Sahip", ADMIN: "Admin", MODERATOR: "Moderatör", MEMBER: "Üye",
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface)",
                transition: "background-color var(--transition-fast)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-secondary)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-surface)"; }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {/* Avatar */}
                <div
                    style={{
                        position: "relative",
                        width: "36px",
                        height: "36px",
                        borderRadius: "var(--radius-full)",
                        backgroundColor: "var(--color-bg-secondary)",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    {member.user?.avatarUrl ? (
                        <img src={member.user.avatarUrl} alt={member.user.displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-ink-secondary)", fontFamily: "var(--font-sans)" }}>
                            {member.user?.displayName?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                    )}
                    {isCreator && (
                        <div
                            style={{
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                                width: "14px",
                                height: "14px",
                                borderRadius: "var(--radius-full)",
                                backgroundColor: "#F59E0B",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Crown size={8} style={{ color: "#FFFFFF" }} />
                        </div>
                    )}
                </div>

                <div>
                    <p className="body-sm" style={{ fontWeight: 600, color: "var(--color-ink)" }}>
                        {member.user?.displayName || "Bilinmeyen Kullanıcı"}
                        {isCreator && (
                            <span style={{ marginLeft: "8px", fontSize: "11px", fontWeight: 500, color: "#F59E0B" }}>
                                (Siz)
                            </span>
                        )}
                    </p>
                    <p className="caption" style={{ color: "var(--color-ink-tertiary)" }}>
                        {new Date(member.joinedAt).toLocaleDateString("tr-TR")} tarihinde katıldı
                    </p>
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className="badge-base" style={{ display: "inline-flex" }}>
                    {roleLabel[member.role] || member.role}
                </span>
                {!isCreator && (
                    <button
                        onClick={() => onKick(member)}
                        disabled={isPending}
                        title="Üyeyi çıkar"
                        style={{
                            width: "32px",
                            height: "32px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "var(--radius-md)",
                            backgroundColor: "var(--color-error-bg)",
                            color: "var(--color-error)",
                            border: "none",
                            cursor: isPending ? "not-allowed" : "pointer",
                            opacity: isPending ? 0.5 : 1,
                            transition: "all var(--transition-fast)",
                        }}
                        onMouseEnter={(e) => {
                            if (!isPending) (e.currentTarget as HTMLElement).style.backgroundColor = "color-mix(in srgb, var(--color-error) 20%, transparent)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-error-bg)";
                        }}
                    >
                        {isPending ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <UserMinus size={13} />}
                    </button>
                )}
            </div>
        </div>
    );
}

/* ─── Admin Page ──────────────────────────────────────── */
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

    useEffect(() => {
        if (!isLoading && club && user && !isOwner) {
            toast.error("Bu sayfaya erişim yetkiniz yok.");
            router.replace(`/clubs/${id}`);
        }
    }, [isLoading, club, user, isOwner, id, router]);

    const handleKickConfirm = async () => {
        if (!kickTarget) return;
        try {
            await removeMemberMutation.mutateAsync(kickTarget.userId);
            toast.success(`${kickTarget.user?.displayName || "Üye"} kulüpten çıkarıldı.`);
        } catch { } finally {
            setKickTarget(null);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteMutation.mutateAsync(id);
            toast.success("Kulüp başarıyla silindi.");
            router.push("/clubs");
        } catch { } finally {
            setDeleteConfirmOpen(false);
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "var(--color-bg)" }}>
                <Loader2 size={28} strokeWidth={1.5} style={{ color: "var(--color-ink-tertiary)", animation: "spin 1s linear infinite" }} />
            </div>
        );
    }

    if (!club || !isOwner) return null;

    const nonOwnerMembers = (members || []).filter((m) => m.userId !== club.creatorId);

    return (
        <>
            <ConfirmModal
                isOpen={!!kickTarget}
                title="Üyeyi Çıkar"
                description={`${kickTarget?.user?.displayName || "bu üyeyi"} kulüpten çıkarmak istediğinize emin misiniz? Bu işlem geri alınamaz.`}
                confirmLabel="Evet, Çıkar"
                danger
                onConfirm={handleKickConfirm}
                onClose={() => setKickTarget(null)}
            />
            <ConfirmModal
                isOpen={deleteConfirmOpen}
                title="Kulübü Sil"
                description={`"${club.name}" adlı kulübü kalıcı olarak silmek istediğinize emin misiniz? Tüm üyeler, etkinlikler ve mesajlar silinecek. Bu işlem GERİ ALINAMAZ.`}
                confirmLabel="Evet, Kalıcı Olarak Sil"
                danger
                onConfirm={handleDeleteConfirm}
                onClose={() => setDeleteConfirmOpen(false)}
            />

            <main style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)" }}>
                <div
                    style={{
                        maxWidth: "960px",
                        margin: "0 auto",
                        padding: "clamp(40px, 6vw, 80px) var(--container-padding) var(--section-padding-y)",
                    }}
                >
                    {/* ── Header ── */}
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "16px",
                            marginBottom: "48px",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <Link
                                href={`/clubs/${id}`}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "var(--radius-md)",
                                    border: "1px solid var(--color-border)",
                                    backgroundColor: "var(--color-surface)",
                                    color: "var(--color-ink-secondary)",
                                    textDecoration: "none",
                                    transition: "all var(--transition-fast)",
                                    flexShrink: 0,
                                }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-secondary)"; (e.currentTarget as HTMLElement).style.color = "var(--color-ink)"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-surface)"; (e.currentTarget as HTMLElement).style.color = "var(--color-ink-secondary)"; }}
                            >
                                <ChevronLeft size={18} />
                            </Link>
                            <div>
                                <p className="label" style={{ color: "var(--color-ink-tertiary)" }}>{club.name}</p>
                                <h1 className="heading-lg" style={{ color: "var(--color-ink)" }}>Yönetim Paneli</h1>
                            </div>
                        </div>

                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "6px 14px",
                                borderRadius: "var(--radius-full)",
                                backgroundColor: "var(--color-warning-bg, #FEF9C3)",
                                color: "var(--color-warning, #B45309)",
                            }}
                        >
                            <ShieldCheck size={14} />
                            <span className="label" style={{ color: "inherit" }}>Kulüp Sahibi</span>
                        </div>
                    </div>

                    {/* ── Stats ── */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                            gap: "16px",
                            marginBottom: "32px",
                        }}
                    >
                        {[
                            { label: "Toplam Üye", value: members?.length ?? 0, Icon: Users },
                            { label: "Etkinlik", value: totalEvents, Icon: Calendar },
                            { label: "Yönetilebilir Üye", value: nonOwnerMembers.length, Icon: ShieldAlert },
                        ].map(({ label, value, Icon }, i) => (
                            <div
                                key={i}
                                className="card-base"
                                style={{ padding: "24px 20px" }}
                            >
                                <Icon size={18} strokeWidth={1.5} style={{ color: "var(--color-ink-tertiary)", marginBottom: "12px" }} />
                                <p
                                    style={{
                                        fontSize: "32px",
                                        fontWeight: 700,
                                        fontFamily: "var(--font-sans)",
                                        letterSpacing: "-0.02em",
                                        color: "var(--color-ink)",
                                        lineHeight: 1,
                                        marginBottom: "4px",
                                    }}
                                >
                                    {value}
                                </p>
                                <p className="caption" style={{ color: "var(--color-ink-tertiary)" }}>{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* ── Divider ── */}
                    <div style={{ height: "1px", backgroundColor: "var(--color-border)", marginBottom: "32px" }} />

                    {/* ── Member Management ── */}
                    <section style={{ marginBottom: "32px" }}>
                        <h2 className="heading-sm" style={{ color: "var(--color-ink)", marginBottom: "6px" }}>Üye Yönetimi</h2>
                        <p className="body-sm" style={{ color: "var(--color-ink-secondary)", marginBottom: "20px" }}>
                            Üyeleri görüntüle ve kulüpten çıkar
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {members?.filter((m) => m.userId === club.creatorId).map((m) => (
                                <MemberRow key={m.id} member={m} isCreator={true} onKick={() => { }} isPending={false} />
                            ))}
                            {nonOwnerMembers.length > 0 ? (
                                nonOwnerMembers.map((m) => (
                                    <MemberRow
                                        key={m.id}
                                        member={m}
                                        isCreator={false}
                                        onKick={(member) => setKickTarget(member)}
                                        isPending={removeMemberMutation.isPending && removeMemberMutation.variables === m.userId}
                                    />
                                ))
                            ) : (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: "48px 24px",
                                        border: "1px dashed var(--color-border)",
                                        borderRadius: "var(--radius-lg)",
                                        gap: "8px",
                                        textAlign: "center",
                                    }}
                                >
                                    <Users size={24} strokeWidth={1.5} style={{ color: "var(--color-ink-tertiary)" }} />
                                    <p className="body-sm" style={{ color: "var(--color-ink-secondary)" }}>Henüz başka üye yok.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ── Danger Zone ── */}
                    <section
                        style={{
                            borderRadius: "var(--radius-lg)",
                            border: "1px solid color-mix(in srgb, var(--color-error) 25%, transparent)",
                            backgroundColor: "var(--color-error-bg)",
                            padding: "28px",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
                            <ShieldAlert size={16} strokeWidth={1.5} style={{ color: "var(--color-error)", marginTop: "2px" }} />
                            <div>
                                <h2 className="heading-sm" style={{ color: "var(--color-error)", marginBottom: "4px" }}>Tehlikeli Bölge</h2>
                                <p className="body-sm" style={{ color: "var(--color-error)", opacity: 0.75 }}>
                                    Bu işlemler geri alınamaz, dikkatli olun
                                </p>
                            </div>
                        </div>

                        <div
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
                            style={{ gap: "16px" }}
                        >
                            <div>
                                <p className="body-sm" style={{ fontWeight: 600, color: "var(--color-ink)" }}>Kulübü Sil</p>
                                <p className="body-sm" style={{ color: "var(--color-ink-secondary)", marginTop: "4px" }}>
                                    Kulübü ve tüm içeriğini kalıcı olarak sil.
                                </p>
                            </div>
                            <button
                                onClick={() => setDeleteConfirmOpen(true)}
                                disabled={deleteMutation.isPending}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "10px 20px",
                                    borderRadius: "var(--radius-md)",
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    fontFamily: "var(--font-sans)",
                                    backgroundColor: "var(--color-error)",
                                    color: "#FFFFFF",
                                    border: "none",
                                    cursor: deleteMutation.isPending ? "not-allowed" : "pointer",
                                    opacity: deleteMutation.isPending ? 0.6 : 1,
                                    flexShrink: 0,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {deleteMutation.isPending ? (
                                    <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
                                ) : (
                                    <Trash2 size={15} strokeWidth={1.5} />
                                )}
                                Kulübü Sil
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}
