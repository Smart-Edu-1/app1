
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface ActivationCode {
  id: string;
  code: string;
  isUsed: boolean;
  createdAt: string;
}

interface AppSettings {
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
}

interface DataContextType {
  subjects: Subject[];
  codes: ActivationCode[];
  settings: AppSettings;
  addCode: (code: string) => void;
  removeCode: (id: string) => void;
  updateSettings: (newSettings: AppSettings) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [subjects] = useState<Subject[]>([
    {
      id: '1',
      name: 'الفيزياء',
      description: 'دروس وتمارين في الفيزياء',
      icon: '⚛️',
      color: '#3B82F6'
    },
    {
      id: '2',
      name: 'الرياضيات',
      description: 'دروس وتمارين في الرياضيات',
      icon: '📐',
      color: '#10B981'
    },
    {
      id: '3',
      name: 'الكيمياء',
      description: 'دروس وتمارين في الكيمياء',
      icon: '🧪',
      color: '#F59E0B'
    }
  ]);

  const [codes, setCodes] = useState<ActivationCode[]>([]);
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    const savedSettings = localStorage.getItem('smartedu_settings');
    return savedSettings ? JSON.parse(savedSettings) : {
      appName: 'Smart Edu',
      aboutText: 'منصة التعليم الذكية التي تهدف إلى تطوير مهارات الطلاب في المواد العلمية',
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
      contactMethods: [
        'واتساب: +963 123 456 789',
        'تليجرام: @smartedu_support',
        'بريد إلكتروني: support@smartedu.com'
      ]
    };
  });

  useEffect(() => {
    // Initialize default codes if none exist
    const existingCodes = localStorage.getItem('smartedu_codes');
    if (!existingCodes) {
      const defaultCodes = [
        {
          id: '1',
          code: 'EDU2024',
          isUsed: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          code: 'SMART123',
          isUsed: false,
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('smartedu_codes', JSON.stringify(defaultCodes));
      setCodes(defaultCodes);
    } else {
      setCodes(JSON.parse(existingCodes));
    }
  }, []);

  const addCode = (code: string) => {
    const newCode: ActivationCode = {
      id: Date.now().toString(),
      code,
      isUsed: false,
      createdAt: new Date().toISOString()
    };
    
    const updatedCodes = [...codes, newCode];
    setCodes(updatedCodes);
    localStorage.setItem('smartedu_codes', JSON.stringify(updatedCodes));
  };

  const removeCode = (id: string) => {
    const updatedCodes = codes.filter(code => code.id !== id);
    setCodes(updatedCodes);
    localStorage.setItem('smartedu_codes', JSON.stringify(updatedCodes));
  };

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('smartedu_settings', JSON.stringify(newSettings));
  };

  const value: DataContextType = {
    subjects,
    codes,
    settings,
    addCode,
    removeCode,
    updateSettings
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
