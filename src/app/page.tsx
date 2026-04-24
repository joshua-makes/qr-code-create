'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  QrConfig,
  defaultConfig,
  decodeConfig,
  enforceEccForLogo,
  isLogoTooLarge,
} from '@/lib/qr';
import { QrControls } from '@/components/qr/QrControls';
import { LogoUploader } from '@/components/qr/LogoUploader';
import { ShareLinkButton } from '@/components/qr/ShareLinkButton';
import { Container } from '@/components/layout/Container';

// Dynamic import to avoid SSR issues with qr-code-styling
const QrPreview = dynamic(
  () => import('@/components/qr/QrPreview').then((m) => m.QrPreview),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-64 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
    ),
  },
);

export default function Home() {
  const [config, setConfig] = useState<QrConfig>(defaultConfig);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [debouncedConfig, setDebouncedConfig] = useState<QrConfig>(defaultConfig);
  const [mounted, setMounted] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load config from URL on mount
  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    const cfgParam = params.get('cfg');
    if (cfgParam) {
      const decoded = decodeConfig(cfgParam);
      setConfig((prev) => ({ ...prev, ...decoded }));
    }
  }, []);

  // Debounce config updates
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const effEcc = enforceEccForLogo(config.ecc, logoDataUrl !== null);
      setDebouncedConfig({ ...config, ecc: effEcc });
    }, 100);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [config, logoDataUrl]);

  const handleConfigChange = useCallback((updates: Partial<QrConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleLogoChange = useCallback(
    (dataUrl: string | null) => {
      setLogoDataUrl(dataUrl);
      if (dataUrl && (config.ecc === 'L' || config.ecc === 'M')) {
        setConfig((prev) => ({ ...prev, ecc: 'Q' }));
      }
    },
    [config.ecc],
  );

  const effectiveEcc = enforceEccForLogo(config.ecc, logoDataUrl !== null);
  const logoTooLarge = logoDataUrl !== null && isLogoTooLarge(config.logoSizePct);

  // Sync effective ECC back to config display
  const displayConfig = { ...config, ecc: effectiveEcc };

  if (!mounted) {
    return (
      <Container className="py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">QR Code Generator</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Create customizable QR codes with logo embedding — entirely in your browser.
        </p>
      </div>

      {logoTooLarge && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400"
        >
          ⚠️ Logo size exceeds 25% — this may make the QR code hard to scan. Consider reducing the
          logo size.
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Controls column */}
        <div className="space-y-4">
          <QrControls config={displayConfig} onChange={handleConfigChange} />
          <LogoUploader
            config={displayConfig}
            logoDataUrl={logoDataUrl}
            onChange={handleConfigChange}
            onLogoChange={handleLogoChange}
          />
          <ShareLinkButton config={displayConfig} />
        </div>

        {/* Preview column */}
        <div className="flex flex-col items-center">
          <div className="sticky top-24 w-full">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 flex flex-col items-center gap-4">
              <h2 className="self-start text-base font-semibold text-gray-900 dark:text-gray-100">
                Preview
              </h2>
              <QrPreview config={debouncedConfig} logoDataUrl={logoDataUrl} />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

