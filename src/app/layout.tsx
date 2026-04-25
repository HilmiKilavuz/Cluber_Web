import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/layout/Header";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cluber — Toplulukların Dijital Merkezi",
  description: "Kulüpler oluştur, topluluklara katıl, etkinlikleri yönet ve gerçek zamanlı sohbet et. Cluber ile topluluğun bir tık uzağında.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={dmSans.variable}>
      <body
        style={{
          fontFamily: "var(--font-dm-sans, 'DM Sans', system-ui, sans-serif)",
        }}
      >
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
