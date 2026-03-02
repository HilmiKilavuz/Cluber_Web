import { io, Socket } from "socket.io-client";
import { env } from "@/lib/constants/env";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/chat";

const SOCKET_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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
