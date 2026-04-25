'use client';

import { useRef } from 'react';
import { QrConfig } from '@/lib/qr';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface LogoUploaderProps {
  config: QrConfig;
  logoDataUrl: string | null;
  onChange: (updates: Partial<QrConfig>) => void;
  onLogoChange: (dataUrl: string | null) => void;
}

export function LogoUploader({ config, logoDataUrl, onChange, onLogoChange }: LogoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result;
      if (typeof result === 'string') {
        onLogoChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onLogoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Logo</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="logo-upload">Upload Logo (PNG or SVG)</Label>
          <input
            ref={fileInputRef}
            id="logo-upload"
            type="file"
            accept="image/png,image/svg+xml"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 dark:text-gray-400 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-blue-600 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400"
          />
        </div>

        {logoDataUrl && (
          <>
            <div className="flex items-center gap-3">
              <img
                src={logoDataUrl}
                alt="Logo preview"
                className="h-12 w-12 rounded object-contain border border-gray-200 dark:border-gray-700 bg-white"
              />
              <Button variant="secondary" size="sm" onClick={handleRemove}>
                Remove
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Logo Size</Label>
              <div className="flex gap-2">
                {([{ label: 'Small', value: 20 }, { label: 'Medium', value: 30 }, { label: 'Large', value: 40 }] as const).map(({ label, value }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onChange({ logoSizePct: value })}
                    className={`flex-1 rounded-md border px-2 py-2 text-sm font-medium transition-colors ${
                      config.logoSizePct === value
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="logo-rounded">Rounded corners</Label>
              <Toggle
                id="logo-rounded"
                checked={config.logoRounded}
                onChange={(checked) => onChange({ logoRounded: checked })}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
