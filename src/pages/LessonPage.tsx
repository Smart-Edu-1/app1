
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';

const LessonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lessons, units, subjects } = useAppData();

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

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center mb-2">
            <span className="text-sm text-gray-500">{subject.name} - {unit.name}</span>
          </div>
          <CardTitle className="text-2xl">{lesson.name}</CardTitle>
          <p className="text-gray-600">{lesson.description}</p>
        </CardHeader>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            {lesson.videoUrl ? (
              <video
                className="w-full h-full"
                controls
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
                style={{ pointerEvents: 'auto' }}
              >
                <source src={lesson.videoUrl} type="video/mp4" />
                متصفحك لا يدعم عرض الفيديو
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <p className="text-xl mb-2">لا يوجد فيديو متاح حالياً</p>
                  <p className="text-gray-300">سيتم إضافة الفيديو قريباً</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {lesson.teacherContact && (
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
  );
};

export default LessonPage;
