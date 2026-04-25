'use client';

import { useRef } from 'react';
import { QrConfig } from '@/lib/qr';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface LogoSectionProps {
  config: QrConfig;
  logoDataUrl: string | null;
  onChange: (updates: Partial<QrConfig>) => void;
  onLogoChange: (dataUrl: string | null) => void;
}

/** Plain section content — no Card wrapper. Used inside the tab layout. */
export function LogoSection({ config, logoDataUrl, onChange, onLogoChange }: LogoSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result;
      if (typeof result === 'string') onLogoChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onLogoChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-5">
      {/* Upload */}
      <div className="space-y-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Upload Logo
        </p>
        <input
          ref={fileInputRef}
          id="logo-upload"
          type="file"
          accept="image/png,image/svg+xml"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600 dark:text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-blue-600 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400 cursor-pointer"
        />
        <p className="text-xs text-gray-400">PNG or SVG recommended</p>
      </div>

      {logoDataUrl && (
        <>
          {/* Preview + remove */}
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 p-3">
            <img
              src={logoDataUrl}
              alt="Logo preview"
              className="h-14 w-14 rounded-lg object-contain border border-gray-200 dark:border-gray-700 bg-white"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">Logo uploaded</p>
              <p className="text-xs text-gray-400">Embedded at center</p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleRemove}>
              Remove
            </Button>
          </div>

          {/* Size */}
          <div className="space-y-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Logo Size</p>
            <div className="grid grid-cols-3 gap-2">
              {([
                { label: 'Small',  value: 15 },
                { label: 'Medium', value: 28 },
                { label: 'Large',  value: 42 },
              ] as const).map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onChange({ logoSizePct: value })}
                  className={`rounded-lg border px-2 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    config.logoSizePct === value
                      ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-200 dark:hover:border-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Rounded corners */}
          <div className="flex items-center justify-between">
            <Label htmlFor="logo-rounded" className="text-sm text-gray-700 dark:text-gray-300">
              Rounded corners
            </Label>
            <Toggle
              id="logo-rounded"
              checked={config.logoRounded}
              onChange={(checked) => onChange({ logoRounded: checked })}
            />
          </div>
        </>
      )}
    </div>
  );
}

/** Card-wrapped version — kept for backwards compatibility. */
export function LogoUploader({ config, logoDataUrl, onChange, onLogoChange }: LogoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Logo</h2>
      </CardHeader>
      <CardContent>
        <LogoSection config={config} logoDataUrl={logoDataUrl} onChange={onChange} onLogoChange={onLogoChange} />
      </CardContent>
    </Card>
  );
}

