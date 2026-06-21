'use client';

import { useEffect } from 'react';
import { apiLogEvent } from '@/lib/client-api';

export default function CheckoutCompleteTracker() {
  useEffect(() => {
    apiLogEvent({ type: 'checkout_complete' });
  }, []);

  return null;
}
