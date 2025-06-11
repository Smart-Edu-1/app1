
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useAppData } from '@/contexts/AppDataContext';
import { Home, User, Info, MessageSquare, DollarSign, Menu, X, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { settings } = useAppData();
  const navigate = useNavigate();
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">القائمة</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4 space-y-4">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => handleNavigation('/app')}
          >
            <Home className="ml-2 h-5 w-5" />
            الصفحة الرئيسية
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setShowUserDetails(!showUserDetails)}
          >
            <User className="ml-2 h-5 w-5" />
            الملف الشخصي
          </Button>
          
          {showUserDetails && user && (
            <div className="mr-7 p-3 bg-gray-50 rounded-lg space-y-2">
              <div>
                <span className="text-sm text-gray-600">الاسم: </span>
                <span className="text-sm">{user.fullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600">اسم المستخدم: </span>
                  <span className="text-sm">{showPassword ? user.username : '••••••••'}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
              {user.id !== 'guest' && (
                <>
                  <div>
                    <span className="text-sm text-gray-600">تاريخ الانتهاء: </span>
                    <span className="text-sm">{new Date(user.expiryDate).toLocaleDateString('ar-SA')}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">حالة الحساب: </span>
                    <span className={`text-sm ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {user.isActive ? 'نشط' : 'معطل'}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
          
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => handleNavigation('/app/about')}
          >
            <Info className="ml-2 h-5 w-5" />
            لمحة عنا
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => handleNavigation('/app/contact')}
          >
            <MessageSquare className="ml-2 h-5 w-5" />
            تواصل معنا
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => handleNavigation('/app/pricing')}
          >
            <DollarSign className="ml-2 h-5 w-5" />
            أسعار الاشتراك
          </Button>
          
          <div className="pt-4 border-t">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
