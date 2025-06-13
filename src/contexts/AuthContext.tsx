
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  updateDoc
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (fullName: string, username: string, password: string, activationCode: string) => Promise<boolean>;
  logout: () => void;
  enterAsGuest: () => void;
  isAuthenticated: boolean;
  isGuest: boolean;
  isPremiumUser: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser(userData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // البحث عن المستخدم باستخدام اسم المستخدم
      const usersQuery = query(
        collection(db, 'users'), 
        where('username', '==', username)
      );
      const querySnapshot = await getDocs(usersQuery);
      
      if (querySnapshot.empty) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "اسم المستخدم غير موجود",
          variant: "destructive"
        });
        return false;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data() as User;
      
      // التحقق من كلمة المرور
      if (userData.password !== password) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "كلمة المرور غير صحيحة",
          variant: "destructive"
        });
        return false;
      }

      // التحقق من حالة الحساب
      if (!userData.isActive) {
        toast({
          title: "حساب معطل",
          description: "الحساب معطل، تواصل مع فريق الدعم",
          variant: "destructive"
        });
        return false;
      }

      // التحقق من انتهاء الصلاحية
      const now = new Date();
      const expiryDate = new Date(userData.expiryDate);
      if (now > expiryDate) {
        toast({
          title: "انتهت صلاحية الحساب",
          description: "الحساب منتهي الصلاحية، تواصل مع فريق الدعم",
          variant: "destructive"
        });
        return false;
      }

      // تسجيل الدخول باستخدام Firebase Auth
      const email = `${username}@smartedu.app`;
      await signInWithEmailAndPassword(auth, email, password);
      
      setUser(userData);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "حدث خطأ أثناء تسجيل الدخول",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName: string, username: string, password: string, activationCode: string): Promise<boolean> => {
    try {
      setLoading(true);

      // التحقق من وجود اسم المستخدم
      const usersQuery = query(
        collection(db, 'users'), 
        where('username', '==', username)
      );
      const existingUser = await getDocs(usersQuery);
      
      if (!existingUser.empty) {
        toast({
          title: "خطأ في التسجيل",
          description: "اسم المستخدم موجود بالفعل",
          variant: "destructive"
        });
        return false;
      }

      // التحقق من كود التفعيل
      const codesQuery = query(
        collection(db, 'activationCodes'), 
        where('code', '==', activationCode),
        where('isUsed', '==', false),
        where('isActive', '==', true)
      );
      const codeSnapshot = await getDocs(codesQuery);
      
      if (codeSnapshot.empty) {
        toast({
          title: "كود تفعيل خاطئ",
          description: "كود التفعيل غير صحيح أو مستخدم بالفعل",
          variant: "destructive"
        });
        return false;
      }

      const codeDoc = codeSnapshot.docs[0];
      const codeData = codeDoc.data();
      
      // التحقق من انتهاء صلاحية الكود
      if (new Date() > new Date(codeData.expiryDate)) {
        toast({
          title: "كود منتهي الصلاحية",
          description: "كود التفعيل منتهي الصلاحية",
          variant: "destructive"
        });
        return false;
      }

      // إنشاء حساب Firebase Auth
      const email = `${username}@smartedu.app`;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // تحديد تاريخ انتهاء الاشتراك (سنة واحدة)
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      // إنشاء بيانات المستخدم
      const newUser: User = {
        id: userCredential.user.uid,
        fullName,
        username,
        password,
        isAdmin: false,
        createdAt: new Date().toISOString(),
        expiryDate: expiryDate.toISOString(),
        isActive: true,
        activationCodeId: codeDoc.id
      };

      // حفظ بيانات المستخدم في Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), newUser);

      // تحديث كود التفعيل كمستخدم
      await updateDoc(doc(db, 'activationCodes', codeDoc.id), {
        isUsed: true,
        usedBy: username,
        usedAt: new Date().toISOString()
      });

      setUser(newUser);
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "خطأ في التسجيل",
        description: "حدث خطأ أثناء إنشاء الحساب",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const enterAsGuest = () => {
    const guestUser: User = {
      id: 'guest',
      fullName: 'ضيف',
      username: 'guest',
      password: '',
      isAdmin: false,
      createdAt: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
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
    isPremiumUser: !!isPremiumUser,
    loading
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
