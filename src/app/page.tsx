"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuth";
import { useState, useEffect } from "react";
import { ArrowRight, MessageSquare, Calendar, Users, Compass } from "lucide-react";

/* ──────────────────────────────────────────────────
   Marquee items
   ────────────────────────────────────────────────── */
const MARQUEE_ITEMS = [
    "KULÜP YÖNETİMİ",
    "GERÇEK ZAMANLI SOHBET",
    "ETKİNLİK TAKİBİ",
    "ÜYE YÖNETİMİ",
    "KEŞFET & KATIL",
    "KATEGORİ FİLTRELE",
    "ANLINDA MESAJLAŞ",
    "KOMÜNİTE KUR",
];

/* ──────────────────────────────────────────────────
   Feature items
   ────────────────────────────────────────────────── */
const FEATURES = [
    {
        icon: MessageSquare,
        title: "Gerçek Zamanlı Sohbet",
        description:
            "Kulüp üyeleriyle anlık mesajlaşın, fikirlerinizi anında paylaşın. Socket.IO ile kesintisiz iletişim.",
    },
    {
        icon: Calendar,
        title: "Etkinlik Yönetimi",
        description:
            "Dijital veya fiziksel etkinlikler oluşturun, katılımcıları takip edin ve RSVP alın.",
    },
    {
        icon: Users,
        title: "Üye Yönetimi",
        description:
            "Roller atayın, yöneticiler belirleyin ve topluluğunuzu kolayca yönetin.",
    },
    {
        icon: Compass,
        title: "Keşfet",
        description:
            "Kategorilere göre filtreleyin, arama yapın ve ilgi alanlarınıza uygun kulüpleri bulun.",
    },
];

/* ──────────────────────────────────────────────────
   Stats
   ────────────────────────────────────────────────── */
const STATS = [
    { value: "Anlık", label: "Gerçek zamanlı mesajlaşma" },
    { value: "JWT", label: "Güvenli kimlik doğrulama" },
    { value: "∞", label: "Sınırsız kulüp & etkinlik" },
];

export default function Home() {
    const { sessionQuery } = useAuth();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const user = sessionQuery.data;
    const isAuthenticated = isMounted && !!user;

    return (
        <main
            style={{
                minHeight: "100vh",
                backgroundColor: "var(--color-bg)",
                overflowX: "hidden",
            }}
        >
            {/* ════════════════════════════════════════
                HERO SECTION
                ════════════════════════════════════════ */}
            <section
                style={{
                    paddingTop: "clamp(80px, 12vw, 160px)",
                    paddingBottom: "clamp(80px, 10vw, 140px)",
                    paddingLeft: "var(--container-padding)",
                    paddingRight: "var(--container-padding)",
                    maxWidth: "1280px",
                    margin: "0 auto",
                }}
            >
                {/* Section marker */}
                <p
                    className="animate-fade-in label"
                    style={{
                        color: "var(--color-ink-tertiary)",
                        marginBottom: "32px",
                    }}
                >
                    (topluluk platformu)
                </p>

                <div className="flex flex-col lg:flex-row lg:items-end lg:gap-16">
                    {/* Heading */}
                    <div className="flex-1">
                        <h1
                            className="animate-fade-in-up display-xl"
                            style={{
                                color: "var(--color-ink)",
                                maxWidth: "720px",
                            }}
                        >
                            Topluluklar,
                            <br />
                            <em
                                style={{
                                    fontStyle: "italic",
                                    fontWeight: 400,
                                }}
                            >
                                Burada
                            </em>{" "}
                            Yaşıyor.
                        </h1>
                    </div>

                    {/* Right column: desc + CTAs */}
                    <div
                        className="animate-fade-in delay-200 mt-10 lg:mt-0"
                        style={{ maxWidth: "400px", flexShrink: 0 }}
                    >
                        <p
                            className="body-lg"
                            style={{
                                color: "var(--color-ink-secondary)",
                                marginBottom: "40px",
                            }}
                        >
                            Kulüpler oluştur, ortak ilgi alanlarına sahip insanlarla tanış ve etkinliklerini
                            tek bir yerden yönet.
                        </p>

                        <div className="flex flex-wrap items-center gap-4">
                            <Link
                                href={isAuthenticated ? "/clubs" : "/register"}
                                className="btn btn-primary btn-lg"
                                style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                            >
                                {isAuthenticated ? "Kulüpleri Keşfet" : "Ücretsiz Başla"}
                                <ArrowRight size={16} />
                            </Link>

                            {!isAuthenticated && (
                                <Link
                                    href="/login"
                                    className="btn btn-ghost btn-lg"
                                >
                                    Giriş Yap
                                </Link>
                            )}

                            {isAuthenticated && (
                                <Link
                                    href="/profile"
                                    className="link-underline body-sm"
                                    style={{
                                        color: "var(--color-ink-secondary)",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px",
                                    }}
                                >
                                    Profiline Git →
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════
                MARQUEE BANNER
                ════════════════════════════════════════ */}
            <div
                style={{
                    borderTop: "1px solid var(--color-border)",
                    borderBottom: "1px solid var(--color-border)",
                    padding: "14px 0",
                    overflow: "hidden",
                }}
            >
                <div className="marquee-wrapper">
                    <div className="marquee-track">
                        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                            <span
                                key={i}
                                className="label"
                                style={{
                                    color: "var(--color-ink-secondary)",
                                    padding: "0 28px",
                                    flexShrink: 0,
                                    letterSpacing: "0.1em",
                                }}
                            >
                                {item}
                                <span style={{ marginLeft: "28px", color: "var(--color-border-strong)" }}>
                                    •
                                </span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════
                FEATURES SECTION
                ════════════════════════════════════════ */}
            <section
                className="section-padding"
                style={{
                    paddingLeft: "var(--container-padding)",
                    paddingRight: "var(--container-padding)",
                    maxWidth: "1280px",
                    margin: "0 auto",
                }}
            >
                {/* Section header */}
                <div
                    className="flex flex-col md:flex-row md:items-end md:justify-between"
                    style={{ marginBottom: "80px" }}
                >
                    <div>
                        <p
                            className="label animate-fade-in"
                            style={{ color: "var(--color-ink-tertiary)", marginBottom: "16px" }}
                        >
                            (özellikler)
                        </p>
                        <h2
                            className="display-md animate-fade-in-up"
                            style={{ color: "var(--color-ink)", maxWidth: "520px" }}
                        >
                            Her şey bir arada,
                            <br />
                            <em style={{ fontStyle: "italic", fontWeight: 400 }}>sade</em> ve hızlı.
                        </h2>
                    </div>

                    <Link
                        href="/clubs"
                        className="animate-fade-in delay-300 link-underline body-sm mt-6 md:mt-0"
                        style={{
                            color: "var(--color-ink-secondary)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            flexShrink: 0,
                        }}
                    >
                        Tüm kulüpleri gör →
                    </Link>
                </div>

                {/* Feature grid */}
                <div
                    className="grid gap-px"
                    style={{
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius-lg)",
                        overflow: "hidden",
                        backgroundColor: "var(--color-border)",
                    }}
                >
                    {FEATURES.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={i}
                                className="animate-fade-in-up group"
                                style={{
                                    animationDelay: `${i * 80}ms`,
                                    padding: "40px 36px",
                                    backgroundColor: "var(--color-bg)",
                                    transition: "background-color var(--transition-base)",
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.backgroundColor =
                                        "var(--color-surface)";
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.backgroundColor =
                                        "var(--color-bg)";
                                }}
                            >
                                <div
                                    style={{
                                        width: "44px",
                                        height: "44px",
                                        borderRadius: "var(--radius-md)",
                                        border: "1px solid var(--color-border)",
                                        backgroundColor: "var(--color-surface)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: "24px",
                                        color: "var(--color-ink-secondary)",
                                        transition: "all var(--transition-base)",
                                    }}
                                    className="group-hover:border-current group-hover:text-[var(--color-ink)]"
                                >
                                    <Icon size={20} strokeWidth={1.5} />
                                </div>

                                <h3
                                    className="heading-sm"
                                    style={{
                                        color: "var(--color-ink)",
                                        marginBottom: "12px",
                                    }}
                                >
                                    {feature.title}
                                </h3>

                                <p
                                    className="body-sm"
                                    style={{ color: "var(--color-ink-secondary)" }}
                                >
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ════════════════════════════════════════
                STATS SECTION  (Motto style: left border stripe)
                ════════════════════════════════════════ */}
            <section
                style={{
                    paddingTop: "0",
                    paddingBottom: "var(--section-padding-y)",
                    paddingLeft: "var(--container-padding)",
                    paddingRight: "var(--container-padding)",
                    maxWidth: "1280px",
                    margin: "0 auto",
                }}
            >
                {/* Divider */}
                <div
                    style={{
                        borderTop: "1px solid var(--color-border)",
                        marginBottom: "80px",
                    }}
                />

                <p
                    className="label"
                    style={{ color: "var(--color-ink-tertiary)", marginBottom: "48px" }}
                >
                    (platform)
                </p>

                <div
                    className="grid gap-8"
                    style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
                >
                    {STATS.map((stat, i) => (
                        <div
                            key={i}
                            className="animate-fade-in-up"
                            style={{
                                animationDelay: `${i * 100}ms`,
                                paddingLeft: "24px",
                                borderLeft: "1px solid var(--color-border)",
                            }}
                        >
                            <div
                                className="display-md"
                                style={{
                                    color: "var(--color-ink)",
                                    marginBottom: "8px",
                                }}
                            >
                                {stat.value}
                            </div>
                            <p
                                className="body-sm"
                                style={{ color: "var(--color-ink-secondary)" }}
                            >
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ════════════════════════════════════════
                CTA SECTION
                ════════════════════════════════════════ */}
            <section
                style={{
                    paddingLeft: "var(--container-padding)",
                    paddingRight: "var(--container-padding)",
                    paddingBottom: "var(--section-padding-y)",
                    maxWidth: "1280px",
                    margin: "0 auto",
                }}
            >
                <div
                    className="animate-fade-in-up"
                    style={{
                        backgroundColor: "var(--color-ink)",
                        borderRadius: "var(--radius-xl)",
                        padding: "clamp(48px, 8vw, 96px) clamp(32px, 6vw, 80px)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "40px",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    {/* Subtle background texture */}
                    <div
                        aria-hidden
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage:
                                "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 60%)",
                            pointerEvents: "none",
                        }}
                    />

                    <p
                        className="label"
                        style={{ color: "rgba(255,255,255,0.4)", position: "relative" }}
                    >
                        {isAuthenticated ? "(topluluğunu büyüt)" : "(başlamaya hazır mısın?)"}
                    </p>

                    <h2
                        className="display-lg"
                        style={{
                            color: "#FFFFFF",
                            maxWidth: "640px",
                            position: "relative",
                        }}
                    >
                        {isAuthenticated
                            ? "Topluluğunu büyütmeye devam et."
                            : "Topluluğun seni bekliyor."}
                    </h2>

                    <p
                        className="body-lg"
                        style={{
                            color: "rgba(255,255,255,0.55)",
                            maxWidth: "480px",
                            position: "relative",
                        }}
                    >
                        {isAuthenticated
                            ? "Kulüplerini yönet, yeni etkinlikler oluştur ve topluluğunla bağlantıda kal."
                            : "Kendi topluluğunu kurmak sadece birkaç saniye sürer. Ücretsiz üye ol ve keşfetmeye başla."}
                    </p>

                    <div
                        className="flex flex-wrap gap-4"
                        style={{ position: "relative" }}
                    >
                        <Link
                            href={isAuthenticated ? "/profile" : "/register"}
                            className="btn btn-xl"
                            style={{
                                backgroundColor: "#FFFFFF",
                                color: "var(--color-ink)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.backgroundColor = "#F0EFE9";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.backgroundColor = "#FFFFFF";
                            }}
                        >
                            {isAuthenticated ? "Profiline Git" : "Hemen Başla"}
                            <ArrowRight size={16} />
                        </Link>

                        <Link
                            href="/clubs"
                            className="btn btn-xl"
                            style={{
                                backgroundColor: "transparent",
                                color: "rgba(255,255,255,0.7)",
                                border: "1px solid rgba(255,255,255,0.2)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.5)";
                                (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
                                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
                            }}
                        >
                            Kulüplere Göz At
                        </Link>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════
                FOOTER
                ════════════════════════════════════════ */}
            <footer
                style={{
                    borderTop: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-bg-secondary)",
                }}
            >
                <div
                    style={{
                        maxWidth: "1280px",
                        margin: "0 auto",
                        padding: "48px var(--container-padding)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "40px",
                    }}
                >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
                        {/* Brand col */}
                        <div>
                            <p
                                style={{
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "18px",
                                    fontWeight: 700,
                                    letterSpacing: "-0.03em",
                                    color: "var(--color-ink)",
                                    marginBottom: "12px",
                                }}
                            >
                                Cluber
                            </p>
                            <p
                                className="body-sm"
                                style={{ color: "var(--color-ink-tertiary)", maxWidth: "280px" }}
                            >
                                Toplulukların dijital merkezi. Kulüp oluştur, katıl, bağlantı kur.
                            </p>
                        </div>

                        {/* Links col */}
                        <div className="flex flex-wrap gap-12">
                            <div>
                                <p
                                    className="label"
                                    style={{ color: "var(--color-ink-tertiary)", marginBottom: "16px" }}
                                >
                                    Platform
                                </p>
                                <div className="flex flex-col gap-3">
                                    {[
                                        { name: "Kulüpler", href: "/clubs" },
                                        { name: "Etkinlik Oluştur", href: "/events/create" },
                                    ].map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="body-sm link-underline"
                                            style={{ color: "var(--color-ink-secondary)" }}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p
                                    className="label"
                                    style={{ color: "var(--color-ink-tertiary)", marginBottom: "16px" }}
                                >
                                    Hesap
                                </p>
                                <div className="flex flex-col gap-3">
                                    {[
                                        { name: "Giriş Yap", href: "/login" },
                                        { name: "Kayıt Ol", href: "/register" },
                                        { name: "Profil", href: "/profile" },
                                    ].map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="body-sm link-underline"
                                            style={{ color: "var(--color-ink-secondary)" }}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div
                        style={{
                            borderTop: "1px solid var(--color-border)",
                            paddingTop: "24px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "8px",
                        }}
                    >
                        <p
                            className="caption"
                            style={{ color: "var(--color-ink-tertiary)" }}
                        >
                            © {new Date().getFullYear()} Cluber. Tüm hakları saklıdır.
                        </p>
                        <p
                            className="caption"
                            style={{ color: "var(--color-ink-tertiary)" }}
                        >
                            Topluluklar, burada yaşıyor.
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
