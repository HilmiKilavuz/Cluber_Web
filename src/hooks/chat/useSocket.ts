"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Socket } from "socket.io-client";
import { getSocket } from "@/lib/socket/socket";
import { Message, ServerToClientEvents, ClientToServerEvents } from "@/types/chat";
import { toast } from "sonner";

export const useSocket = (clubId: string) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

    const connect = useCallback(() => {
        const token = window.localStorage.getItem("access_token");
        if (!token) return;

        if (socketRef.current?.connected) return;

        const socket = getSocket(token);
        socketRef.current = socket;

        socket.on("connect", () => {
            setIsConnected(true);
            socket.emit("join", clubId);
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
        });

        socket.on("message", (message: Message) => {
            setMessages((prev) => [...prev, message]);
        });

        socket.on("joined", (data: { clubId: string; history: Message[] }) => {
            setMessages(Array.isArray(data?.history) ? data.history : []);
        });


        socket.on("exception", (error: { message: string }) => {
            toast.error(error.message);
        });

        return () => {
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
            socketRef.current.emit("sendMessage", { clubId, content });
        } else {
            toast.error("Bağlantı yok, mesaj gönderilemedi.");
        }
    }, [clubId]);

    return {
        messages,
        isConnected,
        sendMessage,
        setMessages,
    };
};
