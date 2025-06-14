
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/app')}
            className="mb-6 hover:bg-white/10 transition-all duration-200"
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            العودة للصفحة الرئيسية
          </Button>
          
          {/* Subject Header with Beautiful Design */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/90 to-secondary/90 p-8 text-white shadow-xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex items-center">
              <div 
                className="w-20 h-20 rounded-xl flex items-center justify-center ml-6 bg-white/20 backdrop-blur-sm border border-white/30"
              >
                <span className="text-4xl">{subject.icon}</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{subject.name}</h1>
                <p className="text-white/90 text-lg">{subject.description}</p>
                <div className="flex items-center mt-3 space-x-4">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {subjectUnits.length} وحدة
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {lessons.filter(l => subjectUnits.some(u => u.id === l.unit_id)).length} درس
                  </Badge>
                </div>
              </div>
            </div>
            {/* Decorative Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 translate-x-12"></div>
          </div>
        </div>

        {/* Units Section */}
        <div className="space-y-8">
          {subjectUnits.length === 0 ? (
            <Card className="text-center p-12 animate-fade-in">
              <div className="text-muted-foreground">
                <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">لا توجد وحدات متاحة</h3>
                <p>سيتم إضافة الوحدات التعليمية قريباً</p>
              </div>
            </Card>
          ) : (
            subjectUnits.map((unit, index) => {
              const unitLessons = lessons.filter(l => l.unit_id === unit.id && l.is_active).sort((a, b) => a.order_index - b.order_index);
              const unitQuizzes = quizzes.filter(q => q.subject_id === id && q.is_active);
              
              return (
                <Card 
                  key={unit.id} 
                  className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in border-0 bg-gradient-to-r from-white to-gray-50/50"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Unit Header */}
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center ml-4">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-foreground mb-1">{unit.name}</CardTitle>
                          <p className="text-muted-foreground">{unit.description}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Play className="h-3 w-3" />
                          {unitLessons.length} درس
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Trophy className="h-3 w-3" />
                          {unitQuizzes.length} اختبار
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Lessons Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-lg flex items-center text-primary">
                            <Play className="ml-2 h-5 w-5" />
                            الدروس التعليمية
                          </h3>
                          {unitLessons.length > 0 && (
                            <Badge variant="secondary">{unitLessons.length} درس</Badge>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          {unitLessons.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
                              <p>لا توجد دروس متاحة حالياً</p>
                            </div>
                          ) : (
                            unitLessons.map((lesson, lessonIndex) => (
                              <div
                                key={lesson.id}
                                className={`group p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 hover-scale ${
                                  !lesson.is_free && (isGuest || !isPremiumUser)
                                    ? 'bg-muted/50 border-muted hover:bg-muted'
                                    : 'bg-blue-50/50 border-blue-100 hover:bg-blue-50 hover:border-blue-200 hover:shadow-md'
                                }`}
                                onClick={() => handleLessonClick(lesson)}
                                style={{ animationDelay: `${(index * 100) + (lessonIndex * 50)}ms` }}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                      !lesson.is_free && (isGuest || !isPremiumUser)
                                        ? 'bg-muted'
                                        : 'bg-gradient-to-r from-blue-500 to-blue-600'
                                    }`}>
                                      {!lesson.is_free && (isGuest || !isPremiumUser) ? (
                                        <Lock className="h-5 w-5 text-muted-foreground" />
                                      ) : (
                                        <Play className="h-5 w-5 text-white" />
                                      )}
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                        {lesson.title}
                                      </h4>
                                      <p className="text-sm text-muted-foreground">{lesson.description}</p>
                                      <div className="flex items-center mt-1 space-x-2">
                                        <Badge variant={lesson.is_free ? "default" : "secondary"} className="text-xs">
                                          {lesson.is_free ? "مجاني" : "مدفوع"}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Quizzes Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-lg flex items-center text-green-600">
                            <Trophy className="ml-2 h-5 w-5" />
                            الاختبارات والتقييم
                          </h3>
                          {unitQuizzes.length > 0 && (
                            <Badge variant="secondary">{unitQuizzes.length} اختبار</Badge>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          {unitQuizzes.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
                              <p>لا توجد اختبارات متاحة حالياً</p>
                            </div>
                          ) : (
                            unitQuizzes.map((quiz, quizIndex) => (
                              <div
                                key={quiz.id}
                                className="group p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 bg-green-50/50 border-green-100 hover:bg-green-50 hover:border-green-200 hover:shadow-md hover-scale"
                                onClick={() => handleQuizClick(quiz)}
                                style={{ animationDelay: `${(index * 100) + (quizIndex * 50)}ms` }}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                                      <FileText className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-foreground group-hover:text-green-600 transition-colors">
                                        {quiz.title}
                                      </h4>
                                      <p className="text-sm text-muted-foreground">{quiz.description}</p>
                                      <div className="flex items-center mt-1 space-x-2">
                                        <Badge variant="outline" className="text-xs">
                                          اختبار تفاعلي
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-green-600 transition-colors" />
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectPage;
