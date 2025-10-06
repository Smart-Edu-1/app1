import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SupabaseAppDataContextType {
  subjects: any[];
  units: any[];
  lessons: any[];
  quizzes: any[];
  codes: any[];
  users: any[];
  notifications: any[];
  distributionCenters: any[];
  appSettings: any;
  loading: boolean;
  error: string | null;
  
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
  
  // Functions for users
  updateUser: (id: string, user: any) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  
  // Functions for notifications
  addNotification: (notification: any) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  
  // Functions for distribution centers
  createDistributionCenter: (center: any) => Promise<void>;
  updateDistributionCenter: (id: string, center: any) => Promise<void>;
  deleteDistributionCenter: (id: string) => Promise<void>;
  
  // Functions for app settings
  updateAppSettings: (settings: any) => Promise<void>;
  
  // Helper functions
  getLessonsByUnit: (unitId: string) => any[];
  getQuizzesByUnit: (unitId: string) => any[];
}

const SupabaseAppDataContext = createContext<SupabaseAppDataContextType | undefined>(undefined);

interface SupabaseAppDataProviderProps {
  children: ReactNode;
}

export const SupabaseAppDataProvider: React.FC<SupabaseAppDataProviderProps> = ({ children }) => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [codes, setCodes] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [distributionCenters, setDistributionCenters] = useState<any[]>([]);
  const [appSettings, setAppSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    loadData();
    const cleanup = setupRealtimeListeners();
    return cleanup;
  }, []);

  // Transform Supabase snake_case to camelCase
  const transformSubject = (subject: any) => ({
    ...subject,
    name: subject.title,
    imageUrl: subject.image_url,
    order: subject.order_index,
    isActive: subject.is_active,
    createdAt: subject.created_at
  });

  const transformUnit = (unit: any) => ({
    ...unit,
    name: unit.title,
    subjectId: unit.subject_id,
    imageUrl: unit.image_url,
    order: unit.order_index,
    isActive: unit.is_active,
    createdAt: unit.created_at
  });

  const transformLesson = (lesson: any) => ({
    ...lesson,
    name: lesson.title,
    unitId: lesson.unit_id,
    videoUrl: lesson.video_url,
    imageUrl: lesson.image_url,
    order: lesson.order_index,
    isPremium: !lesson.is_free,
    isActive: lesson.is_active,
    createdAt: lesson.created_at
  });

  const transformQuiz = (quiz: any) => ({
    ...quiz,
    lessonId: quiz.lesson_id,
    subjectId: quiz.subject_id,
    isActive: quiz.is_active,
    createdAt: quiz.created_at
  });

  const transformCode = (code: any) => ({
    ...code,
    isUsed: code.is_used,
    createdAt: code.created_at
  });

  const transformUser = (user: any) => ({
    ...user,
    fullName: user.full_name,
    isActive: user.is_active,
    isAdmin: user.is_admin,
    expiryDate: user.expiry_date,
    activationCode: user.activation_code,
    createdAt: user.created_at,
    userId: user.user_id
  });

  const transformNotification = (notification: any) => ({
    ...notification,
    isRead: notification.is_read,
    userId: notification.user_id,
    createdAt: notification.created_at
  });

  const transformDistributionCenter = (center: any) => ({
    ...center,
    workingHours: center.working_hours,
    orderIndex: center.order_index,
    order_index: center.order_index, // Keep both for compatibility
    isActive: center.is_active,
    is_active: center.is_active, // Keep both for compatibility
    createdAt: center.created_at
  });

  const loadData = async () => {
    setLoading(true);
    try {
      console.log('🔄 بدء تحميل البيانات من Supabase...');
      
      console.log('🔄 تحميل البيانات من Supabase...');
      
      // Load subjects
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects')
        .select('*')
        .order('order_index', { ascending: true });
      
      console.log('📚 بيانات المواد:', subjectsData, 'خطأ:', subjectsError);
      
      // Load units
      const { data: unitsData, error: unitsError } = await supabase
        .from('units')
        .select('*')
        .order('order_index', { ascending: true });
      
      console.log('📂 بيانات الوحدات:', unitsData, 'خطأ:', unitsError);
      
      // Load lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .order('order_index', { ascending: true });
      
      console.log('📖 بيانات الدروس:', lessonsData, 'خطأ:', lessonsError);
      
      // Load quizzes
      const { data: quizzesData, error: quizzesError } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('🧪 بيانات الاختبارات:', quizzesData, 'خطأ:', quizzesError);
      
      // Load activation codes
      const { data: codesData, error: codesError } = await supabase
        .from('activation_codes')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('🔑 بيانات الأكواد:', codesData, 'خطأ:', codesError);

      // Load users (profiles)
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('👥 بيانات المستخدمين:', usersData, 'خطأ:', usersError);

      // Load notifications
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('🔔 بيانات الإشعارات:', notificationsData, 'خطأ:', notificationsError);

      // Load distribution centers
      const { data: centersData, error: centersError } = await supabase
        .from('distribution_centers')
        .select('*')
        .order('order_index', { ascending: true });

      console.log('🏢 بيانات مراكز التوزيع:', centersData, 'خطأ:', centersError);

      // Load app settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('app_settings')
        .select('*')
        .single();

      console.log('⚙️ بيانات الإعدادات:', settingsData, 'خطأ:', settingsError);

      if (subjectsError) {
        console.error('❌ خطأ في تحميل المواد:', subjectsError);
        throw subjectsError;
      }

      const transformedSubjects = (subjectsData || []).map(transformSubject);
      const transformedUnits = (unitsData || []).map(transformUnit);
      const transformedLessons = (lessonsData || []).map(transformLesson);
      const transformedQuizzes = (quizzesData || []).map(transformQuiz);
      const transformedCodes = (codesData || []).map(transformCode);
      const transformedUsers = (usersData || []).map(transformUser);
      const transformedNotifications = (notificationsData || []).map(transformNotification);
      const transformedCenters = (centersData || []).map(transformDistributionCenter);
      
      // تحويل الإعدادات من key/value إلى كائن
      const transformedSettings: any = {};
      const settingsArray = Array.isArray(settingsData) ? settingsData : (settingsData ? [settingsData] : []);
      
      if (settingsArray.length > 0) {
        settingsArray.forEach((setting: any) => {
          try {
            transformedSettings[setting.key] = JSON.parse(setting.value);
          } catch {
            transformedSettings[setting.key] = setting.value;
          }
        });
      }
      
      const appSettings = {
        appName: transformedSettings.appName || 'Smart Edu',
        aboutText: transformedSettings.aboutText || '',
        subscriptionPrices: transformedSettings.subscriptionPrices || {
          monthly: '',
          quarterly: '',
          yearly: ''
        },
        themeColors: transformedSettings.themeColors || {
          primary: '',
          secondary: '',
          accent: ''
        },
        contactMethods: transformedSettings.contactMethods || [],
        subscriptionPlans: transformedSettings.subscriptionPlans || [],
        supportContacts: transformedSettings.supportContacts || { whatsapp: '', telegram: '', phone: '' },
        contactPageTitle: transformedSettings.contactPageTitle || 'تواصل معنا',
        contactPageDescription: transformedSettings.contactPageDescription || 'نحن هنا لمساعدتك في أي وقت',
        workingHoursTitle: transformedSettings.workingHoursTitle || 'أوقات العمل',
        workingHours: transformedSettings.workingHours || ['الأحد - الخميس: 9:00 صباحاً - 6:00 مساءً', 'الجمعة - السبت: 10:00 صباحاً - 4:00 مساءً'],
        adminCredentials: transformedSettings.adminCredentials || {
          username: '',
          password: ''
        }
      };

      console.log('✅ البيانات المحولة:', {
        subjects: transformedSubjects.length,
        units: transformedUnits.length,
        lessons: transformedLessons.length,
        quizzes: transformedQuizzes.length,
        codes: transformedCodes.length,
        users: transformedUsers.length,
        notifications: transformedNotifications.length,
        centers: transformedCenters.length,
        settings: transformedSettings
      });

      setSubjects(transformedSubjects);
      setUnits(transformedUnits);
      setLessons(transformedLessons);
      setQuizzes(transformedQuizzes);
      setCodes(transformedCodes);
      setUsers(transformedUsers);
      setNotifications(transformedNotifications);
      setDistributionCenters(transformedCenters);
      setAppSettings(transformedSettings);
    } catch (error) {
      console.error('💥 خطأ في تحميل البيانات:', error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: "حدث خطأ أثناء تحميل البيانات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeListeners = () => {
    // Listen to subjects changes
    const subjectsChannel = supabase
      .channel('subjects-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'subjects' }, 
        () => loadData()
      )
      .subscribe();

    // Listen to units changes
    const unitsChannel = supabase
      .channel('units-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'units' }, 
        () => loadData()
      )
      .subscribe();

    // Listen to lessons changes
    const lessonsChannel = supabase
      .channel('lessons-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'lessons' }, 
        () => loadData()
      )
      .subscribe();

    // Listen to quizzes changes
    const quizzesChannel = supabase
      .channel('quizzes-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'quizzes' }, 
        () => loadData()
      )
      .subscribe();

    // Listen to codes changes
    const codesChannel = supabase
      .channel('codes-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'activation_codes' }, 
        () => loadData()
      )
      .subscribe();

    // Listen to notifications changes
    const notificationsChannel = supabase
      .channel('notifications-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'notifications' }, 
        () => loadData()
      )
      .subscribe();

    // Listen to users/profiles changes
    const usersChannel = supabase
      .channel('users-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' }, 
        () => loadData()
      )
      .subscribe();

    // Listen to distribution centers changes
    const centersChannel = supabase
      .channel('centers-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'distribution_centers' }, 
        () => loadData()
      )
      .subscribe();

    // Listen to app settings changes
    const settingsChannel = supabase
      .channel('settings-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'app_settings' }, 
        () => loadData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subjectsChannel);
      supabase.removeChannel(unitsChannel);
      supabase.removeChannel(lessonsChannel);
      supabase.removeChannel(quizzesChannel);
      supabase.removeChannel(codesChannel);
      supabase.removeChannel(notificationsChannel);
      supabase.removeChannel(usersChannel);
      supabase.removeChannel(centersChannel);
      supabase.removeChannel(settingsChannel);
    };
  };

  // Subject functions
  const addSubject = async (subject: any) => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert({
          title: subject.name || subject.title,
          description: subject.description,
          image_url: subject.imageUrl || subject.image_url,
          is_active: subject.isActive !== undefined ? subject.isActive : true,
          order_index: subject.orderIndex || subject.order || 0
        })
        .select()
        .single();

      if (error) throw error;
      console.log('Subject added:', data);
    } catch (error) {
      console.error('Error adding subject:', error);
      toast({
        title: "خطأ في إضافة المادة",
        description: "حدث خطأ أثناء إضافة المادة",
        variant: "destructive"
      });
    }
  };

  const updateSubject = async (id: string, subject: any) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .update({
          title: subject.name || subject.title,
          description: subject.description,
          image_url: subject.imageUrl,
          order_index: subject.order,
          is_active: subject.isActive
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating subject:', error);
      toast({
        title: "خطأ في تحديث المادة",
        description: "حدث خطأ أثناء تحديث المادة",
        variant: "destructive"
      });
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast({
        title: "خطأ في حذف المادة",
        description: "حدث خطأ أثناء حذف المادة",
        variant: "destructive"
      });
    }
  };

  // Unit functions
  const addUnit = async (unit: any) => {
    try {
      const { data, error } = await supabase
        .from('units')
        .insert({
          subject_id: unit.subjectId,
          title: unit.name || unit.title,
          description: unit.description,
          image_url: unit.imageUrl,
          order_index: unit.order || 0,
          is_active: unit.isActive !== undefined ? unit.isActive : true
        })
        .select()
        .single();

      if (error) throw error;
      console.log('Unit added:', data);
    } catch (error) {
      console.error('Error adding unit:', error);
      toast({
        title: "خطأ في إضافة الوحدة",
        description: "حدث خطأ أثناء إضافة الوحدة",
        variant: "destructive"
      });
    }
  };

  const updateUnit = async (id: string, unit: any) => {
    try {
      const { error } = await supabase
        .from('units')
        .update({
          subject_id: unit.subjectId,
          title: unit.name || unit.title,
          description: unit.description,
          image_url: unit.imageUrl,
          order_index: unit.order,
          is_active: unit.isActive
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating unit:', error);
      toast({
        title: "خطأ في تحديث الوحدة",
        description: "حدث خطأ أثناء تحديث الوحدة",
        variant: "destructive"
      });
    }
  };

  const deleteUnit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('units')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting unit:', error);
      toast({
        title: "خطأ في حذف الوحدة",
        description: "حدث خطأ أثناء حذف الوحدة",
        variant: "destructive"
      });
    }
  };

  // Lesson functions
  const addLesson = async (lesson: any) => {
    try {
      // Get subject_id from the unit
      const unit = units.find(u => u.id === lesson.unitId);
      const subjectId = unit?.subjectId || lesson.subjectId;

      const { data, error } = await supabase
        .from('lessons')
        .insert({
          unit_id: lesson.unitId,
          subject_id: subjectId,
          title: lesson.name || lesson.title,
          description: lesson.description,
          video_url: lesson.videoUrl,
          order_index: lesson.order,
          is_active: lesson.isActive !== undefined ? lesson.isActive : true
        })
        .select()
        .single();

      if (error) throw error;
      console.log('Lesson added:', data);
    } catch (error) {
      console.error('Error adding lesson:', error);
      toast({
        title: "خطأ في إضافة الدرس",
        description: "حدث خطأ أثناء إضافة الدرس",
        variant: "destructive"
      });
    }
  };

  const updateLesson = async (id: string, lesson: any) => {
    try {
      // Get subject_id from the unit
      const unit = units.find(u => u.id === lesson.unitId);
      const subjectId = unit?.subjectId || lesson.subjectId;

      const { error } = await supabase
        .from('lessons')
        .update({
          unit_id: lesson.unitId,
          subject_id: subjectId,
          title: lesson.name || lesson.title,
          description: lesson.description,
          video_url: lesson.videoUrl,
          order_index: lesson.order,
          is_active: lesson.isActive
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast({
        title: "خطأ في تحديث الدرس",
        description: "حدث خطأ أثناء تحديث الدرس",
        variant: "destructive"
      });
    }
  };

  const deleteLesson = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast({
        title: "خطأ في حذف الدرس",
        description: "حدث خطأ أثناء حذف الدرس",
        variant: "destructive"
      });
    }
  };

  // Quiz functions
  const addQuiz = async (quiz: any) => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .insert({
          unit_id: quiz.unitId,
          subject_id: quiz.subjectId,
          title: quiz.title,
          description: quiz.description,
          questions: quiz.questions || [],
          is_active: quiz.isActive
        })
        .select()
        .single();

      if (error) throw error;
      console.log('Quiz added:', data);
    } catch (error) {
      console.error('Error adding quiz:', error);
      toast({
        title: "خطأ في إضافة الاختبار",
        description: "حدث خطأ أثناء إضافة الاختبار",
        variant: "destructive"
      });
    }
  };

  const updateQuiz = async (id: string, quiz: any) => {
    try {
      const { error } = await supabase
        .from('quizzes')
        .update({
          lesson_id: quiz.lessonId,
          subject_id: quiz.subjectId,
          title: quiz.title,
          description: quiz.description,
          questions: quiz.questions || [],
          is_active: quiz.isActive
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating quiz:', error);
      toast({
        title: "خطأ في تحديث الاختبار",
        description: "حدث خطأ أثناء تحديث الاختبار",
        variant: "destructive"
      });
    }
  };

  const deleteQuiz = async (id: string) => {
    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast({
        title: "خطأ في حذف الاختبار",
        description: "حدث خطأ أثناء حذف الاختبار",
        variant: "destructive"
      });
    }
  };

  // Code functions
  const addCode = async (code: any) => {
    try {
      const { data, error } = await supabase
        .from('activation_codes')
        .insert({
          code: code.code
        })
        .select()
        .single();

      if (error) throw error;
      console.log('Code added:', data);
    } catch (error) {
      console.error('Error adding code:', error);
      toast({
        title: "خطأ في إضافة الكود",
        description: "حدث خطأ أثناء إضافة كود التفعيل",
        variant: "destructive"
      });
    }
  };

  const updateCode = async (id: string, code: any) => {
    try {
      const { error } = await supabase
        .from('activation_codes')
        .update({
          code: code.code,
          is_used: code.isUsed
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating code:', error);
      toast({
        title: "خطأ في تحديث الكود",
        description: "حدث خطأ أثناء تحديث كود التفعيل",
        variant: "destructive"
      });
    }
  };

  const deleteCode = async (id: string) => {
    try {
      const { error } = await supabase
        .from('activation_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting code:', error);
      toast({
        title: "خطأ في حذف الكود",
        description: "حدث خطأ أثناء حذف كود التفعيل",
        variant: "destructive"
      });
    }
  };

  // User functions
  const updateUser = async (id: string, user: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: user.fullName,
          username: user.username,
          password: user.password,
          is_active: user.isActive,
          expiry_date: user.expiryDate
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "خطأ في تحديث المستخدم",
        description: "حدث خطأ أثناء تحديث بيانات المستخدم",
        variant: "destructive"
      });
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "خطأ في حذف المستخدم",
        description: "حدث خطأ أثناء حذف المستخدم",
        variant: "destructive"
      });
    }
  };

  // Helper functions
  const getLessonsByUnit = (unitId: string) => {
    return lessons.filter(lesson => lesson.unitId === unitId && lesson.isActive);
  };

  const getQuizzesByUnit = (unitId: string) => {
    return quizzes.filter(quiz => {
      // Find lessons in this unit and get quizzes for those lessons
      const unitLessons = lessons.filter(lesson => lesson.unitId === unitId);
      return unitLessons.some(lesson => quiz.lessonId === lesson.id) && quiz.isActive;
    });
  };

  // Notification functions
  const addNotification = async (notification: any) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          title: notification.title,
          message: notification.message,
          type: notification.type || 'info',
          user_id: notification.userId
        })
        .select()
        .single();

      if (error) throw error;
      console.log('Notification added:', data);
    } catch (error) {
      console.error('Error adding notification:', error);
      toast({
        title: "خطأ في إضافة الإشعار",
        description: "حدث خطأ أثناء إضافة الإشعار",
        variant: "destructive"
      });
    }
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "خطأ في تحديث الإشعار",
        description: "حدث خطأ أثناء تحديث حالة الإشعار",
        variant: "destructive"
      });
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: "خطأ في حذف الإشعار",
        description: "حدث خطأ أثناء حذف الإشعار",
        variant: "destructive"
      });
    }
  };

  // App Settings functions
  const updateAppSettings = async (settings: any) => {
    try {
      console.log('🔄 تحديث إعدادات التطبيق:', settings);
      
      // First try to get existing settings to get the correct ID
      const { data: existingSettings, error: fetchError } = await supabase
        .from('app_settings')
        .select('id')
        .limit(1);

      console.log('📋 السجلات الموجودة:', existingSettings, 'خطأ:', fetchError);

      if (fetchError) {
        console.error('❌ خطأ في جلب الإعدادات:', fetchError);
        throw fetchError;
      }

      if (!existingSettings || existingSettings.length === 0) {
        // إنشاء إعدادات جديدة بتنسيق key/value
        const settingsToInsert = [
          { key: 'appName', value: JSON.stringify(settings.appName) },
          { key: 'aboutText', value: JSON.stringify(settings.aboutText) },
          { key: 'subscriptionPrices', value: JSON.stringify(settings.subscriptionPrices) },
          { key: 'themeColors', value: JSON.stringify(settings.themeColors) },
          { key: 'contactMethods', value: JSON.stringify(settings.contactMethods || []) },
          { key: 'subscriptionPlans', value: JSON.stringify(settings.subscriptionPlans || []) },
          { key: 'supportContacts', value: JSON.stringify(settings.supportContacts || {}) },
          { key: 'contactPageTitle', value: JSON.stringify(settings.contactPageTitle || 'تواصل معنا') },
          { key: 'contactPageDescription', value: JSON.stringify(settings.contactPageDescription || 'نحن هنا لمساعدتك في أي وقت') },
          { key: 'workingHoursTitle', value: JSON.stringify(settings.workingHoursTitle || 'أوقات العمل') },
          { key: 'workingHours', value: JSON.stringify(settings.workingHours || []) },
          { key: 'adminCredentials', value: JSON.stringify(settings.adminCredentials || {}) }
        ];
        
        const { error: insertError } = await supabase
          .from('app_settings')
          .insert(settingsToInsert);
        
        if (insertError) {
          console.error('❌ خطأ في إنشاء الإعدادات:', insertError);
          throw insertError;
        }
        console.log('✅ تم إنشاء الإعدادات');
      } else {
        // تحديث الإعدادات الموجودة
        for (const [key, value] of Object.entries(settings)) {
          const jsonValue = JSON.stringify(value);
          await supabase
            .from('app_settings')
            .upsert({ key, value: jsonValue }, { onConflict: 'key' });
        }
        console.log('✅ تم تحديث الإعدادات');
      }
      
      console.log('✅ تم تحديث الإعدادات بنجاح');
      
      // Force reload data to refresh the context
      await loadData();
      
    } catch (error) {
      console.error('❌ خطأ في تحديث إعدادات التطبيق:', error);
      toast({
        title: "خطأ في تحديث الإعدادات",
        description: "حدث خطأ أثناء تحديث إعدادات التطبيق",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Distribution Center functions
  const createDistributionCenter = async (center: any) => {
    try {
      const { data, error } = await supabase
        .from('distribution_centers')
        .insert({
          name: center.name,
          address: center.address,
          phone: center.phone,
          working_hours: center.working_hours,
          latitude: center.latitude,
          longitude: center.longitude,
          is_active: center.is_active,
          order_index: center.order_index
        })
        .select()
        .single();

      if (error) throw error;
      console.log('Distribution center added:', data);
    } catch (error) {
      console.error('Error adding distribution center:', error);
      toast({
        title: "خطأ في إضافة المركز",
        description: "حدث خطأ أثناء إضافة مركز التوزيع",
        variant: "destructive"
      });
    }
  };

  const updateDistributionCenter = async (id: string, center: any) => {
    try {
      const { error } = await supabase
        .from('distribution_centers')
        .update({
          name: center.name,
          address: center.address,
          phone: center.phone,
          working_hours: center.working_hours,
          latitude: center.latitude,
          longitude: center.longitude,
          is_active: center.is_active,
          order_index: center.order_index
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating distribution center:', error);
      toast({
        title: "خطأ في تحديث المركز",
        description: "حدث خطأ أثناء تحديث مركز التوزيع",
        variant: "destructive"
      });
    }
  };

  const deleteDistributionCenter = async (id: string) => {
    try {
      const { error } = await supabase
        .from('distribution_centers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting distribution center:', error);
      toast({
        title: "خطأ في حذف المركز",
        description: "حدث خطأ أثناء حذف مركز التوزيع",
        variant: "destructive"
      });
    }
  };

  const value: SupabaseAppDataContextType = {
    subjects,
    units,
    lessons,
    quizzes,
    codes,
    users,
    error,
    notifications,
    distributionCenters,
    appSettings,
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
    updateUser,
    deleteUser,
    addNotification,
    markNotificationAsRead,
    deleteNotification,
    createDistributionCenter,
    updateDistributionCenter,
    deleteDistributionCenter,
    updateAppSettings,
    getLessonsByUnit,
    getQuizzesByUnit
  };

  return (
    <SupabaseAppDataContext.Provider value={value}>
      {children}
    </SupabaseAppDataContext.Provider>
  );
};

export const useSupabaseAppData = (): SupabaseAppDataContextType => {
  const context = useContext(SupabaseAppDataContext);
  if (context === undefined) {
    throw new Error('useSupabaseAppData must be used within a SupabaseAppDataProvider');
  }
  return context;
};