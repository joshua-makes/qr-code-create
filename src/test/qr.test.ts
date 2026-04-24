import { describe, it, expect } from 'vitest';
import {
  encodeConfig,
  decodeConfig,
  enforceEccForLogo,
  isLogoTooLarge,
  defaultConfig,
  type QrConfig,
} from '@/lib/qr';

describe('encodeConfig / decodeConfig', () => {
  it('round-trips a full config', () => {
    const cfg: QrConfig = {
      text: 'https://example.com',
      size: 512,
      margin: 4,
      ecc: 'H',
      fgColor: '#123456',
      bgColor: '#abcdef',
      logoSizePct: 20,
      logoRounded: true,
    };
    expect(decodeConfig(encodeConfig(cfg))).toEqual(cfg);
  });

  it('round-trips default config', () => {
    expect(decodeConfig(encodeConfig(defaultConfig))).toEqual(defaultConfig);
  });

  it('returns empty object for invalid input', () => {
    expect(decodeConfig('not-valid-base64!!!')).toEqual({});
  });
});

describe('enforceEccForLogo', () => {
  it('upgrades L to Q when logo present', () => {
    expect(enforceEccForLogo('L', true)).toBe('Q');
  });

  it('upgrades M to Q when logo present', () => {
    expect(enforceEccForLogo('M', true)).toBe('Q');
  });

  it('leaves Q alone when logo present', () => {
    expect(enforceEccForLogo('Q', true)).toBe('Q');
  });

  it('leaves H alone when logo present', () => {
    expect(enforceEccForLogo('H', true)).toBe('H');
  });

  it('does not change ECC when no logo', () => {
    expect(enforceEccForLogo('L', false)).toBe('L');
    expect(enforceEccForLogo('M', false)).toBe('M');
  });
});

describe('isLogoTooLarge', () => {
  it('returns true when size > 25', () => {
    expect(isLogoTooLarge(26)).toBe(true);
    expect(isLogoTooLarge(30)).toBe(true);
  });

  it('returns false when size <= 25', () => {
    expect(isLogoTooLarge(25)).toBe(false);
    expect(isLogoTooLarge(20)).toBe(false);
  });
});
