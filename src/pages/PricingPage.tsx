
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppData } from '@/contexts/AppDataContext';
import { Check } from 'lucide-react';

const PricingPage: React.FC = () => {
  const { settings } = useAppData();

  const plans = [
    {
      name: 'الاشتراك الشهري',
      price: settings.subscriptionPrices.monthly,
      period: 'شهر',
      features: [
        'الوصول لجميع الدروس',
        'الوصول لجميع الاختبارات',
        'التواصل مع المدرسين',
        'الدعم الفني'
      ]
    },
    {
      name: 'الاشتراك الفصلي',
      price: settings.subscriptionPrices.quarterly,
      period: '3 أشهر',
      popular: true,
      features: [
        'جميع مميزات الاشتراك الشهري',
        'خصم 30%',
        'أولوية في الدعم الفني',
        'محتوى إضافي حصري'
      ]
    },
    {
      name: 'الاشتراك السنوي',
      price: settings.subscriptionPrices.yearly,
      period: 'سنة',
      features: [
        'جميع مميزات الاشتراك الفصلي',
        'خصم 60%',
        'جلسات مراجعة مجانية',
        'شهادة إتمام'
      ]
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">أسعار الاشتراك</h1>
        <p className="text-lg text-gray-600">اختر الخطة المناسبة لك</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-4 py-1 rounded-full text-sm">الأكثر شعبية</span>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-gray-500">/{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 ml-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 p-6 bg-blue-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-center">كيفية الاشتراك</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">1</div>
            <h4 className="font-semibold">احصل على كود التفعيل</h4>
            <p className="text-sm text-gray-600">تواصل معنا للحصول على كود التفعيل</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">2</div>
            <h4 className="font-semibold">أنشئ حسابك</h4>
            <p className="text-sm text-gray-600">استخدم كود التفعيل لإنشاء حساب جديد</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">3</div>
            <h4 className="font-semibold">ابدأ التعلم</h4>
            <p className="text-sm text-gray-600">استمتع بجميع الدروس والاختبارات</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
