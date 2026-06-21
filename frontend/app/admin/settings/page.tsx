'use client';

import { useEffect, useState, FormEvent } from 'react';
import { adminApiGetSettings, adminApiUpdateSettings } from '@/lib/admin-api';

interface Settings {
  whatsappNumber: string;
  contactEmail: string;
  socialLinks: { instagram: string; facebook: string };
  homeBannerEnabled: boolean;
  firstOrderDiscountText: string;
}

const INPUT = 'w-full rounded-btn border border-line bg-surface px-3 py-2 font-body text-sm text-ink focus:border-wine focus:outline-none focus:ring-1 focus:ring-wine';
const LABEL = 'font-body text-xs font-medium text-ink-soft';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [homeBannerEnabled, setHomeBannerEnabled] = useState(true);
  const [firstOrderDiscountText, setFirstOrderDiscountText] = useState('');

  useEffect(() => {
    adminApiGetSettings().then((s: Settings) => {
      setWhatsappNumber(s.whatsappNumber ?? '');
      setContactEmail(s.contactEmail ?? '');
      setInstagram(s.socialLinks?.instagram ?? '');
      setFacebook(s.socialLinks?.facebook ?? '');
      setHomeBannerEnabled(s.homeBannerEnabled ?? true);
      setFirstOrderDiscountText(s.firstOrderDiscountText ?? '');
      setLoading(false);
    });
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true); setSaved(false); setError('');
    try {
      await adminApiUpdateSettings({
        whatsappNumber,
        contactEmail,
        socialLinks: { instagram, facebook },
        homeBannerEnabled,
        firstOrderDiscountText,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="font-body text-sm text-ink-soft">Loading…</p>;

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Site settings</h1>

      {error && <p className="mb-4 rounded-btn bg-rose-bg px-3 py-2 font-body text-sm text-rose-ink">{error}</p>}
      {saved && <p className="mb-4 rounded-btn bg-green-50 px-3 py-2 font-body text-sm text-green-700">Settings saved.</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="rounded-card border border-line bg-surface p-5">
          <h2 className="mb-4 font-body text-sm font-semibold text-ink">Contact</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className={LABEL}>WhatsApp number</label>
              <input
                className={INPUT} value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="919876543210 (with country code, no +)"
              />
              <p className="font-body text-xs text-ink-soft">Used to build wa.me/… links. Include country code, no spaces or +.</p>
            </div>
            <div className="flex flex-col gap-1">
              <label className={LABEL}>Contact email</label>
              <input className={INPUT} type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="rounded-card border border-line bg-surface p-5">
          <h2 className="mb-4 font-body text-sm font-semibold text-ink">Social links</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className={LABEL}>Instagram URL</label>
              <input className={INPUT} value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="https://instagram.com/..." />
            </div>
            <div className="flex flex-col gap-1">
              <label className={LABEL}>Facebook URL</label>
              <input className={INPUT} value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="https://facebook.com/..." />
            </div>
          </div>
        </div>

        <div className="rounded-card border border-line bg-surface p-5">
          <h2 className="mb-4 font-body text-sm font-semibold text-ink">Homepage</h2>
          <div className="flex flex-col gap-4">
            <label className="flex cursor-pointer items-center gap-3 font-body text-sm text-ink">
              <input
                type="checkbox" checked={homeBannerEnabled}
                onChange={(e) => setHomeBannerEnabled(e.target.checked)}
              />
              <span>
                <span className="font-medium">Show homepage banner</span>
                <span className="ml-2 font-body text-xs text-ink-soft">(sitewide on/off toggle)</span>
              </span>
            </label>
            <div className="flex flex-col gap-1">
              <label className={LABEL}>First-order discount text</label>
              <input
                className={INPUT} value={firstOrderDiscountText}
                onChange={(e) => setFirstOrderDiscountText(e.target.value)}
                placeholder='e.g. "Flat ₹500 off on your first order"'
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="self-start rounded-btn bg-wine px-6 py-2 font-body text-sm font-medium text-surface disabled:opacity-60">
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </form>
    </div>
  );
}
