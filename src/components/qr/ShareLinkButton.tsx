'use client';

import { useState } from 'react';
import { QrConfig, encodeConfig } from '@/lib/qr';
import { Button } from '@/components/ui/Button';

interface ShareLinkButtonProps {
  config: QrConfig;
}

export function ShareLinkButton({ config }: ShareLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const encoded = encodeConfig(config);
    const url = `${window.location.origin}${window.location.pathname}?cfg=${encoded}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement('textarea');
      el.value = url;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.focus();
      el.select();
      try {
        document.execCommand('copy');
      } catch {
        // Silent fail — clipboard not available
      }
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button onClick={handleShare} variant="secondary" className="w-full">
      {copied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Link copied!
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
          </svg>
          Copy Share Link
        </>
      )}
    </Button>
  );
}
