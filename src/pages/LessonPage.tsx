
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, Lock } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';
import { useAuth } from '@/contexts/AuthContext';
import VideoProtection from '@/components/VideoProtection';
import VideoPlayer from '@/components/VideoPlayer';

const LessonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lessons, units, subjects } = useAppData();
  const { user, isGuest, isPremiumUser } = useAuth();

  const lesson = lessons.find(l => l.id === id);
  const unit = lesson ? units.find(u => u.id === lesson.unitId) : null;
  const subject = unit ? subjects.find(s => s.id === unit.subjectId) : null;

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

  if (isGuest && lesson.isPremium) {
    return (
      <div className="container mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/app/subject/${subject.id}`)}
          className="mb-4"
        >
          <ArrowLeft className="ml-2 h-4 w-4" />
          العودة لصفحة المادة
        </Button>

        <Card className="text-center p-8">
          <CardContent>
            <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">محتوى مدفوع</h2>
            <p className="text-gray-600 mb-6">
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

  return (
    <VideoProtection>
      <div className="container mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/app/subject/${subject.id}`)}
          className="mb-4"
        >
          <ArrowLeft className="ml-2 h-4 w-4" />
          العودة لصفحة المادة
        </Button>

        {/* Lesson Title and Description */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center mb-2">
              <span className="text-sm text-gray-500">{subject.name} - {unit.name}</span>
            </div>
            <CardTitle className="text-2xl">{lesson.name}</CardTitle>
            <p className="text-gray-600">{lesson.description}</p>
          </CardHeader>
        </Card>

        {/* Video Player */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="aspect-video">
              {lesson.videoUrl && canAccessPremium ? (
                <VideoPlayer
                  src={lesson.videoUrl}
                  title={lesson.name}
                  onError={() => console.error('خطأ في تحميل الفيديو')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                  <div className="text-center">
                    <p className="text-xl mb-2">لا يوجد فيديو متاح حالياً</p>
                    <p className="text-gray-400">سيتم إضافة الفيديو قريباً</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Teacher Contact */}
        {lesson.teacherContact && canAccessPremium && (
          <Card>
            <CardContent className="p-4">
              <Button className="w-full" variant="outline">
                <MessageSquare className="ml-2 h-5 w-5" />
                تواصل مع المدرس: {lesson.teacherContact}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </VideoProtection>
  );
};

export default LessonPage;
