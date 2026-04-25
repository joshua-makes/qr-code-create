'use client';

import { QrConfig, EccLevel } from '@/lib/qr';
import { Label } from '@/components/ui/Label';
import { Slider } from '@/components/ui/Slider';
import { Select } from '@/components/ui/Select';
import { ColorInput } from '@/components/ui/ColorInput';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { clamp } from '@/lib/utils';

interface QrControlsProps {
  config: QrConfig;
  onChange: (updates: Partial<QrConfig>) => void;
}

export function QrContentCard({ config, onChange }: QrControlsProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Content</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="qr-text">URL or Text</Label>
          <textarea
            id="qr-text"
            value={config.text}
            onChange={(e) => onChange({ text: e.target.value })}
            maxLength={2000}
            rows={3}
            placeholder="https://example.com"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 resize-none"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
            {config.text.length} / 2000
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function QrAppearanceCard({ config, onChange }: QrControlsProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Appearance</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="qr-size">Download Resolution: {config.size}px</Label>
          </div>
          <Slider
            id="qr-size"
            min={128}
            max={1024}
            step={8}
            value={config.size}
            onChange={(e) => onChange({ size: clamp(Number(e.target.value), 128, 1024) })}
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>128px</span>
            <span>1024px (high res)</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="qr-margin">Margin: {config.margin}</Label>
          </div>
          <Slider
            id="qr-margin"
            min={0}
            max={8}
            step={1}
            value={config.margin}
            onChange={(e) => onChange({ margin: clamp(Number(e.target.value), 0, 8) })}
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>0</span>
            <span>8</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="qr-ecc">Error Correction</Label>
          <Select
            id="qr-ecc"
            value={config.ecc}
            onChange={(e) => onChange({ ecc: e.target.value as EccLevel })}
          >
            <option value="L">L — Low (7%)</option>
            <option value="M">M — Medium (15%)</option>
            <option value="Q">Q — Quartile (25%)</option>
            <option value="H">H — High (30%)</option>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="qr-fg">Foreground</Label>
            <div className="flex items-center gap-2">
              <ColorInput
                id="qr-fg"
                value={config.fgColor}
                onChange={(e) => onChange({ fgColor: e.target.value })}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">{config.fgColor}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="qr-bg">Background</Label>
            <div className="flex items-center gap-2">
              <ColorInput
                id="qr-bg"
                value={config.bgColor}
                onChange={(e) => onChange({ bgColor: e.target.value })}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">{config.bgColor}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/** @deprecated Use QrContentCard + QrAppearanceCard separately */
export function QrControls({ config, onChange }: QrControlsProps) {
  return (
    <div className="space-y-4">
      <QrContentCard config={config} onChange={onChange} />
      <QrAppearanceCard config={config} onChange={onChange} />
    </div>
  );
}
