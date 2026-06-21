'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiGetAnalytics, adminApiGetTopSessions } from '@/lib/admin-api';

interface ProductStat { _id: string; name: string; slug: string; views?: number; clicks?: number; }
interface CategoryStat { _id: string; name: string; slug: string; views: number; }
interface StyleStat { _id: string; name: string; family: string; engagements: number; }
interface MarketplaceClick { _id: string; clicks: number; }
interface SessionStat {
  _id: string;
  totalTimeMs: number;
  clickCount: number;
  userId?: string | null;
  userName?: string | null;
  userEmail?: string | null;
}

interface Overview {
  topViewedProducts: ProductStat[];
  topClickedProducts: ProductStat[];
  topCategories: CategoryStat[];
  topStyles: StyleStat[];
  marketplaceClicks: MarketplaceClick[];
  premiumOrders: { revenue: number; count: number };
}

function fmtTime(ms: number) {
  const secs = Math.round(ms / 1000);
  if (secs < 60) return `${secs}s`;
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

interface StatRow { label: string; value: number; suffix: string; href?: string; external?: boolean; }

function StatTable({ title, rows }: { title: string; rows: StatRow[] }) {
  return (
    <div className="rounded-card border border-line bg-surface p-5">
      <h2 className="mb-4 font-display text-base font-semibold text-ink">{title}</h2>
      {rows.length === 0 ? (
        <p className="font-body text-sm text-ink-soft">No data yet.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              {row.href ? (
                <Link
                  href={row.href}
                  target={row.external ? '_blank' : undefined}
                  rel={row.external ? 'noopener noreferrer' : undefined}
                  className="truncate font-body text-sm text-wine hover:underline"
                >
                  {row.label}
                </Link>
              ) : (
                <p className="truncate font-body text-sm text-ink">{row.label}</p>
              )}
              <p className="shrink-0 font-body text-sm font-medium text-ink-soft">
                {row.value} {row.suffix}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [sessions, setSessions] = useState<SessionStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApiGetAnalytics(), adminApiGetTopSessions()]).then(([ov, sess]) => {
      setOverview(ov);
      setSessions(sess ?? []);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="font-body text-sm text-ink-soft">Loading…</p>;
  if (!overview) return <p className="font-body text-sm text-ink-soft">Failed to load analytics.</p>;

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-semibold text-ink">Analytics</h1>

      {/* ── Revenue vs marketplace clicks — clearly separate ── */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <h2 className="font-display text-lg font-semibold text-ink">Sales & Traffic</h2>
          <span className="rounded-badge border border-line px-2 py-0.5 font-body text-xs text-ink-soft">
            Revenue and redirect clicks are different numbers
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-card border border-[var(--wine)] bg-surface p-5">
            <p className="font-body text-xs uppercase tracking-wide text-ink-soft">Premium-line revenue</p>
            <p className="mt-1 font-display text-3xl font-bold text-ink">
              ₹{overview.premiumOrders.revenue.toLocaleString('en-IN')}
            </p>
            <p className="mt-1 font-body text-sm text-ink-soft">
              {overview.premiumOrders.count} confirmed paid order{overview.premiumOrders.count !== 1 ? 's' : ''}
            </p>
          </div>

          {overview.marketplaceClicks.length === 0 ? (
            <div className="rounded-card border border-line bg-surface p-5">
              <p className="font-body text-xs uppercase tracking-wide text-ink-soft">Marketplace clicks</p>
              <p className="mt-1 font-display text-3xl font-bold text-ink">0</p>
              <p className="mt-1 font-body text-xs text-ink-soft">
                Redirect clicks only — not confirmed purchases
              </p>
            </div>
          ) : (
            overview.marketplaceClicks.map((m) => (
              <div key={m._id} className="rounded-card border border-line bg-surface p-5">
                <p className="font-body text-xs uppercase tracking-wide text-ink-soft capitalize">
                  {m._id} redirect clicks
                </p>
                <p className="mt-1 font-display text-3xl font-bold text-ink">{m.clicks}</p>
                <p className="mt-1 font-body text-xs text-ink-soft">
                  Redirect clicks only — not confirmed purchases
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Top products ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StatTable
          title="Most Viewed Products"
          rows={overview.topViewedProducts.map((p) => ({
            label: p.name,
            value: p.views ?? 0,
            suffix: 'views',
            href: `/product/${p.slug}`,
            external: true,
          }))}
        />
        <StatTable
          title="Most Clicked Products"
          rows={overview.topClickedProducts.map((p) => ({
            label: p.name,
            value: p.clicks ?? 0,
            suffix: 'clicks',
            href: `/product/${p.slug}`,
            external: true,
          }))}
        />
      </div>

      {/* ── Top categories + styles ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StatTable
          title="Top Categories by Pageviews"
          rows={overview.topCategories.map((c) => ({
            label: c.name,
            value: c.views,
            suffix: 'views',
            href: `/category/${c.slug}`,
            external: true,
          }))}
        />
        <StatTable
          title="Top Styles by Engagement"
          rows={overview.topStyles.map((s) => ({
            label: `${s.name} (${s.family})`,
            value: s.engagements,
            suffix: 'engagements',
          }))}
        />
      </div>

      {/* ── Top sessions ── */}
      <div>
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">Highest Engagement Sessions</h2>
        <div className="overflow-x-auto rounded-card border border-line">
          <table className="w-full font-body text-sm">
            <thead className="bg-surface text-left">
              <tr>
                {['Session', 'User', 'Time spent', 'Clicks'].map((h) => (
                  <th key={h} className="border-b border-line px-4 py-3 font-medium text-ink-soft">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center font-body text-sm text-ink-soft">
                    No session data yet.
                  </td>
                </tr>
              ) : (
                sessions.map((s) => (
                  <tr key={s._id} className="border-b border-line last:border-0 hover:bg-surface/60">
                    <td className="px-4 py-3 font-annotation text-xs text-ink-soft">
                      {s._id.slice(0, 8)}…
                    </td>
                    <td className="px-4 py-3">
                      {s.userName && s.userId ? (
                        <Link href={`/admin/customers/${s.userId}`} className="group">
                          <p className="font-medium text-wine group-hover:underline">{s.userName}</p>
                          <p className="text-xs text-ink-soft">{s.userEmail}</p>
                        </Link>
                      ) : s.userName ? (
                        <>
                          <p className="font-medium text-ink">{s.userName}</p>
                          <p className="text-xs text-ink-soft">{s.userEmail}</p>
                        </>
                      ) : (
                        <span className="text-ink-soft">Guest</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink">{fmtTime(s.totalTimeMs)}</td>
                    <td className="px-4 py-3 text-ink">{s.clickCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
