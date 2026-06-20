export const metadata = {
  title: 'Jewellery Care Guide — Varcha',
  description: 'How to clean and store your Varcha pieces to keep them looking their best.',
};

const tips = [
  {
    heading: 'Keep away from water',
    body: 'Remove jewellery before bathing, swimming, or doing dishes. Moisture is the primary cause of tarnishing in gold-plated and enamel pieces. Pat dry immediately if it gets wet.',
  },
  {
    heading: 'Store separately',
    body: 'Store each piece in its own soft pouch or compartment. Metal-on-metal contact causes scratches; beaded pieces can tangle and break. Airtight pouches slow tarnish significantly.',
  },
  {
    heading: 'Avoid perfume and chemicals',
    body: 'Spray perfume before putting on your jewellery, not after. Alcohol-based products, sunscreen, and hair spray all accelerate tarnishing and can strip enamel colour.',
  },
  {
    heading: 'Clean gently',
    body: 'Use a soft, dry microfibre cloth after each wear. For a deeper clean, use a barely-damp cloth and dry immediately. Never use ultrasonic cleaners or silver-dip solutions on gold-plated or Meenakari pieces.',
  },
  {
    heading: 'Kundan and polki pieces',
    body: 'Kundan stones are held in gold foil — they are not glued. Do not immerse in water. Wipe the surface only; avoid rubbing the stone setting.',
  },
  {
    heading: 'Beaded pieces',
    body: 'Maasai and tribal beaded pieces are strung on thread or wire. Keep them away from sharp objects. If a thread breaks, stop wearing and have it re-strung before the piece unravels further.',
  },
  {
    heading: 'Re-plating over time',
    body: "Gold plating wears naturally with daily use. Most pieces can be re-plated by a local goldsmith for a modest cost. Contact us if you'd like a recommendation.",
  },
];

export default function CareGuidePage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <span className="font-annotation text-[10px] tracking-[0.35em] text-sketch uppercase">
          Care &amp; maintenance
        </span>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink">Jewellery Care Guide</h1>
        <p className="mt-4 font-body text-base text-ink-soft">
          Fashion jewellery rewards a little care. Follow these guidelines and your pieces will
          stay vibrant for years.
        </p>

        <div className="mt-10 space-y-6">
          {tips.map(({ heading, body }) => (
            <div key={heading} className="rounded-panel border border-line bg-surface p-6">
              <h2 className="font-display text-base font-semibold text-ink">{heading}</h2>
              <p className="mt-2 font-body text-sm leading-relaxed text-ink-soft">{body}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 font-body text-xs text-ink-soft">
          Questions about a specific piece?{' '}
          <a href="/contact" className="text-wine hover:underline">
            Contact us
          </a>{' '}
          and we&apos;ll advise you directly.
        </p>
      </div>
    </div>
  );
}
