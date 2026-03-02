import type { PropsWithChildren } from "react";

interface AuthShellProps extends PropsWithChildren {
  title: string;
  description: string;
}

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-10">
      <section className="w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
        <div className="mt-6">{children}</div>
      </section>
    </main>
  );
}

