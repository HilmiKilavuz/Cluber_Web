"use client";

import Link from "next/link";
import { Compass, Users, MessageSquare, Calendar, ChevronRight, Sparkles, Zap, Shield, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/auth/useAuth";
import { useState, useEffect } from "react";

export default function Home() {
  const { sessionQuery } = useAuth();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const user = sessionQuery.data;
  const isAuthenticated = isMounted && !!user;

  return (
    <main className="relative min-h-screen overflow-hidden bg-white dark:bg-zinc-950">
      {/* Background Decorative Elements */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 blur-3xl" aria-hidden="true">
        <div className="h-[40rem] w-[80rem] bg-gradient-to-b from-blue-500/10 to-transparent dark:from-blue-600/5" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 sm:pb-32 lg:flex lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" className="inline-flex space-x-6">
              <span className="rounded-full bg-blue-600/10 px-3 py-1 text-sm font-semibold leading-6 text-blue-600 ring-1 ring-inset ring-blue-600/10 dark:text-blue-400">
                Yayında
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-zinc-600 dark:text-zinc-400">
                <span>Versiyon 0.1.0</span>
                <ChevronRight className="h-5 w-5 text-zinc-400" aria-hidden="true" />
              </span>
            </a>
          </div>

          <h1 className="mt-10 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-6xl">
            Topluluklar Burada <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Canlanıyor.</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Kulüpler oluştur, ortak ilgi alanlarına sahip insanlarla tanış ve etkinliklerini tek bir yerden yönet. ClubHub, dinamik topluluklar için modern bir platformdur.
          </p>

          <div className="relative z-10 mt-10 flex items-center justify-center gap-x-6">
            <Link
              href={isAuthenticated ? "/clubs" : "/register"}
              className="pointer-events-auto rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-500 hover:scale-105 active:scale-95"
            >
              {isAuthenticated ? "Kulüpleri Keşfet" : "Hemen Katıl"}
            </Link>
            {!isAuthenticated && (
              <Link href="/login" className="pointer-events-auto text-sm font-bold leading-6 text-zinc-900 transition-colors hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400">
                Giriş Yap <span aria-hidden="true">→</span>
              </Link>
            )}
            {isAuthenticated && (
              <Link href="/profile" className="flex items-center gap-2 text-sm font-bold leading-6 text-zinc-900 transition-colors hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400">
                Profiline Git <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>

        {/* Feature Cards Grid (Desktop View) */}
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:w-[40rem]">
              <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
                  <MessageSquare size={24} />
                </div>
                <h3 className="mt-6 text-lg font-bold text-zinc-900 dark:text-zinc-100">Gerçek Zamanlı Sohbet</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Kulüp üyeleriyle anlık mesajlaşın, fikirlerinizi anında paylaşın.</p>
              </div>

              <div className="mt-0 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 sm:mt-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600">
                  <Calendar size={24} />
                </div>
                <h3 className="mt-6 text-lg font-bold text-zinc-900 dark:text-zinc-100">Etkinlik Yönetimi</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Dijital veya fiziksel etkinlikler oluşturun, katılımcıları takip edin.</p>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                  <Users size={24} />
                </div>
                <h3 className="mt-6 text-lg font-bold text-zinc-900 dark:text-zinc-100">Üye Yönetimi</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Roller atayın, moderasyonu sağlayın ve güvenli bir ortam kurun.</p>
              </div>

              <div className="mt-0 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 sm:mt-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600">
                  <Sparkles size={24} />
                </div>
                <h3 className="mt-6 text-lg font-bold text-zinc-900 dark:text-zinc-100">Keşfet</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Yüzlerce kategori arasından size en uygun topluluğu bulun.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">Geleceğin Topluluğunu Birlikte İnşa Edelim</h2>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Modern mimarimiz ve hız odaklı yapımızla topluluk deneyiminizi bir üst seviyeye taşıyoruz.
          </p>
        </div>
        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-zinc-900 dark:text-zinc-100 sm:mt-20 sm:grid-cols-3 lg:mx-0 lg:max-w-none">
          <div className="flex flex-col gap-y-3 border-l border-zinc-200 pl-6 dark:border-zinc-800">
            <dt className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">Hız & Performans</dt>
            <dd className="order-first text-3xl font-semibold tracking-tight italic">
              <Zap className="mb-1 inline-block text-yellow-500" /> %100 Turbopack
            </dd>
          </div>
          <div className="flex flex-col gap-y-3 border-l border-zinc-200 pl-6 dark:border-zinc-800">
            <dt className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">Güvenlik</dt>
            <dd className="order-first text-3xl font-semibold tracking-tight">
              <Shield className="mb-1 inline-block text-blue-500" /> JWT Koruma
            </dd>
          </div>
          <div className="flex flex-col gap-y-3 border-l border-zinc-200 pl-6 dark:border-zinc-800">
            <dt className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">Kullanılabilirlik</dt>
            <dd className="order-first text-3xl font-semibold tracking-tight">Modern UI</dd>
          </div>
        </dl>
      </div>

      {/* CTA Section */}
      <div className="mx-auto my-32 max-w-7xl px-6 sm:my-48 lg:px-8">
        <div className="relative isolate overflow-hidden bg-zinc-900 px-6 py-24 text-center shadow-2xl rounded-3xl sm:px-16 dark:bg-white dark:text-zinc-900">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white dark:text-zinc-900 sm:text-4xl">
            {isAuthenticated ? "Topluluğunu Büyütmeye Devam Et" : "Bugün Başlamaya Hazır Mısın?"}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-400 dark:text-zinc-500">
            {isAuthenticated
              ? "Kulüplerini yönetmek ve yeni etkinlikler oluşturmak için hemen başla."
              : "Kendi topluluğunu kurmak sadece birkaç saniye sürer. Ücretsiz üye ol ve keşfetmeye başla."}
          </p>
          <div className="relative z-10 mt-10 flex items-center justify-center gap-x-6">
            <Link
              href={isAuthenticated ? "/profile" : "/register"}
              className="pointer-events-auto rounded-xl bg-white px-8 py-4 text-base font-bold text-zinc-900 shadow-xl transition-all hover:bg-zinc-100 hover:scale-105 active:scale-95 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-900"
            >
              {isAuthenticated ? "Profiline Git" : "Şimdi Kayıt Ol"}
            </Link>
            <Link href="/clubs" className="pointer-events-auto text-base font-bold leading-6 text-white">
              Kulüplere Göz At <span aria-hidden="true">→</span>
            </Link>
          </div>
          <svg
            viewBox="0 0 1024 1024"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <circle cx={512} cy={512} r={512} fill="url(#gradient)" fillOpacity="0.7" />
            <defs>
              <radialGradient id="gradient">
                <stop stopColor="#3b82f6" />
                <stop offset={1} stopColor="#6366f1" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>

      <footer className="border-t border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="container mx-auto px-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>&copy; {new Date().getFullYear()} ClubHub Web. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </main>
  );
}
