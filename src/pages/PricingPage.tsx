
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';

const PricingPage: React.FC = () => {
  const { settings } = useAppData();

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
              {settings.subscriptionPlans.map((plan, index) => (
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
                    <div className="text-3xl font-bold text-primary">
                      {plan.price} {plan.currency}
                      <span className="text-lg font-normal text-gray-600">
                        /{plan.duration} شهر
                      </span>
                    </div>
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
                    >
                      اختيار الخطة
                    </Button>
                  </CardContent>
                </Card>
              ))}
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
