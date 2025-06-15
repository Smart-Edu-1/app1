import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useSupabaseAppData } from '@/contexts/SupabaseAppDataContext';

const SubjectQuizUnitsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { subjects, units, quizzes } = useSupabaseAppData();

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

  const handleUnitClick = (unit: any) => {
    navigate(`/app/subject/${id}/unit/${unit.id}/quizzes`);
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
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">اختبارات {subject.name}</h1>
                <p className="text-muted-foreground">اختر الوحدة للوصول لاختباراتها</p>
                <Badge variant="outline" className="mt-2">
                  {subjectUnits.length} وحدة متاحة
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Units */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center">
            <Trophy className="ml-2 h-6 w-6" />
            اختبارات الوحدات
          </h2>
          
          {subjectUnits.length === 0 ? (
            <Card className="text-center p-12">
              <div className="text-muted-foreground">
                <Trophy className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">لا توجد وحدات متاحة</h3>
                <p>سيتم إضافة الوحدات التعليمية قريباً</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjectUnits.map((unit) => {
                const unitQuizzes = quizzes.filter(q => q.subject_id === id && q.is_active);
                
                return (
                  <Card 
                    key={unit.id}
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    style={{ borderLeft: `4px solid ${subject.color}` }}
                    onClick={() => handleUnitClick(unit)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                          style={{ backgroundColor: `${subject.color}20` }}
                        >
                          <Trophy className="h-6 w-6" style={{ color: subject.color }} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">اختبارات {unit.name}</h3>
                          <p className="text-muted-foreground text-sm">اختبر معلوماتك في هذه الوحدة</p>
                          <Badge variant="outline" className="mt-2">
                            {unitQuizzes.length} اختبار متاح
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button className="w-full">
                          عرض اختبارات الوحدة
                        </Button>
                      </div>
                    </CardContent>
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

export default SubjectQuizUnitsPage;