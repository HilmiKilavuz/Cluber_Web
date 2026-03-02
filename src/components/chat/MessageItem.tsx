"use client";

import { Message } from "@/types/chat";
import { AuthUser } from "@/types/auth";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface MessageItemProps {
    message: Message;
    currentUser: AuthUser | null;
}

export const MessageItem = ({ message, currentUser }: MessageItemProps) => {
    const isMe = message.senderId === currentUser?.id;
    const senderName = message.sender?.username || "Bilinmeyen";
    const avatarChar = senderName?.charAt(0) || "?";

    return (
        <div className={`flex w-full flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
            <div className={`flex max-w-[80%] items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                {/* Avatar */}
                <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    {message.sender?.avatarUrl ? (
                        <img src={message.sender.avatarUrl} alt={senderName} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-bold text-zinc-400">
                            {avatarChar}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    {/* Sender Name (only for others) */}
                    {!isMe && (
                        <span className="ml-1 text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                            {senderName}
                        </span>
                    )}

                    {/* Bubble */}
                    <div
                        className={`rounded-2xl px-4 py-2 text-sm shadow-sm ${isMe
                            ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950"
                            : "bg-white text-zinc-900 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-50 dark:border-zinc-800"
                            }`}
                    >
                        {message.content}
                    </div>
                </div>
            </div>

            {/* Time */}
            <span className="text-[10px] text-zinc-400">
                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true, locale: tr })}
            </span>
        </div>
    );
};
