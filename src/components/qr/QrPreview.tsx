'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import type { QrConfig } from '@/lib/qr';

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

const MAX_PREVIEW = 540;

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
              margin: 4,
              imageSize: config.logoSizePct / 100,
              hideBackgroundDots: true,
            },
          }
        : {}),
    }),
    [config, effectiveLogo],
  );

  const [overflowError, setOverflowError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    try {
      setOverflowError(false);
      // Always recreate — qr-code-styling's update() doesn't reliably apply imageSize changes
      containerRef.current.innerHTML = '';
      qrRef.current = new QRCodeStyling(getOptions());
      qrRef.current.append(containerRef.current);
    } catch {
      setOverflowError(true);
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
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Canvas — shadow/rounding here; checkerboard when transparent */}
      <div
        className={`overflow-hidden rounded-2xl shadow-2xl ${
          config.bgTransparent
            ? 'bg-checkerboard ring-1 ring-gray-200 dark:ring-gray-700'
            : 'ring-1 ring-black/5 dark:ring-white/5'
        }`}
        style={{ width: displaySize, height: displaySize, flexShrink: 0 }}
      >
        {overflowError ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gray-50 dark:bg-gray-900 px-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Text too long for this QR code</p>
            <p className="text-xs text-gray-400">Shorten your text, or switch to a lower error correction level in the Export tab.</p>
          </div>
        ) : (
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              width: config.size,
              height: config.size,
            }}
          >
            <div ref={containerRef} />
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleDownloadPng}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          PNG
        </button>
        <button
          onClick={handleDownloadSvg}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          SVG
        </button>
        <button
          onClick={handleCopyToClipboard}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          )}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
