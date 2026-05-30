"use client";

import Link from "next/link";
import type { Club } from "@/types/club";
import { Users, ArrowRight } from "lucide-react";

interface ClubCardProps {
    club: Club;
    isAuthenticated?: boolean;
    onAuthRequired?: () => void;
}

export const ClubCard = ({ club, isAuthenticated = true, onAuthRequired }: ClubCardProps) => {
    const handleProtectedClick = (e: React.MouseEvent) => {
        if (!isAuthenticated) {
            e.preventDefault();
            onAuthRequired?.();
        }
    };

    return (
        <div
            className="card-base group animate-fade-in"
            style={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* ── Banner ── */}
            <div
                style={{
                    position: "relative",
                    height: "120px",
                    backgroundColor: "var(--color-bg-secondary)",
                    flexShrink: 0,
                }}
            >
                {club.bannerUrl ? (
                    <img
                        src={club.bannerUrl}
                        alt={club.name}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            background:
                                "linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-border) 100%)",
                        }}
                    />
                )}

                {/* Avatar */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "-20px",
                        left: "20px",
                    }}
                >
                    <div
                        style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "var(--radius-md)",
                            border: "2px solid var(--color-bg)",
                            backgroundColor: "var(--color-bg-secondary)",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "var(--shadow-sm)",
                        }}
                    >
                        {club.avatarUrl ? (
                            <img
                                src={club.avatarUrl}
                                alt={club.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        ) : (
                            <span
                                style={{
                                    fontSize: "16px",
                                    fontWeight: 600,
                                    fontFamily: "var(--font-sans)",
                                    color: "var(--color-ink-secondary)",
                                }}
                            >
                                {club.name?.charAt(0)?.toUpperCase() || "C"}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div
                style={{
                    padding: "32px 20px 20px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Category badge */}
                <div style={{ marginBottom: "10px" }}>
                    <span
                        className="badge-base"
                        style={{ display: "inline-flex" }}
                    >
                        {club.category}
                    </span>
                </div>

                {/* Club name */}
                <h3
                    className="heading-sm"
                    style={{
                        color: "var(--color-ink)",
                        marginBottom: "8px",
                        transition: "color var(--transition-fast)",
                    }}
                >
                    <Link
                        href={`/clubs/${club.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                        onClick={handleProtectedClick}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.color = "var(--color-ink-secondary)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.color = "var(--color-ink)";
                        }}
                    >
                        {club.name}
                    </Link>
                </h3>

                {/* Description */}
                <p
                    className="body-sm"
                    style={{
                        color: "var(--color-ink-secondary)",
                        marginBottom: "auto",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {club.description}
                </p>

                {/* Footer */}
                <div
                    style={{
                        marginTop: "20px",
                        paddingTop: "16px",
                        borderTop: "1px solid var(--color-border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            color: "var(--color-ink-tertiary)",
                        }}
                    >
                        <Users size={13} strokeWidth={1.5} />
                        <span
                            style={{
                                fontSize: "12px",
                                fontWeight: 500,
                                fontFamily: "var(--font-sans)",
                            }}
                        >
                            {club._count?.memberships || club.memberships?.length || 0} üye
                        </span>
                    </div>

                    <Link
                        href={`/clubs/${club.id}`}
                        className="btn btn-sm"
                        style={{
                            backgroundColor: "var(--color-accent)",
                            color: "var(--color-accent-fg)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            textDecoration: "none",
                        }}
                        onClick={handleProtectedClick}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-accent-hover)";
                            (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-accent)";
                            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                        }}
                    >
                        İncele
                        <ArrowRight size={12} />
                    </Link>
                </div>
            </div>
        </div>
    );
};
