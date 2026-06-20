'use client';

import { apiLogEvent } from '@/lib/client-api';

interface Props {
  platform: string;
  url: string;
  productId: string;
}

export default function MarketplaceButton({ platform, url, productId }: Props) {
  async function handleClick() {
    await apiLogEvent({
      type: 'marketplace_redirect',
      productId,
      platform,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <button
      onClick={handleClick}
      className="rounded-btn border border-gold px-6 py-3 text-center font-body text-sm font-medium capitalize text-gold transition-colors hover:bg-gold hover:text-surface"
    >
      Buy on {platform}
    </button>
  );
}
