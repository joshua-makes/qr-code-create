'use client';

import { useEffect, useRef, useCallback } from 'react';
import QRCodeStyling from 'qr-code-styling';
import type { QrConfig } from '@/lib/qr';
import { Button } from '@/components/ui/Button';

interface QrPreviewProps {
  config: QrConfig;
  logoDataUrl: string | null;
}

const eccMap: Record<string, 'L' | 'M' | 'Q' | 'H'> = {
  L: 'L',
  M: 'M',
  Q: 'Q',
  H: 'H',
};

export function QrPreview({ config, logoDataUrl }: QrPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<InstanceType<typeof QRCodeStyling> | null>(null);

  const getOptions = useCallback(
    () => ({
      width: config.size,
      height: config.size,
      data: config.text || ' ',
      margin: config.margin * 4,
      qrOptions: {
        errorCorrectionLevel: eccMap[config.ecc] ?? 'M',
      },
      dotsOptions: {
        color: config.fgColor,
      },
      backgroundOptions: {
        color: config.bgColor,
      },
      ...(logoDataUrl
        ? {
            image: logoDataUrl,
            imageOptions: {
              crossOrigin: 'anonymous' as const,
              margin: 4,
              imageSize: config.logoSizePct / 100,
              ...(config.logoRounded ? { borderRadius: 8 } : {}),
            },
          }
        : {}),
    }),
    [config, logoDataUrl],
  );

  useEffect(() => {
    if (!containerRef.current) return;
    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(getOptions());
      qrRef.current.append(containerRef.current);
    } else {
      qrRef.current.update(getOptions());
    }
  }, [getOptions]);

  const handleDownloadPng = () => {
    qrRef.current?.download({ name: 'qr-code', extension: 'png' });
  };

  const handleDownloadSvg = () => {
    qrRef.current?.download({ name: 'qr-code', extension: 'svg' });
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        ref={containerRef}
        className="rounded-lg overflow-hidden shadow-md"
        style={{ width: Math.min(config.size, 400), height: Math.min(config.size, 400) }}
      />
      <div className="flex gap-3 w-full max-w-xs">
        <Button onClick={handleDownloadPng} className="flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          PNG
        </Button>
        <Button onClick={handleDownloadSvg} variant="secondary" className="flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          SVG
        </Button>
      </div>
    </div>
  );
}
