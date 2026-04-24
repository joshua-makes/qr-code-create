const THEME_KEY = 'qr-theme';

export function getStoredTheme(): 'dark' | 'light' | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return null;
}

export function setStoredTheme(theme: 'dark' | 'light'): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_KEY, theme);
}
