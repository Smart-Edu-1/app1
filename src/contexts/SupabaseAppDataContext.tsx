import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  image_url?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

interface Unit {
  id: string;
  subject_id: string;
  name: string;
  description: string;
  image_url?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

interface Lesson {
  id: string;
  unit_id: string;
  title: string;
  description: string;
  content?: string;
  video_url?: string;
  image_url?: string;
  order_index: number;
  is_free: boolean;
  is_active: boolean;
  created_at: string;
}

interface Quiz {
  id: string;
  lesson_id?: string;
  subject_id?: string;
  title: string;
  description: string;
  questions: any;
  time_limit?: number;
  is_active: boolean;
  created_at: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  user_id?: string;
  created_at: string;
}

interface AppDataContextType {
  subjects: Subject[];
  units: Unit[];
  lessons: Lesson[];
  quizzes: Quiz[];
  notifications: Notification[];
  loading: boolean;
  
  // Subject methods
  addSubject: (data: Omit<Subject, 'id' | 'created_at'>) => Promise<void>;
  updateSubject: (id: string, data: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  
  // Unit methods
  addUnit: (data: Omit<Unit, 'id' | 'created_at'>) => Promise<void>;
  updateUnit: (id: string, data: Partial<Unit>) => Promise<void>;
  deleteUnit: (id: string) => Promise<void>;
  
  // Lesson methods
  addLesson: (data: Omit<Lesson, 'id' | 'created_at'>) => Promise<void>;
  updateLesson: (id: string, data: Partial<Lesson>) => Promise<void>;
  deleteLesson: (id: string) => Promise<void>;
  
  // Quiz methods
  addQuiz: (data: Omit<Quiz, 'id' | 'created_at'>) => Promise<void>;
  updateQuiz: (id: string, data: Partial<Quiz>) => Promise<void>;
  deleteQuiz: (id: string) => Promise<void>;
  
  // Notification methods
  addNotification: (data: Omit<Notification, 'id' | 'created_at'>) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

const AppDataContext = createContext<AppDataContextType>({} as AppDataContextType);

export const useSupabaseAppData = () => useContext(AppDataContext);

export const SupabaseAppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [subjectsData, unitsData, lessonsData, quizzesData, notificationsData] = await Promise.all([
        supabase.from('subjects').select('*').order('order_index'),
        supabase.from('units').select('*').order('order_index'),
        supabase.from('lessons').select('*').order('order_index'),
        supabase.from('quizzes').select('*').order('created_at', { ascending: false }),
        supabase.from('notifications').select('*').order('created_at', { ascending: false })
      ]);

      if (subjectsData.data) setSubjects(subjectsData.data);
      if (unitsData.data) setUnits(unitsData.data);
      if (lessonsData.data) setLessons(lessonsData.data);
      if (quizzesData.data) setQuizzes(quizzesData.data);
      if (notificationsData.data) setNotifications(notificationsData.data);
      
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: "حدث خطأ أثناء تحميل البيانات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Subject methods
  const addSubject = async (data: Omit<Subject, 'id' | 'created_at'>) => {
    try {
      const { data: newSubject, error } = await supabase
        .from('subjects')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      if (newSubject) setSubjects(prev => [...prev, newSubject]);
    } catch (error) {
      console.error('Error adding subject:', error);
      toast({
        title: "خطأ في إضافة المادة",
        description: "حدث خطأ أثناء إضافة المادة",
        variant: "destructive"
      });
    }
  };

  const updateSubject = async (id: string, data: Partial<Subject>) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      setSubjects(prev => prev.map(subject => 
        subject.id === id ? { ...subject, ...data } : subject
      ));
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
      setSubjects(prev => prev.filter(subject => subject.id !== id));
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast({
        title: "خطأ في حذف المادة",
        description: "حدث خطأ أثناء حذف المادة",
        variant: "destructive"
      });
    }
  };

  // Unit methods
  const addUnit = async (data: Omit<Unit, 'id' | 'created_at'>) => {
    try {
      const { data: newUnit, error } = await supabase
        .from('units')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      if (newUnit) setUnits(prev => [...prev, newUnit]);
    } catch (error) {
      console.error('Error adding unit:', error);
      toast({
        title: "خطأ في إضافة الوحدة",
        description: "حدث خطأ أثناء إضافة الوحدة",
        variant: "destructive"
      });
    }
  };

  const updateUnit = async (id: string, data: Partial<Unit>) => {
    try {
      const { error } = await supabase
        .from('units')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      setUnits(prev => prev.map(unit => 
        unit.id === id ? { ...unit, ...data } : unit
      ));
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
      setUnits(prev => prev.filter(unit => unit.id !== id));
    } catch (error) {
      console.error('Error deleting unit:', error);
      toast({
        title: "خطأ في حذف الوحدة",
        description: "حدث خطأ أثناء حذف الوحدة",
        variant: "destructive"
      });
    }
  };

  // Lesson methods
  const addLesson = async (data: Omit<Lesson, 'id' | 'created_at'>) => {
    try {
      const { data: newLesson, error } = await supabase
        .from('lessons')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      if (newLesson) setLessons(prev => [...prev, newLesson]);
    } catch (error) {
      console.error('Error adding lesson:', error);
      toast({
        title: "خطأ في إضافة الدرس",
        description: "حدث خطأ أثناء إضافة الدرس",
        variant: "destructive"
      });
    }
  };

  const updateLesson = async (id: string, data: Partial<Lesson>) => {
    try {
      const { error } = await supabase
        .from('lessons')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      setLessons(prev => prev.map(lesson => 
        lesson.id === id ? { ...lesson, ...data } : lesson
      ));
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
      setLessons(prev => prev.filter(lesson => lesson.id !== id));
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast({
        title: "خطأ في حذف الدرس",
        description: "حدث خطأ أثناء حذف الدرس",
        variant: "destructive"
      });
    }
  };

  // Quiz methods
  const addQuiz = async (data: Omit<Quiz, 'id' | 'created_at'>) => {
    try {
      const { data: newQuiz, error } = await supabase
        .from('quizzes')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      if (newQuiz) setQuizzes(prev => [newQuiz, ...prev]);
    } catch (error) {
      console.error('Error adding quiz:', error);
      toast({
        title: "خطأ في إضافة الاختبار",
        description: "حدث خطأ أثناء إضافة الاختبار",
        variant: "destructive"
      });
    }
  };

  const updateQuiz = async (id: string, data: Partial<Quiz>) => {
    try {
      const { error } = await supabase
        .from('quizzes')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      setQuizzes(prev => prev.map(quiz => 
        quiz.id === id ? { ...quiz, ...data } : quiz
      ));
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
      setQuizzes(prev => prev.filter(quiz => quiz.id !== id));
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast({
        title: "خطأ في حذف الاختبار",
        description: "حدث خطأ أثناء حذف الاختبار",
        variant: "destructive"
      });
    }
  };

  // Notification methods
  const addNotification = async (data: Omit<Notification, 'id' | 'created_at'>) => {
    try {
      const { data: newNotification, error } = await supabase
        .from('notifications')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      if (newNotification) setNotifications(prev => [newNotification, ...prev]);
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
      setNotifications(prev => prev.map(notification => 
        notification.id === id ? { ...notification, is_read: true } : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: "خطأ في حذف الإشعار",
        description: "حدث خطأ أثناء حذف الإشعار",
        variant: "destructive"
      });
    }
  };

  return (
    <AppDataContext.Provider value={{
      subjects,
      units,
      lessons,
      quizzes,
      notifications,
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
      addNotification,
      markNotificationAsRead,
      deleteNotification
    }}>
      {children}
    </AppDataContext.Provider>
  );
};