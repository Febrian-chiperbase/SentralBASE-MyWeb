// Package Theme Utility
export const getPackageTheme = (packageName) => {
  const themes = {
    starter: {
      name: 'starter',
      displayName: 'SentraBASE Starter',
      description: 'Paket dasar untuk klinik kecil',
      icon: '🚀',
      colors: {
        primary: '#3b82f6',
        secondary: '#1d4ed8',
        light: '#dbeafe',
        lighter: '#eff6ff',
        text: '#1e40af',
        gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        gradientHover: 'linear-gradient(135deg, #2563eb, #1e40af)',
        shadow: 'rgba(59, 130, 246, 0.3)',
        border: '#93c5fd'
      },
      badge: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-200'
      }
    },
    professional: {
      name: 'professional',
      displayName: 'SentraBASE Professional',
      description: 'Paket lengkap untuk klinik menengah',
      icon: '👑',
      colors: {
        primary: '#10b981',
        secondary: '#047857',
        light: '#d1fae5',
        lighter: '#ecfdf5',
        text: '#065f46',
        gradient: 'linear-gradient(135deg, #10b981, #047857)',
        gradientHover: 'linear-gradient(135deg, #059669, #065f46)',
        shadow: 'rgba(16, 185, 129, 0.3)',
        border: '#86efac'
      },
      badge: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-200'
      }
    },
    enterprise: {
      name: 'enterprise',
      displayName: 'SentraBASE Enterprise',
      description: 'Solusi kustomisasi untuk klinik besar',
      icon: '🛡️',
      colors: {
        primary: '#6d28d9',
        secondary: '#5b21b6',
        light: '#e9d5ff',
        lighter: '#f3e8ff',
        text: '#4c1d95',
        gradient: 'linear-gradient(135deg, #6d28d9, #5b21b6)',
        gradientHover: 'linear-gradient(135deg, #5b21b6, #4c1d95)',
        shadow: 'rgba(109, 40, 217, 0.4)',
        border: '#c4b5fd'
      },
      badge: {
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        border: 'border-purple-200'
      }
    },
    // Alias untuk berbagai nama paket yang mungkin
    basic: 'starter',
    standard: 'professional',
    premium: 'enterprise',
    custom: 'enterprise',
    kustomisasi: 'enterprise'
  };

  // Normalize package name
  const normalizedName = packageName?.toLowerCase().trim();
  
  // Check if it's an alias
  if (themes[normalizedName] && typeof themes[normalizedName] === 'string') {
    return themes[themes[normalizedName]];
  }
  
  // Return theme or default to starter
  return themes[normalizedName] || themes.starter;
};

// Get theme-specific CSS classes
export const getPackageClasses = (packageName) => {
  const theme = getPackageTheme(packageName);
  
  return {
    banner: `package-banner package-banner-${theme.name}`,
    badge: `${theme.badge.bg} ${theme.badge.text} ${theme.badge.border}`,
    button: `package-button package-button-${theme.name}`,
    icon: `package-icon package-icon-${theme.name}`,
    stats: `stats-theme-${theme.name}`
  };
};

// Generate dynamic CSS variables for theme
export const getPackageCSS = (packageName) => {
  const theme = getPackageTheme(packageName);
  
  return {
    '--package-primary': theme.colors.primary,
    '--package-secondary': theme.colors.secondary,
    '--package-light': theme.colors.light,
    '--package-lighter': theme.colors.lighter,
    '--package-text': theme.colors.text,
    '--package-gradient': theme.colors.gradient,
    '--package-gradient-hover': theme.colors.gradientHover,
    '--package-shadow': theme.colors.shadow,
    '--package-border': theme.colors.border
  };
};

// Get package-specific icon component
export const getPackageIcon = (packageName) => {
  const theme = getPackageTheme(packageName);
  return theme.icon;
};

// Get package display info
export const getPackageDisplayInfo = (packageName) => {
  const theme = getPackageTheme(packageName);
  return {
    displayName: theme.displayName,
    description: theme.description,
    icon: theme.icon,
    theme: theme.name
  };
};
