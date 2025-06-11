
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, FileText, Star, LogOut } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { subjects, codes } = useData();
  
  const usersCount = (JSON.parse(localStorage.getItem('smartedu_users') || '[]')).filter((user: any) => !user.isAdmin).length;
  const activeCodes = codes.filter(code => !code.isUsed).length;
  
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

const AdminPanel: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('smartedu_user') || '{}');
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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
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
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
