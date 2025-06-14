
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSupabaseAppData } from '@/contexts/SupabaseAppDataContext';
import { useToast } from '@/hooks/use-toast';
import { Settings, Save } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const { appSettings, updateAppSettings } = useSupabaseAppData();
  const [formData, setFormData] = useState(() => ({
    ...appSettings,
    contactMethods: appSettings.contactMethods || [],
    subscriptionPlans: appSettings.subscriptionPlans || [],
    themeColors: appSettings.themeColors || { primary: '#3B82F6', secondary: '#10B981', accent: '#F59E0B' },
    adminCredentials: appSettings.adminCredentials || { username: '', password: '' }
  }));
  const { toast } = useToast();

  // Update formData when appSettings change
  useEffect(() => {
    setFormData({
      ...appSettings,
      contactMethods: appSettings.contactMethods || [],
      subscriptionPlans: appSettings.subscriptionPlans || [],
      themeColors: appSettings.themeColors || { primary: '#3B82F6', secondary: '#10B981', accent: '#F59E0B' },
      adminCredentials: appSettings.adminCredentials || { username: '', password: '' }
    });
  }, [appSettings]);

  const handleSave = async () => {
    await updateAppSettings(formData);
    toast({
      title: "تم الحفظ",
      description: "تم حفظ إعدادات التطبيق بنجاح"
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePriceChange = (period: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      subscriptionPrices: {
        ...prev.subscriptionPrices,
        [period]: value
      }
    }));
  };

  const handleColorChange = (colorType: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      themeColors: {
        ...prev.themeColors,
        [colorType]: value
      }
    }));
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">إعدادات التطبيق</h1>
        <p className="text-muted-foreground mt-2">
          تخصيص إعدادات التطبيق العامة والمظهر
        </p>
      </header>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="ml-2 h-5 w-5" />
              الإعدادات العامة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="appName" className="text-right">
                اسم التطبيق
              </Label>
              <Input
                id="appName"
                value={formData.appName}
                onChange={(e) => handleInputChange('appName', e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="aboutText" className="text-right pt-2">
                نص "لمحة عنا"
              </Label>
              <Textarea
                id="aboutText"
                value={formData.aboutText}
                onChange={(e) => handleInputChange('aboutText', e.target.value)}
                className="col-span-3 h-32"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>أسعار الاشتراك</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="monthlyPrice" className="text-right">
                الاشتراك الشهري ($)
              </Label>
              <Input
                id="monthlyPrice"
                type="number"
                value={formData.subscriptionPrices.monthly}
                onChange={(e) => handlePriceChange('monthly', parseFloat(e.target.value) || 0)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quarterlyPrice" className="text-right">
                الاشتراك ثلاثة أشهر ($)
              </Label>
              <Input
                id="quarterlyPrice"
                type="number"
                value={formData.subscriptionPrices.quarterly}
                onChange={(e) => handlePriceChange('quarterly', parseFloat(e.target.value) || 0)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="yearlyPrice" className="text-right">
                الاشتراك السنوي ($)
              </Label>
              <Input
                id="yearlyPrice"
                type="number"
                value={formData.subscriptionPrices.yearly}
                onChange={(e) => handlePriceChange('yearly', parseFloat(e.target.value) || 0)}
                className="col-span-3"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>ألوان التطبيق</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="primaryColor" className="text-right">
                اللون الرئيسي
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={formData.themeColors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  value={formData.themeColors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="secondaryColor" className="text-right">
                اللون الثانوي
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={formData.themeColors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  value={formData.themeColors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accentColor" className="text-right">
                لون التمييز
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="accentColor"
                  type="color"
                  value={formData.themeColors.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  value={formData.themeColors.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button onClick={handleSave} className="min-w-32">
            <Save className="ml-2 h-4 w-4" />
            حفظ الإعدادات
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
