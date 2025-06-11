
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-6xl font-bold text-muted-foreground">404</CardTitle>
          <p className="text-xl text-muted-foreground">الصفحة غير موجودة</p>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            عذراً، الصفحة التي تبحث عنها غير موجودة
          </p>
          <Button onClick={() => navigate('/')} className="w-full">
            <Home className="mr-2 h-4 w-4" />
            العودة للصفحة الرئيسية
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
