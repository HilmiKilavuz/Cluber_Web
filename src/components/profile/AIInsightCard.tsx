"use client";

import { useEffect, useRef } from "react";
import { X, Sparkles, Tag, Lightbulb, Compass, ArrowRight, Loader2, AlertTriangle } from "lucide-react";
import type { ProfileInsightResult } from "@/services/ai/ai.service";
import Link from "next/link";

interface AIInsightCardProps {
    isOpen: boolean;
    onClose: () => void;
    isPending: boolean;
    isError: boolean;
    errorMessage?: string;
    data?: ProfileInsightResult;
    /** True when user has zero club memberships */
    hasNoClubs: boolean;
}

export function AIInsightCard({
    isOpen,
    onClose,
    isPending,
    isError,
    errorMessage,
    data,
    hasNoClubs,
}: AIInsightCardProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    // Close on Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    // Lock body scroll
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
            ref={overlayRef}
            onClick={(e) => {
                if (e.target === overlayRef.current) onClose();
            }}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                backgroundColor: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
                animation: "fadeIn 0.2s ease",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "600px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    backgroundColor: "var(--color-bg)",
                    borderRadius: "var(--radius-xl, 20px)",
                    border: "1px solid var(--color-border)",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
                    animation: "slideUp 0.25s ease",
                    position: "relative",
                }}
            >
                {/* ─── Header ─── */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "24px 28px 20px",
                        borderBottom: "1px solid var(--color-border)",
                        position: "sticky",
                        top: 0,
                        backgroundColor: "var(--color-bg)",
                        zIndex: 1,
                        borderRadius: "var(--radius-xl, 20px) var(--radius-xl, 20px) 0 0",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "10px",
                                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <Sparkles size={18} color="white" />
                        </div>
                        <div>
                            <h2
                                style={{
                                    fontSize: "16px",
                                    fontWeight: 700,
                                    fontFamily: "var(--font-sans)",
                                    color: "var(--color-ink)",
                                    lineHeight: 1.2,
                                }}
                            >
                                AI Karakter Analizi
                            </h2>
                            <p
                                style={{
                                    fontSize: "12px",
                                    color: "var(--color-ink-tertiary)",
                                    fontFamily: "var(--font-sans)",
                                    marginTop: "2px",
                                }}
                            >
                                Kulüplerinden yola çıkarak hazırlandı
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            width: "32px",
                            height: "32px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                            color: "var(--color-ink-secondary)",
                            transition: "background-color 0.15s",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor =
                                "var(--color-bg-secondary)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* ─── Body ─── */}
                <div style={{ padding: "24px 28px 28px" }}>
                    {/* No Clubs Warning */}
                    {hasNoClubs && (
                        <NoClubsWarning onClose={onClose} />
                    )}

                    {/* Loading */}
                    {!hasNoClubs && isPending && (
                        <LoadingState />
                    )}

                    {/* Error */}
                    {!hasNoClubs && isError && !isPending && (
                        <ErrorState message={errorMessage} />
                    )}

                    {/* Result */}
                    {!hasNoClubs && !isPending && !isError && data && (
                        <InsightContent data={data} />
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 1; }
                }
            `}</style>
        </div>
    );
}

/* ─────────────────────────────────── Sub-components ─────────────────────────────────── */

function NoClubsWarning({ onClose }: { onClose: () => void }) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "16px",
                padding: "12px 0 4px",
            }}
        >
            <div
                style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "16px",
                    backgroundColor: "rgba(234, 179, 8, 0.12)",
                    border: "1px solid rgba(234, 179, 8, 0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <AlertTriangle size={28} color="#ca8a04" strokeWidth={1.5} />
            </div>
            <div>
                <h3
                    style={{
                        fontSize: "17px",
                        fontWeight: 700,
                        fontFamily: "var(--font-sans)",
                        color: "var(--color-ink)",
                        marginBottom: "8px",
                    }}
                >
                    Henüz hiçbir kulübe üye değilsin
                </h3>
                <p
                    style={{
                        fontSize: "14px",
                        color: "var(--color-ink-secondary)",
                        fontFamily: "var(--font-sans)",
                        lineHeight: 1.65,
                        maxWidth: "380px",
                    }}
                >
                    AI karakter analizinin yapılabilmesi için en az bir kulübe üye olman
                    gerekiyor. Kulüpler, seni tanımamıza yardımcı oluyor!
                </p>
            </div>
            <Link
                href="/clubs"
                onClick={onClose}
                className="btn btn-primary btn-md"
                style={{
                    marginTop: "4px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    textDecoration: "none",
                }}
            >
                Kulüpleri Keşfet
                <ArrowRight size={15} />
            </Link>
        </div>
    );
}

function LoadingState() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Animated header skeleton */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "20px",
                    borderRadius: "14px",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-bg-secondary)",
                }}
            >
                <Loader2
                    size={24}
                    style={{
                        color: "#6366f1",
                        animation: "spin 1s linear infinite",
                        flexShrink: 0,
                    }}
                />
                <div>
                    <p
                        style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            fontFamily: "var(--font-sans)",
                            color: "var(--color-ink)",
                            marginBottom: "4px",
                        }}
                    >
                        Kulüplerin analiz ediliyor...
                    </p>
                    <p
                        style={{
                            fontSize: "12px",
                            color: "var(--color-ink-tertiary)",
                            fontFamily: "var(--font-sans)",
                        }}
                    >
                        AI senin için bir karakter yorumu hazırlıyor
                    </p>
                </div>
            </div>
            {/* Skeleton blocks */}
            {[120, 80, 100].map((w, i) => (
                <div
                    key={i}
                    style={{
                        height: "16px",
                        width: `${w}%`.replace("120%", "100%"),
                        maxWidth: `${w}%`,
                        borderRadius: "8px",
                        background:
                            "linear-gradient(90deg, var(--color-border) 25%, var(--color-bg-secondary) 50%, var(--color-border) 75%)",
                        backgroundSize: "200% 100%",
                        animation: `shimmer 1.5s infinite ${i * 0.2}s`,
                    }}
                />
            ))}
        </div>
    );
}

function ErrorState({ message }: { message?: string }) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "12px",
                padding: "8px 0",
            }}
        >
            <div
                style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "14px",
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <AlertTriangle size={24} color="#ef4444" strokeWidth={1.5} />
            </div>
            <div>
                <h3
                    style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "var(--color-ink)",
                        fontFamily: "var(--font-sans)",
                        marginBottom: "6px",
                    }}
                >
                    Analiz yapılamadı
                </h3>
                <p
                    style={{
                        fontSize: "13px",
                        color: "var(--color-ink-secondary)",
                        fontFamily: "var(--font-sans)",
                    }}
                >
                    {message ?? "AI servisi şu an kullanılamıyor. Lütfen daha sonra tekrar dene."}
                </p>
            </div>
        </div>
    );
}

function InsightContent({ data }: { data: ProfileInsightResult }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Character description */}
            <section
                style={{
                    padding: "20px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.06) 100%)",
                    border: "1px solid rgba(99,102,241,0.15)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: "-20px",
                        right: "-20px",
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        background: "rgba(99,102,241,0.08)",
                        pointerEvents: "none",
                    }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <Sparkles size={15} color="#6366f1" />
                    <span
                        style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            fontFamily: "var(--font-sans)",
                            color: "#6366f1",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                        }}
                    >
                        Karakter Yorumu
                    </span>
                </div>
                <p
                    style={{
                        fontSize: "14px",
                        lineHeight: 1.75,
                        color: "var(--color-ink)",
                        fontFamily: "var(--font-sans)",
                    }}
                >
                    {data.character}
                </p>
            </section>

            {/* Interests */}
            {data.interests && data.interests.length > 0 && (
                <section>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                        <Tag size={14} color="var(--color-ink-secondary)" />
                        <span
                            style={{
                                fontSize: "13px",
                                fontWeight: 600,
                                fontFamily: "var(--font-sans)",
                                color: "var(--color-ink)",
                            }}
                        >
                            İlgi Alanların
                        </span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {data.interests.map((interest, i) => (
                            <span
                                key={i}
                                style={{
                                    padding: "5px 12px",
                                    borderRadius: "20px",
                                    fontSize: "13px",
                                    fontFamily: "var(--font-sans)",
                                    fontWeight: 500,
                                    backgroundColor: "var(--color-bg-secondary)",
                                    border: "1px solid var(--color-border)",
                                    color: "var(--color-ink-secondary)",
                                }}
                            >
                                {interest}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* Suggestions */}
            {data.suggestions && data.suggestions.length > 0 && (
                <section>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                        <Lightbulb size={14} color="var(--color-ink-secondary)" />
                        <span
                            style={{
                                fontSize: "13px",
                                fontWeight: 600,
                                fontFamily: "var(--font-sans)",
                                color: "var(--color-ink)",
                            }}
                        >
                            Sana Özel Öneriler
                        </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {data.suggestions.map((suggestion, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "10px",
                                    padding: "12px 14px",
                                    borderRadius: "10px",
                                    backgroundColor: "var(--color-bg-secondary)",
                                    border: "1px solid var(--color-border)",
                                }}
                            >
                                <span
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        borderRadius: "50%",
                                        backgroundColor: "rgba(99,102,241,0.12)",
                                        color: "#6366f1",
                                        fontSize: "11px",
                                        fontWeight: 700,
                                        fontFamily: "var(--font-sans)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        marginTop: "1px",
                                    }}
                                >
                                    {i + 1}
                                </span>
                                <p
                                    style={{
                                        fontSize: "13px",
                                        lineHeight: 1.6,
                                        color: "var(--color-ink-secondary)",
                                        fontFamily: "var(--font-sans)",
                                    }}
                                >
                                    {suggestion}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Recommended Clubs */}
            {data.recommendedClubs && data.recommendedClubs.length > 0 && (
                <section>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                        <Compass size={14} color="var(--color-ink-secondary)" />
                        <span
                            style={{
                                fontSize: "13px",
                                fontWeight: 600,
                                fontFamily: "var(--font-sans)",
                                color: "var(--color-ink)",
                            }}
                        >
                            Sana Uygun Kulüpler
                        </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {data.recommendedClubs.map((club) => (
                            <Link
                                key={club.id}
                                href={`/clubs/${club.id}`}
                                style={{ textDecoration: "none" }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "14px 16px",
                                        borderRadius: "12px",
                                        border: "1px solid var(--color-border)",
                                        backgroundColor: "var(--color-surface, var(--color-bg))",
                                        cursor: "pointer",
                                        transition: "border-color 0.15s, transform 0.15s",
                                    }}
                                    onMouseEnter={(e) => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.borderColor = "rgba(99,102,241,0.4)";
                                        el.style.transform = "translateY(-1px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.borderColor = "var(--color-border)";
                                        el.style.transform = "translateY(0)";
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <div
                                            style={{
                                                width: "36px",
                                                height: "36px",
                                                borderRadius: "10px",
                                                background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: "16px",
                                                    fontWeight: 700,
                                                    color: "#6366f1",
                                                    fontFamily: "var(--font-sans)",
                                                }}
                                            >
                                                {club.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p
                                                style={{
                                                    fontSize: "14px",
                                                    fontWeight: 600,
                                                    fontFamily: "var(--font-sans)",
                                                    color: "var(--color-ink)",
                                                    marginBottom: "2px",
                                                }}
                                            >
                                                {club.name}
                                            </p>
                                            {club.category && (
                                                <p
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "var(--color-ink-tertiary)",
                                                        fontFamily: "var(--font-sans)",
                                                    }}
                                                >
                                                    {club.category}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <ArrowRight size={15} color="var(--color-ink-tertiary)" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Footer note */}
            <p
                style={{
                    fontSize: "11px",
                    color: "var(--color-ink-tertiary)",
                    fontFamily: "var(--font-sans)",
                    textAlign: "center",
                    lineHeight: 1.5,
                    paddingTop: "4px",
                    borderTop: "1px solid var(--color-border)",
                }}
            >
                Bu analiz OpenRouter AI tarafından üretilmiştir. Kulüplerine katıldıkça
                daha doğru sonuçlar alırsın.
            </p>
        </div>
    );
}
