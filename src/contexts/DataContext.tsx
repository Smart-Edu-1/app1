
import React, { createContext, useContext, useEffect, useState } from 'react';

interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface Unit {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  order: number;
}

interface Lesson {
  id: string;
  unitId: string;
  title: string;
  description: string;
  videoUrl: string;
  isPremium: boolean;
  order: number;
  teacherContact: string;
}

interface Question {
  id: string;
  text: string;
  type: 'multiple' | 'boolean';
  options?: string[];
  correctAnswer: string | boolean;
  image?: string;
}

interface Quiz {
  id: string;
  unitId: string;
  title: string;
  description: string;
  isPremium: boolean;
  questions: Question[];
  order: number;
}

interface ActivationCode {
  id: string;
  code: string;
  isUsed: boolean;
  usedBy?: string;
  createdAt: string;
  expiresAt: string;
  duration: number;
}

interface AppSettings {
  appName: string;
  aboutText: string;
  contactMethods: string[];
  subscriptionPrices: { [key: string]: number };
  themeColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface DataContextType {
  subjects: Subject[];
  units: Unit[];
  lessons: Lesson[];
  quizzes: Quiz[];
  codes: ActivationCode[];
  settings: AppSettings;
  updateSubjects: (subjects: Subject[]) => void;
  updateUnits: (units: Unit[]) => void;
  updateLessons: (lessons: Lesson[]) => void;
  updateQuizzes: (quizzes: Quiz[]) => void;
  updateCodes: (codes: ActivationCode[]) => void;
  updateSettings: (settings: AppSettings) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [codes, setCodes] = useState<ActivationCode[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    appName: 'Smart Edu',
    aboutText: 'تطبيق Smart Edu هو منصة تعليمية متقدمة توفر محتوى تعليمي عالي الجودة للطلاب في جميع المراحل الدراسية.',
    contactMethods: ['واتساب: +963 123 456 789', 'تليجرام: @smartedu_support', 'بريد إلكتروني: support@smartedu.com'],
    subscriptionPrices: {
      'monthly': 50,
      'quarterly': 120,
      'yearly': 400
    },
    themeColors: {
      primary: '#7c3aed',
      secondary: '#1e1b4b',
      accent: '#a855f7'
    }
  });

  useEffect(() => {
    initializeDefaultData();
  }, []);

  const initializeDefaultData = () => {
    // Initialize default subjects
    const defaultSubjects: Subject[] = [
      {
        id: 'math',
        name: 'الرياضيات',
        description: 'مادة الرياضيات للصف التاسع',
        icon: '📊',
        color: '#3b82f6'
      },
      {
        id: 'physics',
        name: 'الفيزياء',
        description: 'مادة الفيزياء للصف التاسع',
        icon: '⚛️',
        color: '#8b5cf6'
      }
    ];

    const defaultCodes: ActivationCode[] = [
      {
        id: 'code1',
        code: 'SMART2024',
        isUsed: false,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 365
      }
    ];

    // Load or set default data
    const savedSubjects = localStorage.getItem('smartedu_subjects');
    const savedCodes = localStorage.getItem('smartedu_codes');
    const savedSettings = localStorage.getItem('smartedu_settings');

    if (!savedSubjects) {
      localStorage.setItem('smartedu_subjects', JSON.stringify(defaultSubjects));
      setSubjects(defaultSubjects);
    } else {
      setSubjects(JSON.parse(savedSubjects));
    }

    if (!savedCodes) {
      localStorage.setItem('smartedu_codes', JSON.stringify(defaultCodes));
      setCodes(defaultCodes);
    } else {
      setCodes(JSON.parse(savedCodes));
    }

    if (!savedSettings) {
      localStorage.setItem('smartedu_settings', JSON.stringify(settings));
    } else {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const updateSubjects = (newSubjects: Subject[]) => {
    setSubjects(newSubjects);
    localStorage.setItem('smartedu_subjects', JSON.stringify(newSubjects));
  };

  const updateUnits = (newUnits: Unit[]) => {
    setUnits(newUnits);
    localStorage.setItem('smartedu_units', JSON.stringify(newUnits));
  };

  const updateLessons = (newLessons: Lesson[]) => {
    setLessons(newLessons);
    localStorage.setItem('smartedu_lessons', JSON.stringify(newLessons));
  };

  const updateQuizzes = (newQuizzes: Quiz[]) => {
    setQuizzes(newQuizzes);
    localStorage.setItem('smartedu_quizzes', JSON.stringify(newQuizzes));
  };

  const updateCodes = (newCodes: ActivationCode[]) => {
    setCodes(newCodes);
    localStorage.setItem('smartedu_codes', JSON.stringify(newCodes));
  };

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('smartedu_settings', JSON.stringify(newSettings));
  };

  return (
    <DataContext.Provider value={{
      subjects,
      units,
      lessons,
      quizzes,
      codes,
      settings,
      updateSubjects,
      updateUnits,
      updateLessons,
      updateQuizzes,
      updateCodes,
      updateSettings
    }}>
      {children}
    </DataContext.Provider>
  );
};
