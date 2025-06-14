
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Menu } from 'lucide-react';
import { useSupabaseAppData } from '@/contexts/SupabaseAppDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import Sidebar from './Sidebar';

const Header: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { notifications } = useSupabaseAppData();
  const { user } = useAuth();
  const { appName } = useAppSettings();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => 
    !n.isRead && (!n.userId || n.userId === user?.id)
  ).length;

  return (
    <>
      <header className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <h1 className="text-xl font-bold text-center flex-1">{appName}</h1>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/app/notifications')}
            >
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Header;
