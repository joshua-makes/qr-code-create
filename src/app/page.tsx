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
import { QrContentSection, QrStyleSection, QrExportSection } from '@/components/qr/QrControls';
import { LogoSection } from '@/components/qr/LogoUploader';
import { ShareLinkButton } from '@/components/qr/ShareLinkButton';

type Tab = 'content' | 'style' | 'logo' | 'export';

const TABS: { id: Tab; label: string }[] = [
  { id: 'content', label: 'Content' },
  { id: 'style',   label: 'Style' },
  { id: 'logo',    label: 'Logo' },
  { id: 'export',  label: 'Export' },
];

const QrPreview = dynamic(
  () => import('@/components/qr/QrPreview').then((m) => m.QrPreview),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 w-72 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
    ),
  },
);

export default function Home() {
  const [config, setConfig] = useState<QrConfig>(defaultConfig);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [debouncedConfig, setDebouncedConfig] = useState<QrConfig>(defaultConfig);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('content');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    const cfgParam = params.get('cfg');
    if (cfgParam) {
      const decoded = decodeConfig(cfgParam);
      setConfig((prev) => ({ ...prev, ...decoded }));
    }
  }, []);

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
  const displayConfig = { ...config, ecc: effectiveEcc };

  if (!mounted) {
    return (
      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="hidden lg:block lg:w-[400px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800" />
        <div className="flex-1 bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
          <div className="h-72 w-72 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row" style={{ minHeight: 'calc(100vh - 64px)' }}>

      {/* ── Sidebar ─────────────────────────────────── */}
      <aside className="flex-shrink-0 w-full lg:w-[400px] flex flex-col bg-white dark:bg-gray-900 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 lg:overflow-hidden">

        {/* Tab bar */}
        <nav className="flex shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 py-3.5 text-sm font-medium transition-colors focus-visible:outline-none ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
              {tab.id === 'logo' && logoDataUrl && (
                <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-blue-500 align-middle" />
              )}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-t-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Warning */}
        {logoTooLarge && (
          <div
            role="alert"
            aria-live="polite"
            className="mx-4 mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800 dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-400 shrink-0"
          >
            <span className="mt-px">⚠️</span>
            <span>Large logo may reduce scannability — consider Medium.</span>
          </div>
        )}

        {/* Tab content */}
        <div className="flex-1 lg:overflow-y-auto p-5 [scrollbar-width:thin]">
          {activeTab === 'content' && (
            <QrContentSection config={displayConfig} onChange={handleConfigChange} />
          )}
          {activeTab === 'style' && (
            <QrStyleSection config={displayConfig} onChange={handleConfigChange} />
          )}
          {activeTab === 'logo' && (
            <LogoSection
              config={displayConfig}
              logoDataUrl={logoDataUrl}
              onChange={handleConfigChange}
              onLogoChange={handleLogoChange}
            />
          )}
          {activeTab === 'export' && (
            <QrExportSection config={displayConfig} onChange={handleConfigChange} />
          )}
        </div>

        {/* Sidebar footer */}
        <div className="shrink-0 border-t border-gray-200 dark:border-gray-800 p-4">
          <ShareLinkButton config={displayConfig} />
        </div>
      </aside>

      {/* ── Preview pane ─────────────────────────────── */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-6 lg:p-10 overflow-hidden bg-gray-50 dark:bg-gray-950">
        {/* Dot grid decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.35) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-5 w-full max-w-md">
          {/* Preview header */}
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Preview
            </span>
            <span className="text-xs font-mono bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 px-2.5 py-0.5 rounded-full shadow-sm">
              {debouncedConfig.size}px
            </span>
          </div>

          {/* QR code */}
          <QrPreview config={debouncedConfig} logoDataUrl={logoDataUrl} />
        </div>
      </main>

    </div>
  );
}


