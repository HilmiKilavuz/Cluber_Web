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
    CalendarPlus,
    ArrowRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Header() {
    const { sessionQuery, logoutMutation } = useAuth();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 12);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
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
        <header
            className="sticky top-0 z-50 w-full transition-all duration-300"
            style={{
                backgroundColor: isScrolled
                    ? "color-mix(in srgb, var(--color-bg) 92%, transparent)"
                    : "color-mix(in srgb, var(--color-bg) 80%, transparent)",
                borderBottom: `1px solid ${isScrolled ? "var(--color-border)" : "transparent"}`,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
            }}
        >
            <div
                className="mx-auto flex h-16 max-w-[1280px] items-center justify-between"
                style={{ padding: "0 var(--container-padding)" }}
            >
                {/* ── Logo ── */}
                <Link
                    href="/"
                    className="group flex items-center gap-2 transition-transform duration-200 hover:scale-[1.03]"
                    aria-label="Cluber Ana Sayfa"
                >
                    <span
                        style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "20px",
                            fontWeight: 700,
                            letterSpacing: "-0.03em",
                            color: "var(--color-ink)",
                        }}
                    >
                        Cluber
                    </span>
                </Link>

                {/* ── Desktop Nav ── */}
                <nav className="hidden items-center gap-1 md:flex" aria-label="Ana navigasyon">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="rounded-lg px-4 py-2 text-sm transition-all duration-150"
                                style={{
                                    fontWeight: 500,
                                    fontFamily: "var(--font-sans)",
                                    color: isActive ? "var(--color-ink)" : "var(--color-ink-secondary)",
                                    backgroundColor: isActive ? "var(--color-bg-secondary)" : "transparent",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        (e.target as HTMLElement).style.backgroundColor = "var(--color-bg-secondary)";
                                        (e.target as HTMLElement).style.color = "var(--color-ink)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        (e.target as HTMLElement).style.backgroundColor = "transparent";
                                        (e.target as HTMLElement).style.color = "var(--color-ink-secondary)";
                                    }
                                }}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* ── Desktop Auth ── */}
                <div className="hidden items-center gap-3 md:flex">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            {/* User chip */}
                            <Link
                                href="/profile"
                                className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-4 transition-all duration-150 hover:opacity-80"
                                style={{
                                    border: "1px solid var(--color-border)",
                                    backgroundColor: "var(--color-surface)",
                                }}
                            >
                                <div
                                    className="flex h-7 w-7 overflow-hidden rounded-full items-center justify-center"
                                    style={{ backgroundColor: "var(--color-bg-secondary)" }}
                                >
                                    {user.avatarUrl ? (
                                        <img
                                            src={user.avatarUrl}
                                            alt={user.username}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span
                                            style={{
                                                fontSize: "11px",
                                                fontWeight: 600,
                                                color: "var(--color-ink-secondary)",
                                                fontFamily: "var(--font-sans)",
                                            }}
                                        >
                                            {user.username?.charAt(0).toUpperCase() || "U"}
                                        </span>
                                    )}
                                </div>
                                <span
                                    style={{
                                        fontSize: "13px",
                                        fontWeight: 500,
                                        color: "var(--color-ink)",
                                        fontFamily: "var(--font-sans)",
                                    }}
                                >
                                    {user.username}
                                </span>
                            </Link>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-150"
                                style={{
                                    border: "1px solid var(--color-border)",
                                    color: "var(--color-ink-tertiary)",
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLButtonElement).style.color = "var(--color-error)";
                                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-error-bg)";
                                    (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLButtonElement).style.color = "var(--color-ink-tertiary)";
                                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border)";
                                }}
                                title="Çıkış Yap"
                                aria-label="Çıkış Yap"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="rounded-lg px-4 py-2 text-sm transition-all duration-150"
                                style={{
                                    fontWeight: 500,
                                    fontFamily: "var(--font-sans)",
                                    color: "var(--color-ink-secondary)",
                                }}
                                onMouseEnter={(e) => {
                                    (e.target as HTMLElement).style.color = "var(--color-ink)";
                                    (e.target as HTMLElement).style.backgroundColor = "var(--color-bg-secondary)";
                                }}
                                onMouseLeave={(e) => {
                                    (e.target as HTMLElement).style.color = "var(--color-ink-secondary)";
                                    (e.target as HTMLElement).style.backgroundColor = "transparent";
                                }}
                            >
                                Giriş Yap
                            </Link>
                            <Link
                                href="/register"
                                className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm transition-all duration-150 active:scale-95"
                                style={{
                                    fontWeight: 500,
                                    fontFamily: "var(--font-sans)",
                                    backgroundColor: "var(--color-accent)",
                                    color: "var(--color-accent-fg)",
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-accent-hover)";
                                    (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-accent)";
                                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                                }}
                            >
                                Üye Ol
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    )}
                </div>

                {/* ── Mobile Menu Toggle ── */}
                <button
                    className="flex h-9 w-9 items-center justify-center rounded-lg md:hidden transition-all duration-150"
                    style={{
                        border: "1px solid var(--color-border)",
                        color: "var(--color-ink)",
                    }}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
                >
                    {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
            </div>

            {/* ── Mobile Menu ── */}
            {isMenuOpen && (
                <div
                    className="animate-fade-in border-t md:hidden"
                    style={{
                        borderColor: "var(--color-border)",
                        backgroundColor: "var(--color-bg)",
                    }}
                >
                    <nav className="flex flex-col gap-1 p-4" aria-label="Mobil navigasyon">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all duration-150"
                                    style={{
                                        fontWeight: 500,
                                        fontFamily: "var(--font-sans)",
                                        color: isActive ? "var(--color-ink)" : "var(--color-ink-secondary)",
                                        backgroundColor: isActive ? "var(--color-bg-secondary)" : "transparent",
                                    }}
                                >
                                    <Icon size={16} />
                                    {link.name}
                                </Link>
                            );
                        })}

                        <div
                            className="my-2"
                            style={{ height: "1px", backgroundColor: "var(--color-border)" }}
                        />

                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all duration-150 text-left"
                                style={{
                                    fontWeight: 500,
                                    fontFamily: "var(--font-sans)",
                                    color: "var(--color-error)",
                                }}
                            >
                                <LogOut size={16} />
                                Çıkış Yap
                            </button>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                <Link
                                    href="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-center rounded-lg py-3 text-sm transition-all duration-150"
                                    style={{
                                        fontWeight: 500,
                                        fontFamily: "var(--font-sans)",
                                        border: "1px solid var(--color-border)",
                                        color: "var(--color-ink)",
                                    }}
                                >
                                    Giriş Yap
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-center rounded-lg py-3 text-sm transition-all duration-150"
                                    style={{
                                        fontWeight: 500,
                                        fontFamily: "var(--font-sans)",
                                        backgroundColor: "var(--color-accent)",
                                        color: "var(--color-accent-fg)",
                                    }}
                                >
                                    Üye Ol
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
