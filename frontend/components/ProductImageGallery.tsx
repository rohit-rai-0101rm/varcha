'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ProductImage {
  url: string;
  type: string;
}

interface Props {
  images: ProductImage[];
  productName: string;
  isExclusive?: boolean;
}

const SCALE = 2.3;

export default function ProductImageGallery({ images, productName, isExclusive }: Props) {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const zoomRef = useRef<HTMLDivElement>(null);

  if (images.length === 0) return null;

  function handleSelect(idx: number) {
    if (idx === active) return;
    // reset zoom when switching images
    if (zoomRef.current) {
      zoomRef.current.style.transition = 'transform 0.2s ease';
      zoomRef.current.style.transform = 'scale(1) translate(0%,0%)';
    }
    setZoomed(false);
    setFading(true);
    setTimeout(() => { setActive(idx); setFading(false); }, 160);
  }

  function getTranslate(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * (1 / SCALE - 1) * 100;
    const y = ((e.clientY - r.top) / r.height - 0.5) * (1 / SCALE - 1) * 100;
    return { x, y };
  }

  function onMouseEnter(e: React.MouseEvent<HTMLDivElement>) {
    if (!zoomRef.current) return;
    const { x, y } = getTranslate(e);
    zoomRef.current.style.transition = 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)';
    zoomRef.current.style.transform = `scale(${SCALE}) translate(${x}%,${y}%)`;
    setZoomed(true);
  }

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!zoomRef.current || !zoomed) return;
    const { x, y } = getTranslate(e);
    zoomRef.current.style.transition = 'none';
    zoomRef.current.style.transform = `scale(${SCALE}) translate(${x}%,${y}%)`;
  }

  function onMouseLeave() {
    if (!zoomRef.current) return;
    zoomRef.current.style.transition = 'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)';
    zoomRef.current.style.transform = 'scale(1) translate(0%,0%)';
    setZoomed(false);
  }

  return (
    <div className="flex flex-col gap-3 md:flex-row md:gap-3">
      {/* Thumbnail strip — below on mobile, left column on desktop */}
      {images.length > 1 && (
        <div className="order-2 flex shrink-0 flex-row gap-2 overflow-x-auto pb-1 md:order-1 md:w-[76px] md:flex-col md:overflow-x-visible md:overflow-y-auto md:pb-0">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-wine md:h-[72px] md:w-[72px] ${
                active === idx
                  ? 'border-wine opacity-100'
                  : 'border-line opacity-50 hover:opacity-90 hover:border-ink-soft'
              }`}
            >
              <Image
                src={img.url}
                alt={`${productName} — view ${idx + 1}`}
                fill
                sizes="72px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div
        className="relative order-1 aspect-[4/5] min-w-0 flex-1 overflow-hidden rounded-card border border-line bg-surface md:order-2"
        style={{ cursor: zoomed ? 'crosshair' : 'zoom-in' }}
        onMouseEnter={onMouseEnter}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {/* zoom target — transform applied here so Next/Image stays positioned correctly */}
        <div
          ref={zoomRef}
          className="relative h-full w-full"
          style={{ transformOrigin: '50% 50%' }}
        >
          <Image
            src={images[active].url}
            alt={`${productName} — view ${active + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className={`object-cover transition-opacity duration-150 ${fading ? 'opacity-0' : 'opacity-100'}`}
            priority={active === 0}
          />
        </div>

        {/* Badges — outside zoomRef so they don't scale */}
        {isExclusive && (
          <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-badge bg-rose-bg px-2 py-0.5 font-annotation text-xs text-rose-ink">
            Exclusive edit
          </span>
        )}

        {images[active].type === 'model-shot' && (
          <span className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-badge bg-surface/80 px-2 py-0.5 font-annotation text-xs text-ink-soft backdrop-blur-sm">
            On model
          </span>
        )}

        {images.length > 1 && (
          <span className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-badge bg-surface/80 px-2 py-0.5 font-body text-xs text-ink-soft backdrop-blur-sm">
            {active + 1} / {images.length}
          </span>
        )}

        {/* Zoom hint — fades out once user has zoomed */}
        {!zoomed && (
          <span className="pointer-events-none absolute right-3 top-3 z-10 flex items-center gap-1 rounded-badge bg-surface/70 px-2 py-0.5 font-body text-xs text-ink-soft backdrop-blur-sm">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            Hover to zoom
          </span>
        )}
      </div>
    </div>
  );
}
