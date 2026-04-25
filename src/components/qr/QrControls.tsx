'use client';

import { QrConfig, EccLevel, DotStyle, CornerSquareStyle, CornerDotStyle, QrShape } from '@/lib/qr';
import { Label } from '@/components/ui/Label';
import { Slider } from '@/components/ui/Slider';
import { Select } from '@/components/ui/Select';
import { ColorInput } from '@/components/ui/ColorInput';
import { Toggle } from '@/components/ui/Toggle';
import { clamp } from '@/lib/utils';

interface SectionProps {
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
      {children}
    </p>
  );
}

const PRESET_BTN = (active: boolean) =>
  `rounded-lg border px-3 py-2.5 text-sm font-medium capitalize transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
    active
      ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-200 dark:hover:border-gray-600'
  }`;

export function QrContentSection({ config, onChange }: SectionProps) {
  return (
    <div className="space-y-3">
      <SectionLabel>URL or Text</SectionLabel>
      <textarea
        id="qr-text"
        value={config.text}
        onChange={(e) => onChange({ text: e.target.value })}
        maxLength={2000}
        rows={5}
        placeholder="https://example.com"
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:bg-gray-800 resize-none transition-colors"
      />
      <p className="text-xs text-gray-400 text-right tabular-nums">{config.text.length} / 2000</p>
    </div>
  );
}

export function QrStyleSection({ config, onChange }: SectionProps) {
  return (
    <div className="space-y-6">

      {/* Shape */}
      <div className="space-y-2.5">
        <SectionLabel>Shape</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          {(['square', 'circle'] as QrShape[]).map((s) => (
            <button key={s} type="button" onClick={() => onChange({ shape: s })} className={PRESET_BTN(config.shape === s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Dot Style */}
      <div className="space-y-2.5">
        <SectionLabel>Dot Style</SectionLabel>
        <Select id="qr-dot-style" value={config.dotStyle} onChange={(e) => onChange({ dotStyle: e.target.value as DotStyle })}>
          <option value="square">Square</option>
          <option value="dots">Dots</option>
          <option value="rounded">Rounded</option>
          <option value="extra-rounded">Extra Rounded</option>
          <option value="classy">Classy</option>
          <option value="classy-rounded">Classy Rounded</option>
        </Select>
      </div>

      {/* Corners */}
      <div className="space-y-2.5">
        <SectionLabel>Corners</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="qr-corner-sq" className="text-xs text-gray-500 dark:text-gray-400">Squares</Label>
            <Select id="qr-corner-sq" value={config.cornerSquareStyle} onChange={(e) => onChange({ cornerSquareStyle: e.target.value as CornerSquareStyle })}>
              <option value="square">Square</option>
              <option value="extra-rounded">Rounded</option>
              <option value="dot">Dot</option>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="qr-corner-dot" className="text-xs text-gray-500 dark:text-gray-400">Inner Dots</Label>
            <Select id="qr-corner-dot" value={config.cornerDotStyle} onChange={(e) => onChange({ cornerDotStyle: e.target.value as CornerDotStyle })}>
              <option value="square">Square</option>
              <option value="dot">Dot</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Color Presets */}
      <div className="space-y-2.5">
        <SectionLabel>Presets</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              title={preset.label}
              onClick={() => onChange({ fgColor: preset.fg, bgColor: preset.bg, bgTransparent: false })}
              className="relative h-9 w-9 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden hover:scale-110 hover:border-blue-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: preset.bg }}
            >
              <span className="absolute inset-[28%] rounded-sm" style={{ background: preset.fg }} />
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-2.5">
        <SectionLabel>Colors</SectionLabel>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="qr-fg" className="text-sm text-gray-700 dark:text-gray-300">Foreground</Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-mono">{config.fgColor}</span>
              <ColorInput id="qr-fg" value={config.fgColor} onChange={(e) => onChange({ fgColor: e.target.value })} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="qr-bg" className="text-sm text-gray-700 dark:text-gray-300">Background</Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-mono">{config.bgTransparent ? 'none' : config.bgColor}</span>
              <ColorInput
                id="qr-bg"
                value={config.bgColor}
                onChange={(e) => onChange({ bgColor: e.target.value })}
                disabled={config.bgTransparent}
                className={config.bgTransparent ? 'opacity-30 cursor-not-allowed' : ''}
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <Label htmlFor="bg-transparent" className="text-sm text-gray-700 dark:text-gray-300">Transparent background</Label>
            <Toggle id="bg-transparent" checked={config.bgTransparent} onChange={(checked) => onChange({ bgTransparent: checked })} />
          </div>
          {config.bgTransparent && (
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
              Both the background and the white gaps between QR modules will be transparent in the exported file.
            </p>
          )}
        </div>
      </div>

    </div>
  );
}

export function QrExportSection({ config, onChange }: SectionProps) {
  return (
    <div className="space-y-6">

      {/* Resolution */}
      <div className="space-y-2.5">
        <SectionLabel>Download Resolution</SectionLabel>
        <div className="grid grid-cols-3 gap-2">
          {([256, 512, 1024] as const).map((s) => (
            <button key={s} type="button" onClick={() => onChange({ size: s })} className={PRESET_BTN(config.size === s)}>
              <span className="block">{s === 256 ? 'Small' : s === 512 ? 'Medium' : 'Large'}</span>
              <span className="block text-xs opacity-60">{s}px</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quiet Zone */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <SectionLabel>Quiet Zone (margin)</SectionLabel>
          <span className="text-xs font-mono text-gray-400 tabular-nums">{config.margin}</span>
        </div>
        <Slider
          id="qr-margin"
          min={0} max={8} step={1} value={config.margin}
          onChange={(e) => onChange({ margin: clamp(Number(e.target.value), 0, 8) })}
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>None</span>
          <span>Large</span>
        </div>
      </div>

      {/* Error Correction */}
      <div className="space-y-2.5">
        <SectionLabel>Error Correction</SectionLabel>
        <Select id="qr-ecc" value={config.ecc} onChange={(e) => onChange({ ecc: e.target.value as EccLevel })}>
          <option value="L">Low — 7% recovery</option>
          <option value="M">Medium — 15% recovery</option>
          <option value="Q">Quartile — 25% recovery</option>
          <option value="H">High — 30% recovery</option>
        </Select>
        <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
          Higher levels let the QR scan correctly even if part of it is damaged or covered — required when embedding a logo. Higher levels make the code denser.
        </p>
      </div>

    </div>
  );
}

/** @deprecated — use QrContentSection / QrStyleSection / QrExportSection */
export function QrContentCard({ config, onChange }: SectionProps) {
  return <QrContentSection config={config} onChange={onChange} />;
}
export function QrAppearanceCard({ config, onChange }: SectionProps) {
  return (
    <div className="space-y-6">
      <QrStyleSection config={config} onChange={onChange} />
      <QrExportSection config={config} onChange={onChange} />
    </div>
  );
}
export function QrControls({ config, onChange }: SectionProps) {
  return (
    <div className="space-y-6">
      <QrContentCard config={config} onChange={onChange} />
      <QrAppearanceCard config={config} onChange={onChange} />
    </div>
  );
}

export type { SectionProps as QrControlsProps };

