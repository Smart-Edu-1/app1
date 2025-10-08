
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, Lock, Play, Phone, Mail } from 'lucide-react';
import { useSupabaseAppData } from '@/contexts/SupabaseAppDataContext';
import { useAuth } from '@/contexts/AuthContext';
import VideoProtection from '@/components/VideoProtection';
import SecureVideoPlayer from '@/components/SecureVideoPlayer';
import { useToast } from '@/hooks/use-toast';

const LessonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lessons, units, subjects } = useSupabaseAppData();
  const { user, isGuest, isPremiumUser } = useAuth();
  const { toast } = useToast();

  const lesson = lessons.find(l => l.id === id);
  const unit = lesson ? units.find(u => u.id === lesson.unit_id) : null;
  const subject = unit ? subjects.find(s => s.id === unit.subject_id) : null;

  if (!lesson || !unit || !subject) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">الدرس غير موجود</h1>
          <Button onClick={() => navigate('/app')}>العودة للصفحة الرئيسية</Button>
        </div>
      </div>
    );
  }

  // Check if user can access premium content
  const canAccessPremium = isPremiumUser || !lesson.isPremium;

  if (lesson.isPremium && (isGuest || !isPremiumUser)) {
    return (
      <div className="container mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/app/unit/${unit.id}`)}
          className="mb-4"
        >
          <ArrowLeft className="ml-2 h-4 w-4" />
          العودة للوحدة
        </Button>

        <Card className="text-center p-8">
          <CardContent>
            <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">محتوى مدفوع</h2>
            <p className="text-muted-foreground mb-6">
              هذا الدرس متاح للمشتركين فقط. اشترك في التطبيق للوصول إلى جميع الدروس والمحتوى المدفوع.
            </p>
            <Button onClick={() => navigate('/register')} className="w-full max-w-sm">
              اشترك في التطبيق
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleContactTeacher = () => {
    // اختيار أفضل وسيلة تواصل متاحة بالترتيب: واتساب، ثم هاتف، ثم بريد إلكتروني
    if (subject.teacher_whatsapp) {
      window.open(`https://wa.me/${subject.teacher_whatsapp.replace(/[^0-9]/g, '')}`, '_blank');
    } else if (subject.teacher_phone) {
      window.open(`tel:${subject.teacher_phone}`, '_self');
    } else if (subject.teacher_email) {
      window.open(`mailto:${subject.teacher_email}`, '_self');
    }
  };

  return (
    <VideoProtection>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/app/unit/${unit.id}`)}
            className="mb-6"
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            العودة للوحدة
          </Button>

          {/* Lesson Header */}
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center ml-3">
                  <Play className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="text-sm text-muted-foreground">
                  {subject.name} - {unit.name}
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-foreground mb-3">
                {lesson.title}
              </CardTitle>
              {lesson.description && (
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {lesson.description}
                </p>
              )}
            </CardHeader>
          </Card>

          {/* Secure Video Player */}
          <Card className="mb-6">
            <CardContent className="p-0">
              <div className="aspect-video">
                {canAccessPremium ? (
                  <SecureVideoPlayer
                    lessonId={lesson.id}
                    thumbnailUrl={lesson.thumbnail_path}
                    title={lesson.title}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                    <div className="text-center">
                      <Lock className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-xl mb-2">محتوى مدفوع</p>
                      <p className="text-muted-foreground">اشترك للوصول إلى هذا الدرس</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Teacher Contact Button - Right below video */}
          {(subject.teacher_phone || subject.teacher_email || subject.teacher_whatsapp) && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">تواصل مع المدرس</h3>
                    <p className="text-muted-foreground">
                      للاستفسارات حول هذا الدرس
                    </p>
                  </div>
                  <Button 
                    onClick={handleContactTeacher}
                    variant="default"
                  >
                    <MessageSquare className="ml-2 h-5 w-5" />
                    تواصل الآن
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lesson Content */}
          {lesson.content && canAccessPremium && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl">محتوى الدرس</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none text-foreground">
                  <p className="leading-relaxed whitespace-pre-wrap">{lesson.content}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </VideoProtection>
  );
};

export default LessonPage;
