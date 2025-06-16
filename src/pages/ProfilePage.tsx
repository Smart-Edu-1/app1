
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Eye, EyeOff, LogOut, ArrowLeft, Smartphone } from 'lucide-react';
import VideoProtection from '@/components/VideoProtection';

const ProfilePage: React.FC = () => {
  const { user, logout, isGuest, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Log current user state for debugging
  useEffect(() => {
    console.log('ProfilePage - Current user state:', user);
    console.log('ProfilePage - Is guest:', isGuest);
    console.log('ProfilePage - Is loading:', isLoading);
  }, [user, isGuest, isLoading]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBack = () => {
    navigate('/app');
  };

  // Show loading state
  if (isLoading) {
    return (
      <VideoProtection>
        <div className="container mx-auto p-6 max-w-2xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-500">جاري تحميل الملف الشخصي...</p>
            </div>
          </div>
        </div>
      </VideoProtection>
    );
  }

  // Show message if no user is logged in
  if (!user) {
    return (
      <VideoProtection>
        <div className="container mx-auto p-6 max-w-2xl">
          <div className="text-center min-h-[400px] flex items-center justify-center">
            <div>
              <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">غير مسجل دخول</h2>
              <p className="text-gray-500 mb-4">يرجى تسجيل الدخول للوصول للملف الشخصي</p>
              <Button onClick={() => navigate('/')}>
                الذهاب لصفحة الدخول
              </Button>
            </div>
          </div>
        </div>
      </VideoProtection>
    );
  }

  return (
    <VideoProtection>
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            العودة
          </Button>
          
          <h1 className="text-2xl font-bold text-center">الملف الشخصي</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <User className="ml-2 h-6 w-6" />
              معلومات المستخدم
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-medium text-gray-600">الاسم الكامل:</span>
                <span className="text-lg">{user.fullName}</span>
              </div>

              <div className="flex flex-col space-y-2">
                <span className="text-sm font-medium text-gray-600">اسم المستخدم:</span>
                <div className="flex items-center justify-between">
                  <span className="text-lg">{showPassword ? user.username : '••••••••'}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {!isGuest && (
                <>
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-gray-600">تاريخ الانتهاء:</span>
                    <span className="text-lg">
                      {user.expiryDate ? new Date(user.expiryDate).toLocaleDateString('en-GB') : 'غير محدد'}
                    </span>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-gray-600">حالة الحساب:</span>
                    <span className={`text-lg font-medium ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {user.isActive ? 'نشط' : 'معطل'}
                    </span>
                  </div>

                  {user.deviceId && !user.isAdmin && (
                    <div className="flex flex-col space-y-2">
                      <span className="text-sm font-medium text-gray-600 flex items-center">
                        <Smartphone className="ml-1 h-4 w-4" />
                        معرف الجهاز:
                      </span>
                      <span className="text-sm text-gray-500 font-mono bg-gray-50 p-2 rounded">
                        {user.deviceId}
                      </span>
                      <p className="text-xs text-blue-600">
                        هذا الحساب مرتبط بجهاز محدد لضمان الأمان
                      </p>
                    </div>
                  )}

                  {user.isAdmin && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-700 font-medium">
                        🛡️ حساب مشرف - يمكن تسجيل الدخول من أي جهاز
                      </p>
                    </div>
                  )}
                </>
              )}

              {isGuest && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    أنت تتصفح كضيف. بعض المميزات قد تكون محدودة.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-6 border-t">
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="ml-2 h-4 w-4" />
                تسجيل الخروج
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </VideoProtection>
  );
};

export default ProfilePage;
