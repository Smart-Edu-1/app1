
import React from 'react';
import { Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, FileText, Star, Bell, Settings, LogOut, BarChart3 } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';
import { useToast } from '@/hooks/use-toast';
import UserManagement from '@/components/admin/UserManagement';
import CodeManagement from '@/components/admin/CodeManagement';
import SubjectManagement from '@/components/admin/SubjectManagement';
import NotificationManagement from '@/components/admin/NotificationManagement';

const AdminDashboard = () => {
  const { subjects, codes, users, notifications } = useAppData();
  
  const usersCount = users.filter(user => !user.isAdmin).length;
  const activeCodes = codes.filter(code => !code.isUsed && code.isActive).length;
  const unreadNotifications = notifications.filter(n => !n.isRead).length;
  
  const statsCards = [
    {
      title: 'المستخدمين',
      value: usersCount,
      icon: <Users className="h-6 w-6 text-blue-500" />,
      description: 'إجمالي المستخدمين المسجلين'
    },
    {
      title: 'المواد الدراسية',
      value: subjects.length,
      icon: <BookOpen className="h-6 w-6 text-violet-500" />,
      description: 'إجمالي المواد الدراسية'
    },
    {
      title: 'أكواد التفعيل المتاحة',
      value: activeCodes,
      icon: <Star className="h-6 w-6 text-orange-500" />,
      description: 'أكواد غير مستخدمة'
    },
    {
      title: 'الإشعارات غير المقروءة',
      value: unreadNotifications,
      icon: <Bell className="h-6 w-6 text-red-500" />,
      description: 'إشعارات تحتاج متابعة'
    }
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center">لوحة تحكم المشرف الرئيسية</h1>
        <p className="text-center text-muted-foreground mt-2">
          نظرة عامة على النظام
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{card.title}</CardTitle>
                {card.icon}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{card.value}</p>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const AdminSidebar = () => {
  const location = useLocation();
  
  const sidebarItems = [
    { path: '/admin', label: 'الرئيسية', icon: <BarChart3 className="h-5 w-5" /> },
    { path: '/admin/users', label: 'إدارة المستخدمين', icon: <Users className="h-5 w-5" /> },
    { path: '/admin/subjects', label: 'إدارة المواد', icon: <BookOpen className="h-5 w-5" /> },
    { path: '/admin/codes', label: 'أكواد التفعيل', icon: <Star className="h-5 w-5" /> },
    { path: '/admin/notifications', label: 'الإشعارات', icon: <Bell className="h-5 w-5" /> },
    { path: '/admin/settings', label: 'الإعدادات', icon: <Settings className="h-5 w-5" /> }
  ];

  return (
    <div className="bg-white shadow-lg w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-primary">Smart Edu Admin</h2>
        <p className="text-sm text-gray-600">لوحة التحكم</p>
      </div>
      
      <nav className="space-y-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

const AdminPanel: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('smartedu_current_user') || '{}');
    if (!userData || !userData.isAdmin) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "تم تسجيل الخروج",
      description: "شكراً لاستخدامك لوحة تحكم Smart Edu"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">لوحة تحكم Smart Edu</h1>
            <p className="text-muted-foreground">مرحباً {user?.fullName}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </Button>
        </div>
        
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/subjects" element={<SubjectManagement />} />
          <Route path="/codes" element={<CodeManagement />} />
          <Route path="/notifications" element={<NotificationManagement />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
