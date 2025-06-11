
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppData } from '@/contexts/AppDataContext';

const AboutPage: React.FC = () => {
  const { settings } = useAppData();

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">لمحة عن {settings.appName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-lg leading-relaxed">{settings.aboutText}</p>
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">مميزات التطبيق</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">دروس تفاعلية</h4>
                  <p className="text-sm text-gray-600">دروس مصورة عالية الجودة مع شرح مفصل</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">اختبارات متنوعة</h4>
                  <p className="text-sm text-gray-600">اختبارات لقياس مستوى الفهم والتطبيق</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2">متابعة شخصية</h4>
                  <p className="text-sm text-gray-600">تواصل مباشر مع المدرسين المختصين</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold mb-2">محتوى محدث</h4>
                  <p className="text-sm text-gray-600">محتوى تعليمي محدث حسب المناهج الحديثة</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;
