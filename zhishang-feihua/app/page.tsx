import { TypingShell } from "@/components/typing/TypingShell";
import { SiteHeader } from "@/components/SiteHeader";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container max-w-4xl px-4 pb-16 pt-8 md:px-6">
        <header className="mb-10 text-center">
          <h1 className="font-display text-4xl font-semibold tracking-wide text-primary-800 dark:text-primary-100 sm:text-5xl">
            指上飛花
          </h1>
          <p className="mt-2 text-muted-foreground">桃花源 · 中文輸入練習</p>
        </header>
        <TypingShell />
      </div>
    </div>
  );
}
