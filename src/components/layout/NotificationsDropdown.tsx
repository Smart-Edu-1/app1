
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppData } from '@/contexts/AppDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Check } from 'lucide-react';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead } = useAppData();
  const { user } = useAuth();

  if (!isOpen) return null;

  const userNotifications = notifications
    .filter(n => !n.userId || n.userId === user?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
  };

  return (
    <div className="absolute top-full left-0 mt-2 w-80 z-50">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">الإشعارات</CardTitle>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
          {userNotifications.length === 0 ? (
            <p className="text-center text-gray-500 py-4">لا توجد إشعارات</p>
          ) : (
            <div className="space-y-3">
              {userNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    notification.isRead ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.createdAt).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsDropdown;
