
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseAppData } from '@/contexts/SupabaseAppDataContext';
import { AppSettingsProvider } from '@/contexts/AppSettingsContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import ActivateSubjectPage from './ActivateSubjectPage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import PricingPage from './PricingPage';
import DistributionCentersPage from './DistributionCentersPage';
import SubjectPage from './SubjectPage';
import SubjectUnitsPage from './SubjectUnitsPage';
import SubjectQuizUnitsPage from './SubjectQuizUnitsPage';
import UnitPage from './UnitPage';
import UnitLessonsPage from './UnitLessonsPage';
import UnitQuizzesPage from './UnitQuizzesPage';
import LessonPage from './LessonPage';
import QuizPage from './QuizPage';
import QuizExplanationPage from './QuizExplanationPage';
import NotificationsPage from './NotificationsPage';
import ProfilePage from './ProfilePage';

const HomePage = () => {
  const { subjects, loading, error } = useSupabaseAppData();
  const { isGuest, isPremiumUser, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  console.log('🏠 HomePage - البيانات الحالية:', {
    subjects: subjects.length,
    loading,
    error,
    authLoading,
    isGuest,
    isPremiumUser,
    subjectsData: subjects
  });

  const handleUnitsClick = (subject: any) => {
    navigate(`/app/subject/${subject.id}/units`);
  };

  const handleQuizzesClick = (subject: any) => {
    navigate(`/app/subject/${subject.id}/quiz-units`);
  };

  if (authLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>جارٍ تحميل بيانات المصادقة...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>جارٍ تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-500">
          <p>حدث خطأ في تحميل البيانات: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            إعادة التحميل
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">المنصة التعليمية</h1>
        <p className="text-lg text-muted-foreground">رحلتك نحو النجاح تبدأ من هنا</p>
      </div>
      <section>
        <h2 className="text-xl font-semibold mb-4 text-center">المواد الدراسية</h2>
        
        {subjects.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>لا توجد مواد متاحة حالياً</p>
            <p className="text-sm mt-2">عدد المواد: {subjects.length}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.filter(s => s.is_active).sort((a, b) => a.order_index - b.order_index).map((subject) => (
              <Card 
                key={subject.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border-l-4"
                style={{ borderLeftColor: subject.color }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center mr-4 shadow-md"
                      style={{ backgroundColor: `${subject.color}20` }}
                    >
                      <span className="text-3xl">{subject.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{subject.name}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">{subject.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 mt-4">
                    <Button 
                      onClick={() => handleUnitsClick(subject)}
                      variant="outline"
                      className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      عرض الوحدات
                    </Button>
                    <Button 
                      onClick={() => handleQuizzesClick(subject)}
                      className="w-full shadow-sm"
                    >
                      عرض الاختبارات
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const MainApp: React.FC = () => {
  return (
    <AppSettingsProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/activate" element={<ActivateSubjectPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/distribution-centers" element={<DistributionCentersPage />} />
            <Route path="/subject/:id" element={<SubjectPage />} />
            <Route path="/subject/:id/units" element={<SubjectUnitsPage />} />
            <Route path="/subject/:id/quiz-units" element={<SubjectQuizUnitsPage />} />
            <Route path="/subject/:subjectId/unit/:unitId/lessons" element={<UnitLessonsPage />} />
            <Route path="/unit/:id" element={<UnitPage />} />
            <Route path="/unit/:id/quizzes" element={<UnitQuizzesPage />} />
            <Route path="/subject/:subjectId/unit/:unitId/quizzes" element={<UnitQuizzesPage />} />
            <Route path="/lesson/:id" element={<LessonPage />} />
            <Route path="/quiz/:id" element={<QuizPage />} />
            <Route path="/quiz/:quizId/explanation/:questionId" element={<QuizExplanationPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    </AppSettingsProvider>
  );
};

export default MainApp;
