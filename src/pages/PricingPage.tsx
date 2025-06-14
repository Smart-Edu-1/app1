
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useNavigate } from 'react-router-dom';

const PricingPage: React.FC = () => {
  const { subscriptionPlans } = useAppSettings();
  const navigate = useNavigate();

  // Default subscription plans if none are configured
  const defaultPlans = [
    {
      id: '1',
      name: 'الخطة الأساسية',
      description: 'خطة مثالية للطلاب',
      features: ['جميع الدروس', 'دعم فني', 'اختبارات تفاعلية']
    },
    {
      id: '2', 
      name: 'الخطة المتقدمة',
      description: 'خطة موصى بها',
      features: ['جميع الدروس', 'دعم فني متقدم', 'اختبارات تفاعلية', 'متابعة شخصية']
    },
    {
      id: '3',
      name: 'الخطة المميزة', 
      description: 'أفضل قيمة',
      features: ['جميع الدروس', 'دعم فني مميز', 'اختبارات تفاعلية', 'متابعة شخصية', 'خصومات خاصة']
    }
  ];

  const plansToShow = subscriptionPlans.length > 0 ? subscriptionPlans : defaultPlans;

  if (plansToShow.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">أسعار الاشتراك</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-8">
              <p className="text-lg">لا توجد خطط اشتراك متاحة حالياً</p>
              <p className="text-sm text-gray-600">يرجى المحاولة لاحقاً أو التواصل مع الدعم الفني</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">أسعار الاشتراك</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-8">
            <p className="text-lg">اختر الخطة التي تناسبك للحصول على أفضل تجربة تعليمية</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plansToShow.map((plan, index) => (
                <Card 
                  key={plan.id} 
                  className={`border-2 hover:border-primary transition-colors ${
                    index === 1 ? 'border-primary shadow-lg' : ''
                  }`}
                >
                  <CardHeader>
                    {index === 1 && (
                      <div className="bg-primary text-white text-sm px-3 py-1 rounded-full w-fit mx-auto mb-2">
                        الأكثر شعبية
                      </div>
                    )}
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="h-4 w-4 text-green-600 ml-2" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full mt-6 ${index === 1 ? '' : 'variant-outline'}`}
                      variant={index === 1 ? 'default' : 'outline'}
                      onClick={() => navigate('/distribution-centers')}
                    >
                      اختيار الخطة
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg text-center">
              <h3 className="font-semibold mb-4">يمكنك التواصل مع الدعم لطلب كود التفعيل</h3>
              <Button 
                onClick={() => window.open('https://wa.me/1234567890', '_blank')}
                className="bg-green-500 hover:bg-green-600"
              >
                تواصل مع الدعم
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingPage;
