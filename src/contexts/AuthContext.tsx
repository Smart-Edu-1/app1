import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  username: string;
  fullName: string;
  isAdmin: boolean;
  isActive: boolean;
  expiryDate?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (fullName: string, username: string, password: string, activationCode: string) => Promise<boolean>;
  logout: () => void;
  enterAsGuest: () => void;
  isGuest: boolean;
  isPremiumUser: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  enterAsGuest: () => {},
  isGuest: false,
  isPremiumUser: false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('خطأ في تحليل بيانات المستخدم المحفوظة:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Calculate isGuest and isPremiumUser based on user state
  const isGuest = user?.id === 'guest';
  const isPremiumUser = user ? !isGuest && user.isActive && (!user.expiryDate || new Date(user.expiryDate) > new Date()) : false;

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('بدء محاولة تسجيل الدخول...');
      console.log('Firebase Project ID:', db.app.options.projectId);
      console.log('اسم المستخدم:', username);
      
      // Test Firebase connection first
      console.log('اختبار الاتصال بقاعدة البيانات...');
      
      const usersRef = collection(db, 'users');
      console.log('تم إنشاء مرجع المجموعة');
      
      const q = query(usersRef, where('username', '==', username));
      console.log('تم إنشاء الاستعلام');
      
      console.log('محاولة تنفيذ الاستعلام...');
      const querySnapshot = await getDocs(q);
      console.log('تم تنفيذ الاستعلام بنجاح');
      console.log('عدد المستندات الموجودة:', querySnapshot.size);
      
      if (querySnapshot.empty) {
        console.log('لم يتم العثور على المستخدم');
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "اسم المستخدم غير موجود",
          variant: "destructive"
        });
        return false;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      
      console.log('بيانات المستخدم الموجودة:', userData);

      // التحقق من كلمة المرور
      if (userData.password !== password) {
        console.log('كلمة المرور غير صحيحة');
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "كلمة المرور غير صحيحة",
          variant: "destructive"
        });
        return false;
      }

      // التحقق من أن الحساب نشط (ما عدا الأدمن)
      if (userData.isActive === false && !userData.isAdmin) {
        toast({
          title: "حساب معطل",
          description: "تم تعطيل حسابك. يرجى الاتصال بالإدارة",
          variant: "destructive"
        });
        return false;
      }

      // التحقق من انتهاء صلاحية الحساب (ما عدا الأدمن)
      if (userData.expiryDate && !userData.isAdmin) {
        const expiryDate = new Date(userData.expiryDate);
        const now = new Date();
        if (expiryDate < now) {
          toast({
            title: "انتهت صلاحية الحساب",
            description: "انتهت صلاحية حسابك. يرجى تجديد الاشتراك",
            variant: "destructive"
          });
          return false;
        }
      }

      // تحديد إذا كان المستخدم مسؤول
      const isAdmin = userData.isAdmin === true;
      
      const loggedInUser: User = {
        id: userDoc.id,
        username: userData.username,
        fullName: userData.fullName,
        isAdmin: isAdmin,
        isActive: userData.isActive !== false,
        expiryDate: userData.expiryDate,
        createdAt: userData.createdAt
      };

      console.log('المستخدم بعد تسجيل الدخول:', loggedInUser);
      console.log('هل هو مشرف؟', isAdmin);
      
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً ${userData.fullName}`,
      });
      
      return true;
    } catch (error: any) {
      console.error('خطأ مفصل في تسجيل الدخول:', error);
      console.error('نوع الخطأ:', error.code);
      console.error('رسالة الخطأ:', error.message);
      
      let errorMessage = "حدث خطأ أثناء تسجيل الدخول";
      
      if (error.code === 'permission-denied') {
        errorMessage = "لا توجد صلاحيات كافية للوصول إلى قاعدة البيانات. يرجى التحقق من إعدادات Firestore";
        console.error('خطأ في الصلاحيات: تحقق من قواعد Firestore Security Rules');
      } else if (error.code === 'unavailable') {
        errorMessage = "قاعدة البيانات غير متاحة حالياً";
      }
      
      toast({
        title: "خطأ في تسجيل الدخول",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  };

  const register = async (fullName: string, username: string, password: string, activationCode: string): Promise<boolean> => {
    try {
      console.log('محاولة التحقق من كود التفعيل:', activationCode);
      
      // التحقق من وجود كود التفعيل
      const codesRef = collection(db, 'activationCodes');
      const codeQuery = query(
        codesRef,
        where('code', '==', activationCode),
        where('isUsed', '==', false),
        where('isActive', '==', true)
      );
      
      const codeSnapshot = await getDocs(codeQuery);
      
      if (codeSnapshot.empty) {
        toast({
          title: "كود تفعيل غير صحيح",
          description: "كود التفعيل غير موجود أو مستخدم بالفعل",
          variant: "destructive"
        });
        return false;
      }

      // التحقق من عدم وجود اسم المستخدم مسبقاً
      const usersRef = collection(db, 'users');
      const userQuery = query(usersRef, where('username', '==', username));
      const userSnapshot = await getDocs(userQuery);
      
      if (!userSnapshot.empty) {
        toast({
          title: "اسم المستخدم موجود",
          description: "اسم المستخدم موجود بالفعل. يرجى اختيار اسم آخر",
          variant: "destructive"
        });
        return false;
      }

      const codeDoc = codeSnapshot.docs[0];
      const codeData = codeDoc.data();
      
      // إنشاء تاريخ انتهاء الصلاحية
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + (codeData.validityYears || 1));
      
      // إنشاء المستخدم الجديد
      const newUser = {
        username,
        password,
        fullName,
        isActive: true,
        isAdmin: false,
        expiryDate: expiryDate.toISOString(),
        createdAt: new Date().toISOString(),
        activationCode
      };
      
      const docRef = await addDoc(usersRef, newUser);
      
      // تحديث كود التفعيل كمستخدم
      await updateDoc(doc(db, 'activationCodes', codeDoc.id), {
        isUsed: true,
        usedBy: username,
        usedAt: new Date().toISOString()
      });
      
      const registeredUser: User = {
        id: docRef.id,
        username,
        fullName,
        isAdmin: false,
        isActive: true,
        expiryDate: expiryDate.toISOString(),
        createdAt: new Date().toISOString()
      };
      
      setUser(registeredUser);
      localStorage.setItem('user', JSON.stringify(registeredUser));
      
      return true;
    } catch (error) {
      console.error('خطأ في إنشاء الحساب:', error);
      toast({
        title: "خطأ في إنشاء الحساب",
        description: "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const enterAsGuest = () => {
    const guestUser: User = {
      id: 'guest',
      username: 'guest',
      fullName: 'ضيف',
      isAdmin: false,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    setUser(guestUser);
    localStorage.setItem('user', JSON.stringify(guestUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      enterAsGuest,
      isGuest,
      isPremiumUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
