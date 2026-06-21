'use client';

import { useEffect, useRef } from 'react';
import { apiLogEvent, getSessionId, getToken } from '@/lib/client-api';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const MIN_MS = 2_000; // skip time_spent if user left in under 2 s

interface Props {
  productId?: string;
  categoryId?: string;
}

export default function PageTracker({ productId, categoryId }: Props) {
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    apiLogEvent({ type: 'pageview', productId, categoryId });

    // keepalive fetch survives tab close; sendBeacon can't set custom headers
    const handleUnload = () => {
      const durationMs = Date.now() - startRef.current;
      if (durationMs < MIN_MS) return;
      const sid = getSessionId();
      if (!sid) return;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Session-Id': sid,
      };
      const token = getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
      fetch(`${API}/api/events`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ type: 'time_spent', productId, categoryId, durationMs }),
        keepalive: true,
      }).catch(() => {});
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      const durationMs = Date.now() - startRef.current;
      if (durationMs >= MIN_MS) {
        apiLogEvent({ type: 'time_spent', productId, categoryId, durationMs });
      }
    };
  }, [productId, categoryId]);

  return null;
}
