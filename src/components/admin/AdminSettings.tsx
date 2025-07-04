
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
  const [formData, setFormData] = useState(() => {
    console.log('🔍 إعدادات التطبيق الحالية:', appSettings);
    return {
      appName: appSettings.appName || 'منصة التعلم',
      aboutText: appSettings.aboutText || 'منصة تعليمية شاملة تقدم أفضل المحتوى التعليمي',
      subscriptionPrices: appSettings.subscriptionPrices || { monthly: 9.99, quarterly: 24.99, yearly: 89.99 },
      contactMethods: appSettings.contactMethods || [],
      subscriptionPlans: appSettings.subscriptionPlans || [],
      themeColors: appSettings.themeColors || { primary: '#3B82F6', secondary: '#10B981', accent: '#F59E0B' },
      adminCredentials: appSettings.adminCredentials || { username: 'admin', password: 'admin123' },
      supportContacts: appSettings.supportContacts || { whatsapp: '', telegram: '', phone: '' },
      contactPageTitle: appSettings.contactPageTitle || 'تواصل معنا',
      contactPageDescription: appSettings.contactPageDescription || 'نحن هنا لمساعدتك في أي وقت',
      workingHoursTitle: appSettings.workingHoursTitle || 'أوقات العمل',
      workingHours: appSettings.workingHours || ['الأحد - الخميس: 9:00 صباحاً - 6:00 مساءً', 'الجمعة - السبت: 10:00 صباحاً - 4:00 مساءً']
    };
  });
  const { toast } = useToast();

  // Update formData when appSettings change
  useEffect(() => {
    console.log('🔄 تحديث البيانات في useEffect:', appSettings);
    
    // Always update formData when appSettings change, even if it's empty initially
    const newFormData = {
      appName: appSettings.appName || 'منصة التعلم',
      aboutText: appSettings.aboutText || 'منصة تعليمية شاملة تقدم أفضل المحتوى التعليمي',
      subscriptionPrices: appSettings.subscriptionPrices || { monthly: 9.99, quarterly: 24.99, yearly: 89.99 },
      contactMethods: appSettings.contactMethods || [],
      subscriptionPlans: appSettings.subscriptionPlans || [],
      themeColors: appSettings.themeColors || { primary: '#3B82F6', secondary: '#10B981', accent: '#F59E0B' },
      adminCredentials: appSettings.adminCredentials || { username: 'admin', password: 'admin123' },
      supportContacts: appSettings.supportContacts || { whatsapp: '', telegram: '', phone: '' },
      contactPageTitle: appSettings.contactPageTitle || 'تواصل معنا',
      contactPageDescription: appSettings.contactPageDescription || 'نحن هنا لمساعدتك في أي وقت',
      workingHoursTitle: appSettings.workingHoursTitle || 'أوقات العمل',
      workingHours: appSettings.workingHours || ['الأحد - الخميس: 9:00 صباحاً - 6:00 مساءً', 'الجمعة - السبت: 10:00 صباحاً - 4:00 مساءً']
    };
    
    console.log('📝 البيانات الجديدة للنموذج:', newFormData);
    setFormData(newFormData);
  }, [appSettings]);

  const handleSave = async () => {
    console.log('🚀 تم الضغط على زر الحفظ!');
    console.log('📝 بدء عملية الحفظ من لوحة التحكم:', formData);
    
    // Check if formData has required fields
    if (!formData.appName) {
      console.error('❌ اسم التطبيق مفقود!');
      toast({
        title: "خطأ",
        description: "اسم التطبيق مطلوب",
        variant: "destructive"
      });
      return;
    }
    
    try {
      console.log('🔄 استدعاء updateAppSettings...');
      await updateAppSettings(formData);
      console.log('✅ تم الحفظ بنجاح من لوحة التحكم');
      toast({
        title: "تم الحفظ",
        description: "تم حفظ إعدادات التطبيق بنجاح"
      });
    } catch (error) {
      console.error('❌ خطأ في الحفظ من لوحة التحكم:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive"
      });
    }
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

  const handleSupportContactChange = (contactType: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      supportContacts: {
        ...prev.supportContacts,
        [contactType]: value
      }
    }));
  };

  const addSubscriptionPlan = () => {
    const newPlan = {
      id: Date.now().toString(),
      name: '',
      description: '',
      price: 0,
      duration: 1,
      features: [''],
      isActive: true
    };
    setFormData(prev => ({
      ...prev,
      subscriptionPlans: [...(prev.subscriptionPlans || []), newPlan]
    }));
  };

  const updateSubscriptionPlan = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      subscriptionPlans: prev.subscriptionPlans?.map((plan: any, i: number) => 
        i === index ? { ...plan, [field]: value } : plan
      ) || []
    }));
  };

  const deleteSubscriptionPlan = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subscriptionPlans: prev.subscriptionPlans?.filter((_: any, i: number) => i !== index) || []
    }));
  };

  const addContactMethod = () => {
    setFormData(prev => ({
      ...prev,
      contactMethods: [...(prev.contactMethods || []), '']
    }));
  };

  const updateContactMethod = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      contactMethods: prev.contactMethods?.map((method: string, i: number) => 
        i === index ? value : method
      ) || []
    }));
  };

  const deleteContactMethod = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contactMethods: prev.contactMethods?.filter((_: string, i: number) => i !== index) || []
    }));
  };

  const addWorkingHour = () => {
    setFormData(prev => ({
      ...prev,
      workingHours: [...(prev.workingHours || []), '']
    }));
  };

  const updateWorkingHour = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      workingHours: prev.workingHours?.map((hour: string, i: number) => 
        i === index ? value : hour
      ) || []
    }));
  };

  const deleteWorkingHour = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workingHours: prev.workingHours?.filter((_: string, i: number) => i !== index) || []
    }));
  };

  const addPlanFeature = (planIndex: number) => {
    setFormData(prev => ({
      ...prev,
      subscriptionPlans: prev.subscriptionPlans?.map((plan: any, i: number) => 
        i === planIndex ? { 
          ...plan, 
          features: [...(plan.features || []), ''] 
        } : plan
      ) || []
    }));
  };

  const updatePlanFeature = (planIndex: number, featureIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      subscriptionPlans: prev.subscriptionPlans?.map((plan: any, i: number) => 
        i === planIndex ? { 
          ...plan, 
          features: plan.features?.map((feature: string, j: number) => 
            j === featureIndex ? value : feature
          ) || []
        } : plan
      ) || []
    }));
  };

  const deletePlanFeature = (planIndex: number, featureIndex: number) => {
    setFormData(prev => ({
      ...prev,
      subscriptionPlans: prev.subscriptionPlans?.map((plan: any, i: number) => 
        i === planIndex ? { 
          ...plan, 
          features: plan.features?.filter((_: string, j: number) => j !== featureIndex) || []
        } : plan
      ) || []
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

        <Card>
          <CardHeader>
            <CardTitle>إعدادات التواصل والدعم</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="whatsappNumber" className="text-right">
                رقم الواتساب
              </Label>
              <Input
                id="whatsappNumber"
                value={formData.supportContacts?.whatsapp || ''}
                onChange={(e) => handleSupportContactChange('whatsapp', e.target.value)}
                className="col-span-3"
                placeholder="مثال: +963123456789"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telegramNumber" className="text-right">
                رقم التلجرام
              </Label>
              <Input
                id="telegramNumber"
                value={formData.supportContacts?.telegram || ''}
                onChange={(e) => handleSupportContactChange('telegram', e.target.value)}
                className="col-span-3"
                placeholder="مثال: @username أو +963123456789"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                رقم الهاتف
              </Label>
              <Input
                id="phoneNumber"
                value={formData.supportContacts?.phone || ''}
                onChange={(e) => handleSupportContactChange('phone', e.target.value)}
                className="col-span-3"
                placeholder="مثال: +963123456789"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              طرق التواصل (صفحة تواصل معنا)
              <Button onClick={addContactMethod} variant="outline" size="sm">
                <Settings className="ml-2 h-4 w-4" />
                إضافة طريقة تواصل
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(formData.contactMethods || []).map((method: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={method}
                  onChange={(e) => updateContactMethod(index, e.target.value)}
                  placeholder="مثال: واتساب: +963123456789"
                  className="flex-1"
                />
                <Button
                  onClick={() => deleteContactMethod(index)}
                  variant="destructive"
                  size="sm"
                >
                  حذف
                </Button>
              </div>
            ))}
            
            {(!formData.contactMethods || formData.contactMethods.length === 0) && (
              <div className="text-center text-gray-500 py-8">
                لا توجد طرق تواصل. اضغط "إضافة طريقة تواصل" لإضافة طريقة جديدة.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إعدادات صفحة تواصل معنا</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contactPageTitle" className="text-right">
                عنوان الصفحة
              </Label>
              <Input
                id="contactPageTitle"
                value={formData.contactPageTitle}
                onChange={(e) => handleInputChange('contactPageTitle', e.target.value)}
                className="col-span-3"
                placeholder="تواصل معنا"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="contactPageDescription" className="text-right pt-2">
                وصف الصفحة
              </Label>
              <Textarea
                id="contactPageDescription"
                value={formData.contactPageDescription}
                onChange={(e) => handleInputChange('contactPageDescription', e.target.value)}
                className="col-span-3"
                placeholder="نحن هنا لمساعدتك في أي وقت"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="workingHoursTitle" className="text-right">
                عنوان أوقات العمل
              </Label>
              <Input
                id="workingHoursTitle"
                value={formData.workingHoursTitle}
                onChange={(e) => handleInputChange('workingHoursTitle', e.target.value)}
                className="col-span-3"
                placeholder="أوقات العمل"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>أوقات العمل</Label>
                <Button onClick={addWorkingHour} variant="outline" size="sm">
                  <Settings className="ml-2 h-4 w-4" />
                  إضافة وقت عمل
                </Button>
              </div>
              {(formData.workingHours || []).map((hour: string, index: number) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input
                    value={hour}
                    onChange={(e) => updateWorkingHour(index, e.target.value)}
                    placeholder="مثال: الأحد - الخميس: 9:00 صباحاً - 6:00 مساءً"
                    className="flex-1"
                  />
                  <Button
                    onClick={() => deleteWorkingHour(index)}
                    variant="destructive"
                    size="sm"
                  >
                    حذف
                  </Button>
                </div>
              ))}
              
              {(!formData.workingHours || formData.workingHours.length === 0) && (
                <div className="text-center text-gray-500 py-4">
                  لا توجد أوقات عمل. اضغط "إضافة وقت عمل" لإضافة وقت جديد.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              خطط الاشتراك
              <Button onClick={addSubscriptionPlan} variant="outline" size="sm">
                <Settings className="ml-2 h-4 w-4" />
                إضافة خطة
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {(formData.subscriptionPlans || []).map((plan: any, planIndex: number) => (
              <Card key={planIndex} className="p-4 border border-gray-200">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">خطة الاشتراك {planIndex + 1}</h4>
                    <Button 
                      onClick={() => deleteSubscriptionPlan(planIndex)}
                      variant="destructive" 
                      size="sm"
                    >
                      حذف الخطة
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>اسم الخطة</Label>
                      <Input
                        value={plan.name || ''}
                        onChange={(e) => updateSubscriptionPlan(planIndex, 'name', e.target.value)}
                        placeholder="مثال: الخطة الأساسية"
                      />
                    </div>
                    <div>
                      <Label>السعر</Label>
                      <Input
                        type="number"
                        value={plan.price || 0}
                        onChange={(e) => updateSubscriptionPlan(planIndex, 'price', parseFloat(e.target.value) || 0)}
                        placeholder="9.99"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>الوصف</Label>
                    <Textarea
                      value={plan.description || ''}
                      onChange={(e) => updateSubscriptionPlan(planIndex, 'description', e.target.value)}
                      placeholder="وصف الخطة"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label>المدة (بالشهور)</Label>
                    <Input
                      type="number"
                      value={plan.duration || 1}
                      onChange={(e) => updateSubscriptionPlan(planIndex, 'duration', parseInt(e.target.value) || 1)}
                      placeholder="1"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>المميزات</Label>
                      <Button 
                        onClick={() => addPlanFeature(planIndex)}
                        variant="outline" 
                        size="sm"
                      >
                        إضافة ميزة
                      </Button>
                    </div>
                    {(plan.features || []).map((feature: string, featureIndex: number) => (
                      <div key={featureIndex} className="flex items-center gap-2 mb-2">
                        <Input
                          value={feature}
                          onChange={(e) => updatePlanFeature(planIndex, featureIndex, e.target.value)}
                          placeholder="ميزة الخطة"
                        />
                        <Button 
                          onClick={() => deletePlanFeature(planIndex, featureIndex)}
                          variant="destructive" 
                          size="sm"
                        >
                          حذف
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
            
            {(!formData.subscriptionPlans || formData.subscriptionPlans.length === 0) && (
              <div className="text-center text-gray-500 py-8">
                لا توجد خطط اشتراك. اضغط "إضافة خطة" لإنشاء خطة جديدة.
              </div>
            )}
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
