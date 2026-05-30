"use client";

import { useEvents } from "@/hooks/events/useEvents";
import { EventCard } from "@/components/events/EventCard";
import {
    Calendar,
    Search,
    Loader2,
    Inbox,
    Clock,
    ChevronDown,
    X,
    Filter,
} from "lucide-react";
import { useState, useMemo, useRef, useEffect, Suspense } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import type { Event } from "@/types/event";

const EVENT_CATEGORIES = [
    "Tümü",
    "Teknoloji",
    "Spor",
    "Müzik",
    "Sanat",
    "Bilim",
    "İş & Kariyer",
    "Oyun",
    "Eğitim",
    "Edebiyat",
    "Sinema",
    "Diğer",
];

/* ════════════════════════════════
   SECTION LABEL
   ════════════════════════════════ */
function SectionLabel({
    icon: Icon,
    label,
    count,
    color,
}: {
    icon: React.ElementType;
    label: string;
    count: number;
    color: string;
}) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "28px",
            }}
        >
            <div
                style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: color === "accent" ? "var(--color-ink)" : "var(--color-bg-secondary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                <Icon
                    size={15}
                    strokeWidth={1.8}
                    style={{
                        color: color === "accent" ? "var(--color-accent-fg)" : "var(--color-ink-tertiary)",
                    }}
                />
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span
                    className="heading-sm"
                    style={{ color: "var(--color-ink)" }}
                >
                    {label}
                </span>
                <span
                    className="caption"
                    style={{
                        color: "var(--color-ink-tertiary)",
                        padding: "2px 8px",
                        backgroundColor: "var(--color-bg-secondary)",
                        borderRadius: "var(--radius-full)",
                        border: "1px solid var(--color-border)",
                    }}
                >
                    {count}
                </span>
            </div>
        </div>
    );
}

/* ════════════════════════════════
   EVENTS CONTENT
   ════════════════════════════════ */
function EventsContent() {
    const router = useRouter();
    const { sessionQuery } = useAuth();
    const user = sessionQuery.data;
    const isLoadingAuth = sessionQuery.isLoading;

    useEffect(() => {
        if (!isLoadingAuth && !user) {
            router.push("/login?next=/events");
        }
    }, [user, isLoadingAuth, router]);

    const [search, setSearch] = useState("");
    const [showPast, setShowPast] = useState(true);
    const upcomingRef = useRef<HTMLDivElement>(null);

    const debouncedSearch = useDebounce(search, 400);

    // Fetch all events with large limit to get all
    const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } = useEvents({
        limit: 100,
    });

    const allEvents = useMemo(
        () =>
            data?.pages.flatMap((page: any) =>
                Array.isArray(page.data) ? page.data : Array.isArray(page) ? page : []
            ) ?? [],
        [data]
    );

    // Filter by search
    const filteredEvents = useMemo(() => {
        return allEvents.filter((event: Event) => {
            const matchesSearch =
                !debouncedSearch ||
                event.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                event.location?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                event.description?.toLowerCase().includes(debouncedSearch.toLowerCase());
            return matchesSearch;
        });
    }, [allEvents, debouncedSearch]);

    // Split into upcoming and past
    const now = new Date();
    const upcomingEvents = useMemo(
        () =>
            filteredEvents
                .filter((e: Event) => new Date(e.date) >= now)
                .sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        [filteredEvents]
    );
    const pastEvents = useMemo(
        () =>
            filteredEvents
                .filter((e: Event) => new Date(e.date) < now)
                .sort((a: Event, b: Event) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        [filteredEvents]
    );

    if (isLoadingAuth || !user) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "calc(100vh - 64px)",
                    backgroundColor: "var(--color-bg)",
                }}
            >
                <Loader2
                    size={28}
                    strokeWidth={1.5}
                    style={{
                        color: "var(--color-ink-tertiary)",
                        animation: "spin 1s linear infinite",
                    }}
                />
            </div>
        );
    }

    return (
        <main style={{ minHeight: "calc(100vh - 64px)", backgroundColor: "var(--color-bg)" }}>
            {/* ════════════════════════════════
                PAGE HEADER
                ════════════════════════════════ */}
            <section
                style={{
                    paddingTop: "clamp(56px, 8vw, 96px)",
                    paddingBottom: "clamp(32px, 5vw, 56px)",
                    paddingLeft: "var(--container-padding)",
                    paddingRight: "var(--container-padding)",
                    maxWidth: "1280px",
                    margin: "0 auto",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "32px",
                        marginBottom: "48px",
                    }}
                >
                    {/* Title block */}
                    <div>
                        <p
                            className="label animate-fade-in"
                            style={{ color: "var(--color-ink-tertiary)", marginBottom: "16px" }}
                        >
                            (tüm etkinlikler)
                        </p>
                        <h1
                            className="animate-fade-in-up display-md"
                            style={{ color: "var(--color-ink)", maxWidth: "560px" }}
                        >
                            Her kulübün etkinlikleri, tek yerden.
                        </h1>
                        <p
                            className="animate-fade-in delay-100 body-md"
                            style={{
                                color: "var(--color-ink-secondary)",
                                marginTop: "12px",
                                maxWidth: "480px",
                            }}
                        >
                            Yaklaşan etkinlikleri keşfet, katıl ve geçmiş etkinliklere göz at.
                        </p>
                    </div>

                    {/* Stats row */}
                    <div
                        className="animate-fade-in delay-200"
                        style={{
                            display: "flex",
                            gap: "12px",
                            flexWrap: "wrap",
                        }}
                    >
                        {[
                            {
                                label: "Yaklaşan",
                                count: upcomingEvents.length,
                                color: "var(--color-ink)",
                                bg: "var(--color-ink)",
                                fg: "var(--color-accent-fg)",
                            },
                            {
                                label: "Geçmiş",
                                count: pastEvents.length,
                                color: "var(--color-ink-tertiary)",
                                bg: "var(--color-bg-secondary)",
                                fg: "var(--color-ink-secondary)",
                            },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "8px 16px",
                                    borderRadius: "var(--radius-full)",
                                    backgroundColor: stat.bg,
                                    border: `1px solid ${stat.bg === "var(--color-bg-secondary)" ? "var(--color-border)" : "transparent"}`,
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "var(--font-sans)",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        color: stat.fg,
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    {stat.count}
                                </span>
                                <span
                                    style={{
                                        fontFamily: "var(--font-sans)",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                        color: stat.fg,
                                        opacity: stat.bg === "var(--color-ink)" ? 0.75 : 1,
                                    }}
                                >
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Search ── */}
                <div
                    className="animate-fade-in delay-200"
                    style={{
                        maxWidth: "520px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "0 16px",
                        height: "50px",
                        borderRadius: "var(--radius-lg)",
                        border: "1px solid var(--color-border)",
                        backgroundColor: "var(--color-surface)",
                        boxShadow: "var(--shadow-sm)",
                        transition: "border-color var(--transition-base), box-shadow var(--transition-base)",
                    }}
                    onFocusCapture={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-ink)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 3px rgba(17,17,16,0.08)";
                    }}
                    onBlurCapture={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
                    }}
                >
                    <Search size={16} strokeWidth={1.5} style={{ color: "var(--color-ink-tertiary)", flexShrink: 0 }} />
                    <input
                        type="text"
                        placeholder="Etkinlik ara..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            flex: 1,
                            border: "none",
                            outline: "none",
                            background: "transparent",
                            fontFamily: "var(--font-sans)",
                            fontSize: "15px",
                            color: "var(--color-ink)",
                        }}
                        aria-label="Etkinlik arama"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            style={{
                                fontSize: "18px",
                                color: "var(--color-ink-tertiary)",
                                cursor: "pointer",
                                border: "none",
                                background: "none",
                                lineHeight: 1,
                                padding: "2px",
                            }}
                            aria-label="Aramayı temizle"
                        >
                            ×
                        </button>
                    )}
                </div>


            </section>

            {/* ════════════════════════════════
                DIVIDER
                ════════════════════════════════ */}
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 var(--container-padding)" }}>
                <div style={{ height: "1px", backgroundColor: "var(--color-border)" }} />
            </div>

            {/* ════════════════════════════════
                EVENTS CONTENT
                ════════════════════════════════ */}
            <section
                style={{
                    maxWidth: "1280px",
                    margin: "0 auto",
                    padding: "56px var(--container-padding) var(--section-padding-y)",
                }}
            >
                {isLoading ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: "320px",
                            gap: "16px",
                        }}
                    >
                        <Loader2
                            size={32}
                            strokeWidth={1.5}
                            style={{
                                color: "var(--color-ink-tertiary)",
                                animation: "spin 1s linear infinite",
                            }}
                        />
                        <p className="body-sm" style={{ color: "var(--color-ink-tertiary)" }}>
                            Etkinlikler yükleniyor...
                        </p>
                    </div>
                ) : error ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: "320px",
                            gap: "12px",
                        }}
                    >
                        <p
                            style={{
                                padding: "16px 24px",
                                borderRadius: "var(--radius-md)",
                                backgroundColor: "var(--color-error-bg)",
                                color: "var(--color-error)",
                                fontFamily: "var(--font-sans)",
                                fontSize: "14px",
                            }}
                        >
                            Bir hata oluştu. Lütfen tekrar deneyin.
                        </p>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: "280px",
                            gap: "16px",
                            border: "1px dashed var(--color-border)",
                            borderRadius: "var(--radius-lg)",
                            backgroundColor: "var(--color-bg-secondary)",
                            textAlign: "center",
                            padding: "40px",
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
                            <Inbox size={24} strokeWidth={1.5} style={{ color: "var(--color-ink-tertiary)" }} />
                        </div>
                        <div>
                            <h3 className="heading-sm" style={{ color: "var(--color-ink)", marginBottom: "8px" }}>
                                Etkinlik Bulunamadı
                            </h3>
                            <p
                                className="body-sm"
                                style={{ color: "var(--color-ink-secondary)", maxWidth: "360px" }}
                            >
                                {search
                                    ? "Arama kriterlerinize uygun etkinlik bulunamadı. Farklı anahtar kelimelerle tekrar deneyin."
                                    : "Henüz hiç etkinlik oluşturulmamış. Kulüpler etkinlik oluşturduğunda burada görünecek."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "64px" }}>

                        {/* ─── UPCOMING EVENTS ─── */}
                        {upcomingEvents.length > 0 && (
                            <div ref={upcomingRef}>
                                <SectionLabel
                                    icon={Calendar}
                                    label="Yaklaşan Etkinlikler"
                                    count={upcomingEvents.length}
                                    color="accent"
                                />
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                        gap: "16px",
                                    }}
                                >
                                    {upcomingEvents.map((event: Event, i: number) => (
                                        <div
                                            key={event.id}
                                            className="animate-fade-in-up"
                                            style={{ animationDelay: `${Math.min(i * 50, 500)}ms` }}
                                        >
                                            <EventCard event={event} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ─── SEPARATOR ─── */}
                        {upcomingEvents.length > 0 && pastEvents.length > 0 && (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "16px",
                                }}
                            >
                                <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-border)" }} />
                                <span
                                    className="caption"
                                    style={{
                                        color: "var(--color-ink-tertiary)",
                                        whiteSpace: "nowrap",
                                        padding: "4px 12px",
                                        border: "1px solid var(--color-border)",
                                        borderRadius: "var(--radius-full)",
                                        backgroundColor: "var(--color-bg-secondary)",
                                    }}
                                >
                                    geçmiş etkinlikler
                                </span>
                                <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-border)" }} />
                            </div>
                        )}

                        {/* ─── PAST EVENTS ─── */}
                        {pastEvents.length > 0 && (
                            <div>
                                <SectionLabel
                                    icon={Clock}
                                    label="Geçmiş Etkinlikler"
                                    count={pastEvents.length}
                                    color="muted"
                                />
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                        gap: "16px",
                                        opacity: 0.7,
                                    }}
                                >
                                    {pastEvents.map((event: Event, i: number) => (
                                        <div
                                            key={event.id}
                                            className="animate-fade-in"
                                            style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
                                        >
                                            <div style={{ position: "relative" }}>
                                                {/* Past event overlay badge */}
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: "12px",
                                                        right: "12px",
                                                        zIndex: 2,
                                                        padding: "3px 10px",
                                                        borderRadius: "var(--radius-full)",
                                                        backgroundColor: "rgba(0,0,0,0.6)",
                                                        backdropFilter: "blur(4px)",
                                                        fontFamily: "var(--font-sans)",
                                                        fontSize: "10px",
                                                        fontWeight: 500,
                                                        color: "rgba(255,255,255,0.85)",
                                                        letterSpacing: "0.04em",
                                                        textTransform: "uppercase",
                                                        pointerEvents: "none",
                                                    }}
                                                >
                                                    Sona Erdi
                                                </div>
                                                <EventCard event={event} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Load more */}
                        {hasNextPage && (
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <button
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                    className="btn btn-ghost btn-md"
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        opacity: isFetchingNextPage ? 0.6 : 1,
                                        cursor: isFetchingNextPage ? "not-allowed" : "pointer",
                                    }}
                                >
                                    {isFetchingNextPage ? (
                                        <>
                                            <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
                                            Yükleniyor...
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown size={15} />
                                            Daha Fazla Yükle
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}

/* ════════════════════════════════
   PAGE EXPORT
   ════════════════════════════════ */
export default function EventsPage() {
    return (
        <Suspense
            fallback={
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
                        style={{
                            color: "var(--color-ink-tertiary)",
                            animation: "spin 1s linear infinite",
                        }}
                    />
                </div>
            }
        >
            <EventsContent />
        </Suspense>
    );
}
