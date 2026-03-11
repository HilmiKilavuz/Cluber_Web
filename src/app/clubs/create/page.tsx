"use client";

import { ClubForm } from "@/components/clubs/ClubForm";
import { ChevronLeft, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import { useEffect } from "react";

export default function CreateClubPage() {
    const router = useRouter();
    const { sessionQuery } = useAuth();
    const user = sessionQuery.data;
    const isLoadingAuth = sessionQuery.isLoading;

    useEffect(() => {
        if (!isLoadingAuth && !user) {
            router.push("/login");
        }
    }, [user, isLoadingAuth, router]);

    if (isLoadingAuth || !user) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
        );
    }

    return (
        <main className="container mx-auto max-w-3xl px-4 py-12 sm:px-6">
            {/* Navigation */}
            <div className="mb-10">
                <button
                    onClick={() => router.back()}
                    className="group flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                    <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
                    Geri Dön
                </button>
            </div>

            {/* Header */}
            <div className="mb-12">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    <Sparkles size={16} />
                    <span>Yeni Bir Başlangıç</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
                    Topluluğunu Kur
                </h1>
                <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                    Kendi kulübünü oluşturarak insanları bir araya getir, etkinlikler düzenle ve topluluğunu büyüt.
                </p>
            </div>

            {/* Form Container */}
            <div className="relative">
                {/* Decorative background element */}
                <div className="pointer-events-none absolute -left-12 -top-12 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
                <div className="pointer-events-none absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl" />

                <ClubForm />
            </div>

            {/* Footer Info */}
            <div className="mt-12 rounded-3xl bg-zinc-50 p-6 text-center dark:bg-zinc-900/50">
                <p className="text-sm text-zinc-500">
                    Kulüp oluşturarak topluluk kurallarımızı kabul etmiş sayılırsınız.
                    Kulübünüz onaylandıktan sonra keşfet sayfasında görülecektir.
                </p>
            </div>
        </main>
    );
}
