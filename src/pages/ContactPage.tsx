
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { useAppSettings } from '@/contexts/AppSettingsContext';

const ContactPage: React.FC = () => {
  const { contactMethods } = useAppSettings();

  // Default contact methods if none are configured
  const defaultContactMethods = [
    'واتساب: +1234567890',
    'بريد إلكتروني: contact@example.com',
    'هاتف: +1234567890'
  ];

  const methodsToShow = contactMethods.length > 0 ? contactMethods : defaultContactMethods;

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">تواصل معنا</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-6">
            <p className="text-lg">نحن هنا لمساعدتك في أي وقت</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {methodsToShow.map((method, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    {method.includes('واتساب') && <MessageCircle className="h-6 w-6 text-green-600" />}
                    {method.includes('تليجرام') && <MessageCircle className="h-6 w-6 text-blue-600" />}
                    {method.includes('بريد') && <Mail className="h-6 w-6 text-red-600" />}
                    {method.includes('هاتف') && <Phone className="h-6 w-6 text-gray-600" />}
                  </div>
                  <p className="text-sm font-medium">{method}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">أوقات العمل</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm">الأحد - الخميس: 9:00 صباحاً - 6:00 مساءً</p>
                <p className="text-sm">الجمعة - السبت: 10:00 صباحاً - 4:00 مساءً</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactPage;
