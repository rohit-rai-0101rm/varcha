export const metadata = {
  title: 'About — Varcha',
  description: 'The story behind Varcha jewellery.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <span className="font-annotation text-[10px] tracking-[0.35em] text-sketch uppercase">
          Our story
        </span>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink">About Varcha</h1>

        <div className="mt-8 space-y-6 font-body text-base leading-relaxed text-ink-soft">
          <p>
            Varcha began with a simple conviction: the most beautiful jewellery in the world is
            made by hand, by people who have spent a lifetime mastering a single craft. Our name
            means <em className="text-ink">flourishing</em> — and that is exactly what we are
            building, for artisans and for the women who wear their work.
          </p>
          <p>
            We work directly with craft clusters across India — the polki workshops of Jaipur,
            the enamel studios of Jodhpur, the bead artisans of Rajasthan — and with global
            heritage traditions that share the same rigour: Maasai beadwork, North African
            silverwork, Japanese minimalist metalwork.
          </p>
          <p>
            The everyday line is sold through Amazon and Flipkart to keep prices accessible. The
            premium and bridal line is sold exclusively on this site — no marketplaces, no
            middlemen — so the full margin returns to the artisans who made it.
          </p>
          <p>
            Every piece ships from our own studio in Jaipur. Every image you see is of the
            actual piece, not a render. And every purchase supports an artisan who has chosen to
            keep a traditional craft alive.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-6 border-t border-line pt-10">
          {[
            { label: 'Craft clusters', value: '12+' },
            { label: 'Artisan families', value: '40+' },
            { label: 'Styles documented', value: '30+' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="font-display text-3xl font-bold text-wine">{value}</p>
              <p className="mt-1 font-body text-xs text-ink-soft">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
