
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Save, Palette, Plus, Edit, Trash2, Eye, EyeOff, Shield } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';
import { useToast } from '@/hooks/use-toast';
import { SubscriptionPlan } from '@/types';

const SettingsManagement = () => {
  const { settings, updateSettings } = useAppData();
  const { toast } = useToast();
  const [formData, setFormData] = useState(settings);
  const [showAdminUsername, setShowAdminUsername] = useState(false);
  const [isCredentialsDialogOpen, setIsCredentialsDialogOpen] = useState(false);
  const [credentialsForm, setCredentialsForm] = useState({
    currentUsername: '',
    currentPassword: '',
    newUsername: '',
    newPassword: ''
  });
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [planForm, setPlanForm] = useState({
    name: '',
    description: '',
    price: 0,
    currency: 'USD',
    duration: 1,
    features: [''],
    isActive: true,
    order: 1
  });

  const handleSave = () => {
    updateSettings(formData);
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم تحديث إعدادات التطبيق بنجاح"
    });
  };

  const handleCredentialsUpdate = () => {
    if (credentialsForm.currentUsername !== settings.adminCredentials.username ||
        credentialsForm.currentPassword !== settings.adminCredentials.password) {
      toast({
        title: "خطأ في التحقق",
        description: "اسم المستخدم أو كلمة المرور الحالية غير صحيحة",
        variant: "destructive"
      });
      return;
    }

    const updatedSettings = {
      ...formData,
      adminCredentials: {
        username: credentialsForm.newUsername,
        password: credentialsForm.newPassword
      }
    };

    setFormData(updatedSettings);
    updateSettings(updatedSettings);
    setIsCredentialsDialogOpen(false);
    setCredentialsForm({
      currentUsername: '',
      currentPassword: '',
      newUsername: '',
      newPassword: ''
    });

    toast({
      title: "تم تحديث بيانات الدخول",
      description: "تم تغيير اسم المستخدم وكلمة المرور بنجاح"
    });
  };

  const handleAddPlan = () => {
    const newPlan: SubscriptionPlan = {
      id: Date.now().toString(),
      ...planForm,
      features: planForm.features.filter(f => f.trim() !== '')
    };

    const updatedSettings = {
      ...formData,
      subscriptionPlans: [...formData.subscriptionPlans, newPlan]
    };

    setFormData(updatedSettings);
    setIsPlanDialogOpen(false);
    setPlanForm({
      name: '',
      description: '',
      price: 0,
      currency: 'USD',
      duration: 1,
      features: [''],
      isActive: true,
      order: 1
    });

    toast({
      title: "تم إضافة الخطة",
      description: "تم إنشاء خطة اشتراك جديدة"
    });
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      currency: plan.currency,
      duration: plan.duration,
      features: [...plan.features, ''],
      isActive: plan.isActive,
      order: plan.order
    });
    setIsPlanDialogOpen(true);
  };

  const handleUpdatePlan = () => {
    if (!editingPlan) return;

    const updatedPlans = formData.subscriptionPlans.map(plan =>
      plan.id === editingPlan.id
        ? {
            ...editingPlan,
            ...planForm,
            features: planForm.features.filter(f => f.trim() !== '')
          }
        : plan
    );

    const updatedSettings = {
      ...formData,
      subscriptionPlans: updatedPlans
    };

    setFormData(updatedSettings);
    setIsPlanDialogOpen(false);
    setEditingPlan(null);
    setPlanForm({
      name: '',
      description: '',
      price: 0,
      currency: 'USD',
      duration: 1,
      features: [''],
      isActive: true,
      order: 1
    });

    toast({
      title: "تم تحديث الخطة",
      description: "تم حفظ تغييرات خطة الاشتراك"
    });
  };

  const handleDeletePlan = (planId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الخطة؟')) {
      const updatedSettings = {
        ...formData,
        subscriptionPlans: formData.subscriptionPlans.filter(plan => plan.id !== planId)
      };

      setFormData(updatedSettings);
      toast({
        title: "تم حذف الخطة",
        description: "تم حذف خطة الاشتراك بنجاح"
      });
    }
  };

  const addFeature = () => {
    setPlanForm({
      ...planForm,
      features: [...planForm.features, '']
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...planForm.features];
    newFeatures[index] = value;
    setPlanForm({
      ...planForm,
      features: newFeatures
    });
  };

  const removeFeature = (index: number) => {
    setPlanForm({
      ...planForm,
      features: planForm.features.filter((_, i) => i !== index)
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
        {/* General Settings */}
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
          </CardContent>
        </Card>

        {/* Admin Credentials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="ml-2 h-5 w-5" />
              بيانات المشرف
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>اسم المستخدم</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type={showAdminUsername ? "text" : "password"}
                  value={formData.adminCredentials.username}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdminUsername(!showAdminUsername)}
                >
                  {showAdminUsername ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label>كلمة المرور</Label>
              <Input
                type="password"
                value="********"
                readOnly
                className="bg-gray-100"
              />
            </div>
            <Dialog open={isCredentialsDialogOpen} onOpenChange={setIsCredentialsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  تعديل بيانات الدخول
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>تعديل بيانات دخول المشرف</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>اسم المستخدم الحالي</Label>
                    <Input
                      value={credentialsForm.currentUsername}
                      onChange={(e) => setCredentialsForm({
                        ...credentialsForm,
                        currentUsername: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <Label>كلمة المرور الحالية</Label>
                    <Input
                      type="password"
                      value={credentialsForm.currentPassword}
                      onChange={(e) => setCredentialsForm({
                        ...credentialsForm,
                        currentPassword: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <Label>اسم المستخدم الجديد</Label>
                    <Input
                      value={credentialsForm.newUsername}
                      onChange={(e) => setCredentialsForm({
                        ...credentialsForm,
                        newUsername: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <Label>كلمة المرور الجديدة</Label>
                    <Input
                      type="password"
                      value={credentialsForm.newPassword}
                      onChange={(e) => setCredentialsForm({
                        ...credentialsForm,
                        newPassword: e.target.value
                      })}
                    />
                  </div>
                  <Button onClick={handleCredentialsUpdate} className="w-full">
                    حفظ التغييرات
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Theme Colors */}
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

        {/* Contact Methods */}
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

      {/* Subscription Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            خطط الاشتراك
            <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingPlan(null);
                  setPlanForm({
                    name: '',
                    description: '',
                    price: 0,
                    currency: 'USD',
                    duration: 1,
                    features: [''],
                    isActive: true,
                    order: 1
                  });
                }}>
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة خطة
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingPlan ? 'تعديل خطة الاشتراك' : 'إضافة خطة اشتراك جديدة'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>اسم الخطة</Label>
                    <Input
                      value={planForm.name}
                      onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                      placeholder="مثال: الخطة الأساسية"
                    />
                  </div>
                  <div>
                    <Label>الوصف</Label>
                    <Textarea
                      value={planForm.description}
                      onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                      placeholder="وصف الخطة"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>السعر</Label>
                      <Input
                        type="number"
                        value={planForm.price}
                        onChange={(e) => setPlanForm({ ...planForm, price: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label>العملة</Label>
                      <select
                        value={planForm.currency}
                        onChange={(e) => setPlanForm({ ...planForm, currency: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="USD">دولار أمريكي</option>
                        <option value="EUR">يورو</option>
                        <option value="SAR">ريال سعودي</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label>المدة (بالشهور)</Label>
                    <Input
                      type="number"
                      value={planForm.duration}
                      onChange={(e) => setPlanForm({ ...planForm, duration: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>المميزات</Label>
                    {planForm.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 mt-2">
                        <Input
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          placeholder="ميزة"
                        />
                        {planForm.features.length > 1 && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeFeature(index)}
                          >
                            حذف
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" onClick={addFeature} className="mt-2">
                      إضافة ميزة
                    </Button>
                  </div>
                  <Button 
                    onClick={editingPlan ? handleUpdatePlan : handleAddPlan} 
                    className="w-full"
                  >
                    {editingPlan ? 'حفظ التغييرات' : 'إضافة الخطة'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.subscriptionPlans.map((plan) => (
              <Card key={plan.id} className="relative">
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <p className="text-2xl font-bold text-primary">
                    {plan.price} {plan.currency}
                    <span className="text-sm font-normal text-gray-500">
                      /{plan.duration} شهر
                    </span>
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                  <ul className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-sm">• {feature}</li>
                    ))}
                  </ul>
                  <div className="flex space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPlan(plan)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePlan(plan.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsManagement;
