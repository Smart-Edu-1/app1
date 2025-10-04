import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Check } from 'lucide-react';
import VideoProtection from '@/components/VideoProtection';

const ActivateSubjectPage: React.FC = () => {
  const [activationCode, setActivationCode] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { user, activateSubject, isGuest } = useAuth();
  const { toast } = useToast();

  // إذا كان ضيفاً، أعد التوجيه
  React.useEffect(() => {
    if (isGuest) {
      toast({
        title: "غير مسموح",
        description: "يجب تسجيل الدخول لتفعيل المواد",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [isGuest, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activationCode.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال كود التفعيل",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const result = await activateSubject(activationCode);
      
      if (result.success) {
        toast({
          title: "تم التفعيل بنجاح",
          description: result.message
        });
        setActivationCode('');
        setTimeout(() => {
          navigate('/app');
        }, 1500);
      } else {
        toast({
          title: "فشل التفعيل",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء التفعيل",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VideoProtection>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">تفعيل المواد</CardTitle>
            <CardDescription>
              أدخل كود التفعيل لتفعيل مادة أو المنهاج الكامل
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>مرحباً، {user.fullName}</strong>
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  يمكنك تفعيل مادة واحدة أو المنهاج الكامل باستخدام كود التفعيل
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="activationCode">كود التفعيل</Label>
                <Input
                  id="activationCode"
                  type="text"
                  value={activationCode}
                  onChange={(e) => setActivationCode(e.target.value)}
                  className="mt-1"
                  placeholder="أدخل كود التفعيل"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  الكود يكون مكوناً من أحرف وأرقام
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                <Check className="ml-2 h-4 w-4" />
                {loading ? "جارٍ التفعيل..." : "تفعيل"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">ملاحظات هامة:</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• كل كود تفعيل يستخدم مرة واحدة فقط</li>
                <li>• يمكنك تفعيل مادة واحدة أو المنهاج الكامل</li>
                <li>• للحصول على كود تفعيل، تواصل مع الدعم</li>
              </ul>
            </div>
            
            <Button
              variant="ghost"
              onClick={() => navigate('/app')}
              className="w-full mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              العودة للصفحة الرئيسية
            </Button>
          </CardContent>
        </Card>
      </div>
    </VideoProtection>
  );
};

export default ActivateSubjectPage;
