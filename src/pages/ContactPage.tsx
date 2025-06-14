
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { useSupabaseAppData } from '@/contexts/SupabaseAppDataContext';

const ContactPage: React.FC = () => {
  const { appSettings } = useSupabaseAppData();

  // Default contact methods if none are configured
  const defaultContactMethods = [
    'واتساب: +1234567890',
    'بريد إلكتروني: contact@example.com',
    'هاتف: +1234567890'
  ];

  const methodsToShow = appSettings.contactMethods && appSettings.contactMethods.length > 0 
    ? appSettings.contactMethods 
    : defaultContactMethods;

  const handleContactClick = (method: string) => {
    const methodLower = method.toLowerCase();
    
    if (methodLower.includes('واتساب') || methodLower.includes('whatsapp')) {
      const phoneNumber = method.match(/[\+]?[0-9\s\-\(\)]+/)?.[0]?.replace(/[\s\-\(\)]/g, '');
      if (phoneNumber) {
        window.open(`https://wa.me/${phoneNumber.replace('+', '')}`, '_blank');
      }
    } else if (methodLower.includes('تليجرام') || methodLower.includes('telegram')) {
      const usernameMatch = method.match(/@([a-zA-Z0-9_]+)/);
      const phoneMatch = method.match(/[\+]?[0-9\s\-\(\)]+/);
      
      if (usernameMatch) {
        window.open(`https://t.me/${usernameMatch[1]}`, '_blank');
      } else if (phoneMatch) {
        const phoneNumber = phoneMatch[0].replace(/[\s\-\(\)]/g, '');
        window.open(`https://t.me/${phoneNumber.replace('+', '')}`, '_blank');
      }
    } else if (methodLower.includes('بريد') || methodLower.includes('email') || methodLower.includes('mail')) {
      const emailMatch = method.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) {
        window.open(`mailto:${emailMatch[0]}`, '_blank');
      }
    } else if (methodLower.includes('هاتف') || methodLower.includes('phone') || methodLower.includes('تلفون')) {
      const phoneNumber = method.match(/[\+]?[0-9\s\-\(\)]+/)?.[0]?.replace(/[\s\-\(\)]/g, '');
      if (phoneNumber) {
        window.open(`tel:${phoneNumber}`, '_blank');
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {appSettings.contactPageTitle || 'تواصل معنا'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-6">
            <p className="text-lg">
              {appSettings.contactPageDescription || 'نحن هنا لمساعدتك في أي وقت'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {methodsToShow.map((method, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => handleContactClick(method)}
                >
                  <div className="flex items-center justify-center mb-2">
                    {(method.includes('واتساب') || method.includes('whatsapp')) && <MessageCircle className="h-6 w-6 text-green-600" />}
                    {(method.includes('تليجرام') || method.includes('telegram')) && <MessageCircle className="h-6 w-6 text-blue-600" />}
                    {(method.includes('بريد') || method.includes('email') || method.includes('mail')) && <Mail className="h-6 w-6 text-red-600" />}
                    {(method.includes('هاتف') || method.includes('phone') || method.includes('تلفون')) && <Phone className="h-6 w-6 text-gray-600" />}
                  </div>
                  <p className="text-sm font-medium">{method}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">
                {appSettings.workingHoursTitle || 'أوقات العمل'}
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                {(appSettings.workingHours || ['الأحد - الخميس: 9:00 صباحاً - 6:00 مساءً', 'الجمعة - السبت: 10:00 صباحاً - 4:00 مساءً']).map((hour, index) => (
                  <p key={index} className="text-sm mb-1">{hour}</p>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactPage;
