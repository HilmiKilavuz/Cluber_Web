"use client";

import { useState, use } from "react";
import { useEvents } from "@/hooks/events/useEvents";
import { useClub } from "@/hooks/clubs/useClubs";
import { EventCard } from "@/components/events/EventCard";
import { EventForm } from "@/components/events/EventForm";
import { Plus, Calendar, ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuth";

interface ClubEventsPageProps {
    params: Promise<{ id: string }>;
}

type FilterType = "Tümü" | "Yaklaşan" | "Geçmiş";

export default function ClubEventsPage({ params }: ClubEventsPageProps) {
    const { id: clubId } = use(params);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [filter, setFilter] = useState<FilterType>("Tümü");

    const { data: club, isLoading: isLoadingClub } = useClub(clubId);
    const {
        data: eventsData,
        isLoading: isLoadingEvents,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useEvents({ clubId });

    const events =
        eventsData?.pages.flatMap((page: any) =>
            Array.isArray(page.data) ? page.data : Array.isArray(page) ? page : []
        ) || [];

    const { sessionQuery } = useAuth();
    const user = sessionQuery.data;

    const filteredEvents = events
        .filter((event: any) => {
            const isPast = new Date(event.date).getTime() < new Date().getTime();
            if (filter === "Yaklaşan") return !isPast;
            if (filter === "Geçmiş") return isPast;
            return true;
        })
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const isOwner = user?.id === club?.creatorId;

    if (isLoadingClub || isLoadingEvents) {
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
                    maxWidth: "1280px",
                    margin: "0 auto",
                    padding: "clamp(40px, 6vw, 80px) var(--container-padding) var(--section-padding-y)",
                }}
            >
                {/* ── Header ── */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        gap: "20px",
                        marginBottom: "48px",
                    }}
                >
                    <div>
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
                            (etkinlikler)
                        </p>
                        <h1 className="display-md" style={{ color: "var(--color-ink)" }}>
                            Etkinlik Takvimi
                        </h1>
                        <p className="body-md" style={{ color: "var(--color-ink-secondary)", marginTop: "8px" }}>
                            Kulübün planlanan tüm etkinliklerini buradan takip edin.
                        </p>
                    </div>

                    {isOwner && (
                        <button
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            className="btn btn-primary btn-md"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                flexShrink: 0,
                            }}
                        >
                            {showCreateForm ? (
                                "Formu Kapat"
                            ) : (
                                <>
                                    <Plus size={15} />
                                    Yeni Etkinlik
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* ── Create Form ── */}
                {isOwner && showCreateForm && (
                    <div
                        className="card-base animate-fade-in-up"
                        style={{ padding: "32px", marginBottom: "40px" }}
                    >
                        <h2 className="heading-sm" style={{ color: "var(--color-ink)", marginBottom: "6px" }}>
                            Yeni Etkinlik Oluştur
                        </h2>
                        <p className="body-sm" style={{ color: "var(--color-ink-secondary)", marginBottom: "24px" }}>
                            Üyelerin katılabileceği bir etkinlik planlayın.
                        </p>
                        <EventForm clubId={clubId} onSuccess={() => setShowCreateForm(false)} />
                    </div>
                )}

                {/* ── Divider + Filter ── */}
                <div
                    style={{
                        height: "1px",
                        backgroundColor: "var(--color-border)",
                        marginBottom: "32px",
                    }}
                />

                {events && events.length > 0 && (
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                            marginBottom: "32px",
                        }}
                    >
                        {(["Tümü", "Yaklaşan", "Geçmiş"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    height: "32px",
                                    padding: "0 14px",
                                    borderRadius: "var(--radius-full)",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    fontFamily: "var(--font-sans)",
                                    cursor: "pointer",
                                    border: `1px solid ${filter === tab ? "var(--color-ink)" : "var(--color-border)"}`,
                                    backgroundColor: filter === tab ? "var(--color-ink)" : "var(--color-surface)",
                                    color: filter === tab ? "var(--color-accent-fg)" : "var(--color-ink-secondary)",
                                    transition: "all var(--transition-fast)",
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── Events Grid ── */}
                {!filteredEvents || filteredEvents.length === 0 ? (
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
                            backgroundColor: "var(--color-bg-secondary)",
                        }}
                    >
                        <div
                            style={{
                                width: "56px",
                                height: "56px",
                                borderRadius: "var(--radius-md)",
                                backgroundColor: "var(--color-border)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Calendar size={24} strokeWidth={1.5} style={{ color: "var(--color-ink-tertiary)" }} />
                        </div>
                        <h3 className="heading-sm" style={{ color: "var(--color-ink)" }}>
                            {filter === "Tümü" ? "Henüz etkinlik yok" : "Bu kritere uygun etkinlik bulunamadı."}
                        </h3>
                        <p className="body-sm" style={{ color: "var(--color-ink-secondary)" }}>
                            {filter === "Tümü" && isOwner
                                ? "İlk etkinliği sen oluşturabilirsin!"
                                : "Farklı bir filtre seçmeyi deneyin."}
                        </p>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                            gap: "16px",
                        }}
                    >
                        {filteredEvents.map((event: any) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}

                {/* ── Load more ── */}
                {hasNextPage && (
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="btn btn-ghost btn-md"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                opacity: isFetchingNextPage ? 0.6 : 1,
                            }}
                        >
                            {isFetchingNextPage ? (
                                <>
                                    <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
                                    Yükleniyor...
                                </>
                            ) : (
                                "Daha Fazla Yükle"
                            )}
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
