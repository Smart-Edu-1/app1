
import React from 'react';
import { Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, FileText, Star, Bell, Settings, LogOut, BarChart3, Layers, Play, HelpCircle, MapPin } from 'lucide-react';
import { useSupabaseAppData } from '@/contexts/SupabaseAppDataContext';
import { useToast } from '@/hooks/use-toast';
import VideoProtection from '@/components/VideoProtection';
import UserManagement from '@/components/admin/UserManagement';
import CodeManagement from '@/components/admin/CodeManagement';
import SubjectManagement from '@/components/admin/SubjectManagement';
import UnitManagement from '@/components/admin/UnitManagement';
import LessonManagement from '@/components/admin/LessonManagement';
import QuizManagement from '@/components/admin/QuizManagement';
import NotificationManagement from '@/components/admin/NotificationManagement';
import AdminSettings from '@/components/admin/AdminSettings';
import DistributionCenterManagement from '@/components/admin/DistributionCenterManagement';
import TransferRequestManagement from '@/components/admin/TransferRequestManagement';

const AdminDashboard = () => {
  const { subjects, codes, units, lessons, quizzes, distributionCenters } = useSupabaseAppData();
  
  const activeCodes = codes.filter(code => !code.isUsed).length;
  
  const statsCards = [
    {
      title: 'المواد الدراسية',
      value: subjects.length,
      icon: <BookOpen className="h-6 w-6 text-violet-500" />,
      description: 'إجمالي المواد الدراسية'
    },
    {
      title: 'الوحدات التعليمية',
      value: units.length,
      icon: <Layers className="h-6 w-6 text-green-500" />,
      description: 'إجمالي الوحدات'
    },
    {
      title: 'الدروس',
      value: lessons.length,
      icon: <Play className="h-6 w-6 text-purple-500" />,
      description: 'إجمالي الدروس التعليمية'
    },
    {
      title: 'الاختبارات',
      value: quizzes.length,
      icon: <HelpCircle className="h-6 w-6 text-yellow-500" />,
      description: 'إجمالي الاختبارات'
    },
    {
      title: 'أكواد التفعيل المتاحة',
      value: activeCodes,
      icon: <Star className="h-6 w-6 text-orange-500" />,
      description: 'أكواد غير مستخدمة'
    },
    {
      title: 'إجمالي الأكواد',
      value: codes.length,
      icon: <FileText className="h-6 w-6 text-blue-500" />,
      description: 'جميع أكواد التفعيل'
    },
    {
      title: 'مراكز التوزيع',
      value: distributionCenters.length,
      icon: <MapPin className="h-6 w-6 text-red-500" />,
      description: 'مراكز التوزيع النشطة'
    }
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center">لوحة تحكم Smart Edu</h1>
        <p className="text-center text-muted-foreground mt-2">
          نظرة عامة على النظام
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                {card.icon}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.description}</p>
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
    { path: '/admin/transfer-requests', label: 'طلبات نقل الحساب', icon: <FileText className="h-5 w-5" /> },
    { path: '/admin/subjects', label: 'إدارة المواد', icon: <BookOpen className="h-5 w-5" /> },
    { path: '/admin/units', label: 'إدارة الوحدات', icon: <Layers className="h-5 w-5" /> },
    { path: '/admin/lessons', label: 'إدارة الدروس', icon: <Play className="h-5 w-5" /> },
    { path: '/admin/quizzes', label: 'إدارة الاختبارات', icon: <HelpCircle className="h-5 w-5" /> },
    { path: '/admin/codes', label: 'أكواد التفعيل', icon: <Star className="h-5 w-5" /> },
    { path: '/admin/distribution-centers', label: 'مراكز التوزيع', icon: <MapPin className="h-5 w-5" /> },
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
    if (!user || !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "تم تسجيل الخروج",
      description: "شكراً لاستخدامك لوحة تحكم Smart Edu"
    });
  };

  if (!user || !user.isAdmin) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <VideoProtection>
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
            <Route path="/transfer-requests" element={<TransferRequestManagement />} />
            <Route path="/subjects" element={<SubjectManagement />} />
            <Route path="/units" element={<UnitManagement />} />
            <Route path="/lessons" element={<LessonManagement />} />
            <Route path="/quizzes" element={<QuizManagement />} />
            <Route path="/codes" element={<CodeManagement />} />
            <Route path="/distribution-centers" element={<DistributionCenterManagement />} />
            <Route path="/notifications" element={<NotificationManagement />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </div>
    </VideoProtection>
  );
};

export default AdminPanel;
