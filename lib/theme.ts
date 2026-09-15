import prisma from './prisma';

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgDark: string;
  bgSurface: string;
  textPrimary: string;
  textMuted: string;
  fontFamily: string;
  borderRadius: string;
  siteName: string;
  tagline: string;
}

export const defaultTheme: ThemeConfig = {
  primaryColor: '#6C47FF',
  secondaryColor: '#FF6B6B',
  accentColor: '#00D4AA',
  bgDark: '#0A0A12',
  bgSurface: '#13131F',
  textPrimary: '#F6F6FD',
  textMuted: '#8E8EA8',
  fontFamily: 'Inter',
  borderRadius: '12px',
  siteName: 'DigiVault',
  tagline: 'Direct E-Books & High-Value PDF Knowledge Products',
};

export async function getTheme(): Promise<ThemeConfig> {
  try {
    const setting = await prisma.platformSettings.findUnique({
      where: { key: 'site_theme' },
    });
    if (setting && setting.value) {
      const parsed = JSON.parse(setting.value);
      return { ...defaultTheme, ...parsed };
    }
  } catch (error) {
    console.error('Error reading theme from DB:', error);
  }
  return defaultTheme;
}

export async function saveTheme(newTheme: Partial<ThemeConfig>): Promise<ThemeConfig> {
  const current = await getTheme();
  const merged: ThemeConfig = { ...current, ...newTheme };

  await prisma.platformSettings.upsert({
    where: { key: 'site_theme' },
    update: { value: JSON.stringify(merged), updatedAt: new Date() },
    create: { key: 'site_theme', value: JSON.stringify(merged), updatedAt: new Date() },
  });

  return merged;
}

export function themeToCss(theme: ThemeConfig): string {
  return `
    :root {
      --brand-primary: ${theme.primaryColor};
      --brand-primary-glow: ${theme.primaryColor}33;
      --brand-secondary: ${theme.secondaryColor};
      --brand-accent: ${theme.accentColor};
      --brand-accent-glow: ${theme.accentColor}33;
      --bg-dark: ${theme.bgDark};
      --bg-surface: ${theme.bgSurface};
      --bg-card: ${theme.bgSurface};
      --text-primary: ${theme.textPrimary};
      --text-muted: ${theme.textMuted};
      --border-color: rgba(255, 255, 255, 0.08);
      --border-focus: ${theme.primaryColor}88;
      --border-radius: ${theme.borderRadius};
      --font-family: '${theme.fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
  `.replace(/\s+/g, ' ');
}