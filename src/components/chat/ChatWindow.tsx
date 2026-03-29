"use client";

import { useSocket } from "@/hooks/chat/useSocket";
import { useAuth } from "@/hooks/auth/useAuth";
import { MessageItem } from "./MessageItem";
import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Wifi, WifiOff } from "lucide-react";

interface ChatWindowProps {
    clubId: string;
}

export const ChatWindow = ({ clubId }: ChatWindowProps) => {
    const { messages, isConnected, isConnecting, sendMessage } = useSocket(clubId);
    const { sessionQuery } = useAuth();
    const [content, setContent] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const user = sessionQuery.data;

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        sendMessage(content);
        setContent("");
    };

    return (
        <div className="flex flex-col h-[600px] w-full rounded-3xl border border-zinc-200 bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-800 overflow-hidden shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 italic">KULÜP SOHBETİ</h2>
                    {isConnected ? (
                        <Wifi className="text-emerald-500" size={14} />
                    ) : isConnecting ? (
                        <div className="flex items-center gap-1">
                            <Loader2 className="animate-spin text-blue-500" size={14} />
                            <span className="text-[10px] text-blue-500 font-bold">BAĞLANIYOR...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1">
                            <WifiOff className="text-red-500" size={14} />
                            <span className="text-[10px] text-red-500 font-bold">BAĞLANTI YOK</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    {isConnected && <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>}
                    {isConnecting && !isConnected && <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>}
                    <span>{isConnected ? "Aktif" : isConnecting ? "Bağlanıyor..." : "Çevrimdışı"}</span>
                </div>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
            >
                {(!Array.isArray(messages) || messages.length === 0) ? (
                    <div className="flex h-full flex-col items-center justify-center opacity-40">
                        <MessageItem message={{
                            id: 'welc',
                            content: 'Sohbetin ilk mesajını sen gönder!',
                            userId: 'sys',
                            clubId: clubId,
                            createdAt: new Date().toISOString()
                        }} currentUser={null} />
                    </div>
                ) : (
                    messages.map((msg: any) => (
                        <MessageItem key={msg.id} message={msg} currentUser={user || null} />
                    ))
                )}

            </div>

            {/* Footer / Input */}
            <div className="bg-white p-4 border-t border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800">
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Bir mesaj gönder..."
                        className="flex-1 rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900"
                    />
                    <button
                        type="submit"
                        disabled={!content.trim() || !isConnected}
                        className="flex items-center justify-center rounded-2xl bg-zinc-900 p-2.5 text-white transition-opacity hover:opacity-90 disabled:opacity-40 dark:bg-zinc-50 dark:text-zinc-900"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};
