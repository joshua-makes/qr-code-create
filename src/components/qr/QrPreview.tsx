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

const FALLBACK_LOGO_SIZE = 256;

/** Draws the image onto a canvas with rounded corners and returns a new data URL. */
function applyRoundedCorners(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onerror = () => resolve(dataUrl);
    img.onload = () => {
      // SVG images may report 0 natural dimensions; fall back to a fixed size
      const w = img.naturalWidth > 0 ? img.naturalWidth : FALLBACK_LOGO_SIZE;
      const h = img.naturalHeight > 0 ? img.naturalHeight : FALLBACK_LOGO_SIZE;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(dataUrl); return; }
      const r = Math.min(w, h) * 0.2;
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(w - r, 0);
      ctx.quadraticCurveTo(w, 0, w, r);
      ctx.lineTo(w, h - r);
      ctx.quadraticCurveTo(w, h, w - r, h);
      ctx.lineTo(r, h);
      ctx.quadraticCurveTo(0, h, 0, h - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 0, 0, w, h);
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
      shape: config.shape as 'square' | 'circle',
      qrOptions: {
        errorCorrectionLevel: eccMap[config.ecc] ?? 'M',
      },
      dotsOptions: {
        color: config.fgColor,
        type: config.dotStyle as 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded',
      },
      cornersSquareOptions: {
        type: config.cornerSquareStyle as 'square' | 'extra-rounded' | 'dot',
      },
      cornersDotOptions: {
        type: config.cornerDotStyle as 'square' | 'dot',
      },
      backgroundOptions: {
        color: config.bgTransparent ? 'transparent' : config.bgColor,
      },
      ...(effectiveLogo
        ? {
            image: effectiveLogo,
            imageOptions: {
              crossOrigin: 'anonymous' as const,
              margin: 2,
              // imageSize is a coverage coefficient, not a pixel percentage.
              // Formula: imageSize = (pct/100)^2 * 4 makes the logo visually
              // occupy ~logoSizePct% of the QR width (calibrated for Q ECC).
              imageSize: Math.pow(config.logoSizePct / 100, 2) * 4,
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

  const [copied, setCopied] = useState(false);
  const handleCopyToClipboard = () => {
    const canvas = containerRef.current?.querySelector('canvas');
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard API unavailable
      }
    }, 'image/png');
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
        <Button onClick={handleCopyToClipboard} variant="secondary" className="flex-1">
          {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          )}
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
    </div>
  );
}
