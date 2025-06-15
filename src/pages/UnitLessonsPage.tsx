import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Lock } from 'lucide-react';
import { useSupabaseAppData } from '@/contexts/SupabaseAppDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const UnitLessonsPage: React.FC = () => {
  const { subjectId, unitId } = useParams<{ subjectId: string; unitId: string }>();
  const navigate = useNavigate();
  const { subjects, units, lessons } = useSupabaseAppData();
  const { isGuest, isPremiumUser } = useAuth();
  const { toast } = useToast();

  const subject = subjects.find(s => s.id === subjectId);
  const unit = units.find(u => u.id === unitId);
  const unitLessons = lessons.filter(l => l.unit_id === unitId && l.is_active).sort((a, b) => a.order_index - b.order_index);

  if (!subject || !unit) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">الوحدة غير موجودة</h1>
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/app/subject/${subjectId}/units`)}
            className="mb-4"
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            العودة إلى وحدات {subject.name}
          </Button>
          
          {/* Unit Header */}
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center ml-4">
                <Play className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">دروس {unit.name}</h1>
                <p className="text-muted-foreground">اختر الدرس الذي تريد مشاهدته</p>
                <Badge variant="outline" className="mt-2">
                  {unitLessons.length} درس متاح
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Lessons */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center">
            <Play className="ml-2 h-6 w-6" />
            الدروس المتاحة
          </h2>
          
          {unitLessons.length === 0 ? (
            <Card className="text-center p-12">
              <div className="text-muted-foreground">
                <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">لا توجد دروس متاحة</h3>
                <p>سيتم إضافة الدروس قريباً</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unitLessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  className={`overflow-hidden cursor-pointer hover:shadow-lg transition-shadow ${
                    !lesson.is_free && (isGuest || !isPremiumUser)
                      ? 'opacity-75'
                      : ''
                  }`}
                  style={{ borderLeft: `4px solid ${subject.color}` }}
                  onClick={() => handleLessonClick(lesson)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                        style={{ backgroundColor: `${subject.color}20` }}
                      >
                        {!lesson.is_free && (isGuest || !isPremiumUser) ? (
                          <Lock className="h-6 w-6" style={{ color: subject.color }} />
                        ) : (
                          <Play className="h-6 w-6" style={{ color: subject.color }} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{lesson.title}</h3>
                        <p className="text-muted-foreground text-sm">{lesson.description}</p>
                        <Badge variant={lesson.is_free ? "default" : "secondary"} className="mt-2">
                          {lesson.is_free ? "مجاني" : "مدفوع"}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button className="w-full">
                        مشاهدة الدرس
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnitLessonsPage;