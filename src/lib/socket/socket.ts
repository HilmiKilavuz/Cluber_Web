import { io, Socket } from "socket.io-client";
import { env } from "@/lib/constants/env";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/chat";

// Next.js ortam değişkenlerindeki API adresi '/api/v1' gibi bir suffix içerebiliyor.
// Sockets.io root üzerinden (origin) bağlanmalı.
const fullURL = env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const urlObj = new URL(fullURL.startsWith('http') ? fullURL : `http://${fullURL}`);
const SOCKET_URL = urlObj.origin;
export const getSocket = (token: string): Socket<ServerToClientEvents, ClientToServerEvents> => {
    return io(SOCKET_URL, {
        auth: {
            token: `Bearer ${token}`,
        },
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    });
};
