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
    LayoutDashboard,
    ShieldAlert,
    ArrowRight,
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
    const events =
        eventsData?.pages.flatMap((page: any) =>
            Array.isArray(page.data) ? page.data : Array.isArray(page) ? page : []
        ) || [];

    const handleJoin = async () => {
        try {
            await joinMutation.mutateAsync(id);
            toast.success("Kulübe başarıyla katıldınız!");
        } catch { }
    };

    const handleLeave = async () => {
        try {
            await leaveMutation.mutateAsync(id);
            toast.success("Kulüpten ayrıldınız.");
        } catch { }
    };

    /* ── Loading ── */
    if (isLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
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

    /* ── Error ── */
    if (error || !club) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    gap: "16px",
                    backgroundColor: "var(--color-bg)",
                    padding: "40px",
                    textAlign: "center",
                }}
            >
                <h2 className="heading-lg" style={{ color: "var(--color-ink)" }}>
                    Kulüp bulunamadı
                </h2>
                <p className="body-md" style={{ color: "var(--color-ink-secondary)" }}>
                    İstediğiniz kulüp silinmiş veya taşınmış olabilir.
                </p>
                <Link
                    href="/clubs"
                    className="btn btn-primary btn-md"
                    style={{ marginTop: "8px", display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none" }}
                >
                    Tüm Kulüplere Dön
                    <ArrowRight size={15} />
                </Link>
            </div>
        );
    }

    const TAB_LINKS = [
        { label: "Genel Bakış", href: `/clubs/${club.id}`, icon: null },
        { label: "Sohbet", href: `/clubs/${club.id}/chat`, icon: MessageSquare },
        { label: "Etkinlikler", href: `/clubs/${club.id}/events`, icon: Calendar },
        { label: "Üyeler", href: `/clubs/${club.id}/members`, icon: LayoutDashboard },
    ];

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)" }}>

            {/* ════════════════════════════════
                BANNER
                ════════════════════════════════ */}
            <div
                style={{
                    position: "relative",
                    height: "clamp(200px, 28vw, 320px)",
                    backgroundColor: "var(--color-bg-secondary)",
                    overflow: "hidden",
                }}
            >
                {club.bannerUrl ? (
                    <img
                        src={club.bannerUrl}
                        alt={club.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                ) : (
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            background: "linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-border) 100%)",
                        }}
                    />
                )}

                {/* Gradient overlay */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
                    }}
                />

                {/* Back button */}
                <button
                    onClick={() => router.back()}
                    style={{
                        position: "absolute",
                        top: "20px",
                        left: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "36px",
                        height: "36px",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "rgba(255,255,255,0.15)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        color: "#FFFFFF",
                        cursor: "pointer",
                        transition: "background-color var(--transition-fast)",
                    }}
                    aria-label="Geri"
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.25)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.15)"; }}
                >
                    <ChevronLeft size={18} />
                </button>
            </div>

            {/* ════════════════════════════════
                CONTENT
                ════════════════════════════════ */}
            <div
                style={{
                    maxWidth: "1280px",
                    margin: "0 auto",
                    padding: "0 var(--container-padding)",
                }}
            >
                {/* Club identity row */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "flex-end",
                        gap: "20px",
                        marginTop: "-40px",
                        marginBottom: "40px",
                    }}
                >
                    {/* Avatar */}
                    <div
                        style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "var(--radius-lg)",
                            border: "3px solid var(--color-bg)",
                            backgroundColor: "var(--color-bg-secondary)",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "var(--shadow-md)",
                            flexShrink: 0,
                        }}
                    >
                        {club.avatarUrl ? (
                            <img src={club.avatarUrl} alt={club.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            <span
                                style={{
                                    fontSize: "28px",
                                    fontWeight: 600,
                                    fontFamily: "var(--font-sans)",
                                    color: "var(--color-ink-secondary)",
                                }}
                            >
                                {club.name?.charAt(0) || "C"}
                            </span>
                        )}
                    </div>

                    {/* Name + meta */}
                    <div style={{ flex: 1, minWidth: "200px", paddingBottom: "4px" }}>
                        <span className="badge-base" style={{ marginBottom: "8px", display: "inline-flex" }}>
                            {club.category}
                        </span>
                        <h1
                            className="display-md"
                            style={{ color: "var(--color-ink)", lineHeight: 1.1 }}
                        >
                            {club.name}
                        </h1>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "16px",
                                marginTop: "8px",
                            }}
                        >
                            <span
                                className="body-sm"
                                style={{
                                    color: "var(--color-ink-tertiary)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                }}
                            >
                                <Users size={13} strokeWidth={1.5} />
                                {club._count?.memberships || club.memberships?.length || 0} üye
                            </span>
                            <span
                                className="body-sm"
                                style={{
                                    color: "var(--color-ink-tertiary)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                }}
                            >
                                <Clock size={13} strokeWidth={1.5} />
                                {new Date(club.createdAt).toLocaleDateString("tr-TR")}
                            </span>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                            paddingBottom: "4px",
                        }}
                    >
                        {isOwner ? (
                            <Link
                                href={`/clubs/${club.id}/settings`}
                                className="btn btn-ghost btn-md"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    textDecoration: "none",
                                }}
                            >
                                <Settings size={15} />
                                Ayarlar
                            </Link>
                        ) : isMember ? (
                            <button
                                onClick={handleLeave}
                                className="btn btn-ghost btn-md"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    color: "var(--color-error)",
                                    borderColor: "color-mix(in srgb, var(--color-error) 30%, transparent)",
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-error-bg)";
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                                }}
                            >
                                <LogOut size={15} />
                                Ayrıl
                            </button>
                        ) : (
                            <button
                                onClick={handleJoin}
                                className="btn btn-primary btn-md"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <UserPlus size={15} />
                                Katıl
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Tab Navigation ── */}
                <div
                    style={{
                        display: "flex",
                        gap: "0",
                        borderBottom: "1px solid var(--color-border)",
                        marginBottom: "48px",
                    }}
                >
                    {TAB_LINKS.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    padding: "12px 20px",
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    fontFamily: "var(--font-sans)",
                                    color: "var(--color-ink-secondary)",
                                    textDecoration: "none",
                                    borderBottom: "2px solid transparent",
                                    marginBottom: "-1px",
                                    transition: "all var(--transition-fast)",
                                    whiteSpace: "nowrap",
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.color = "var(--color-ink)";
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.color = "var(--color-ink-secondary)";
                                }}
                            >
                                {Icon && <Icon size={15} strokeWidth={1.5} />}
                                {tab.label}
                            </Link>
                        );
                    })}
                    {isOwner && (
                        <Link
                            href={`/clubs/${club.id}/admin`}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "12px 20px",
                                fontSize: "14px",
                                fontWeight: 500,
                                fontFamily: "var(--font-sans)",
                                color: "var(--color-warning)",
                                textDecoration: "none",
                                borderBottom: "2px solid transparent",
                                marginBottom: "-1px",
                                transition: "color var(--transition-fast)",
                                whiteSpace: "nowrap",
                            }}
                        >
                            <ShieldAlert size={15} strokeWidth={1.5} />
                            Yönetim Paneli
                        </Link>
                    )}
                </div>

                {/* ── Content Grid ── */}
                <div
                    className="grid lg:grid-cols-3"
                    style={{ gap: "32px", paddingBottom: "var(--section-padding-y)" }}
                >
                    {/* Main */}
                    <div style={{ gridColumn: "1 / 3" }}>
                        {/* About */}
                        <section
                            className="card-base"
                            style={{ padding: "32px" }}
                        >
                            <h2
                                className="heading-sm"
                                style={{ color: "var(--color-ink)", marginBottom: "16px" }}
                            >
                                Hakkında
                            </h2>
                            <p
                                className="body-md"
                                style={{
                                    color: "var(--color-ink-secondary)",
                                    whiteSpace: "pre-wrap",
                                    lineHeight: 1.7,
                                }}
                            >
                                {club.description}
                            </p>
                        </section>

                        {/* Events */}
                        <section style={{ marginTop: "24px" }}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: "20px",
                                }}
                            >
                                <h2 className="heading-sm" style={{ color: "var(--color-ink)" }}>
                                    Yaklaşan Etkinlikler
                                </h2>
                                <Link
                                    href={`/clubs/${club.id}/events`}
                                    className="link-underline body-sm"
                                    style={{ color: "var(--color-ink-secondary)" }}
                                >
                                    Tümünü Gör →
                                </Link>
                            </div>

                            {events && events.length > 0 ? (
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                        gap: "16px",
                                    }}
                                >
                                    {[...events]
                                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                        .slice(0, 3)
                                        .map((event) => (
                                            <EventCard key={event.id} event={event} />
                                        ))}
                                </div>
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
                                        textAlign: "center",
                                        gap: "12px",
                                    }}
                                >
                                    <Calendar size={32} strokeWidth={1} style={{ color: "var(--color-border-strong)" }} />
                                    <p className="body-sm" style={{ color: "var(--color-ink-secondary)" }}>
                                        Henüz planlanmış etkinlik yok.
                                    </p>
                                    <Link
                                        href={`/clubs/${club.id}/events`}
                                        className="link-underline body-sm"
                                        style={{ color: "var(--color-ink-secondary)" }}
                                    >
                                        Etkinlik oluştur →
                                    </Link>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {/* Owner card */}
                        <section
                            className="card-base"
                            style={{ padding: "24px" }}
                        >
                            <h3
                                className="label"
                                style={{ color: "var(--color-ink-tertiary)", marginBottom: "16px" }}
                            >
                                Kulüp Sahibi
                            </h3>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <div
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "var(--radius-full)",
                                        backgroundColor: "var(--color-bg-secondary)",
                                        overflow: "hidden",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    {club.creator?.avatarUrl ? (
                                        <img src={club.creator.avatarUrl} alt={club.creator.displayName} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "var(--radius-full)" }} />
                                    ) : (
                                        <span style={{ fontSize: "14px", fontWeight: 600, fontFamily: "var(--font-sans)", color: "var(--color-ink-secondary)" }}>
                                            {club.creator?.displayName?.charAt(0) || club.creatorId?.charAt(0) || "U"}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <p className="body-sm" style={{ fontWeight: 600, color: "var(--color-ink)" }}>
                                        {club.creator?.displayName || "Admin"}
                                    </p>
                                    <p className="caption" style={{ color: "var(--color-ink-tertiary)" }}>Kurucu Üye</p>
                                </div>
                            </div>
                        </section>

                        {/* Dark info card */}
                        <div
                            style={{
                                backgroundColor: "var(--color-ink)",
                                borderRadius: "var(--radius-lg)",
                                padding: "28px 24px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                            }}
                        >
                            <h3
                                className="heading-sm"
                                style={{ color: "#FFFFFF" }}
                            >
                                Resmi Kulüp
                            </h3>
                            <p
                                className="body-sm"
                                style={{ color: "rgba(255,255,255,0.5)" }}
                            >
                                Bu kulüp topluluk kurallarına uygun olarak oluşturulmuştur.
                            </p>
                            <button
                                className="btn btn-md"
                                style={{
                                    width: "100%",
                                    marginTop: "4px",
                                    backgroundColor: "rgba(255,255,255,0.12)",
                                    color: "#FFFFFF",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.2)";
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.12)";
                                }}
                            >
                                Paylaş
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
