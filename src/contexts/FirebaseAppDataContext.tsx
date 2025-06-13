
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useFirebaseData } from '@/hooks/useFirebaseData';

interface FirebaseAppDataContextType {
  subjects: any[];
  units: any[];
  lessons: any[];
  quizzes: any[];
  codes: any[];
  loading: boolean;
  
  // Functions for subjects
  addSubject: (subject: any) => Promise<void>;
  updateSubject: (id: string, subject: any) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  
  // Functions for units
  addUnit: (unit: any) => Promise<void>;
  updateUnit: (id: string, unit: any) => Promise<void>;
  deleteUnit: (id: string) => Promise<void>;
  
  // Functions for lessons
  addLesson: (lesson: any) => Promise<void>;
  updateLesson: (id: string, lesson: any) => Promise<void>;
  deleteLesson: (id: string) => Promise<void>;
  
  // Functions for quizzes
  addQuiz: (quiz: any) => Promise<void>;
  updateQuiz: (id: string, quiz: any) => Promise<void>;
  deleteQuiz: (id: string) => Promise<void>;
  
  // Functions for codes
  addCode: (code: any) => Promise<void>;
  updateCode: (id: string, code: any) => Promise<void>;
  deleteCode: (id: string) => Promise<void>;
  
  // Helper functions
  getLessonsByUnit: (unitId: string) => any[];
  getQuizzesByUnit: (unitId: string) => any[];
}

const FirebaseAppDataContext = createContext<FirebaseAppDataContextType | undefined>(undefined);

interface FirebaseAppDataProviderProps {
  children: ReactNode;
}

export const FirebaseAppDataProvider: React.FC<FirebaseAppDataProviderProps> = ({ children }) => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { saveData, updateData, deleteData, subscribeToData } = useFirebaseData();

  useEffect(() => {
    setLoading(true);
    
    // الاستماع للتغييرات في المواد
    const unsubscribeSubjects = subscribeToData('subjects', setSubjects, {
      orderBy: { field: 'order', direction: 'asc' }
    });
    
    // الاستماع للتغييرات في الوحدات
    const unsubscribeUnits = subscribeToData('units', setUnits, {
      orderBy: { field: 'order', direction: 'asc' }
    });
    
    // الاستماع للتغييرات في الدروس
    const unsubscribeLessons = subscribeToData('lessons', setLessons, {
      orderBy: { field: 'order', direction: 'asc' }
    });
    
    // الاستماع للتغييرات في الاختبارات
    const unsubscribeQuizzes = subscribeToData('quizzes', setQuizzes, {
      orderBy: { field: 'order', direction: 'asc' }
    });
    
    // الاستماع للتغييرات في أكواد التفعيل
    const unsubscribeCodes = subscribeToData('activationCodes', setCodes, {
      orderBy: { field: 'createdAt', direction: 'desc' }
    });
    
    setLoading(false);
    
    return () => {
      unsubscribeSubjects();
      unsubscribeUnits();
      unsubscribeLessons();
      unsubscribeQuizzes();
      unsubscribeCodes();
    };
  }, []);

  // Subject functions
  const addSubject = async (subject: any) => {
    const id = await saveData('subjects', subject);
    if (id) {
      console.log('Subject added with ID:', id);
    }
  };

  const updateSubject = async (id: string, subject: any) => {
    await updateData('subjects', id, subject);
  };

  const deleteSubject = async (id: string) => {
    await deleteData('subjects', id);
  };

  // Unit functions
  const addUnit = async (unit: any) => {
    const id = await saveData('units', unit);
    if (id) {
      console.log('Unit added with ID:', id);
    }
  };

  const updateUnit = async (id: string, unit: any) => {
    await updateData('units', id, unit);
  };

  const deleteUnit = async (id: string) => {
    await deleteData('units', id);
  };

  // Lesson functions
  const addLesson = async (lesson: any) => {
    const id = await saveData('lessons', lesson);
    if (id) {
      console.log('Lesson added with ID:', id);
    }
  };

  const updateLesson = async (id: string, lesson: any) => {
    await updateData('lessons', id, lesson);
  };

  const deleteLesson = async (id: string) => {
    await deleteData('lessons', id);
  };

  // Quiz functions
  const addQuiz = async (quiz: any) => {
    const id = await saveData('quizzes', quiz);
    if (id) {
      console.log('Quiz added with ID:', id);
    }
  };

  const updateQuiz = async (id: string, quiz: any) => {
    await updateData('quizzes', id, quiz);
  };

  const deleteQuiz = async (id: string) => {
    await deleteData('quizzes', id);
  };

  // Code functions
  const addCode = async (code: any) => {
    const id = await saveData('activationCodes', code);
    if (id) {
      console.log('Code added with ID:', id);
    }
  };

  const updateCode = async (id: string, code: any) => {
    await updateData('activationCodes', id, code);
  };

  const deleteCode = async (id: string) => {
    await deleteData('activationCodes', id);
  };

  // Helper functions
  const getLessonsByUnit = (unitId: string) => {
    return lessons.filter(lesson => lesson.unitId === unitId && lesson.isActive);
  };

  const getQuizzesByUnit = (unitId: string) => {
    return quizzes.filter(quiz => quiz.unitId === unitId && quiz.isActive);
  };

  const value: FirebaseAppDataContextType = {
    subjects,
    units,
    lessons,
    quizzes,
    codes,
    loading,
    addSubject,
    updateSubject,
    deleteSubject,
    addUnit,
    updateUnit,
    deleteUnit,
    addLesson,
    updateLesson,
    deleteLesson,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    addCode,
    updateCode,
    deleteCode,
    getLessonsByUnit,
    getQuizzesByUnit
  };

  return (
    <FirebaseAppDataContext.Provider value={value}>
      {children}
    </FirebaseAppDataContext.Provider>
  );
};

export const useFirebaseAppData = (): FirebaseAppDataContextType => {
  const context = useContext(FirebaseAppDataContext);
  if (context === undefined) {
    throw new Error('useFirebaseAppData must be used within a FirebaseAppDataProvider');
  }
  return context;
};
