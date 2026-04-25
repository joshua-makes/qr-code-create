export type EccLevel = 'L' | 'M' | 'Q' | 'H';
export type DotStyle = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
export type CornerSquareStyle = 'square' | 'extra-rounded' | 'dot';
export type CornerDotStyle = 'square' | 'dot';
export type QrShape = 'square' | 'circle';

export interface QrConfig {
  text: string;
  size: number;
  margin: number;
  ecc: EccLevel;
  fgColor: string;
  bgColor: string;
  bgTransparent: boolean;
  logoSizePct: number;
  logoRounded: boolean;
  dotStyle: DotStyle;
  cornerSquareStyle: CornerSquareStyle;
  cornerDotStyle: CornerDotStyle;
  shape: QrShape;
}

export const defaultConfig: QrConfig = {
  text: 'https://example.com',
  size: 512,
  margin: 2,
  ecc: 'M',
  fgColor: '#000000',
  bgColor: '#ffffff',
  bgTransparent: false,
  logoSizePct: 15,
  logoRounded: false,
  dotStyle: 'square',
  cornerSquareStyle: 'square',
  cornerDotStyle: 'square',
  shape: 'square',
};

export function encodeConfig(cfg: Omit<QrConfig, 'text'> & { text?: string }): string {
  return btoa(JSON.stringify(cfg));
}

export function decodeConfig(encoded: string): Partial<QrConfig> {
  try {
    return JSON.parse(atob(encoded)) as Partial<QrConfig>;
  } catch {
    return {};
  }
}

export function enforceEccForLogo(ecc: EccLevel, hasLogo: boolean): EccLevel {
  if (!hasLogo) return ecc;
  if (ecc === 'L' || ecc === 'M') return 'Q';
  return ecc;
}

export function isLogoTooLarge(sizePct: number): boolean {
  return sizePct > 40;
}
