'use client';

import { useRef, useState } from 'react';
import { adminApiUploadImage } from '@/lib/admin-api';

interface Props {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  hint?: string;
  label?: string;
}

const ACCEPT = 'image/jpeg,image/png,image/webp';

export default function ImageUploader({ value, onChange, folder, hint, label = 'Image' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  async function handleFile(file: File) {
    setError('');
    setUploading(true);
    try {
      const url = await adminApiUploadImage(file, folder);
      onChange(url);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) handleFile(file);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-body text-xs font-medium text-ink-soft">{label}</span>
        <button
          type="button"
          onClick={() => setShowUrlInput((v) => !v)}
          className="font-body text-[11px] text-ink-soft hover:text-wine underline"
        >
          {showUrlInput ? 'Hide URL field' : 'Paste URL instead'}
        </button>
      </div>

      {/* Drop zone / preview */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className="relative flex min-h-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-card border-2 border-dashed border-line bg-bg transition-colors hover:border-wine"
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="preview"
              className="h-full max-h-[200px] w-full object-contain p-1"
              onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-ink/40 opacity-0 transition-opacity hover:opacity-100">
              <span className="rounded-btn bg-surface px-3 py-1.5 font-body text-xs font-medium text-ink shadow">
                {uploading ? 'Uploading…' : 'Replace image'}
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            {uploading ? (
              <>
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-wine" />
                <span className="font-body text-xs text-ink-soft">Uploading…</span>
              </>
            ) : (
              <>
                <svg className="h-8 w-8 text-ink-soft/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 16.5V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-1.5M16.5 12L12 7.5m0 0L7.5 12M12 7.5V18" />
                </svg>
                <span className="font-body text-sm font-medium text-ink-soft">
                  Click or drag image here
                </span>
                {hint && (
                  <span className="font-annotation text-[10px] tracking-wide text-ink-soft/60">
                    {hint}
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={onInputChange}
      />

      {/* Inline upload progress when replacing */}
      {uploading && value && (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-wine" />
          <span className="font-body text-xs text-ink-soft">Uploading to Cloudinary…</span>
        </div>
      )}

      {error && <p className="font-body text-xs text-red-600">{error}</p>}

      {/* URL paste fallback */}
      {showUrlInput && (
        <input
          type="url"
          placeholder="https://res.cloudinary.com/..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-btn border border-line bg-surface px-3 py-2 font-body text-sm text-ink focus:border-wine focus:outline-none focus:ring-1 focus:ring-wine"
        />
      )}

      {/* Size hint below drop zone when image is present */}
      {value && hint && (
        <span className="font-annotation text-[10px] tracking-wide text-ink-soft/60">{hint}</span>
      )}
    </div>
  );
}
