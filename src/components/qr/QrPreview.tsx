'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
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

const MAX_PREVIEW = 480;

/** Draws the image onto a canvas with rounded corners and returns a new data URL. */
function applyRoundedCorners(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(dataUrl); return; }
      const r = Math.min(img.width, img.height) * 0.2;
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(img.width - r, 0);
      ctx.quadraticCurveTo(img.width, 0, img.width, r);
      ctx.lineTo(img.width, img.height - r);
      ctx.quadraticCurveTo(img.width, img.height, img.width - r, img.height);
      ctx.lineTo(r, img.height);
      ctx.quadraticCurveTo(0, img.height, 0, img.height - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = dataUrl;
  });
}

export function QrPreview({ config, logoDataUrl }: QrPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<InstanceType<typeof QRCodeStyling> | null>(null);
  const [effectiveLogo, setEffectiveLogo] = useState<string | null>(logoDataUrl);

  // Pre-process logo for rounded corners
  useEffect(() => {
    if (!logoDataUrl) {
      setEffectiveLogo(null);
      return;
    }
    if (config.logoRounded) {
      applyRoundedCorners(logoDataUrl).then(setEffectiveLogo);
    } else {
      setEffectiveLogo(logoDataUrl);
    }
  }, [logoDataUrl, config.logoRounded]);

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
      ...(effectiveLogo
        ? {
            image: effectiveLogo,
            imageOptions: {
              crossOrigin: 'anonymous' as const,
              margin: 2,
              imageSize: config.logoSizePct / 100,
            },
          }
        : {}),
    }),
    [config, effectiveLogo],
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

  const displaySize = Math.min(config.size, MAX_PREVIEW);
  const scale = displaySize / config.size;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Outer box clips to displaySize; inner div is the full-res QR scaled down */}
      <div
        className="rounded-lg overflow-hidden shadow-md"
        style={{ width: displaySize, height: displaySize, flexShrink: 0 }}
      >
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: config.size, height: config.size }}>
          <div ref={containerRef} />
        </div>
      </div>
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
