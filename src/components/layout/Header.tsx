"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import {
    Compass,
    User,
    LogOut,
    Home as HomeIcon,
    Menu,
    X,
    Sparkles,
    CalendarPlus
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Header() {
    const { sessionQuery, logoutMutation } = useAuth();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const user = sessionQuery.data;
    const isAuthenticated = isMounted && !!user;

    const navLinks = [
        { name: "Ana Sayfa", href: "/", icon: HomeIcon },
        { name: "Kulüpler", href: "/clubs", icon: Compass },
    ];

    if (isAuthenticated) {
        navLinks.push({ name: "Etkinlik Oluştur", href: "/events/create", icon: CalendarPlus });
        navLinks.push({ name: "Profilim", href: "/profile", icon: User });
    }

    const handleLogout = async () => {
        try {
            await logoutMutation.mutateAsync();
            window.location.href = "/";
        } catch {
            toast.error("Çıkış yapılırken bir sorun oluştu. Lütfen tekrar deneyin.");
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                        <Sparkles size={20} />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">
                        CLUB<span className="text-blue-600">HUB</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex md:items-center md:gap-1">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${isActive
                                    ? "bg-zinc-100 text-blue-600 dark:bg-zinc-900 dark:text-blue-400"
                                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                                    }`}
                            >
                                <Icon size={18} />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Desktop Auth Actions */}
                <div className="hidden md:flex md:items-center md:gap-4">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 rounded-full border border-zinc-200 bg-zinc-50 py-1 pl-1 pr-4 dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="h-8 w-8 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                                    {user.avatarUrl ? (
                                        <img src={user.avatarUrl} alt={user.username} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs font-bold text-zinc-500">
                                            {user.username?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                    )}
                                </div>
                                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                    {user.username}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-red-900/10 transition-colors"
                                title="Çıkış Yap"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="rounded-xl px-4 py-2 text-sm font-bold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                            >
                                Giriş Yap
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-xl bg-zinc-900 px-5 py-2 text-sm font-bold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all"
                            >
                                Kayıt Ol
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="flex h-10 w-10 items-center justify-center rounded-xl md:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="border-t border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
                    <nav className="flex flex-col gap-2">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 rounded-xl p-3 text-base font-bold text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900"
                                >
                                    <Icon size={20} />
                                    {link.name}
                                </Link>
                            );
                        })}
                        <hr className="my-2 border-zinc-100 dark:border-zinc-800" />
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 rounded-xl p-3 text-base font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                            >
                                <LogOut size={20} />
                                Çıkış Yap
                            </button>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 p-2">
                                <Link
                                    href="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-center rounded-xl border border-zinc-200 py-3 text-sm font-bold dark:border-zinc-800"
                                >
                                    Giriş Yap
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-center rounded-xl bg-zinc-900 py-3 text-sm font-bold text-white dark:bg-zinc-100 dark:text-zinc-900"
                                >
                                    Kayıt Ol
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
