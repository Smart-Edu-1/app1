
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Settings } from 'lucide-react';

const HomePage = () => {
  const { subjects } = useData();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleSubjectClick = (subject: any) => {
    if (user?.id === 'guest') {
      toast({
        title: "محتوى محدود",
        description: "يجب تسجيل الدخول للوصول للمحتوى الكامل",
        variant: "destructive"
      });
    } else {
      toast({
        title: `${subject.name}`,
        description: "سيتم إضافة المحتوى قريباً",
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "تم تسجيل الخروج",
      description: "شكراً لاستخدام Smart Edu"
    });
  };

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-center mb-2">Smart Edu</h1>
          <p className="text-center text-muted-foreground">
            مرحباً {user?.fullName || 'بك'} في منصة التعليم الذكية
          </p>
        </div>
        <div className="flex gap-2">
          {user?.isAdmin && (
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/admin'}
            >
              <Settings className="w-4 h-4 mr-2" />
              لوحة التحكم
            </Button>
          )}
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            تسجيل الخروج
          </Button>
        </div>
      </header>
      
      <section>
        <h2 className="text-xl font-semibold mb-4">المواد الدراسية</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Card 
              key={subject.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              style={{ borderLeft: `4px solid ${subject.color}` }}
              onClick={() => handleSubjectClick(subject)}
            >
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                    style={{ backgroundColor: `${subject.color}20` }}
                  >
                    <span className="text-2xl">{subject.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{subject.name}</h3>
                    <p className="text-muted-foreground text-sm">{subject.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

const MainApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  );
};

export default MainApp;
