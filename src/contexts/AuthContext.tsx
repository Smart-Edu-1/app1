import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
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
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, username: string, email: string, password: string, activationCode: string) => Promise<boolean>;
  logout: () => void;
  enterAsGuest: () => void;
  isGuest: boolean;
  isPremiumUser: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
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
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile from our profiles table
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (profile && !error) {
            const userData: User = {
              id: profile.id,
              username: profile.username,
              fullName: profile.full_name,
              isAdmin: profile.is_admin,
              isActive: profile.is_active,
              expiryDate: profile.expiry_date,
              createdAt: profile.created_at
            };
            setUser(userData);
          } else {
            console.error('Error fetching profile:', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Calculate isGuest and isPremiumUser based on user state
  const isGuest = user?.id === 'guest';
  const isPremiumUser = user ? !isGuest && user.isActive && (!user.expiryDate || new Date(user.expiryDate) > new Date()) : false;

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('محاولة تسجيل الدخول...', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('خطأ في تسجيل الدخول:', error);
        
        let errorMessage = "حدث خطأ أثناء تسجيل الدخول";
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "يرجى تأكيد البريد الإلكتروني أولاً";
        }
        
        toast({
          title: "خطأ في تسجيل الدخول",
          description: errorMessage,
          variant: "destructive"
        });
        return false;
      }

      console.log('تم تسجيل الدخول بنجاح');
      return true;
    } catch (error: any) {
      console.error('خطأ غير متوقع في تسجيل الدخول:', error);
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "حدث خطأ غير متوقع",
        variant: "destructive"
      });
      return false;
    }
  };

  const register = async (fullName: string, username: string, email: string, password: string, activationCode: string): Promise<boolean> => {
    try {
      console.log('محاولة التحقق من كود التفعيل:', activationCode);
      
      // التحقق من وجود كود التفعيل
      const { data: codeData, error: codeError } = await supabase
        .from('activation_codes')
        .select('*')
        .eq('code', activationCode)
        .eq('is_used', false)
        .single();

      if (codeError || !codeData) {
        toast({
          title: "كود تفعيل غير صحيح",
          description: "كود التفعيل غير موجود أو مستخدم بالفعل",
          variant: "destructive"
        });
        return false;
      }

      // التحقق من عدم وجود اسم المستخدم مسبقاً
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        toast({
          title: "اسم المستخدم موجود",
          description: "اسم المستخدم موجود بالفعل. يرجى اختيار اسم آخر",
          variant: "destructive"
        });
        return false;
      }

      // إنشاء تاريخ انتهاء الصلاحية
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      // إنشاء المستخدم في Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
            username: username,
            password: password
          }
        }
      });

      if (authError) {
        console.error('خطأ في إنشاء الحساب:', authError);
        
        let errorMessage = "حدث خطأ أثناء إنشاء الحساب";
        
        if (authError.message.includes('User already registered')) {
          errorMessage = "البريد الإلكتروني مسجل بالفعل";
        }
        
        toast({
          title: "خطأ في إنشاء الحساب",
          description: errorMessage,
          variant: "destructive"
        });
        return false;
      }

      if (authData.user) {
        // إنشاء profile للمستخدم
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: authData.user.id,
            full_name: fullName,
            username: username,
            password: password, // في التطبيق الحقيقي، لا نحفظ كلمة المرور بهذا الشكل
            is_active: true,
            is_admin: false,
            expiry_date: expiryDate.toISOString(),
            activation_code: activationCode
          });

        if (profileError) {
          console.error('خطأ في إنشاء ملف التعريف:', profileError);
          toast({
            title: "خطأ في إنشاء الحساب",
            description: "حدث خطأ أثناء إنشاء ملف التعريف",
            variant: "destructive"
          });
          return false;
        }

        // تحديث كود التفعيل كمستخدم
        await supabase
          .from('activation_codes')
          .update({
            is_used: true
          })
          .eq('id', codeData.id);

        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "يرجى تأكيد البريد الإلكتروني إذا كان مطلوباً",
        });

        return true;
      }

      return false;
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

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
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
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
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