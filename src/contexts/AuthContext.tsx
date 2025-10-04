
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { getDeviceId, clearDeviceId } from '@/utils/deviceUtils';

interface User {
  id: string;
  username: string;
  fullName: string;
  isAdmin: boolean;
  isActive: boolean;
  expiryDate?: string;
  createdAt: string;
  deviceId?: string;
  isLoggedOut?: boolean;
  governorate?: string;
  studentPhone?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (username: string, password: string) => Promise<{ success: boolean; requiresTransfer?: boolean; message?: string }>;
  register: (fullName: string, username: string, password: string, activationCode: string, governorate?: string, studentPhone?: string) => Promise<boolean>;
  logout: () => void;
  enterAsGuest: () => void;
  isGuest: boolean;
  isPremiumUser: boolean;
  isLoading: boolean;
  activateSubject: (activationCode: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  login: async () => ({ success: false }),
  register: async () => false,
  logout: () => {},
  enterAsGuest: () => {},
  isGuest: false,
  isPremiumUser: false,
  isLoading: true,
  activateSubject: async () => ({ success: false, message: '' })
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkPersistedLogin = async () => {
      const persistedUser = localStorage.getItem('smart_edu_user');
      const deviceId = getDeviceId();
      
      if (persistedUser) {
        try {
          const userData = JSON.parse(persistedUser);
          
          // للضيوف - استعادة الحالة مباشرة
          if (userData.id === 'guest') {
            setUser(userData);
            setIsLoading(false);
            return;
          }
          
          // للمستخدمين المسجلين - التحقق من قاعدة البيانات
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userData.id)
            .eq('is_active', true)
            .single();

          if (!profile || error) {
            localStorage.removeItem('smart_edu_user');
            setIsLoading(false);
            return;
          }

          // التحقق من دور المستخدم
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.id)
            .single();

          const isAdmin = roleData?.role === 'admin';

          // للمشرفين - السماح بتسجيل الدخول بدون قيود
          if (isAdmin) {
            const restoredUser: User = {
              id: profile.id,
              username: profile.username,
              fullName: profile.full_name,
              isAdmin: true,
              isActive: profile.is_active,
              expiryDate: profile.expiry_date,
              createdAt: profile.created_at,
              deviceId: profile.device_id,
              isLoggedOut: false
            };
            
            setUser(restoredUser);
            setIsLoading(false);
            return;
          }

          // للطلاب - التحقق من معرف الجهاز
          if (profile.device_id && profile.device_id === deviceId && !profile.is_logged_out) {
            const restoredUser: User = {
              id: profile.id,
              username: profile.username,
              fullName: profile.full_name,
              isAdmin: false,
              isActive: profile.is_active,
              expiryDate: profile.expiry_date,
              createdAt: profile.created_at,
              deviceId: profile.device_id,
              isLoggedOut: false
            };
            
            setUser(restoredUser);
            setIsLoading(false);
            return;
          }
          
          localStorage.removeItem('smart_edu_user');
        } catch (error) {
          console.error('خطأ في استعادة المستخدم:', error);
          localStorage.removeItem('smart_edu_user');
        }
      }
      
      setIsLoading(false);
    };

    checkPersistedLogin();

    // مراقبة تحديثات قاعدة البيانات للطلاب فقط
    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          const updatedProfile = payload.new as any;
          
          // إذا تم حذف معرف الجهاز من قبل المشرف للطلاب فقط
          if (user && user.id === updatedProfile.id && !user.isAdmin) {
            if (!updatedProfile.device_id && user.deviceId) {
              // تسجيل خروج فوري
              setUser(null);
              setSession(null);
              localStorage.removeItem('smart_edu_user');
              
              toast({
                title: "تم تسجيل خروجك",
                description: "تم تسجيل خروجك من قبل المشرف",
                variant: "destructive"
              });
            }
          }
        }
      )
      .subscribe();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
      }
    );

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  // Calculate isGuest and isPremiumUser based on user state
  const isGuest = user?.id === 'guest';
  const isPremiumUser = user ? !isGuest && user.isActive && (!user.expiryDate || new Date(user.expiryDate) > new Date()) : false;

  console.log('AuthContext current state:', { user, isGuest, isPremiumUser, isLoading });

  const login = async (username: string, password: string): Promise<{ success: boolean; requiresTransfer?: boolean; message?: string }> => {
    try {
      const deviceId = getDeviceId();
      console.log('محاولة تسجيل الدخول:', { username, deviceId });
      
      // البحث عن المستخدم في جدول profiles
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .eq('is_active', true)
        .single();

      if (error || !profile) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "اسم المستخدم أو كلمة المرور غير صحيحة",
          variant: "destructive"
        });
        return { success: false };
      }

      // التحقق من دور المستخدم
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', profile.id)
        .single();

      const isAdmin = roleData?.role === 'admin';

      // للمشرفين - السماح بتسجيل الدخول من أي جهاز بدون أي قيود
      if (isAdmin) {
        const userData: User = {
          id: profile.id,
          username: profile.username,
          fullName: profile.full_name,
          isAdmin: true,
          isActive: profile.is_active,
          expiryDate: profile.expiry_date,
          createdAt: profile.created_at,
          deviceId: profile.device_id,
          isLoggedOut: false,
          governorate: profile.governorate,
          studentPhone: profile.student_phone
        };
        
        setUser(userData);
        localStorage.setItem('smart_edu_user', JSON.stringify(userData));
        return { success: true };
      }

      // للطلاب - التحقق من معرف الجهاز
      if (profile.device_id && profile.device_id !== deviceId) {
        console.log('Device ID mismatch:', { stored: profile.device_id, current: deviceId });
        return { 
          success: false, 
          requiresTransfer: true, 
          message: "لا يمكن الدخول من جهاز آخر. يمكنك نقل الحساب عبر الدعم." 
        };
      }

      // للطلاب مع device_id مطابق - دخول مباشر بدون التحقق من is_logged_out
      if (profile.device_id && profile.device_id === deviceId) {
        // تحديث حالة تسجيل الخروج إلى false
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ is_logged_out: false })
          .eq('id', profile.id);

        if (updateError) {
          console.error('خطأ في تحديث حالة تسجيل الدخول:', updateError);
          toast({
            title: "خطأ في تسجيل الدخول",
            description: "حدث خطأ أثناء تسجيل الدخول",
            variant: "destructive"
          });
          return { success: false };
        }

        const userData: User = {
          id: profile.id,
          username: profile.username,
          fullName: profile.full_name,
          isAdmin: false,
          isActive: profile.is_active,
          expiryDate: profile.expiry_date,
          createdAt: profile.created_at,
          deviceId: profile.device_id,
          isLoggedOut: false,
          governorate: profile.governorate,
          studentPhone: profile.student_phone
        };
        
        setUser(userData);
        localStorage.setItem('smart_edu_user', JSON.stringify(userData));
        return { success: true };
      }

      // للطلاب الذين ليس لديهم معرف جهاز - التحقق من حالة تسجيل الخروج
      if (!profile.device_id) {
        if (profile.is_logged_out) {
          toast({
            title: "يجب تسجيل الخروج أولاً",
            description: "يجب تسجيل الخروج من الجلسة السابقة قبل تسجيل الدخول مرة أخرى",
            variant: "destructive"
          });
          return { success: false };
        }

        // إضافة معرف الجهاز الجديد وتحديث حالة تسجيل الخروج
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            device_id: deviceId,
            is_logged_out: false 
          })
          .eq('id', profile.id);

        if (updateError) {
          console.error('خطأ في تحديث معرف الجهاز:', updateError);
          toast({
            title: "خطأ في تسجيل الدخول",
            description: "حدث خطأ أثناء تسجيل الدخول",
            variant: "destructive"
          });
          return { success: false };
        }

        const userData: User = {
          id: profile.id,
          username: profile.username,
          fullName: profile.full_name,
          isAdmin: false,
          isActive: profile.is_active,
          expiryDate: profile.expiry_date,
          createdAt: profile.created_at,
          deviceId: deviceId,
          isLoggedOut: false,
          governorate: profile.governorate,
          studentPhone: profile.student_phone
        };
        
        setUser(userData);
        localStorage.setItem('smart_edu_user', JSON.stringify(userData));
        return { success: true };
      }

      return { success: false };
    } catch (error: any) {
      console.error('خطأ غير متوقع في تسجيل الدخول:', error);
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "حدث خطأ غير متوقع",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  const register = async (fullName: string, username: string, password: string, activationCode: string, governorate?: string, studentPhone?: string): Promise<boolean> => {
    try {
      console.log('محاولة إنشاء حساب جديد');
      const deviceId = getDeviceId();
      
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

      // إنشاء تاريخ انتهاء الصلاحية (سنة من الآن)
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      // إنشاء المستخدم في جدول profiles مباشرة مع معرف الجهاز
      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          full_name: fullName,
          username: username,
          password: password,
          is_active: true,
          expiry_date: expiryDate.toISOString(),
          activation_code: activationCode || null,
          device_id: deviceId,
          is_logged_out: false,
          governorate: governorate || null,
          student_phone: studentPhone || null
        })
        .select()
        .single();

      if (profileError) {
        console.error('خطأ في إنشاء الحساب:', profileError);
        toast({
          title: "خطأ في إنشاء الحساب",
          description: "حدث خطأ أثناء إنشاء الحساب",
          variant: "destructive"
        });
        return false;
      }

      // إنشاء بيانات المستخدم الجديد
      const userData: User = {
        id: newProfile.id,
        username: newProfile.username,
        fullName: newProfile.full_name,
        isAdmin: false,
        isActive: newProfile.is_active,
        expiryDate: newProfile.expiry_date,
        createdAt: newProfile.created_at,
        deviceId: newProfile.device_id,
        isLoggedOut: false,
        governorate: newProfile.governorate,
        studentPhone: newProfile.student_phone
      };

      // إضافة دور الطالب
      await supabase
        .from('user_roles')
        .insert({
          user_id: newProfile.id,
          role: 'student'
        });
      
      // إذا كان هناك كود تفعيل، نقوم بتفعيله
      if (activationCode) {
        await activateSubject(activationCode);
      }
      
      setUser(userData);
      
      // حفظ حالة المستخدم في localStorage للبقاء مسجل الدخول
      localStorage.setItem('smart_edu_user', JSON.stringify(userData));
      
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: `مرحباً ${fullName}`
      });

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

  const logout = async () => {
    console.log('بدء تسجيل الخروج للمستخدم:', user);
    
    if (user && user.id !== 'guest') {
      // تحديث حالة تسجيل الخروج في قاعدة البيانات (للطلاب فقط)
      if (!user.isAdmin) {
        await supabase
          .from('profiles')
          .update({ is_logged_out: true })
          .eq('id', user.id);
      }
    }
    
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    
    // مسح البيانات المحفوظة
    localStorage.removeItem('smart_edu_user');
    
    console.log('تم تسجيل الخروج وتحديث حالة قاعدة البيانات');
  };

  const enterAsGuest = () => {
    console.log('الدخول كضيف...');
    const guestUser: User = {
      id: 'guest',
      username: 'guest',
      fullName: 'ضيف',
      isAdmin: false,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    setUser(guestUser);
    
    // حفظ حالة الضيف في localStorage
    localStorage.setItem('smart_edu_user', JSON.stringify(guestUser));
    
    console.log('تم الدخول كضيف:', guestUser);
  };

  const activateSubject = async (activationCode: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (!user || user.id === 'guest') {
        return { success: false, message: 'يجب تسجيل الدخول أولاً' };
      }

      // التحقق من وجود كود التفعيل
      const { data: codeData, error: codeError } = await supabase
        .from('activation_codes')
        .select('*')
        .eq('code', activationCode)
        .eq('is_used', false)
        .single();

      if (codeError || !codeData) {
        return { success: false, message: 'كود تفعيل غير صحيح أو مستخدم بالفعل' };
      }

      // تحديث حالة الكود
      await supabase
        .from('activation_codes')
        .update({ 
          is_used: true, 
          used_by: user.id,
          used_at: new Date().toISOString()
        })
        .eq('id', codeData.id);

      // إذا كان كود تفعيل كامل المنهاج
      if (codeData.is_full_curriculum) {
        // الحصول على جميع المواد
        const { data: subjects } = await supabase
          .from('subjects')
          .select('id');

        if (subjects) {
          // تفعيل جميع المواد
          for (const subject of subjects) {
            await supabase
              .from('student_subjects')
              .upsert({
                student_id: user.id,
                subject_id: subject.id,
                activation_code: activationCode
              });
          }
        }

        return { success: true, message: 'تم تفعيل جميع المواد بنجاح!' };
      }

      // تفعيل مادة واحدة
      if (codeData.subject_id) {
        await supabase
          .from('student_subjects')
          .upsert({
            student_id: user.id,
            subject_id: codeData.subject_id,
            activation_code: activationCode
          });

        return { success: true, message: 'تم تفعيل المادة بنجاح!' };
      }

      return { success: false, message: 'كود التفعيل غير صالح' };
    } catch (error) {
      console.error('خطأ في تفعيل المادة:', error);
      return { success: false, message: 'حدث خطأ أثناء التفعيل' };
    }
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
      isPremiumUser,
      isLoading,
      activateSubject
    }}>
      {children}
    </AuthContext.Provider>
  );
};
