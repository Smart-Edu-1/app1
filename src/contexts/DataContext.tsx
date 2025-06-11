
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

interface DataContextType {
  subjects: Subject[];
  codes: ActivationCode[];
  addCode: (code: string) => void;
  removeCode: (id: string) => void;
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

  const value: DataContextType = {
    subjects,
    codes,
    addCode,
    removeCode
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
