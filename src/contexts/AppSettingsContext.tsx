import React, { createContext, useContext, ReactNode } from 'react';
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
  adminCredentials: {
    username: 'admin',
    password: 'admin123'
  }
});

interface AppSettingsProviderProps {
  children: ReactNode;
}

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
    adminCredentials: appSettings.adminCredentials || {
      username: 'admin',
      password: 'admin123'
    }
  };

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