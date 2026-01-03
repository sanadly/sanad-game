'use client';

import { useEffect, useState } from 'react';

export default function CRTOverlay() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const settings = localStorage.getItem('terra-nova-settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setEnabled(parsed.crtOverlayEnabled !== false);
      }
    }
  }, []);

  if (!enabled) return null;

  return <div className="crt-overlay" aria-hidden="true" />;
}
