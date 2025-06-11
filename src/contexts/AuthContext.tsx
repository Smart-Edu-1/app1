
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (fullName: string, username: string, password: string, activationCode: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  enterAsGuest: () => void;
  isAuthenticated: boolean;
  isGuest: boolean;
  isPremiumUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('smartedu_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    console.log('Login attempt:', username);
    
    // Check for admin login
    const settings = JSON.parse(localStorage.getItem('smartedu_settings_v2') || '{}');
    if (username === settings.adminCredentials?.username && password === settings.adminCredentials?.password) {
      const adminUser: User = {
        id: 'admin',
        fullName: 'المدير الرئيسي',
        username: settings.adminCredentials.username,
        password: settings.adminCredentials.password,
        isAdmin: true,
        createdAt: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 10 years
        isActive: true
      };
      setUser(adminUser);
      localStorage.setItem('smartedu_current_user', JSON.stringify(adminUser));
      return { success: true };
    }

    // Check regular users
    const users = JSON.parse(localStorage.getItem('smartedu_users_v2') || '[]');
    const foundUser = users.find((u: User) => u.username === username && u.password === password);
    
    if (!foundUser) {
      return { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
    }

    // Check if account is active
    if (!foundUser.isActive) {
      return { success: false, message: 'الحساب معطل، تواصل مع فريق الدعم' };
    }

    // Check if account has expired
    const now = new Date();
    const expiryDate = new Date(foundUser.expiryDate);
    if (now > expiryDate) {
      return { success: false, message: 'الحساب منتهي الصلاحية، تواصل مع فريق الدعم' };
    }

    setUser(foundUser);
    localStorage.setItem('smartedu_current_user', JSON.stringify(foundUser));
    return { success: true };
  };

  const register = async (fullName: string, username: string, password: string, activationCode: string): Promise<{ success: boolean; message?: string }> => {
    console.log('Register attempt:', username, activationCode);
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('smartedu_users_v2') || '[]');
    if (users.find((u: User) => u.username === username)) {
      return { success: false, message: 'اسم المستخدم موجود بالفعل' };
    }

    // Check activation code
    const codes = JSON.parse(localStorage.getItem('smartedu_codes_v2') || '[]');
    const codeIndex = codes.findIndex((c: any) => 
      c.code === activationCode && 
      !c.isUsed && 
      c.isActive && 
      new Date() < new Date(c.expiryDate)
    );
    
    if (codeIndex === -1) {
      return { success: false, message: 'كود التفعيل غير صحيح أو منتهي الصلاحية' };
    }

    // Mark code as used
    codes[codeIndex].isUsed = true;
    codes[codeIndex].usedBy = username;
    localStorage.setItem('smartedu_codes_v2', JSON.stringify(codes));

    // Create new user with 1 year expiry
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const newUser: User = {
      id: Date.now().toString(),
      fullName,
      username,
      password,
      isAdmin: false,
      createdAt: new Date().toISOString(),
      expiryDate: expiryDate.toISOString(),
      isActive: true,
      activationCodeId: codes[codeIndex].id
    };

    users.push(newUser);
    localStorage.setItem('smartedu_users_v2', JSON.stringify(users));
    
    setUser(newUser);
    localStorage.setItem('smartedu_current_user', JSON.stringify(newUser));
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smartedu_current_user');
  };

  const enterAsGuest = () => {
    const guestUser: User = {
      id: 'guest',
      fullName: 'ضيف',
      username: 'guest',
      password: '',
      isAdmin: false,
      createdAt: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      isActive: true
    };
    setUser(guestUser);
  };

  const isGuest = user?.id === 'guest';
  const isPremiumUser = user && !isGuest && user.isActive && new Date() < new Date(user.expiryDate);

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    enterAsGuest,
    isAuthenticated: !!user,
    isGuest,
    isPremiumUser: !!isPremiumUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
