export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-brand-charcoal text-5xl font-bold">
          🎫 <span className="text-brand-orange">Eventify</span>
        </h1>
        <p className="text-brand-soft-black mt-4 text-lg">
          Phase 0 complete — Environment is ready!
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="bg-brand-charcoal h-16 w-16 rounded-xl" title="#262626" />
          <div
            className="bg-brand-cream border-brand-sage/30 h-16 w-16 rounded-xl border"
            title="#E2E8CE"
          />
          <div className="bg-brand-sage h-16 w-16 rounded-xl" title="#ACBFA4" />
          <div className="bg-brand-orange h-16 w-16 rounded-xl" title="#FF7F11" />
        </div>
        <p className="text-brand-sage mt-4 text-sm">Color palette loaded ✓</p>
      </div>
    </main>
  );
}
