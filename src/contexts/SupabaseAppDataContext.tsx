import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SupabaseAppDataContextType {
  subjects: any[];
  units: any[];
  lessons: any[];
  quizzes: any[];
  codes: any[];
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
    unitId: lesson.unit_id,
    videoUrl: lesson.video_url,
    imageUrl: lesson.image_url,
    order: lesson.order_index,
    isFree: lesson.is_free,
    isActive: lesson.is_active,
    createdAt: lesson.created_at
  });

  const transformQuiz = (quiz: any) => ({
    ...quiz,
    lessonId: quiz.lesson_id,
    subjectId: quiz.subject_id,
    timeLimit: quiz.time_limit,
    isActive: quiz.is_active,
    createdAt: quiz.created_at
  });

  const transformCode = (code: any) => ({
    ...code,
    isUsed: code.is_used,
    createdAt: code.created_at
  });

  const loadData = async () => {
    setLoading(true);
    try {
      // Load subjects
      const { data: subjectsData } = await supabase
        .from('subjects')
        .select('*')
        .order('order_index', { ascending: true });
      
      // Load units
      const { data: unitsData } = await supabase
        .from('units')
        .select('*')
        .order('order_index', { ascending: true });
      
      // Load lessons
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .order('order_index', { ascending: true });
      
      // Load quizzes
      const { data: quizzesData } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Load activation codes
      const { data: codesData } = await supabase
        .from('activation_codes')
        .select('*')
        .order('created_at', { ascending: false });

      setSubjects((subjectsData || []).map(transformSubject));
      setUnits((unitsData || []).map(transformUnit));
      setLessons((lessonsData || []).map(transformLesson));
      setQuizzes((quizzesData || []).map(transformQuiz));
      setCodes((codesData || []).map(transformCode));
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

    return () => {
      supabase.removeChannel(subjectsChannel);
      supabase.removeChannel(unitsChannel);
      supabase.removeChannel(lessonsChannel);
      supabase.removeChannel(quizzesChannel);
      supabase.removeChannel(codesChannel);
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
          title: lesson.title,
          description: lesson.description,
          content: lesson.content,
          video_url: lesson.videoUrl,
          image_url: lesson.imageUrl,
          order_index: lesson.order,
          is_free: lesson.isFree,
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
          title: lesson.title,
          description: lesson.description,
          content: lesson.content,
          video_url: lesson.videoUrl,
          image_url: lesson.imageUrl,
          order_index: lesson.order,
          is_free: lesson.isFree,
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
          time_limit: quiz.timeLimit,
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
          time_limit: quiz.timeLimit,
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

  const value: SupabaseAppDataContextType = {
    subjects,
    units,
    lessons,
    quizzes,
    codes,
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