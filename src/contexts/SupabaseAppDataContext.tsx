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
  
  const { toast } = useToast();

  useEffect(() => {
    loadData();
    const cleanup = setupRealtimeListeners();
    return cleanup;
  }, []);

  // Transform Supabase snake_case to camelCase
  const transformSubject = (subject: any) => ({
    ...subject,
    imageUrl: subject.image_url,
    order: subject.order_index,
    isActive: subject.is_active,
    createdAt: subject.created_at
  });

  const transformUnit = (unit: any) => ({
    ...unit,
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
    isActive: center.is_active,
    createdAt: center.created_at
  });

  const loadData = async () => {
    setLoading(true);
    try {
      console.log('🔄 بدء تحميل البيانات من Supabase...');
      
      // اختبار الاتصال أولاً
      console.log('🧪 اختبار الاتصال مع Supabase...');
      const testResponse = await fetch('https://nmzqqgcbfhvajzqyrequ.supabase.co/rest/v1/subjects?select=count', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tenFxZ2NiZmh2YWp6cXlyZXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MDc5MDAsImV4cCI6MjA2NTQ4MzkwMH0.tIlI6hdFqCdvfOGojAOhfgAbhnFWil4EbR8-MZLkPOA',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tenFxZ2NiZmh2YWp6cXlyZXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MDc5MDAsImV4cCI6MjA2NTQ4MzkwMH0.tIlI6hdFqCdvfOGojAOhfgAbhnFWil4EbR8-MZLkPOA',
          'Content-Type': 'application/json'
        }
      });
      console.log('🧪 نتيجة اختبار الاتصال:', testResponse.status, testResponse.statusText);
      
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
      const transformedSettings = settingsData ? {
        appName: settingsData.app_name,
        aboutText: settingsData.about_text,
        subscriptionPrices: {
          monthly: settingsData.monthly_price,
          quarterly: settingsData.quarterly_price,
          yearly: settingsData.yearly_price
        },
        themeColors: {
          primary: settingsData.primary_color,
          secondary: settingsData.secondary_color,
          accent: settingsData.accent_color
        },
        contactMethods: settingsData.contact_methods || [],
        subscriptionPlans: settingsData.subscription_plans || [],
        supportContacts: settingsData.support_contacts || { whatsapp: '', telegram: '', phone: '' },
        contactPageTitle: settingsData.contact_page_title || 'تواصل معنا',
        contactPageDescription: settingsData.contact_page_description || 'نحن هنا لمساعدتك في أي وقت',
        workingHoursTitle: settingsData.working_hours_title || 'أوقات العمل',
        workingHours: settingsData.working_hours || ['الأحد - الخميس: 9:00 صباحاً - 6:00 مساءً', 'الجمعة - السبت: 10:00 صباحاً - 4:00 مساءً'],
        adminCredentials: {
          username: settingsData.admin_username,
          password: settingsData.admin_password
        }
      } : {};

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
          name: subject.name,
          description: subject.description,
          icon: subject.icon,
          color: subject.color,
          image_url: subject.imageUrl,
          order_index: subject.order,
          is_active: subject.isActive
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
          name: subject.name,
          description: subject.description,
          icon: subject.icon,
          color: subject.color,
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
          name: unit.name,
          description: unit.description,
          image_url: unit.imageUrl,
          order_index: unit.order,
          is_active: unit.isActive
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
          name: unit.name,
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
      const { data, error } = await supabase
        .from('lessons')
        .insert({
          unit_id: lesson.unitId,
          title: lesson.name,
          description: lesson.description,
          content: lesson.content,
          video_url: lesson.videoUrl,
          image_url: lesson.imageUrl,
          order_index: lesson.order,
          is_free: !lesson.isPremium,
          is_active: lesson.isActive
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
      const { error } = await supabase
        .from('lessons')
        .update({
          unit_id: lesson.unitId,
          title: lesson.name,
          description: lesson.description,
          content: lesson.content,
          video_url: lesson.videoUrl,
          image_url: lesson.imageUrl,
          order_index: lesson.order,
          is_free: !lesson.isPremium,
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
          lesson_id: quiz.lessonId,
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
        console.log('📝 إنشاء إعدادات جديدة...');
        // If no settings exist, create new ones
        const { data: newData, error: insertError } = await supabase
          .from('app_settings')
          .insert({
            app_name: settings.appName,
            about_text: settings.aboutText,
            monthly_price: settings.subscriptionPrices?.monthly || 9.99,
            quarterly_price: settings.subscriptionPrices?.quarterly || 24.99,
            yearly_price: settings.subscriptionPrices?.yearly || 89.99,
            primary_color: settings.themeColors?.primary || '#3B82F6',
            secondary_color: settings.themeColors?.secondary || '#10B981',
            accent_color: settings.themeColors?.accent || '#F59E0B',
            contact_methods: settings.contactMethods || [],
            subscription_plans: settings.subscriptionPlans || [],
            support_contacts: settings.supportContacts || { whatsapp: '', telegram: '', phone: '' },
            contact_page_title: settings.contactPageTitle || 'تواصل معنا',
            contact_page_description: settings.contactPageDescription || 'نحن هنا لمساعدتك في أي وقت',
            working_hours_title: settings.workingHoursTitle || 'أوقات العمل',
            working_hours: settings.workingHours || ['الأحد - الخميس: 9:00 صباحاً - 6:00 مساءً', 'الجمعة - السبت: 10:00 صباحاً - 4:00 مساءً'],
            admin_username: settings.adminCredentials?.username || 'admin',
            admin_password: settings.adminCredentials?.password || 'admin123'
          })
          .select()
          .single();
        
        if (insertError) {
          console.error('❌ خطأ في إنشاء الإعدادات:', insertError);
          throw insertError;
        }
        console.log('✅ تم إنشاء الإعدادات:', newData);
      } else {
        console.log('🔄 تحديث الإعدادات الموجودة...', existingSettings[0].id);
        // Update existing settings using the first record's ID
        const { data: updatedData, error: updateError } = await supabase
          .from('app_settings')
          .update({
            app_name: settings.appName,
            about_text: settings.aboutText,
            monthly_price: settings.subscriptionPrices?.monthly || 9.99,
            quarterly_price: settings.subscriptionPrices?.quarterly || 24.99,
            yearly_price: settings.subscriptionPrices?.yearly || 89.99,
            primary_color: settings.themeColors?.primary || '#3B82F6',
            secondary_color: settings.themeColors?.secondary || '#10B981',
            accent_color: settings.themeColors?.accent || '#F59E0B',
            contact_methods: settings.contactMethods || [],
            subscription_plans: settings.subscriptionPlans || [],
            support_contacts: settings.supportContacts || { whatsapp: '', telegram: '', phone: '' },
            contact_page_title: settings.contactPageTitle || 'تواصل معنا',
            contact_page_description: settings.contactPageDescription || 'نحن هنا لمساعدتك في أي وقت',
            working_hours_title: settings.workingHoursTitle || 'أوقات العمل',
            working_hours: settings.workingHours || ['الأحد - الخميس: 9:00 صباحاً - 6:00 مساءً', 'الجمعة - السبت: 10:00 صباحاً - 4:00 مساءً'],
            admin_username: settings.adminCredentials?.username || 'admin',
            admin_password: settings.adminCredentials?.password || 'admin123'
          })
          .eq('id', existingSettings[0].id)
          .select();

        if (updateError) {
          console.error('❌ خطأ في تحديث الإعدادات:', updateError);
          throw updateError;
        }
        console.log('✅ تم تحديث الإعدادات:', updatedData);
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