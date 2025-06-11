
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';

const PricingPage: React.FC = () => {
  const { settings } = useAppData();

  const features = [
    'الوصول لجميع المواد الدراسية',
    'مشاهدة جميع الفيديوهات التعليمية',
    'حل جميع الاختبارات',
    'تواصل مباشر مع المدرسين',
    'تحديثات المحتوى التعليمي',
    'دعم فني على مدار الساعة'
  ];

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">أسعار الاشتراك</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-8">
            <p className="text-lg">اختر الخطة التي تناسبك للحصول على أفضل تجربة تعليمية</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl">شهري</CardTitle>
                  <div className="text-3xl font-bold text-primary">
                    ${settings.subscriptionPrices.monthly}
                    <span className="text-lg font-normal text-gray-600">/شهر</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-600 ml-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant="outline">
                    اشتراك شهري
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary shadow-lg">
                <CardHeader>
                  <div className="bg-primary text-white text-sm px-3 py-1 rounded-full w-fit mx-auto mb-2">
                    الأكثر شعبية
                  </div>
                  <CardTitle className="text-xl">ربع سنوي</CardTitle>
                  <div className="text-3xl font-bold text-primary">
                    ${settings.subscriptionPrices.quarterly}
                    <span className="text-lg font-normal text-gray-600">/3 أشهر</span>
                  </div>
                  <p className="text-sm text-green-600">توفر 17%</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-600 ml-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6">
                    اشتراك ربع سنوي
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl">سنوي</CardTitle>
                  <div className="text-3xl font-bold text-primary">
                    ${settings.subscriptionPrices.yearly}
                    <span className="text-lg font-normal text-gray-600">/سنة</span>
                  </div>
                  <p className="text-sm text-green-600">توفر 25%</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-600 ml-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant="outline">
                    اشتراك سنوي
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">كيفية الاشتراك؟</h3>
              <p className="text-sm text-gray-600">
                تواصل معنا للحصول على كود التفعيل وتفعيل حسابك للاستفادة من جميع المميزات
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingPage;
