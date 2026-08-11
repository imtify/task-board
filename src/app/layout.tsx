import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Task Board",
  description: "A simple task manager built with Next.js and Tailwind CSS.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <header className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto flex max-w-5xl items-center px-4 py-4 sm:px-6">
            <h1 className="text-lg font-semibold tracking-tight">
              Task Board
            </h1>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
