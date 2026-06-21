export const metadata = {
  title: 'Contact — Varcha',
  description: 'Get in touch with the Varcha team.',
};

export default function ContactPage() {
  const waNumber = '911234567890'; // placeholder — replaced by Settings in Checkpoint 4
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent('Hi! I have a question about a Varcha piece.')}`;

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <span className="font-annotation text-[10px] tracking-[0.35em] text-sketch uppercase">
          Get in touch
        </span>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink">Contact us</h1>

        <p className="mt-4 font-body text-base text-ink-soft">
          We typically respond within a few hours on business days. For order queries, please
          include your order number.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-2 rounded-panel border border-line bg-surface p-6 transition-colors hover:border-gold"
          >
            <span className="font-display text-lg font-semibold text-ink">WhatsApp</span>
            <span className="font-body text-sm text-ink-soft">
              Quickest way to reach us. Usually respond within 2 hours.
            </span>
            <span className="mt-2 font-body text-sm font-medium text-gold">Chat now →</span>
          </a>

          <a
            href="mailto:hello@varcha.in"
            className="flex flex-col gap-2 rounded-panel border border-line bg-surface p-6 transition-colors hover:border-gold"
          >
            <span className="font-display text-lg font-semibold text-ink">Email</span>
            <span className="font-body text-sm text-ink-soft">
              For detailed queries, custom orders, or wholesale enquiries.
            </span>
            <span className="mt-2 font-body text-sm font-medium text-gold">
              hello@varcha.in →
            </span>
          </a>
        </div>

        <div className="mt-10 rounded-panel border border-line bg-surface p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Studio address</h2>
          <p className="mt-2 font-body text-sm leading-relaxed text-ink-soft">
            Varcha Jewellery Studio<br />
            Jawahar Nagar, Jaipur — 302 004<br />
            Rajasthan, India
          </p>
          <p className="mt-3 font-body text-xs text-ink-soft">
            Studio visits by appointment only. Shipping available pan-India.
          </p>
        </div>
      </div>
    </div>
  );
}
