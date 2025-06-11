
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  fullName: string;
  username: string;
  password: string;
  activationCode: string;
  isActive: boolean;
  createdAt: string;
  expiresAt: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (fullName: string, username: string, password: string, activationCode: string) => Promise<boolean>;
  logout: () => void;
  isGuest: boolean;
  enterAsGuest: () => void;
  checkSession: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('smartedu_user');
    const savedGuest = localStorage.getItem('smartedu_guest');
    
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      // Check if account is still valid
      if (new Date(userData.expiresAt) > new Date()) {
        setUser(userData);
      } else {
        localStorage.removeItem('smartedu_user');
      }
    } else if (savedGuest) {
      setIsGuest(true);
    }

    // Initialize default admin account
    initializeDefaultAdmin();
  }, []);

  const initializeDefaultAdmin = () => {
    const existingUsers = JSON.parse(localStorage.getItem('smartedu_users') || '[]');
    const adminExists = existingUsers.find((u: User) => u.username === 'Yousef55');
    
    if (!adminExists) {
      const adminUser: User = {
        id: 'admin-1',
        fullName: 'يوسف المدير الرئيسي',
        username: 'Yousef55',
        password: 'yousef18',
        activationCode: 'ADMIN001',
        isActive: true,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        isAdmin: true
      };
      
      const updatedUsers = [...existingUsers, adminUser];
      localStorage.setItem('smartedu_users', JSON.stringify(updatedUsers));
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('smartedu_users') || '[]');
    const foundUser = users.find((u: User) => u.username === username && u.password === password);
    
    if (foundUser) {
      // Check if account is expired
      if (new Date(foundUser.expiresAt) <= new Date()) {
        return false;
      }
      
      // Check if account is active
      if (!foundUser.isActive) {
        return false;
      }
      
      setUser(foundUser);
      setIsGuest(false);
      localStorage.setItem('smartedu_user', JSON.stringify(foundUser));
      localStorage.removeItem('smartedu_guest');
      return true;
    }
    
    return false;
  };

  const register = async (fullName: string, username: string, password: string, activationCode: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('smartedu_users') || '[]');
    const codes = JSON.parse(localStorage.getItem('smartedu_codes') || '[]');
    
    // Check if username already exists
    const userExists = users.find((u: User) => u.username === username);
    if (userExists) {
      return false;
    }
    
    // Check if activation code is valid
    const validCode = codes.find((c: any) => 
      c.code === activationCode && 
      !c.isUsed && 
      new Date(c.expiresAt) > new Date()
    );
    
    if (!validCode) {
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName,
      username,
      password,
      activationCode,
      isActive: true,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    // Mark code as used
    const updatedCodes = codes.map((c: any) => 
      c.code === activationCode ? { ...c, isUsed: true, usedBy: username } : c
    );
    
    // Save updated data
    localStorage.setItem('smartedu_users', JSON.stringify([...users, newUser]));
    localStorage.setItem('smartedu_codes', JSON.stringify(updatedCodes));
    
    setUser(newUser);
    localStorage.setItem('smartedu_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem('smartedu_user');
    localStorage.removeItem('smartedu_guest');
  };

  const enterAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem('smartedu_guest', 'true');
  };

  const checkSession = (): boolean => {
    if (user && new Date(user.expiresAt) <= new Date()) {
      logout();
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isGuest,
      enterAsGuest,
      checkSession
    }}>
      {children}
    </AuthContext.Provider>
  );
};
