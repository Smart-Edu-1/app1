
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, UserPlus, LogIn, Eye, EyeOff } from 'lucide-react';
import VideoProtection from '@/components/VideoProtection';

const LoginPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, enterAsGuest, user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!authLoading && user) {
      console.log('المستخدم الحالي:', user);
      if (user.isAdmin) {
        console.log('توجيه إلى لوحة الإدارة');
        navigate('/admin');
      } else {
        console.log('توجيه إلى التطبيق');
        navigate('/app');
      }
    }
  }, [user, navigate, authLoading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('محاولة تسجيل الدخول:', { username, password });
      const result = await login(username, password);
      
      if (result.success) {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: `مرحباً بك`
        });
        // التوجيه سيتم من useEffect عند تغيير user
      } else if (result.requiresTransfer) {
        toast({
          title: "جهاز غير مسموح",
          description: result.message || "لا يمكن الدخول من جهاز آخر",
          variant: "destructive",
          action: (
            <Button variant="outline" onClick={() => navigate('/transfer-request')}>
              معرفة المزيد
            </Button>
          )
        });
      }
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = () => {
    console.log('محاولة الدخول كضيف');
    enterAsGuest();
    toast({
      title: "تم الدخول كضيف",
      description: "يمكنك تصفح المحتوى المجاني فقط"
    });
    navigate('/app');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <VideoProtection>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-500">جارٍ التحقق من حالة تسجيل الدخول...</p>
          </div>
        </div>
      </VideoProtection>
    );
  }

  if (showLogin) {
    return (
      <VideoProtection>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">المنصة التعليمية</CardTitle>
              <CardDescription>رحلتك نحو النجاح تبدأ من هنا</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="username">اسم المستخدم</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                      placeholder="أدخل كلمة المرور"
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
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
                </Button>
              </form>
              <Button
                variant="ghost"
                onClick={() => setShowLogin(false)}
                className="w-full mt-4"
              >
                العودة للخيارات الرئيسية
              </Button>
            </CardContent>
          </Card>
        </div>
      </VideoProtection>
    );
  }

  return (
    <VideoProtection>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">المنصة التعليمية</CardTitle>
            <CardDescription className="text-lg">
              رحلتك نحو النجاح تبدأ من هنا
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleGuestAccess}
              variant="outline"
              className="w-full h-12 text-lg"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              تجربة التطبيق
            </Button>
            
            <Button
              onClick={handleRegister}
              variant="outline"
              className="w-full h-12 text-lg"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              إنشاء حساب جديد
            </Button>
            
            <Button
              onClick={() => setShowLogin(true)}
              className="w-full h-12 text-lg"
            >
              <LogIn className="mr-2 h-5 w-5" />
              تسجيل الدخول
            </Button>
          </CardContent>
        </Card>
      </div>
    </VideoProtection>
  );
};

export default LoginPage;
