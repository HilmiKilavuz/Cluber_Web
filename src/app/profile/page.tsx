"use client";

import { useCallback, useState } from "react";
import { useJoinedClubs } from "@/hooks/clubs/useClubs";
import { useProfileInsight } from "@/hooks/ai/useProfileInsight";
import { ProfileHeader, ProfileStats } from "@/components/profile/ProfileComponents";
import { ClubCard } from "@/components/clubs/ClubCard";
import { AIInsightCard } from "@/components/profile/AIInsightCard";
import { Loader2, Compass, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    const { data: joinedClubs, isLoading } = useJoinedClubs();

    // ── AI Insight state — lives here so mutations don't re-render the header ──
    const [showAIInsight, setShowAIInsight] = useState(false);
    const profileInsightMutation = useProfileInsight();

    const handleOpenAI = useCallback(() => {
        setShowAIInsight(true);
        // Only fire if user has clubs AND we haven't fetched yet (avoids duplicate calls)
        if (joinedClubs && joinedClubs.length > 0 && !profileInsightMutation.data && !profileInsightMutation.isPending) {
            profileInsightMutation.mutate();
        }
    }, [joinedClubs, profileInsightMutation]);

    const handleCloseAI = useCallback(() => {
        setShowAIInsight(false);
    }, []);

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
                    display: "flex",
                    flexDirection: "column",
                    gap: "32px",
                }}
            >
                {/* Section label */}
                <div>
                    <p className="label" style={{ color: "var(--color-ink-tertiary)", marginBottom: "8px" }}>
                        (profil)
                    </p>
                </div>

                {/* Profile Header — receives only a stable callback, no AI state */}
                <ProfileHeader onOpenAI={handleOpenAI} />

                {/* Stats */}
                <ProfileStats />

                {/* Divider */}
                <div style={{ height: "1px", backgroundColor: "var(--color-border)" }} />

                {/* Clubs Section */}
                <section>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "24px",
                        }}
                    >
                        <h2 className="heading-lg" style={{ color: "var(--color-ink)" }}>
                            Katıldığım Kulüpler
                        </h2>
                        <span
                            className="label"
                            style={{ color: "var(--color-ink-tertiary)" }}
                        >
                            {joinedClubs?.length || 0} kulüp
                        </span>
                    </div>

                    {isLoading ? (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "200px",
                                border: "1px solid var(--color-border)",
                                borderRadius: "var(--radius-lg)",
                            }}
                        >
                            <Loader2
                                size={24}
                                strokeWidth={1.5}
                                style={{ color: "var(--color-ink-tertiary)", animation: "spin 1s linear infinite" }}
                            />
                        </div>
                    ) : !joinedClubs || joinedClubs.length === 0 ? (
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
                                <Compass size={24} strokeWidth={1.5} style={{ color: "var(--color-ink-tertiary)" }} />
                            </div>
                            <div>
                                <h3 className="heading-sm" style={{ color: "var(--color-ink)", marginBottom: "6px" }}>
                                    Henüz bir kulübe katılmadınız
                                </h3>
                                <p className="body-sm" style={{ color: "var(--color-ink-secondary)" }}>
                                    Yeni maceralar için keşfetmeye başlayın!
                                </p>
                            </div>
                            <Link
                                href="/clubs"
                                className="btn btn-primary btn-md"
                                style={{
                                    marginTop: "8px",
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
                    ) : (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                gap: "16px",
                            }}
                        >
                            {joinedClubs.map((club) => (
                                <ClubCard key={club.id} club={club} />
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* AI Insight Modal — rendered at page level, isolated from header re-renders */}
            <AIInsightCard
                isOpen={showAIInsight}
                onClose={handleCloseAI}
                isPending={profileInsightMutation.isPending}
                isError={profileInsightMutation.isError}
                errorMessage={profileInsightMutation.error?.message}
                data={profileInsightMutation.data}
                hasNoClubs={!joinedClubs || joinedClubs.length === 0}
            />
        </main>
    );
}
