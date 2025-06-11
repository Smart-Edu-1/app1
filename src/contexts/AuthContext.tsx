
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  fullName: string;
  username: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (fullName: string, username: string, password: string, activationCode: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('smartedu_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (username: string, password: string): Promise<boolean> => {
    console.log('Login attempt:', username);
    
    // Check for admin login
    if (username === 'Yousef55' && password === 'yousef18') {
      const adminUser = {
        id: 'admin',
        fullName: 'يوسف المدير',
        username: 'Yousef55',
        isAdmin: true
      };
      setUser(adminUser);
      localStorage.setItem('smartedu_user', JSON.stringify(adminUser));
      return true;
    }

    // Check regular users
    const users = JSON.parse(localStorage.getItem('smartedu_users') || '[]');
    const foundUser = users.find((u: any) => u.username === username && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('smartedu_user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const register = async (fullName: string, username: string, password: string, activationCode: string): Promise<boolean> => {
    console.log('Register attempt:', username, activationCode);
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('smartedu_users') || '[]');
    if (users.find((u: any) => u.username === username)) {
      return false;
    }

    // Check activation code
    const codes = JSON.parse(localStorage.getItem('smartedu_codes') || '[]');
    const codeIndex = codes.findIndex((c: any) => c.code === activationCode && !c.isUsed);
    
    if (codeIndex === -1) {
      return false;
    }

    // Mark code as used
    codes[codeIndex].isUsed = true;
    localStorage.setItem('smartedu_codes', JSON.stringify(codes));

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      fullName,
      username,
      password,
      isAdmin: false
    };

    users.push(newUser);
    localStorage.setItem('smartedu_users', JSON.stringify(users));
    
    setUser(newUser);
    localStorage.setItem('smartedu_user', JSON.stringify(newUser));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smartedu_user');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user
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
