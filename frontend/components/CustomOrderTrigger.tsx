'use client';

import { useState } from 'react';
import { apiCreateCustomOrderRequest, apiUploadCustomOrderImage } from '@/lib/client-api';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';

const BUDGET_RANGES = ['Under ₹2,000', '₹2,000 – ₹5,000', '₹5,000 – ₹15,000', '₹15,000+'];

interface Props {
  className?: string;
}

export default function CustomOrderTrigger({ className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [occasion, setOccasion] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [preferredStone, setPreferredStone] = useState('');
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function reset() {
    setName(''); setPhone(''); setEmail(''); setOccasion(''); setBudgetRange('');
    setPreferredStone(''); setMessage(''); setImageUrl(''); setStatus('idle'); setErrorMsg('');
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await apiUploadCustomOrderImage(file);
      setImageUrl(url);
    } catch {
      setErrorMsg('Image upload failed — you can still submit without it.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setStatus('error');
      setErrorMsg('Please enter your name and phone number.');
      return;
    }
    setStatus('submitting');
    setErrorMsg('');
    try {
      await apiCreateCustomOrderRequest({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        occasion: occasion.trim() || undefined,
        budgetRange: budgetRange || undefined,
        preferredStone: preferredStone.trim() || undefined,
        referenceImageUrl: imageUrl || undefined,
        message: message.trim() || undefined,
      });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong — please try again.');
    }
  }

  const inputCls =
    'w-full rounded-btn border border-line bg-bg px-3 py-2.5 font-body text-sm text-ink placeholder-ink-soft focus:border-wine focus:outline-none';

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center gap-2 rounded-btn border border-gold px-6 py-2.5 font-body text-sm font-medium text-gold transition-colors hover:bg-gold hover:text-surface ${className}`}
        >
          Request a Custom Piece
        </button>
      </DialogTrigger>
      <DialogContent>
        {status === 'success' ? (
          <>
            <DialogTitle>Request received</DialogTitle>
            <DialogDescription>
              Thanks{name.trim() ? `, ${name.trim().split(' ')[0]}` : ''} — our team will reach out on{' '}
              {phone.trim()} to talk through your piece.
            </DialogDescription>
          </>
        ) : (
          <>
            <DialogTitle>Request a Custom Piece</DialogTitle>
            <DialogDescription>
              Tell us what you have in mind — a rashi bracelet, a bridal set, anything bespoke — and
              we&apos;ll get back to you.
            </DialogDescription>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input className={inputCls} placeholder="Your name *" value={name} onChange={(e) => setName(e.target.value)} />
                <input className={inputCls} placeholder="Phone number *" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <input className={inputCls} placeholder="Email (optional)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input className={inputCls} placeholder="Occasion (e.g. wedding, gift)" value={occasion} onChange={(e) => setOccasion(e.target.value)} />
                <select className={inputCls} value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)}>
                  <option value="">Budget range (optional)</option>
                  {BUDGET_RANGES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <input
                className={inputCls}
                placeholder="Preferred stone or style (optional)"
                value={preferredStone}
                onChange={(e) => setPreferredStone(e.target.value)}
              />

              <textarea
                className={inputCls}
                placeholder="Tell us more about what you're looking for (optional)"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <div>
                <label className="mb-1.5 block font-body text-xs font-medium text-ink-soft">
                  Reference image (optional)
                </label>
                {imageUrl ? (
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Reference" className="h-16 w-16 rounded-btn border border-line object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="font-body text-xs text-ink-soft underline hover:text-wine"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploading}
                    className="w-full font-body text-xs text-ink-soft file:mr-3 file:rounded-btn file:border file:border-line file:bg-bg file:px-3 file:py-1.5 file:font-body file:text-xs file:text-ink-soft"
                  />
                )}
                {uploading && <p className="mt-1 font-body text-xs text-ink-soft">Uploading…</p>}
              </div>

              {status === 'error' && <p className="font-body text-xs text-red-600">{errorMsg}</p>}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="inline-flex w-full items-center justify-center gap-2 rounded-btn bg-wine px-7 py-3 font-body text-sm font-semibold text-surface transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'submitting' ? 'Submitting…' : 'Submit Request'}
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
