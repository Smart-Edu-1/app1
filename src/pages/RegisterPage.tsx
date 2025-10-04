import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    activationCode: '',
    governorate: '',
    studentPhone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();

  const syrianGovernorates = [
    'دمشق',
    'ريف دمشق',
    'حلب',
    'حمص',
    'حماة',
    'اللاذقية',
    'طرطوس',
    'درعا',
    'السويداء',
    'الحسكة',
    'دير الزور',
    'الرقة',
    'القنيطرة'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleGovernorateChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      governorate: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من تطابق كلمة المرور
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "خطأ في كلمة المرور",
        description: "كلمة المرور وتأكيدها غير متطابقتين",
        variant: "destructive"
      });
      return;
    }

    // التحقق من قوة كلمة المرور
    if (formData.password.length < 6) {
      toast({
        title: "كلمة مرور ضعيفة",
        description: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
        variant: "destructive"
      });
      return;
    }

    // التحقق من أن اسم المستخدم بالإنكليزية
    const englishOnly = /^[a-zA-Z0-9_]+$/;
    if (!englishOnly.test(formData.username)) {
      toast({
        title: "اسم مستخدم غير صحيح",
        description: "يجب أن يحتوي اسم المستخدم على حروف إنكليزية وأرقام فقط",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const success = await register(
        formData.fullName,
        formData.username,
        formData.password,
        formData.activationCode,
        formData.governorate || undefined,
        formData.studentPhone || undefined
      );

      if (success) {
        navigate('/app');
        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: `مرحباً ${formData.fullName}`
        });
      }
    } catch (error) {
      // الخطأ سيظهر من AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Smart Edu</CardTitle>
          <CardDescription>إنشاء حساب جديد</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">الاسم الثلاثي</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                className="mt-1"
                placeholder="أدخل اسمك الثلاثي"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="governorate">المحافظة (اختياري)</Label>
              <Select value={formData.governorate} onValueChange={handleGovernorateChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="اختر المحافظة" />
                </SelectTrigger>
                <SelectContent>
                  {syrianGovernorates.map((gov) => (
                    <SelectItem key={gov} value={gov}>
                      {gov}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="studentPhone">رقم الطالب (اختياري)</Label>
              <Input
                id="studentPhone"
                name="studentPhone"
                type="tel"
                value={formData.studentPhone}
                onChange={handleInputChange}
                className="mt-1"
                placeholder="أدخل رقم الهاتف"
              />
            </div>
            
            <div>
              <Label htmlFor="username">اسم المستخدم (بالإنكليزية)</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                className="mt-1"
                placeholder="أدخل اسم المستخدم"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pr-10"
                  placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pr-10"
                  placeholder="أعد كتابة كلمة المرور"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="activationCode">كود التفعيل (اختياري)</Label>
              <Input
                id="activationCode"
                name="activationCode"
                type="text"
                value={formData.activationCode}
                onChange={handleInputChange}
                className="mt-1"
                placeholder="أدخل كود التفعيل أو اتركه فارغاً"
              />
              <p className="text-xs text-muted-foreground mt-1">
                يمكنك إضافة كود التفعيل لاحقاً من صفحة تفعيل المواد
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? "جارٍ إنشاء الحساب..." : "إنشاء حساب"}
            </Button>
          </form>
          
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="w-full mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            العودة للصفحة الرئيسية
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
