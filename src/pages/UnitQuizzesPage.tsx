import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, FileText, Clock } from 'lucide-react';
import { useSupabaseAppData } from '@/contexts/SupabaseAppDataContext';

const UnitQuizzesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { subjects, units, quizzes } = useSupabaseAppData();

  const unit = units.find(u => u.id === id);
  const subject = unit ? subjects.find(s => s.id === unit.subject_id) : null;
  const unitQuizzes = quizzes.filter(q => q.subject_id === unit?.subject_id && q.is_active);

  if (!unit || !subject) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">الوحدة غير موجودة</h1>
          <Button onClick={() => navigate('/app')}>العودة للصفحة الرئيسية</Button>
        </div>
      </div>
    );
  }

  const handleQuizClick = (quiz: any) => {
    navigate(`/app/quiz/${quiz.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/app/unit/${unit.id}`)}
            className="mb-4"
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            العودة إلى {unit.name}
          </Button>
          
          {/* Page Header */}
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center ml-4">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">اختبارات {unit.name}</h1>
                <p className="text-muted-foreground">اختبر معلوماتك في وحدة {unit.name}</p>
                <Badge variant="outline" className="mt-2">
                  {unitQuizzes.length} اختبار متاح
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Quizzes */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center">
            <FileText className="ml-2 h-6 w-6" />
            الاختبارات المتاحة
          </h2>
          
          {unitQuizzes.length === 0 ? (
            <Card className="text-center p-12">
              <div className="text-muted-foreground">
                <Trophy className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">لا توجد اختبارات متاحة</h3>
                <p>سيتم إضافة الاختبارات قريباً</p>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {unitQuizzes.map((quiz) => (
                <Card
                  key={quiz.id}
                  className="p-6 cursor-pointer transition-all hover:shadow-md hover:bg-muted/20"
                  onClick={() => handleQuizClick(quiz)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">{quiz.title}</h3>
                        <p className="text-muted-foreground mb-2">{quiz.description}</p>
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">اختبار تفاعلي</Badge>
                          {quiz.time_limit && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {quiz.time_limit} دقيقة
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnitQuizzesPage;