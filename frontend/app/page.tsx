import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg">
      <div className="text-center">
        <h1 className="font-display text-5xl font-semibold text-wine">Varcha</h1>
        <p className="mt-3 font-body text-lg text-ink-soft">
          Curated artificial jewelry — coming soon
        </p>
        <ThemeToggle />
      </div>
    </main>
  );
}
