export const theme = {
  colors: {
    primary: '#22c55e',
    secondary: '#3A416C',
    background: '#111827',
    tileBackground: '#090d15ff',
    textPrimary: '#f1f1f1ff',
    textSecondary: '#6b7280',
    error: '#ff4757',
    success: '#2ed573',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
    extraLarge: 32,
  },
  fontSizes: {
    small: 14,
    medium: 18,
    large: 24,
    extraLarge: 32,
  },
  fontWeights: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
  fontFamilies: {
    // Professional system fonts (fallbacks)
    primary: 'Inter_400Regular',
    primaryBold: 'Inter_600SemiBold',
    secondary: 'Roboto_400Regular',
    secondaryBold: 'Roboto_500Medium',
    // System font fallbacks
    system: 'System',
    systemBold: 'System',
  },
};