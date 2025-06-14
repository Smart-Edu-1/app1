
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseAppData } from '@/contexts/SupabaseAppDataContext';
import { Home, User, Info, MessageSquare, DollarSign, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { loading } = useSupabaseAppData();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
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
            onClick={() => handleNavigation('/app/profile')}
          >
            <User className="ml-2 h-5 w-5" />
            الملف الشخصي
          </Button>
          
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
          
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
