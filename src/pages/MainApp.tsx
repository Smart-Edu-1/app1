
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseAppData } from '@/contexts/SupabaseAppDataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import PricingPage from './PricingPage';
import SubjectPage from './SubjectPage';
import LessonPage from './LessonPage';
import QuizPage from './QuizPage';

const HomePage = () => {
  const { subjects, loading } = useSupabaseAppData();
  const { isGuest, isPremiumUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  console.log('🏠 HomePage - البيانات الحالية:', {
    subjects: subjects.length,
    loading,
    isGuest,
    isPremiumUser,
    subjectsData: subjects
  });

  const handleSubjectClick = (subject: any) => {
    navigate(`/app/subject/${subject.id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">⏳ جارٍ تحميل البيانات...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <section>
        <h2 className="text-xl font-semibold mb-4 text-center">المواد الدراسية</h2>
        
        {subjects.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>لا توجد مواد متاحة حالياً</p>
            <p className="text-sm mt-2">عدد المواد: {subjects.length}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.filter(s => s.isActive).sort((a, b) => a.order - b.order).map((subject) => (
              <Card 
                key={subject.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                style={{ borderLeft: `4px solid ${subject.color}` }}
                onClick={() => handleSubjectClick(subject)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                      style={{ backgroundColor: `${subject.color}20` }}
                    >
                      <span className="text-2xl">{subject.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{subject.name}</h3>
                      <p className="text-muted-foreground text-sm">{subject.description}</p>
                    </div>
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
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/subject/:id" element={<SubjectPage />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/quiz/:id" element={<QuizPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default MainApp;
