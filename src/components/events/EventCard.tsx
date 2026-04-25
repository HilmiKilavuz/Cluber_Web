"use client";

import { Calendar, MapPin, Users, CheckCircle2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import type { Event } from "@/types/event";
import { useRSVP, useCancelRSVP } from "@/hooks/events/useEvents";
import { useAuth } from "@/hooks/auth/useAuth";
import { useUIStore } from "@/store/ui.store";
import { toast } from "sonner";

interface EventCardProps {
    event: Event;
}

export function EventCard({ event }: EventCardProps) {
    const { sessionQuery } = useAuth();
    const user = sessionQuery.data;

    const rsvpMutation = useRSVP(event?.id || "");
    const cancelRSVPMutation = useCancelRSVP(event?.id || "");
    const { openParticipantsModal } = useUIStore();

    if (!event) return null;

    const isParticipant = event.participants?.some((p) => p.userId === user?.id);
    const participantCount = event._count?.participants || event.participants?.length || 0;
    const isFull = event.maxParticipants ? participantCount >= event.maxParticipants : false;
    const isLoading = rsvpMutation.isPending || cancelRSVPMutation.isPending;

    const handleRSVP = async () => {
        if (!user) {
            toast.error("Katılmak için giriş yapmalısınız.");
            return;
        }
        if (isParticipant) {
            await cancelRSVPMutation.mutateAsync();
        } else {
            if (isFull) {
                toast.error("Bu etkinlik maalesef dolu.");
                return;
            }
            await rsvpMutation.mutateAsync("GOING");
        }
    };

    return (
        <div
            className="card-base group animate-fade-in"
            style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
        >
            {/* Cover image */}
            {event.imageUrl && (
                <div
                    style={{
                        height: "140px",
                        overflow: "hidden",
                        flexShrink: 0,
                    }}
                >
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 500ms ease",
                        }}
                        className="group-hover:scale-105"
                    />
                </div>
            )}

            <div
                style={{
                    padding: "20px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                }}
            >
                {/* Category badge */}
                <span className="badge-base" style={{ display: "inline-flex", alignSelf: "flex-start" }}>
                    {event.category || "Genel"}
                </span>

                {/* Title */}
                <h3
                    className="heading-sm"
                    style={{
                        color: "var(--color-ink)",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {event.title}
                </h3>

                {/* Meta */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                    }}
                >
                    {[
                        {
                            Icon: Calendar,
                            text: format(new Date(event.date), "d MMMM yyyy, HH:mm", { locale: tr }),
                            onClick: undefined,
                        },
                        {
                            Icon: MapPin,
                            text: event.location,
                            onClick: undefined,
                            truncate: true,
                        },
                        {
                            Icon: Users,
                            text: `${participantCount} Katılımcı${event.maxParticipants ? ` / ${event.maxParticipants}` : ""}`,
                            onClick: () => openParticipantsModal(event.id),
                        },
                    ].map(({ Icon, text, onClick, truncate }, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                color: "var(--color-ink-tertiary)",
                                cursor: onClick ? "pointer" : "default",
                            }}
                            onClick={onClick}
                            onMouseEnter={onClick ? (e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-ink)"; } : undefined}
                            onMouseLeave={onClick ? (e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-ink-tertiary)"; } : undefined}
                        >
                            <Icon size={13} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                            <span
                                className="caption"
                                style={{
                                    overflow: truncate ? "hidden" : undefined,
                                    textOverflow: truncate ? "ellipsis" : undefined,
                                    whiteSpace: truncate ? "nowrap" : undefined,
                                }}
                            >
                                {text}
                            </span>
                        </div>
                    ))}
                </div>

                {/* RSVP button */}
                <button
                    onClick={handleRSVP}
                    disabled={isLoading}
                    style={{
                        marginTop: "auto",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "10px 16px",
                        borderRadius: "var(--radius-md)",
                        fontSize: "13px",
                        fontWeight: 500,
                        fontFamily: "var(--font-sans)",
                        cursor: isLoading || isFull ? "not-allowed" : "pointer",
                        transition: "all var(--transition-fast)",
                        opacity: isLoading ? 0.7 : 1,
                        ...(isParticipant
                            ? {
                                backgroundColor: "var(--color-success-bg)",
                                color: "var(--color-success)",
                                border: "1px solid color-mix(in srgb, var(--color-success) 25%, transparent)",
                            }
                            : isFull
                                ? {
                                    backgroundColor: "var(--color-bg-secondary)",
                                    color: "var(--color-ink-tertiary)",
                                    border: "1px solid var(--color-border)",
                                }
                                : {
                                    backgroundColor: "var(--color-accent)",
                                    color: "var(--color-accent-fg)",
                                    border: "1px solid transparent",
                                }),
                    }}
                    onMouseEnter={(e) => {
                        if (!isLoading && !isFull && isParticipant) {
                            (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-error-bg)";
                            (e.currentTarget as HTMLElement).style.color = "var(--color-error)";
                            (e.currentTarget as HTMLElement).style.borderColor = "color-mix(in srgb, var(--color-error) 25%, transparent)";
                        } else if (!isLoading && !isFull) {
                            (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-accent-hover)";
                            (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (isParticipant) {
                            (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-success-bg)";
                            (e.currentTarget as HTMLElement).style.color = "var(--color-success)";
                            (e.currentTarget as HTMLElement).style.borderColor = "color-mix(in srgb, var(--color-success) 25%, transparent)";
                        } else if (!isFull) {
                            (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-accent)";
                            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                        }
                    }}
                >
                    {isLoading ? (
                        <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                    ) : isParticipant ? (
                        <>
                            <CheckCircle2 size={14} />
                            Katılıyorsun
                        </>
                    ) : isFull ? (
                        "Kontenjan Dolu"
                    ) : (
                        "Katıl"
                    )}
                </button>
            </div>
        </div>
    );
}
