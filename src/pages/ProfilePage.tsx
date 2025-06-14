import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Eye, EyeOff, LogOut, ArrowLeft } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBack = () => {
    navigate('/app');
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-gray-500">
          لا يمكن الوصول للملف الشخصي
        </div>
      </div>
    );
  }

  return (
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

            {user.id !== 'guest' && (
              <>
                <div className="flex flex-col space-y-2">
                  <span className="text-sm font-medium text-gray-600">تاريخ الانتهاء:</span>
                  <span className="text-lg">{new Date(user.expiryDate).toLocaleDateString('en-GB')}</span>
                </div>

                <div className="flex flex-col space-y-2">
                  <span className="text-sm font-medium text-gray-600">حالة الحساب:</span>
                  <span className={`text-lg font-medium ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {user.isActive ? 'نشط' : 'معطل'}
                  </span>
                </div>
              </>
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
  );
};

export default ProfilePage;