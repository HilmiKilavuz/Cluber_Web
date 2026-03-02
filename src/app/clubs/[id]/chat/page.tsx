"use client";

import { ChatWindow } from "@/components/chat/ChatWindow";
import { useClub, useJoinedClubs } from "@/hooks/clubs/useClubs";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, MessageSquare, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ClubChatPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { data: club, isLoading: clubLoading } = useClub(id);
    const { data: joinedClubs, isLoading: joinedLoading } = useJoinedClubs();

    const isMember = joinedClubs?.some((c) => c.id === id);
    const isLoading = clubLoading || joinedLoading;

    useEffect(() => {
        if (!isLoading && !isMember && club) {
            toast.error("Bu sohbet odasına erişmek için kulübe üye olmalısınız.");
            router.push(`/clubs/${id}`);
        }
    }, [isLoading, isMember, club, id, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    if (!club) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Kulüp bulunamadı</h2>
                <Link href="/clubs" className="mt-6 font-semibold text-blue-600 hover:underline">
                    Tüm kulüplere dön
                </Link>
            </div>
        );
    }

    return (
        <main className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header / Breadcrumb */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 italic flex items-center gap-2">
                            <MessageSquare size={24} className="text-blue-600" />
                            {club.name.toUpperCase()}
                        </h1>
                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mt-0.5">Kulüp Sohbeti</p>
                    </div>
                </div>

                <Link
                    href={`/clubs/${club.id}`}
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-bold text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 sm:w-auto"
                >
                    Kulübe Dön
                </Link>
            </div>

            {/* Chat Interface */}
            <div className="mx-auto w-full max-w-4xl">
                <ChatWindow clubId={id} />
            </div>

            {/* Info / Tips */}
            <div className="mt-8 rounded-3xl bg-blue-50/50 p-6 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                <h3 className="text-sm font-bold text-blue-700 dark:text-blue-400 uppercase tracking-tighter">İpucu</h3>
                <p className="mt-1 text-sm text-blue-600/80 dark:text-blue-300/60 leading-relaxed">
                    Sohbet üyeleriyle saygılı bir şekilde iletişim kurun. Kulüp kuralları tüm mesajlaşmalar için geçerlidir.
                </p>
            </div>
        </main>
    );
}
