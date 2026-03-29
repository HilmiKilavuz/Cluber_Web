"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Socket } from "socket.io-client";
import { getSocket } from "@/lib/socket/socket";
import { Message, ServerToClientEvents, ClientToServerEvents } from "@/types/chat";
import { toast } from "sonner";
import { chatService } from "@/services/chat/chat.service";

export const useSocket = (clubId: string) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);
    const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

    const connect = useCallback(() => {
        const token = window.sessionStorage.getItem("access_token") || window.localStorage.getItem("access_token");
        if (!token) {
            setIsConnecting(false);
            return;
        }

        if (socketRef.current?.connected) return;

        setIsConnecting(true);
        const socket = getSocket(token);
        socketRef.current = socket;

        chatService.getMessages(clubId)
            .then(data => {
                if (Array.isArray(data)) {
                    setMessages([...data].reverse());
                }
            })
            .catch(err => {
                console.error("Failed to load history", err);
            });

        socket.on("connect_error", (err) => {
            console.error("Socket connect_error:", err.message);
            setIsConnecting(false);
            setIsConnected(false);
        });

        socket.on("connect", () => {
            console.log("Socket connected!");
            setIsConnected(true);
            setIsConnecting(false);
            socket.emit("chat:join-room", { clubId });
        });

        socket.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
            setIsConnected(false);
        });

        socket.on("chat:new-message", (message: Message) => {
            setMessages((prev) => {
                if (prev.some(m => m.id === message.id)) return prev;
                return [...prev, message];
            });
        });

        socket.on("exception", (error: { message: string }) => {
            toast.error(error.message);
        });

        return () => {
            socket.off("connect_error");
            socket.disconnect();
        };
    }, [clubId]);

    useEffect(() => {
        const cleanup = connect();
        return () => {
            cleanup?.();
        };
    }, [connect]);

    const sendMessage = useCallback((content: string) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit("chat:send-message", { clubId, content }, (res) => {
                if (res?.id) {
                    toast.success("Mesaj gönderildi!");
                }
            });
        } else {
            toast.error("Bağlantı yok, mesaj gönderilemedi.");
        }
    }, [clubId]);

    return {
        messages,
        isConnected,
        isConnecting,
        sendMessage,
        setMessages,
    };
};
