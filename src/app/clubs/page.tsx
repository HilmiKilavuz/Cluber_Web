"use client";

import { useClubs } from "@/hooks/clubs/useClubs";
import type { Club } from "@/types/club";
import { ClubCard } from "@/components/clubs/ClubCard";
import { Search, Loader2, Plus, Inbox, Lock, ArrowRight, X } from "lucide-react";
import { useState, useEffect, Suspense, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = [
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
   AUTH REQUIRED MODAL
   ════════════════════════════════ */
function AuthRequiredModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    // Close on ESC key
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(6px)",
                animation: "fadeIn 0.18s ease-out",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-xl, 20px)",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)",
                    maxWidth: "420px",
                    width: "100%",
                    overflow: "hidden",
                    animation: "slideUpFade 0.22s ease-out",
                }}
            >
                {/* Modal Header */}
                <div
                    style={{
                        padding: "24px 24px 0",
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                    }}
                >
                    {/* Lock icon */}
                    <div
                        style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "var(--radius-md)",
                            backgroundColor: "var(--color-bg-secondary)",
                            border: "1px solid var(--color-border)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <Lock size={20} strokeWidth={1.5} style={{ color: "var(--color-ink)" }} />
                    </div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--color-border)",
                            backgroundColor: "var(--color-bg-secondary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "var(--color-ink-secondary)",
                            transition: "all var(--transition-fast)",
                            flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-border)";
                            (e.currentTarget as HTMLElement).style.color = "var(--color-ink)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-secondary)";
                            (e.currentTarget as HTMLElement).style.color = "var(--color-ink-secondary)";
                        }}
                        aria-label="Kapat"
                    >
                        <X size={14} strokeWidth={2} />
                    </button>
                </div>

                {/* Modal Body */}
                <div style={{ padding: "20px 24px 28px" }}>
                    <h2
                        className="heading-md"
                        style={{
                            color: "var(--color-ink)",
                            marginBottom: "10px",
                        }}
                    >
                        Giriş Yapmanız Gerekiyor
                    </h2>
                    <p
                        className="body-sm"
                        style={{
                            color: "var(--color-ink-secondary)",
                            marginBottom: "28px",
                            lineHeight: 1.6,
                        }}
                    >
                        Kulüp detaylarını görüntülemek, etkinliklere katılmak ve kulüplere üye olmak için
                        hesabınıza giriş yapmanız gerekmektedir.
                    </p>

                    {/* Actions */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <Link
                            href="/login?next=/clubs"
                            className="btn btn-primary btn-md"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                textDecoration: "none",
                                width: "100%",
                            }}
                        >
                            Giriş Yap
                            <ArrowRight size={15} />
                        </Link>

                        <Link
                            href="/register"
                            className="btn btn-ghost btn-md"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                textDecoration: "none",
                                width: "100%",
                                border: "1px solid var(--color-border)",
                            }}
                        >
                            Hesap Oluştur
                        </Link>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUpFade {
                    from { opacity: 0; transform: translateY(16px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
}

/* ════════════════════════════════
   CLUBS CONTENT
   ════════════════════════════════ */
function ClubsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialSearch = searchParams.get("search") || "";
    const initialCategory = searchParams.get("category") || "Tümü";

    const [search, setSearch] = useState(initialSearch);
    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [isMounted, setIsMounted] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const debouncedSearch = useDebounce(search, 500);

    // URL Sync
    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (activeCategory !== "Tümü") params.set("category", activeCategory);
        const newUrl = params.toString() ? `/clubs?${params.toString()}` : "/clubs";
        router.push(newUrl, { scroll: false });
    }, [debouncedSearch, activeCategory, router]);

    const {
        data,
        isLoading,
        error,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useClubs({
        search: debouncedSearch,
        category: activeCategory !== "Tümü" ? activeCategory : undefined,
    });

    const allClubs =
        data?.pages.flatMap((page: any) =>
            Array.isArray(page.data) ? page.data : Array.isArray(page) ? page : []
        ) || [];

    const clubs = allClubs.filter((club: Club) => {
        const matchesCategory =
            !activeCategory || activeCategory === "Tümü" || club.category === activeCategory;
        const matchesSearch =
            !debouncedSearch ||
            club.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            club.description?.toLowerCase().includes(debouncedSearch.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const { sessionQuery } = useAuth();
    const user = sessionQuery.data;
    const isAuthenticated = isMounted && !!user;

    const handleAuthRequired = useCallback(() => {
        setShowAuthModal(true);
    }, []);

    return (
        <main
            style={{
                minHeight: "calc(100vh - 64px)",
                backgroundColor: "var(--color-bg)",
            }}
        >
            {/* Auth Required Modal */}
            <AuthRequiredModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />

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
                    className="flex flex-col lg:flex-row lg:items-end lg:justify-between"
                    style={{ gap: "32px", marginBottom: "48px" }}
                >
                    {/* Title block */}
                    <div>
                        <p
                            className="label animate-fade-in"
                            style={{ color: "var(--color-ink-tertiary)", marginBottom: "16px" }}
                        >
                            (keşfet)
                        </p>
                        <h1
                            className="animate-fade-in-up display-md"
                            style={{ color: "var(--color-ink)", maxWidth: "480px" }}
                        >
                            Sana uygun bir kulüp bul.
                        </h1>
                        <p
                            className="animate-fade-in delay-100 body-md"
                            style={{
                                color: "var(--color-ink-secondary)",
                                marginTop: "12px",
                                maxWidth: "400px",
                            }}
                        >
                            İlgi alanlarına göre kulüplere katıl, yeni insanlar tanı ve etkinlikler düzenle.
                        </p>
                    </div>

                    {/* CTA: Create Club — only for logged-in users */}
                    {isMounted && user && (
                        <div className="animate-fade-in delay-200" style={{ flexShrink: 0 }}>
                            <Link
                                href="/clubs/create"
                                className="btn btn-primary btn-md"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    textDecoration: "none",
                                }}
                            >
                                <Plus size={15} />
                                Kulüp Oluştur
                            </Link>
                        </div>
                    )}
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
                        (e.currentTarget as HTMLElement).style.boxShadow =
                            "0 0 0 3px rgba(17,17,16,0.08)";
                    }}
                    onBlurCapture={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
                    }}
                >
                    <Search
                        size={16}
                        strokeWidth={1.5}
                        style={{ color: "var(--color-ink-tertiary)", flexShrink: 0 }}
                    />
                    <input
                        type="text"
                        placeholder="Kulüp ara..."
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
                        aria-label="Kulüp arama"
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

                {/* ── Category chips ── */}
                <div
                    className="animate-fade-in delay-300"
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginTop: "16px",
                    }}
                >
                    {CATEGORIES.map((cat) => {
                        const isActive = activeCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
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
                                    border: `1px solid ${isActive ? "var(--color-ink)" : "var(--color-border)"}`,
                                    backgroundColor: isActive ? "var(--color-ink)" : "var(--color-surface)",
                                    color: isActive ? "var(--color-accent-fg)" : "var(--color-ink-secondary)",
                                    transition: "all var(--transition-fast)",
                                    letterSpacing: "0.01em",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-ink)";
                                        (e.currentTarget as HTMLElement).style.color = "var(--color-ink)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                                        (e.currentTarget as HTMLElement).style.color = "var(--color-ink-secondary)";
                                    }
                                }}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* ════════════════════════════════
                DIVIDER
                ════════════════════════════════ */}
            <div
                style={{
                    maxWidth: "1280px",
                    margin: "0 auto",
                    padding: "0 var(--container-padding)",
                }}
            >
                <div style={{ height: "1px", backgroundColor: "var(--color-border)" }} />
            </div>

            {/* ════════════════════════════════
                CLUB GRID
                ════════════════════════════════ */}
            <section
                style={{
                    maxWidth: "1280px",
                    margin: "0 auto",
                    padding: "48px var(--container-padding) var(--section-padding-y)",
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
                            Kulüpler yükleniyor...
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
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
                        {/* Results count */}
                        {clubs.length > 0 && (
                            <p
                                className="label"
                                style={{ color: "var(--color-ink-tertiary)" }}
                            >
                                {clubs.length} kulüp bulundu
                            </p>
                        )}

                        {/* Grid */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                gap: "16px",
                            }}
                        >
                            {clubs.map((club: Club, i: number) => (
                                <div
                                    key={club.id}
                                    style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
                                >
                                    <ClubCard
                                        club={club}
                                        isAuthenticated={isAuthenticated}
                                        onAuthRequired={handleAuthRequired}
                                    />
                                </div>
                            ))}

                            {clubs.length === 0 && (
                                <div
                                    style={{
                                        gridColumn: "1 / -1",
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
                                        <h3
                                            className="heading-sm"
                                            style={{ color: "var(--color-ink)", marginBottom: "8px" }}
                                        >
                                            Sonuç Bulunamadı
                                        </h3>
                                        <p
                                            className="body-sm"
                                            style={{
                                                color: "var(--color-ink-secondary)",
                                                maxWidth: "360px",
                                            }}
                                        >
                                            Arama kriterlerinize uygun kulüp bulunamadı. Farklı anahtar
                                            kelimelerle veya farklı bir kategoride tekrar deneyin.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

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
                                        "Daha Fazla Yükle"
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

export default function ClubsPage() {
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
            <ClubsContent />
        </Suspense>
    );
}
