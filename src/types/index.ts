
export interface User {
  id: string;
  fullName: string;
  username: string;
  password: string;
  isAdmin: boolean;
  createdAt: string;
  expiryDate: string;
  isActive: boolean;
  activationCodeId?: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
}

export interface Unit {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
}

export interface Lesson {
  id: string;
  unitId: string;
  name: string;
  description: string;
  videoUrl: string;
  imageUrl?: string;
  isPremium: boolean;
  order: number;
  teacherContact?: string;
  isActive: boolean;
}

export interface Quiz {
  id: string;
  unitId: string;
  name: string;
  description: string;
  imageUrl?: string;
  isPremium: boolean;
  order: number;
  isActive: boolean;
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  type: 'multiple' | 'boolean';
  options?: string[];
  correctAnswer: string | number;
  imageUrl?: string;
  order: number;
}

export interface ActivationCode {
  id: string;
  code: string;
  isUsed: boolean;
  usedBy?: string;
  createdAt: string;
  isActive: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  userId?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number; // in months
  features: string[];
  isActive: boolean;
  order: number;
}

export interface AppSettings {
  appName: string;
  aboutText: string;
  subscriptionPlans: SubscriptionPlan[];
  themeColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  contactMethods: string[];
  adminCredentials: {
    username: string;
    password: string;
  };
}
