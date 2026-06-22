import Link from 'next/link';

export const metadata = {
  title: 'Ring Size Guide — Varcha',
  description: 'Find your ring size at home using our simple guide.',
};

const sizes = [
  { us: '5', uk: 'J', india: '9', diameter: '15.7 mm', circumference: '49.3 mm' },
  { us: '6', uk: 'L', india: '12', diameter: '16.5 mm', circumference: '51.8 mm' },
  { us: '7', uk: 'N', india: '14', diameter: '17.3 mm', circumference: '54.4 mm' },
  { us: '8', uk: 'P', india: '16', diameter: '18.2 mm', circumference: '57.1 mm' },
  { us: '9', uk: 'R', india: '18', diameter: '19.0 mm', circumference: '59.7 mm' },
  { us: '10', uk: 'T', india: '20', diameter: '19.8 mm', circumference: '62.2 mm' },
  { us: '11', uk: 'V', india: '22', diameter: '20.6 mm', circumference: '64.8 mm' },
  { us: '12', uk: 'X', india: '24', diameter: '21.4 mm', circumference: '67.2 mm' },
];

export default function RingSizeGuidePage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <span className="font-annotation text-[10px] tracking-[0.35em] text-sketch uppercase">
          Sizing
        </span>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink">Ring Size Guide</h1>
        <p className="mt-4 font-body text-base text-ink-soft">
          Use either method below to find your size at home. If you&apos;re between sizes, size up
          for comfort — rings can always be sized down later.
        </p>

        {/* Method 1 */}
        <div className="mt-10 rounded-panel border border-line bg-surface p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Method 1 — Paper strip</h2>
          <ol className="mt-4 space-y-2 font-body text-sm leading-relaxed text-ink-soft">
            <li>1. Cut a thin strip of paper about 1 cm wide and 10 cm long.</li>
            <li>2. Wrap it snugly around the base of the finger you&apos;d like to size.</li>
            <li>3. Mark where the strip overlaps to form a complete circle.</li>
            <li>4. Lay the strip flat and measure the length in millimetres. This is your finger&apos;s circumference.</li>
            <li>5. Find the matching circumference in the table below to get your size.</li>
          </ol>
        </div>

        {/* Method 2 */}
        <div className="mt-4 rounded-panel border border-line bg-surface p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Method 2 — Existing ring</h2>
          <ol className="mt-4 space-y-2 font-body text-sm leading-relaxed text-ink-soft">
            <li>1. Place a ring that fits well on a flat surface.</li>
            <li>2. Measure the inner diameter (from one inner edge straight across to the other) in millimetres.</li>
            <li>3. Match it to the Diameter column in the table below.</li>
          </ol>
        </div>

        {/* Size chart */}
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse font-body text-sm">
            <thead>
              <tr className="border-b border-line">
                {['India', 'US', 'UK', 'Diameter', 'Circumference'].map((h) => (
                  <th
                    key={h}
                    className="py-2.5 text-left font-semibold text-ink-soft first:pl-2"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {sizes.map((row) => (
                <tr key={row.india} className="text-ink-soft hover:bg-surface">
                  <td className="py-2.5 pl-2 font-medium text-ink">{row.india}</td>
                  <td className="py-2.5">{row.us}</td>
                  <td className="py-2.5">{row.uk}</td>
                  <td className="py-2.5">{row.diameter}</td>
                  <td className="py-2.5">{row.circumference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-8 font-body text-xs text-ink-soft">
          Not sure?{' '}
          <Link href="/contact" className="text-wine hover:underline">
            WhatsApp us
          </Link>{' '}
          with your finger measurement and we&apos;ll advise you before you order.
        </p>
      </div>
    </div>
  );
}
