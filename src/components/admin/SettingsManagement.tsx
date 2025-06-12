
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Save, Palette } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';
import { useToast } from '@/hooks/use-toast';

const SettingsManagement = () => {
  const { settings, updateSettings } = useAppData();
  const { toast } = useToast();
  const [formData, setFormData] = useState(settings);

  const handleSave = () => {
    updateSettings(formData);
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم تحديث إعدادات التطبيق بنجاح"
    });
  };

  const addContactMethod = () => {
    setFormData({
      ...formData,
      contactMethods: [...formData.contactMethods, '']
    });
  };

  const updateContactMethod = (index: number, value: string) => {
    const newMethods = [...formData.contactMethods];
    newMethods[index] = value;
    setFormData({
      ...formData,
      contactMethods: newMethods
    });
  };

  const removeContactMethod = (index: number) => {
    setFormData({
      ...formData,
      contactMethods: formData.contactMethods.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إعدادات التطبيق</h2>
        <Button onClick={handleSave}>
          <Save className="ml-2 h-4 w-4" />
          حفظ الإعدادات
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="ml-2 h-5 w-5" />
              الإعدادات العامة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="appName">اسم التطبيق</Label>
              <Input
                id="appName"
                value={formData.appName}
                onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="aboutText">نص لمحة عنا</Label>
              <Textarea
                id="aboutText"
                value={formData.aboutText}
                onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="adminUsername">اسم المستخدم للمشرف</Label>
              <Input
                id="adminUsername"
                value={formData.adminCredentials.username}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  adminCredentials: { 
                    ...formData.adminCredentials, 
                    username: e.target.value 
                  } 
                })}
              />
            </div>
            <div>
              <Label htmlFor="adminPassword">كلمة مرور المشرف</Label>
              <Input
                id="adminPassword"
                type="password"
                value={formData.adminCredentials.password}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  adminCredentials: { 
                    ...formData.adminCredentials, 
                    password: e.target.value 
                  } 
                })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="ml-2 h-5 w-5" />
              ألوان التطبيق
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="primaryColor">اللون الأساسي</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={formData.themeColors.primary}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    themeColors: { 
                      ...formData.themeColors, 
                      primary: e.target.value 
                    } 
                  })}
                  className="w-16 h-10"
                />
                <Input
                  value={formData.themeColors.primary}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    themeColors: { 
                      ...formData.themeColors, 
                      primary: e.target.value 
                    } 
                  })}
                  placeholder="#3B82F6"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="secondaryColor">اللون الثانوي</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={formData.themeColors.secondary}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    themeColors: { 
                      ...formData.themeColors, 
                      secondary: e.target.value 
                    } 
                  })}
                  className="w-16 h-10"
                />
                <Input
                  value={formData.themeColors.secondary}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    themeColors: { 
                      ...formData.themeColors, 
                      secondary: e.target.value 
                    } 
                  })}
                  placeholder="#10B981"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="accentColor">لون التمييز</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="accentColor"
                  type="color"
                  value={formData.themeColors.accent}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    themeColors: { 
                      ...formData.themeColors, 
                      accent: e.target.value 
                    } 
                  })}
                  className="w-16 h-10"
                />
                <Input
                  value={formData.themeColors.accent}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    themeColors: { 
                      ...formData.themeColors, 
                      accent: e.target.value 
                    } 
                  })}
                  placeholder="#F59E0B"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>أسعار الاشتراك</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="monthlyPrice">السعر الشهري ($)</Label>
              <Input
                id="monthlyPrice"
                type="number"
                step="0.01"
                value={formData.subscriptionPrices.monthly}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  subscriptionPrices: { 
                    ...formData.subscriptionPrices, 
                    monthly: parseFloat(e.target.value) 
                  } 
                })}
              />
            </div>
            <div>
              <Label htmlFor="quarterlyPrice">السعر ربع السنوي ($)</Label>
              <Input
                id="quarterlyPrice"
                type="number"
                step="0.01"
                value={formData.subscriptionPrices.quarterly}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  subscriptionPrices: { 
                    ...formData.subscriptionPrices, 
                    quarterly: parseFloat(e.target.value) 
                  } 
                })}
              />
            </div>
            <div>
              <Label htmlFor="yearlyPrice">السعر السنوي ($)</Label>
              <Input
                id="yearlyPrice"
                type="number"
                step="0.01"
                value={formData.subscriptionPrices.yearly}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  subscriptionPrices: { 
                    ...formData.subscriptionPrices, 
                    yearly: parseFloat(e.target.value) 
                  } 
                })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>طرق التواصل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.contactMethods.map((method, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={method}
                  onChange={(e) => updateContactMethod(index, e.target.value)}
                  placeholder="مثال: واتساب: +963 123 456 789"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeContactMethod(index)}
                >
                  حذف
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addContactMethod}>
              إضافة طريقة تواصل
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsManagement;
