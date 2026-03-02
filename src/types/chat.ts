import { AuthUser } from "./auth";

export interface Message {
    id: string;
    content: string;
    senderId: string;
    clubId: string;
    sender?: AuthUser;
    createdAt: string;
}

export interface ChatRoom {
    clubId: string;
    messages: Message[];
    members: AuthUser[];
}

export interface ServerToClientEvents {
    message: (message: Message) => void;
    exception: (error: { message: string; statusCode: number }) => void;
    joined: (data: { clubId: string; history: Message[] }) => void;
}

export interface ClientToServerEvents {
    join: (clubId: string) => void;
    leave: (clubId: string) => void;
    sendMessage: (data: { clubId: string; content: string }) => void;
}
