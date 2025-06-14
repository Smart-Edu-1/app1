import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useSupabaseAppData } from './SupabaseAppDataContext';

interface AppSettingsContextType {
  appName: string;
  aboutText: string;
  subscriptionPrices: {
    monthly: number;
    quarterly: number;
    yearly: number;
  };
  themeColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  contactMethods: string[];
  subscriptionPlans: any[];
  supportContacts: {
    whatsapp: string;
    telegram: string;
    phone: string;
  };
  adminCredentials: {
    username: string;
    password: string;
  };
}

const AppSettingsContext = createContext<AppSettingsContextType>({
  appName: 'منصة التعلم',
  aboutText: 'منصة تعليمية شاملة تقدم أفضل المحتوى التعليمي',
  subscriptionPrices: {
    monthly: 9.99,
    quarterly: 24.99,
    yearly: 89.99
  },
  themeColors: {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B'
  },
  contactMethods: [],
  subscriptionPlans: [],
  supportContacts: {
    whatsapp: '',
    telegram: '',
    phone: ''
  },
  adminCredentials: {
    username: 'admin',
    password: 'admin123'
  }
});

interface AppSettingsProviderProps {
  children: ReactNode;
}

const hexToHsl = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

export const AppSettingsProvider: React.FC<AppSettingsProviderProps> = ({ children }) => {
  const { appSettings } = useSupabaseAppData();

  const value: AppSettingsContextType = {
    appName: appSettings.appName || 'منصة التعلم',
    aboutText: appSettings.aboutText || 'منصة تعليمية شاملة تقدم أفضل المحتوى التعليمي',
    subscriptionPrices: appSettings.subscriptionPrices || {
      monthly: 9.99,
      quarterly: 24.99,
      yearly: 89.99
    },
    themeColors: appSettings.themeColors || {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#F59E0B'
    },
    contactMethods: appSettings.contactMethods || [],
    subscriptionPlans: appSettings.subscriptionPlans || [],
    supportContacts: appSettings.supportContacts || {
      whatsapp: '',
      telegram: '',
      phone: ''
    },
    adminCredentials: appSettings.adminCredentials || {
      username: 'admin',
      password: 'admin123'
    }
  };

  // Apply theme colors to CSS variables
  useEffect(() => {
    if (value.themeColors) {
      const root = document.documentElement;
      
      if (value.themeColors.primary) {
        const primaryHsl = hexToHsl(value.themeColors.primary);
        root.style.setProperty('--primary', primaryHsl);
        root.style.setProperty('--ring', primaryHsl);
      }
      
      if (value.themeColors.secondary) {
        const secondaryHsl = hexToHsl(value.themeColors.secondary);
        root.style.setProperty('--secondary', secondaryHsl);
      }
      
      if (value.themeColors.accent) {
        const accentHsl = hexToHsl(value.themeColors.accent);
        root.style.setProperty('--accent', accentHsl);
      }
    }
  }, [value.themeColors]);

  // Update page title with app name
  useEffect(() => {
    if (value.appName) {
      document.title = value.appName;
    }
  }, [value.appName]);

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = (): AppSettingsContextType => {
  const context = useContext(AppSettingsContext);
  return context;
};