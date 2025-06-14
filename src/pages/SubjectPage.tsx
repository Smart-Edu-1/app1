
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, FileText, Lock, Play, Clock, Users, Trophy } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/app')}
            className="mb-4"
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            العودة للصفحة الرئيسية
          </Button>
          
          {/* Subject Header */}
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center ml-4">
                <span className="text-3xl">{subject.icon}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{subject.name}</h1>
                <p className="text-muted-foreground">{subject.description}</p>
                <div className="flex items-center mt-2 space-x-3">
                  <Badge variant="outline">
                    {subjectUnits.length} وحدة
                  </Badge>
                  <Badge variant="outline">
                    {lessons.filter(l => subjectUnits.some(u => u.id === l.unit_id)).length} درس
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Units */}
        <div className="space-y-4">
          {subjectUnits.length === 0 ? (
            <Card className="text-center p-12">
              <div className="text-muted-foreground">
                <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">لا توجد وحدات متاحة</h3>
                <p>سيتم إضافة الوحدات التعليمية قريباً</p>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {subjectUnits.map((unit) => {
                const unitLessons = lessons.filter(l => l.unit_id === unit.id && l.is_active);
                const unitQuizzes = quizzes.filter(q => q.subject_id === id && q.is_active);
                
                return (
                  <Card 
                    key={unit.id} 
                    className="p-6 cursor-pointer transition-all hover:shadow-md hover:bg-muted/20"
                    onClick={() => navigate(`/app/unit/${unit.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center ml-4">
                          <BookOpen className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-1">{unit.name}</h3>
                          <p className="text-muted-foreground">{unit.description}</p>
                          <div className="flex items-center mt-2 space-x-3">
                            <Badge variant="outline">
                              {unitLessons.length} درس
                            </Badge>
                            <Badge variant="outline">
                              {unitQuizzes.length} اختبار
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectPage;
