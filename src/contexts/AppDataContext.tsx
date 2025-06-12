
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Subject, Unit, Lesson, Quiz, Question, ActivationCode, Notification, AppSettings } from '@/types';

interface AppDataContextType {
  // Users
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => string;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUserById: (id: string) => User | undefined;
  
  // Subjects
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  
  // Units
  units: Unit[];
  addUnit: (unit: Omit<Unit, 'id'>) => void;
  updateUnit: (id: string, updates: Partial<Unit>) => void;
  deleteUnit: (id: string) => void;
  getUnitsBySubject: (subjectId: string) => Unit[];
  
  // Lessons
  lessons: Lesson[];
  addLesson: (lesson: Omit<Lesson, 'id'>) => void;
  updateLesson: (id: string, updates: Partial<Lesson>) => void;
  deleteLesson: (id: string) => void;
  getLessonsByUnit: (unitId: string) => Lesson[];
  
  // Quizzes
  quizzes: Quiz[];
  addQuiz: (quiz: Omit<Quiz, 'id'>) => void;
  updateQuiz: (id: string, updates: Partial<Quiz>) => void;
  deleteQuiz: (id: string) => void;
  getQuizzesByUnit: (unitId: string) => Quiz[];
  
  // Questions
  questions: Question[];
  addQuestion: (question: Omit<Question, 'id'>) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  getQuestionsByQuiz: (quizId: string) => Question[];
  
  // Activation Codes
  codes: ActivationCode[];
  addCode: (code: Omit<ActivationCode, 'id' | 'createdAt'>) => void;
  updateCode: (id: string, updates: Partial<ActivationCode>) => void;
  deleteCode: (id: string) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (id: string) => void;
  
  // Settings
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const defaultSettings: AppSettings = {
  appName: 'Smart Edu',
  aboutText: 'منصة التعليم الذكية التي تهدف إلى تطوير مهارات الطلاب في المواد العلمية',
  subscriptionPlans: [
    {
      id: '1',
      name: 'الخطة الأساسية',
      description: 'الوصول إلى المحتوى الأساسي',
      price: 9.99,
      currency: 'USD',
      duration: 1,
      features: ['الوصول إلى جميع الدروس المجانية', 'دعم فني أساسي', 'تحديثات المحتوى'],
      isActive: true,
      order: 1
    },
    {
      id: '2',
      name: 'الخطة المتقدمة',
      description: 'الوصول الكامل إلى جميع المميزات',
      price: 24.99,
      currency: 'USD',
      duration: 3,
      features: ['الوصول إلى جميع الدروس', 'الاختبارات التفاعلية', 'دعم فني متقدم', 'تحميل المواد للمراجعة'],
      isActive: true,
      order: 2
    },
    {
      id: '3',
      name: 'الخطة السنوية',
      description: 'أفضل قيمة مع الوصول الكامل',
      price: 89.99,
      currency: 'USD',
      duration: 12,
      features: ['جميع مميزات الخطة المتقدمة', 'جلسات فردية مع المدرسين', 'شهادات إتمام', 'وصول مدى الحياة للمحتوى المحدث'],
      isActive: true,
      order: 3
    }
  ],
  themeColors: {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B'
  },
  contactMethods: [
    'واتساب: +963 123 456 789',
    'تليجرام: @smartedu_support',
    'بريد إلكتروني: support@smartedu.com'
  ],
  adminCredentials: {
    username: 'Yousef55',
    password: 'yousef18'
  }
};

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [codes, setCodes] = useState<ActivationCode[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // Initialize data from localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem('smartedu_users_v2');
    const savedSubjects = localStorage.getItem('smartedu_subjects_v2');
    const savedUnits = localStorage.getItem('smartedu_units_v2');
    const savedLessons = localStorage.getItem('smartedu_lessons_v2');
    const savedQuizzes = localStorage.getItem('smartedu_quizzes_v2');
    const savedQuestions = localStorage.getItem('smartedu_questions_v2');
    const savedCodes = localStorage.getItem('smartedu_codes_v2');
    const savedNotifications = localStorage.getItem('smartedu_notifications_v2');
    const savedSettings = localStorage.getItem('smartedu_settings_v2');

    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    else {
      // Initialize default subjects
      const defaultSubjects = [
        { id: '1', name: 'الفيزياء', description: 'دروس وتمارين في الفيزياء', icon: '⚛️', color: '#3B82F6', order: 1, isActive: true },
        { id: '2', name: 'الرياضيات', description: 'دروس وتمارين في الرياضيات', icon: '📐', color: '#10B981', order: 2, isActive: true },
        { id: '3', name: 'الكيمياء', description: 'دروس وتمارين في الكيمياء', icon: '🧪', color: '#F59E0B', order: 3, isActive: true }
      ];
      setSubjects(defaultSubjects);
      localStorage.setItem('smartedu_subjects_v2', JSON.stringify(defaultSubjects));
    }
    
    if (savedUnits) setUnits(JSON.parse(savedUnits));
    if (savedLessons) setLessons(JSON.parse(savedLessons));
    if (savedQuizzes) setQuizzes(JSON.parse(savedQuizzes));
    if (savedQuestions) setQuestions(JSON.parse(savedQuestions));
    if (savedCodes) setCodes(JSON.parse(savedCodes));
    else {
      // Initialize default codes
      const defaultCodes = [
        { id: '1', code: 'EDU2024', isUsed: false, createdAt: new Date().toISOString(), expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), isActive: true },
        { id: '2', code: 'SMART123', isUsed: false, createdAt: new Date().toISOString(), expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), isActive: true }
      ];
      setCodes(defaultCodes);
      localStorage.setItem('smartedu_codes_v2', JSON.stringify(defaultCodes));
    }
    
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    else {
      localStorage.setItem('smartedu_settings_v2', JSON.stringify(defaultSettings));
    }
  }, []);

  // Users functions
  const addUser = (userData: Omit<User, 'id' | 'createdAt'>): string => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('smartedu_users_v2', JSON.stringify(updatedUsers));
    return newUser.id;
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    const updatedUsers = users.map(user => user.id === id ? { ...user, ...updates } : user);
    setUsers(updatedUsers);
    localStorage.setItem('smartedu_users_v2', JSON.stringify(updatedUsers));
  };

  const deleteUser = (id: string) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('smartedu_users_v2', JSON.stringify(updatedUsers));
  };

  const getUserById = (id: string) => users.find(user => user.id === id);

  // Subjects functions
  const addSubject = (subjectData: Omit<Subject, 'id'>) => {
    const newSubject: Subject = { ...subjectData, id: Date.now().toString() };
    const updatedSubjects = [...subjects, newSubject];
    setSubjects(updatedSubjects);
    localStorage.setItem('smartedu_subjects_v2', JSON.stringify(updatedSubjects));
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    const updatedSubjects = subjects.map(subject => subject.id === id ? { ...subject, ...updates } : subject);
    setSubjects(updatedSubjects);
    localStorage.setItem('smartedu_subjects_v2', JSON.stringify(updatedSubjects));
  };

  const deleteSubject = (id: string) => {
    const updatedSubjects = subjects.filter(subject => subject.id !== id);
    setSubjects(updatedSubjects);
    localStorage.setItem('smartedu_subjects_v2', JSON.stringify(updatedSubjects));
  };

  // Units functions
  const addUnit = (unitData: Omit<Unit, 'id'>) => {
    const newUnit: Unit = { ...unitData, id: Date.now().toString() };
    const updatedUnits = [...units, newUnit];
    setUnits(updatedUnits);
    localStorage.setItem('smartedu_units_v2', JSON.stringify(updatedUnits));
  };

  const updateUnit = (id: string, updates: Partial<Unit>) => {
    const updatedUnits = units.map(unit => unit.id === id ? { ...unit, ...updates } : unit);
    setUnits(updatedUnits);
    localStorage.setItem('smartedu_units_v2', JSON.stringify(updatedUnits));
  };

  const deleteUnit = (id: string) => {
    const updatedUnits = units.filter(unit => unit.id !== id);
    setUnits(updatedUnits);
    localStorage.setItem('smartedu_units_v2', JSON.stringify(updatedUnits));
  };

  const getUnitsBySubject = (subjectId: string) => 
    units.filter(unit => unit.subjectId === subjectId && unit.isActive).sort((a, b) => a.order - b.order);

  // Lessons functions
  const addLesson = (lessonData: Omit<Lesson, 'id'>) => {
    const newLesson: Lesson = { ...lessonData, id: Date.now().toString() };
    const updatedLessons = [...lessons, newLesson];
    setLessons(updatedLessons);
    localStorage.setItem('smartedu_lessons_v2', JSON.stringify(updatedLessons));
  };

  const updateLesson = (id: string, updates: Partial<Lesson>) => {
    const updatedLessons = lessons.map(lesson => lesson.id === id ? { ...lesson, ...updates } : lesson);
    setLessons(updatedLessons);
    localStorage.setItem('smartedu_lessons_v2', JSON.stringify(updatedLessons));
  };

  const deleteLesson = (id: string) => {
    const updatedLessons = lessons.filter(lesson => lesson.id !== id);
    setLessons(updatedLessons);
    localStorage.setItem('smartedu_lessons_v2', JSON.stringify(updatedLessons));
  };

  const getLessonsByUnit = (unitId: string) => 
    lessons.filter(lesson => lesson.unitId === unitId && lesson.isActive).sort((a, b) => a.order - b.order);

  // Quizzes functions
  const addQuiz = (quizData: Omit<Quiz, 'id'>) => {
    const newQuiz: Quiz = { ...quizData, id: Date.now().toString() };
    const updatedQuizzes = [...quizzes, newQuiz];
    setQuizzes(updatedQuizzes);
    localStorage.setItem('smartedu_quizzes_v2', JSON.stringify(updatedQuizzes));
  };

  const updateQuiz = (id: string, updates: Partial<Quiz>) => {
    const updatedQuizzes = quizzes.map(quiz => quiz.id === id ? { ...quiz, ...updates } : quiz);
    setQuizzes(updatedQuizzes);
    localStorage.setItem('smartedu_quizzes_v2', JSON.stringify(updatedQuizzes));
  };

  const deleteQuiz = (id: string) => {
    const updatedQuizzes = quizzes.filter(quiz => quiz.id !== id);
    setQuizzes(updatedQuizzes);
    localStorage.setItem('smartedu_quizzes_v2', JSON.stringify(updatedQuizzes));
  };

  const getQuizzesByUnit = (unitId: string) => 
    quizzes.filter(quiz => quiz.unitId === unitId && quiz.isActive).sort((a, b) => a.order - b.order);

  // Questions functions
  const addQuestion = (questionData: Omit<Question, 'id'>) => {
    const newQuestion: Question = { ...questionData, id: Date.now().toString() };
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    localStorage.setItem('smartedu_questions_v2', JSON.stringify(updatedQuestions));
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    const updatedQuestions = questions.map(question => question.id === id ? { ...question, ...updates } : question);
    setQuestions(updatedQuestions);
    localStorage.setItem('smartedu_questions_v2', JSON.stringify(updatedQuestions));
  };

  const deleteQuestion = (id: string) => {
    const updatedQuestions = questions.filter(question => question.id !== id);
    setQuestions(updatedQuestions);
    localStorage.setItem('smartedu_questions_v2', JSON.stringify(updatedQuestions));
  };

  const getQuestionsByQuiz = (quizId: string) => 
    questions.filter(question => question.quizId === quizId).sort((a, b) => a.order - b.order);

  // Codes functions
  const addCode = (codeData: Omit<ActivationCode, 'id' | 'createdAt'>) => {
    const newCode: ActivationCode = { 
      ...codeData, 
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedCodes = [...codes, newCode];
    setCodes(updatedCodes);
    localStorage.setItem('smartedu_codes_v2', JSON.stringify(updatedCodes));
  };

  const updateCode = (id: string, updates: Partial<ActivationCode>) => {
    const updatedCodes = codes.map(code => code.id === id ? { ...code, ...updates } : code);
    setCodes(updatedCodes);
    localStorage.setItem('smartedu_codes_v2', JSON.stringify(updatedCodes));
  };

  const deleteCode = (id: string) => {
    const updatedCodes = codes.filter(code => code.id !== id);
    setCodes(updatedCodes);
    localStorage.setItem('smartedu_codes_v2', JSON.stringify(updatedCodes));
  };

  // Notifications functions
  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedNotifications = [...notifications, newNotification];
    setNotifications(updatedNotifications);
    localStorage.setItem('smartedu_notifications_v2', JSON.stringify(updatedNotifications));
  };

  const markNotificationAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('smartedu_notifications_v2', JSON.stringify(updatedNotifications));
  };

  // Settings functions
  const updateSettings = (updates: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...updates };
    setSettings(updatedSettings);
    localStorage.setItem('smartedu_settings_v2', JSON.stringify(updatedSettings));
  };

  const value: AppDataContextType = {
    // Users
    users,
    addUser,
    updateUser,
    deleteUser,
    getUserById,
    
    // Subjects
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    
    // Units
    units,
    addUnit,
    updateUnit,
    deleteUnit,
    getUnitsBySubject,
    
    // Lessons
    lessons,
    addLesson,
    updateLesson,
    deleteLesson,
    getLessonsByUnit,
    
    // Quizzes
    quizzes,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    getQuizzesByUnit,
    
    // Questions
    questions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestionsByQuiz,
    
    // Codes
    codes,
    addCode,
    updateCode,
    deleteCode,
    
    // Notifications
    notifications,
    addNotification,
    markNotificationAsRead,
    
    // Settings
    settings,
    updateSettings
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = (): AppDataContextType => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
