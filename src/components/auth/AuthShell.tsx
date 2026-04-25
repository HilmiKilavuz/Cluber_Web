import type { PropsWithChildren } from "react";
import Link from "next/link";

interface AuthShellProps extends PropsWithChildren {
    title: string;
    description: string;
    /** Sağ panel için isteğe bağlı alıntı metni */
    quote?: string;
}

export function AuthShell({ title, description, children, quote }: AuthShellProps) {
    return (
        <main
            style={{
                minHeight: "calc(100vh - 64px)",
                display: "flex",
                backgroundColor: "var(--color-bg)",
            }}
        >
            {/* ── Sol panel: Branding ── */}
            <div
                className="hidden lg:flex"
                style={{
                    width: "42%",
                    flexShrink: 0,
                    backgroundColor: "var(--color-ink)",
                    padding: "64px 56px",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                {/* Top: Logo */}
                <Link
                    href="/"
                    style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "20px",
                        fontWeight: 700,
                        letterSpacing: "-0.03em",
                        color: "var(--color-accent-fg)",
                        textDecoration: "none",
                    }}
                >
                    Cluber
                </Link>

                {/* Middle: Big quote */}
                <div>
                    <p
                        style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "clamp(28px, 3vw, 48px)",
                            fontWeight: 500,
                            lineHeight: 1.1,
                            letterSpacing: "-0.025em",
                            color: "#FFFFFF",
                            marginBottom: "24px",
                        }}
                    >
                        {quote ||
                            <>
                                Topluluğun
                                <br />
                                seni bekliyor.
                            </>}
                    </p>
                    <p
                        style={{
                            fontSize: "14px",
                            lineHeight: 1.6,
                            color: "rgba(255,255,255,0.45)",
                            fontFamily: "var(--font-sans)",
                            maxWidth: "320px",
                        }}
                    >
                        Kulüpler oluştur, etkinlikler düzenle ve gerçek zamanlı sohbet et.
                    </p>
                </div>

                {/* Bottom: Footer note */}
                <p
                    style={{
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.25)",
                        fontFamily: "var(--font-sans)",
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                    }}
                >
                    © {new Date().getFullYear()} Cluber
                </p>
            </div>

            {/* ── Sağ panel: Form ── */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "48px var(--container-padding)",
                }}
            >
                <div
                    className="animate-fade-in-up"
                    style={{ width: "100%", maxWidth: "420px" }}
                >
                    {/* Mobile logo */}
                    <Link
                        href="/"
                        className="lg:hidden"
                        style={{
                            display: "block",
                            fontFamily: "var(--font-sans)",
                            fontSize: "18px",
                            fontWeight: 700,
                            letterSpacing: "-0.03em",
                            color: "var(--color-ink)",
                            marginBottom: "32px",
                            textDecoration: "none",
                        }}
                    >
                        Cluber
                    </Link>

                    {/* Title */}
                    <h1
                        className="heading-lg"
                        style={{
                            color: "var(--color-ink)",
                            marginBottom: "8px",
                        }}
                    >
                        {title}
                    </h1>
                    <p
                        className="body-sm"
                        style={{
                            color: "var(--color-ink-secondary)",
                            marginBottom: "40px",
                        }}
                    >
                        {description}
                    </p>

                    {/* Form content */}
                    {children}
                </div>
            </div>
        </main>
    );
}
