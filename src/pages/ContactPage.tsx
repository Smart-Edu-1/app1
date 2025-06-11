
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppData } from '@/contexts/AppDataContext';
import { MessageSquare, Phone, Mail } from 'lucide-react';

const ContactPage: React.FC = () => {
  const { settings } = useAppData();

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">تواصل معنا</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-lg">نحن هنا لمساعدتك! تواصل معنا عبر إحدى الطرق التالية:</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {settings.contactMethods.map((method, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="ml-4">
                    {method.includes('واتساب') && <MessageSquare className="h-6 w-6 text-green-600" />}
                    {method.includes('تليجرام') && <MessageSquare className="h-6 w-6 text-blue-600" />}
                    {method.includes('بريد') && <Mail className="h-6 w-6 text-red-600" />}
                    {method.includes('هاتف') && <Phone className="h-6 w-6 text-gray-600" />}
                  </div>
                  <div>
                    <p className="font-medium">{method}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">ساعات العمل</h3>
              <p className="text-sm text-gray-600">
                من السبت إلى الخميس: 9:00 صباحاً - 9:00 مساءً<br />
                الجمعة: 2:00 ظهراً - 9:00 مساءً
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactPage;
