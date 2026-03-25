"use client";

import { useClubs } from "@/hooks/clubs/useClubs";
import { ClubCard } from "@/components/clubs/ClubCard";
import { Search, Loader2, Compass, Plus, Inbox } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter, useSearchParams } from "next/navigation";

function ClubsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialSearch = searchParams.get("search") || "";
    const initialCategory = searchParams.get("category") || "Tümü";

    const [search, setSearch] = useState(initialSearch);
    const [activeCategory, setActiveCategory] = useState(initialCategory);

    const debouncedSearch = useDebounce(search, 500);

    // URL Sync
    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedSearch) {
            params.set("search", debouncedSearch);
        }
        if (activeCategory !== "Tümü") {
            params.set("category", activeCategory);
        }
        
        const newUrl = params.toString() ? `/clubs?${params.toString()}` : "/clubs";
        router.push(newUrl, { scroll: false });
    }, [debouncedSearch, activeCategory, router]);

    const { data: allClubs, isLoading, error } = useClubs();
    
    // Perform local filtering (since backend might not support filters yet)
    const clubs = allClubs?.filter((club) => {
        const matchesCategory = activeCategory === "Tümü" || club.category === activeCategory;
        const matchesSearch = !debouncedSearch || 
            club.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            club.description.toLowerCase().includes(debouncedSearch.toLowerCase());
        
        return matchesCategory && matchesSearch;
    });
    
    const { sessionQuery } = useAuth();
    const user = sessionQuery.data;

    const categories = ["Tümü", "Teknoloji", "Spor", "Müzik", "Sanat", "Bilim", "İş & Kariyer", "Oyun", "Edebiyat", "Sinema", "Diğer"];

    return (
        <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-12 flex flex-col items-center text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    <Compass size={16} />
                    <span>Keşfet</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
                    Sana Uygun Bir Kulüp Bul
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                    İlgi alanlarına göre kulüplere katıl, yeni insanlar tanı ve birlikte etkinlikler düzenle.
                </p>

                {user && (
                    <div className="mt-8">
                        <Link
                            href="/clubs/create"
                            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900"
                        >
                            <Plus size={18} />
                            Kulüp Oluştur
                        </Link>
                    </div>
                )}

                {/* Search Bar */}
                <div className="mt-8 flex w-full max-w-lg items-center gap-2 rounded-2xl border border-zinc-200 bg-white p-2.5 shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900">
                    <Search className="ml-2 text-zinc-400" size={20} />
                    <input
                        type="text"
                        placeholder="Kulüp ara..."
                        className="w-full bg-transparent px-2 text-zinc-900 outline-none placeholder:text-zinc-500 dark:text-zinc-100"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Categories */}
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${activeCategory === cat
                                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                    <p className="text-zinc-500">Kulüpler yükleniyor...</p>
                </div>
            ) : error ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                    <p className="text-red-500 bg-red-50 dark:bg-red-900/10 px-6 py-4 rounded-2xl">Bir hata oluştu. Lütfen tekrar deneyin.</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.isArray(clubs) && clubs.map((club) => (
                        <ClubCard key={club.id} club={club} />
                    ))}
                    {(!clubs || (Array.isArray(clubs) && clubs.length === 0)) && (
                        <div className="col-span-full flex min-h-[300px] flex-col items-center justify-center text-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 p-8">
                            <div className="rounded-full bg-zinc-100 dark:bg-zinc-800 p-4 mb-4">
                                <Inbox size={32} className="text-zinc-400" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Sonuç Bulunamadı</h3>
                            <p className="mt-2 text-zinc-500 max-w-sm">Arama kriterlerinize uygun kulüp bulunamadı. Lütfen farklı kelimelerle veya farklı bir kategoride tekrar arayın.</p>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}

export default function ClubsPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="animate-spin text-zinc-400" size={40} />
            </div>
        }>
            <ClubsContent />
        </Suspense>
    );
}
