"use client";

import { useParams, useRouter } from "next/navigation";
import { useClub, useClubMembers } from "@/hooks/clubs/useClubs";
import { useAuth } from "@/hooks/auth/useAuth";
import { Users, Crown, Shield, User, ChevronLeft, Loader2, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

const ROLE_LABELS: Record<string, string> = {
    OWNER: "Kurucu",
    ADMIN: "Yönetici",
    MODERATOR: "Moderatör",
    MEMBER: "Üye",
};

const ROLE_ICONS: Record<string, React.ReactNode> = {
    OWNER: <Crown size={12} />,
    ADMIN: <Shield size={12} />,
    MODERATOR: <Shield size={12} />,
    MEMBER: <User size={12} />,
};

export default function ClubMembersPage() {
    const params = useParams<{ id: string }>();
    const clubId = params.id;
    const { data: club, isLoading: clubLoading } = useClub(clubId);
    const { data: members, isLoading: membersLoading } = useClubMembers(clubId);
    const { sessionQuery } = useAuth();
    const user = sessionQuery.data;

    const isLoading = clubLoading || membersLoading;

    if (isLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "60vh",
                    backgroundColor: "var(--color-bg)",
                }}
            >
                <Loader2
                    size={28}
                    strokeWidth={1.5}
                    style={{ color: "var(--color-ink-tertiary)", animation: "spin 1s linear infinite" }}
                />
            </div>
        );
    }

    return (
        <main
            style={{
                minHeight: "100vh",
                backgroundColor: "var(--color-bg)",
            }}
        >
            <div
                style={{
                    maxWidth: "960px",
                    margin: "0 auto",
                    padding: "clamp(40px, 6vw, 80px) var(--container-padding) var(--section-padding-y)",
                }}
            >
                {/* ── Header ── */}
                <Link
                    href={`/clubs/${clubId}`}
                    className="body-sm"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        color: "var(--color-ink-tertiary)",
                        textDecoration: "none",
                        marginBottom: "12px",
                        transition: "color var(--transition-fast)",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-ink)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-ink-tertiary)"; }}
                >
                    <ChevronLeft size={14} />
                    {club?.name}
                </Link>

                <p className="label" style={{ color: "var(--color-ink-tertiary)", marginBottom: "8px" }}>
                    (üyeler)
                </p>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "12px",
                        marginBottom: "40px",
                    }}
                >
                    <h1 className="display-sm" style={{ color: "var(--color-ink)" }}>Üyeler</h1>
                    <span className="label" style={{ color: "var(--color-ink-tertiary)" }}>
                        {members?.length || 0} üye
                    </span>
                </div>

                {/* ── Divider ── */}
                <div style={{ height: "1px", backgroundColor: "var(--color-border)", marginBottom: "24px" }} />

                {/* ── Members List ── */}
                {!members || members.length === 0 ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "80px 24px",
                            border: "1px dashed var(--color-border)",
                            borderRadius: "var(--radius-lg)",
                            gap: "12px",
                            textAlign: "center",
                        }}
                    >
                        <Users size={24} strokeWidth={1.5} style={{ color: "var(--color-ink-tertiary)" }} />
                        <p className="body-sm" style={{ color: "var(--color-ink-secondary)" }}>Henüz üye yok.</p>
                    </div>
                ) : (
                    <div
                        className="card-base"
                        style={{ overflow: "hidden" }}
                    >
                        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                            {members.map((member, idx) => {
                                const isMe = member.userId === user?.id;
                                const initial = member.user?.displayName?.charAt(0)?.toUpperCase() || "?";

                                return (
                                    <li
                                        key={member.id}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "14px",
                                            padding: "14px 20px",
                                            borderTop: idx === 0 ? "none" : "1px solid var(--color-border)",
                                            transition: "background-color var(--transition-fast)",
                                        }}
                                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-secondary)"; }}
                                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                                    >
                                        {/* Avatar */}
                                        <div
                                            style={{
                                                width: "36px",
                                                height: "36px",
                                                flexShrink: 0,
                                                borderRadius: "var(--radius-full)",
                                                backgroundColor: "var(--color-bg-secondary)",
                                                overflow: "hidden",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {member.user?.avatarUrl ? (
                                                <img
                                                    src={member.user.avatarUrl}
                                                    alt={member.user.displayName || "Kullanıcı Avatarı"}
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                />
                                            ) : (
                                                <span
                                                    style={{
                                                        fontSize: "12px",
                                                        fontWeight: 600,
                                                        fontFamily: "var(--font-sans)",
                                                        color: "var(--color-ink-secondary)",
                                                    }}
                                                >
                                                    {initial}
                                                </span>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <p
                                                    className="body-sm"
                                                    style={{
                                                        fontWeight: 600,
                                                        color: "var(--color-ink)",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {member.user?.displayName || "Kullanıcı"}
                                                </p>
                                                {isMe && (
                                                    <span className="badge-base" style={{ flexShrink: 0 }}>Ben</span>
                                                )}
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "4px",
                                                    marginTop: "2px",
                                                    color: "var(--color-ink-tertiary)",
                                                }}
                                            >
                                                <Calendar size={11} strokeWidth={1.5} />
                                                <span className="caption">
                                                    {format(new Date(member.joinedAt), "d MMMM yyyy", { locale: tr })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Role Badge */}
                                        <span
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "5px",
                                                padding: "4px 10px",
                                                borderRadius: "var(--radius-full)",
                                                fontSize: "11px",
                                                fontWeight: 500,
                                                fontFamily: "var(--font-sans)",
                                                letterSpacing: "0.02em",
                                                border: "1px solid var(--color-border)",
                                                color: "var(--color-ink-secondary)",
                                                backgroundColor: "var(--color-surface)",
                                                flexShrink: 0,
                                            }}
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
        </main>
    );
}
