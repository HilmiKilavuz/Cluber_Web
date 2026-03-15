"use client";

import { useUIStore } from "@/store/ui.store";
import { useEvent } from "@/hooks/events/useEvents";
import { X, Users, UserCircle2 } from "lucide-react";
import { useEffect } from "react";

export function ParticipantsModal() {
    const { isParticipantsModalOpen, selectedEventId, closeParticipantsModal } = useUIStore();
    
    // Only fetch event data if modal is open and an event is selected
    const { data: event, isLoading } = useEvent(selectedEventId ?? "");

    // Close on esc key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeParticipantsModal();
        };
        if (isParticipantsModalOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isParticipantsModalOpen, closeParticipantsModal]);

    if (!isParticipantsModalOpen) return null;

    const participants = event?.participants || [];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm transition-all duration-300">
            <div 
                className="relative w-full max-w-md animate-in fade-in zoom-in-95 rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
                onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
            >
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                            <Users className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                                Katılımcılar
                            </h2>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                                {event ? event.title : "Etkinlik Yükleniyor..."}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={closeParticipantsModal}
                        className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600 dark:border-zinc-800 dark:border-t-blue-500"></div>
                            <p className="mt-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">Yükleniyor...</p>
                        </div>
                    ) : participants.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-10 dark:border-zinc-800">
                            <Users className="mb-3 h-10 w-10 text-zinc-300 dark:text-zinc-700" />
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                Henüz kimse katılmıyor.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {participants.map((participant) => (
                                <div 
                                    key={participant.id} 
                                    className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-3 transition-colors hover:bg-zinc-100 dark:border-zinc-800/50 dark:bg-zinc-900/30 dark:hover:bg-zinc-900"
                                >
                                    {participant.user?.avatarUrl ? (
                                        <img 
                                            src={participant.user.avatarUrl} 
                                            alt={participant.user.displayName}
                                            className="h-12 w-12 rounded-full object-cover shadow-sm"
                                        />
                                    ) : (
                                        <div className="h-12 w-12 flex items-center justify-center rounded-full bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                                            <UserCircle2 className="h-8 w-8" />
                                        </div>
                                    )}
                                    
                                    <div className="flex-1 overflow-hidden">
                                        <h3 className="truncate text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                            {participant.user?.displayName || "Gizli Kullanıcı"}
                                        </h3>
                                        {/* To do: Add more info if available, like role */}
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                                            Üye
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Backdrop Click Close */}
                <div 
                    className="fixed inset-0 -z-10 bg-transparent" 
                    onClick={closeParticipantsModal}
                />
            </div>
        </div>
    );
}
