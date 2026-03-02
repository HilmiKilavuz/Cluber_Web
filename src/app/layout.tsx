import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "ClubHub",
  description: "Kulüpler oluştur, topluluklara katıl, etkinlikleri ve sohbeti yönet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased font-sans">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
