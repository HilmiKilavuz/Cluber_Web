"use client";

import { ChatWindow } from "@/components/chat/ChatWindow";
import { useClub, useJoinedClubs } from "@/hooks/clubs/useClubs";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, MessageSquare, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ClubChatPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { data: club, isLoading: clubLoading } = useClub(id);
    const { data: joinedClubs, isLoading: joinedLoading } = useJoinedClubs();

    const isMember = joinedClubs?.some((c) => c.id === id);
    const isLoading = clubLoading || joinedLoading;

    useEffect(() => {
        if (!isLoading && !isMember && club) {
            toast.error("Bu sohbet odasına erişmek için kulübe üye olmalısınız.");
            router.push(`/clubs/${id}`);
        }
    }, [isLoading, isMember, club, id, router]);

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

    if (!club) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    backgroundColor: "var(--color-bg)",
                    gap: "16px",
                    textAlign: "center",
                    padding: "40px",
                }}
            >
                <h2 className="heading-lg" style={{ color: "var(--color-ink)" }}>Kulüp bulunamadı</h2>
                <Link
                    href="/clubs"
                    className="link-underline body-sm"
                    style={{ color: "var(--color-ink-secondary)" }}
                >
                    Tüm kulüplere dön →
                </Link>
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
                    maxWidth: "1024px",
                    margin: "0 auto",
                    padding: "clamp(32px, 5vw, 56px) var(--container-padding) var(--section-padding-y)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                }}
            >
                {/* ── Header ── */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <button
                            onClick={() => router.back()}
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
                                cursor: "pointer",
                                flexShrink: 0,
                                transition: "all var(--transition-fast)",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-secondary)"; (e.currentTarget as HTMLElement).style.color = "var(--color-ink)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-surface)"; (e.currentTarget as HTMLElement).style.color = "var(--color-ink-secondary)"; }}
                            aria-label="Geri"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <MessageSquare
                                    size={16}
                                    strokeWidth={1.5}
                                    style={{ color: "var(--color-ink-secondary)" }}
                                />
                                <h1
                                    className="heading-sm"
                                    style={{ color: "var(--color-ink)" }}
                                >
                                    {club.name}
                                </h1>
                            </div>
                            <p className="caption" style={{ color: "var(--color-ink-tertiary)", marginTop: "2px" }}>
                                Kulüp Sohbeti
                            </p>
                        </div>
                    </div>

                    <Link
                        href={`/clubs/${club.id}`}
                        className="btn btn-ghost btn-sm"
                        style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}
                    >
                        Kulübe Dön
                    </Link>
                </div>

                {/* ── Divider ── */}
                <div style={{ height: "1px", backgroundColor: "var(--color-border)" }} />

                {/* ── Chat Window ── */}
                <div style={{ width: "100%" }}>
                    <ChatWindow clubId={id} />
                </div>

                {/* ── Tip ── */}
                <div
                    style={{
                        padding: "16px 20px",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "var(--color-bg-secondary)",
                        border: "1px solid var(--color-border)",
                    }}
                >
                    <p className="caption" style={{ color: "var(--color-ink-tertiary)" }}>
                        <strong style={{ color: "var(--color-ink-secondary)" }}>İpucu:</strong>{" "}
                        Sohbet üyeleriyle saygılı bir şekilde iletişim kurun. Kulüp kuralları tüm mesajlaşmalar için geçerlidir.
                    </p>
                </div>
            </div>
        </main>
    );
}
