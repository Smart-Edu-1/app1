
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, FileText, Lock } from 'lucide-react';
import { useSupabaseAppData } from '@/contexts/SupabaseAppDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const SubjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { subjects, units, lessons, quizzes } = useSupabaseAppData();
  const { isGuest, isPremiumUser } = useAuth();
  const { toast } = useToast();

  const subject = subjects.find(s => s.id === id);
  const subjectUnits = units.filter(u => u.subject_id === id && u.is_active).sort((a, b) => a.order_index - b.order_index);

  if (!subject) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">المادة غير موجودة</h1>
          <Button onClick={() => navigate('/app')}>العودة للصفحة الرئيسية</Button>
        </div>
      </div>
    );
  }

  const handleLessonClick = (lesson: any) => {
    if (!lesson.is_free && (isGuest || !isPremiumUser)) {
      toast({
        title: "محتوى مدفوع",
        description: "يجب تفعيل الحساب للوصول لهذا المحتوى",
        variant: "destructive"
      });
      return;
    }
    navigate(`/app/lesson/${lesson.id}`);
  };

  const handleQuizClick = (quiz: any) => {
    navigate(`/app/quiz/${quiz.id}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/app')}
          className="mb-4"
        >
          <ArrowLeft className="ml-2 h-4 w-4" />
          العودة للصفحة الرئيسية
        </Button>
        
        <div className="flex items-center mb-6">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center ml-4"
            style={{ backgroundColor: `${subject.color}20` }}
          >
            <span className="text-3xl">{subject.icon}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{subject.name}</h1>
            <p className="text-gray-600">{subject.description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {subjectUnits.map((unit) => {
          const unitLessons = lessons.filter(l => l.unit_id === unit.id && l.is_active).sort((a, b) => a.order_index - b.order_index);
          const unitQuizzes = quizzes.filter(q => q.subject_id === id && q.is_active);
          
          return (
            <Card key={unit.id}>
              <CardHeader>
                <CardTitle className="text-xl">{unit.name}</CardTitle>
                <p className="text-gray-600">{unit.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center">
                      <BookOpen className="ml-2 h-5 w-5" />
                      الدروس
                    </h3>
                    <div className="space-y-2">
                      {unitLessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            !lesson.is_free && (isGuest || !isPremiumUser)
                              ? 'bg-gray-100 border-gray-300'
                              : 'hover:bg-blue-50 border-blue-200'
                          }`}
                          onClick={() => handleLessonClick(lesson)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{lesson.title}</h4>
                              <p className="text-sm text-gray-600">{lesson.description}</p>
                            </div>
                            {!lesson.is_free && (isGuest || !isPremiumUser) && (
                              <Lock className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center">
                      <FileText className="ml-2 h-5 w-5" />
                      الاختبارات
                    </h3>
                    <div className="space-y-2">
                      {unitQuizzes.map((quiz) => (
                        <div
                          key={quiz.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-green-50 border-green-200`}
                          onClick={() => handleQuizClick(quiz)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{quiz.title}</h4>
                              <p className="text-sm text-gray-600">{quiz.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectPage;
