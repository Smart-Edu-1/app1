import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock } from 'lucide-react';
import { useSupabaseAppData } from '@/contexts/SupabaseAppDataContext';
import { useAppSettings } from '@/contexts/AppSettingsContext';

const DistributionCentersPage: React.FC = () => {
  const { distributionCenters, loading } = useSupabaseAppData();
  const { supportContacts } = useAppSettings();

  // Default centers as fallback
  const defaultCenters = [
    {
      id: '1',
      name: 'مركز الرياض',
      address: 'شارع الملك فهد، الرياض',
      phone: '+966123456789',
      workingHours: 'السبت - الخميس: 8:00 ص - 6:00 م',
      latitude: 24.7136,
      longitude: 46.6753,
      isActive: true
    },
    {
      id: '2',
      name: 'مركز جدة',
      address: 'شارع التحلية، جدة',
      phone: '+966123456790',
      workingHours: 'السبت - الخميس: 9:00 ص - 7:00 م',
      latitude: 21.5433,
      longitude: 39.1728,
      isActive: true
    }
  ];

  const centersToShow = distributionCenters.length > 0 ? 
    distributionCenters.filter(center => center.isActive) : 
    defaultCenters;

  const getSupportContactUrl = () => {
    if (supportContacts?.whatsapp) {
      return `https://wa.me/${supportContacts.whatsapp.replace(/[^\d]/g, '')}`;
    }
    if (supportContacts?.telegram) {
      return `https://t.me/${supportContacts.telegram}`;
    }
    if (supportContacts?.phone) {
      return `tel:${supportContacts.phone}`;
    }
    return 'https://wa.me/966123456789'; // Default fallback
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">⏳ جارٍ تحميل مراكز التوزيع...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">مراكز التوزيع</CardTitle>
          <p className="text-center text-muted-foreground">
            اختر أقرب مركز توزيع إليك للحصول على خدماتنا
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {centersToShow.map((center) => (
              <Card key={center.id} className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <MapPin className="ml-2 h-5 w-5 text-primary" />
                    {center.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="ml-2 h-4 w-4 text-gray-500 mt-1" />
                    <span className="text-sm text-gray-600">{center.address}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="ml-2 h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{center.phone}</span>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="ml-2 h-4 w-4 text-gray-500 mt-1" />
                    <span className="text-sm text-gray-600">{center.workingHours}</span>
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <Button 
                      className="w-full" 
                      onClick={() => window.open(`tel:${center.phone}`, '_self')}
                    >
                      <Phone className="ml-2 h-4 w-4" />
                      اتصل بالمركز
                    </Button>
                    
                    {center.latitude && center.longitude && (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.open(
                          `https://maps.google.com/?q=${center.latitude},${center.longitude}`,
                          '_blank'
                        )}
                      >
                        <MapPin className="ml-2 h-4 w-4" />
                        عرض على الخريطة
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-blue-50 rounded-lg text-center">
            <h3 className="font-semibold mb-4 text-lg">يمكنك التواصل مع الدعم لطلب كود التفعيل</h3>
            <p className="text-gray-600 mb-4">
              للحصول على كود التفعيل وتفعيل حسابك، تواصل معنا عبر الواتساب
            </p>
            <Button 
              onClick={() => window.open(getSupportContactUrl(), '_blank')}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              تواصل مع الدعم
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DistributionCentersPage;