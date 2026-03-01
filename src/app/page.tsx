export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-12">
      <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="mb-3 inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          ClubHub Frontend Başlangıç
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          Kulübünü kur, topluluğuna katıl, etkinlik ve sohbeti yönet.
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-400 sm:text-base">
          Frontend altyapısı Next.js App Router, TypeScript strict mode, Axios
          interceptor ve React Query provider ile başlatıldı. Sıradaki adım,
          kimlik doğrulama ekranları ile `useAuth` akışını oluşturmaktır.
        </p>

        <div className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
              Tamamlanan
            </h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-zinc-600 dark:text-zinc-400">
              <li>Proje kurulumu ve klasör iskeleti</li>
              <li>Axios instance + interceptor</li>
              <li>Merkezi API hata eşleme yapısı</li>
              <li>Global provider (React Query + Sonner)</li>
            </ul>
          </div>

          <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
              Sıradaki adımlar
            </h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-zinc-600 dark:text-zinc-400">
              <li>Login/Register sayfaları</li>
              <li>`useAuth` hook ve route koruma</li>
              <li>Kulüp keşfet ve detay sayfaları</li>
              <li>Sohbet ve etkinlik modülleri</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
