export type EccLevel = 'L' | 'M' | 'Q' | 'H';

export interface QrConfig {
  text: string;
  size: number;
  margin: number;
  ecc: EccLevel;
  fgColor: string;
  bgColor: string;
  logoSizePct: number;
  logoRounded: boolean;
}

export const defaultConfig: QrConfig = {
  text: 'https://example.com',
  size: 300,
  margin: 2,
  ecc: 'M',
  fgColor: '#000000',
  bgColor: '#ffffff',
  logoSizePct: 20,
  logoRounded: false,
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
