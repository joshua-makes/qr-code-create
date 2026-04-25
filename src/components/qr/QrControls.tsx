'use client';

import { QrConfig, EccLevel, DotStyle, CornerSquareStyle, CornerDotStyle, QrShape } from '@/lib/qr';
import { Label } from '@/components/ui/Label';
import { Slider } from '@/components/ui/Slider';
import { Select } from '@/components/ui/Select';
import { ColorInput } from '@/components/ui/ColorInput';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { clamp } from '@/lib/utils';

interface QrControlsProps {
  config: QrConfig;
  onChange: (updates: Partial<QrConfig>) => void;
}

const COLOR_PRESETS = [
  { label: 'Classic', fg: '#000000', bg: '#ffffff' },
  { label: 'Slate',   fg: '#1e293b', bg: '#f8fafc' },
  { label: 'Navy',    fg: '#1e3a5f', bg: '#dbeafe' },
  { label: 'Forest',  fg: '#14532d', bg: '#dcfce7' },
  { label: 'Crimson', fg: '#7f1d1d', bg: '#fee2e2' },
  { label: 'Violet',  fg: '#3b0764', bg: '#f3e8ff' },
  { label: 'Teal',    fg: '#134e4a', bg: '#ccfbf1' },
  { label: 'Amber',   fg: '#78350f', bg: '#fef3c7' },
] as const;

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

        {/* Download Resolution */}
        <div className="space-y-2">
          <Label>Download Resolution</Label>
          <div className="flex gap-2">
            {([256, 512, 1024] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChange({ size: s })}
                className={`flex-1 rounded-md border px-2 py-2 text-sm font-medium transition-colors ${
                  config.size === s
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span className="block">{s === 256 ? 'Small' : s === 512 ? 'Medium' : 'Large'}</span>
                <span className="block text-xs opacity-70">{s}px</span>
              </button>
            ))}
          </div>
        </div>

        {/* Shape */}
        <div className="space-y-2">
          <Label>Shape</Label>
          <div className="flex gap-2">
            {(['square', 'circle'] as QrShape[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChange({ shape: s })}
                className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                  config.shape === s
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Dot Style */}
        <div className="space-y-2">
          <Label htmlFor="qr-dot-style">Dot Style</Label>
          <Select
            id="qr-dot-style"
            value={config.dotStyle}
            onChange={(e) => onChange({ dotStyle: e.target.value as DotStyle })}
          >
            <option value="square">Square</option>
            <option value="dots">Dots</option>
            <option value="rounded">Rounded</option>
            <option value="extra-rounded">Extra Rounded</option>
            <option value="classy">Classy</option>
            <option value="classy-rounded">Classy Rounded</option>
          </Select>
        </div>

        {/* Corner Styles */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="qr-corner-sq">Corner Squares</Label>
            <Select
              id="qr-corner-sq"
              value={config.cornerSquareStyle}
              onChange={(e) => onChange({ cornerSquareStyle: e.target.value as CornerSquareStyle })}
            >
              <option value="square">Square</option>
              <option value="extra-rounded">Rounded</option>
              <option value="dot">Dot</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="qr-corner-dot">Corner Dots</Label>
            <Select
              id="qr-corner-dot"
              value={config.cornerDotStyle}
              onChange={(e) => onChange({ cornerDotStyle: e.target.value as CornerDotStyle })}
            >
              <option value="square">Square</option>
              <option value="dot">Dot</option>
            </Select>
          </div>
        </div>

        {/* Margin */}
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

        {/* Error Correction */}
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

        {/* Color Presets */}
        <div className="space-y-2">
          <Label>Color Presets</Label>
          <div className="flex flex-wrap gap-2">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                title={preset.label}
                onClick={() => onChange({ fgColor: preset.fg, bgColor: preset.bg, bgTransparent: false })}
                className="relative h-8 w-8 rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ background: preset.bg }}
              >
                <span
                  className="absolute inset-[25%] rounded-sm"
                  style={{ background: preset.fg }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
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
                disabled={config.bgTransparent}
                className={config.bgTransparent ? 'opacity-40 cursor-not-allowed' : ''}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                {config.bgTransparent ? 'transparent' : config.bgColor}
              </span>
            </div>
          </div>
        </div>

        {/* Transparent Background */}
        <div className="flex items-center justify-between">
          <Label htmlFor="bg-transparent">Transparent background</Label>
          <Toggle
            id="bg-transparent"
            checked={config.bgTransparent}
            onChange={(checked) => onChange({ bgTransparent: checked })}
          />
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
