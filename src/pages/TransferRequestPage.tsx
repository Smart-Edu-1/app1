import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Send, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import VideoProtection from '@/components/VideoProtection';
import { supabase } from '@/integrations/supabase/client';

const TransferRequestPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.password.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم المستخدم وكلمة المرور",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // إنشاء طلب نقل الحساب
      const { error } = await supabase
        .from('transfer_requests')
        .insert({
          username: formData.username,
          password: formData.password,
          note: formData.note || null,
          status: 'pending'
        });

      if (error) {
        console.error('خطأ في إنشاء الطلب:', error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء إرسال الطلب",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "تم إرسال الطلب بنجاح",
        description: "سيتم مراجعة طلبك خلال 24 ساعة كحد أقصى"
      });

      // مسح النموذج
      setFormData({
        username: '',
        password: '',
        note: ''
      });

      // العودة للصفحة الرئيسية بعد 2 ثانية
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('خطأ في إرسال الطلب:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VideoProtection>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">طلب نقل الحساب</CardTitle>
            <CardDescription>
              نقل حسابك من جهاز إلى آخر
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>تعليمات نقل الحساب</AlertTitle>
              <AlertDescription>
                <ol className="list-decimal list-inside space-y-2 mt-2 text-sm">
                  <li>قم بتسجيل الخروج من الحساب على الجهاز القديم</li>
                  <li>أدخل اسم المستخدم وكلمة المرور للحساب المراد نقله</li>
                  <li>يمكنك إضافة ملاحظة (اختياري)</li>
                  <li>اضغط "تقديم الطلب"</li>
                  <li>سيتم مراجعة الطلب خلال 24 ساعة كحد أقصى</li>
                  <li>بعد الموافقة، يمكنك الدخول من الجهاز الجديد</li>
                </ol>
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="أدخل اسم المستخدم"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="أدخل كلمة المرور"
                  required
                />
              </div>

              <div>
                <Label htmlFor="note">ملاحظة (اختياري)</Label>
                <Textarea
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="أضف أي ملاحظات إضافية هنا..."
                  rows={4}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                <Send className="ml-2 h-4 w-4" />
                {loading ? "جارٍ إرسال الطلب..." : "تقديم الطلب"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-sm text-yellow-800 mb-2">تنبيه هام:</h3>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• تأكد من تسجيل الخروج من الجهاز القديم قبل تقديم الطلب</li>
                <li>• الطلب سيُراجع يدوياً من قبل فريق الدعم</li>
                <li>• قد يستغرق الأمر حتى 24 ساعة للمراجعة</li>
                <li>• ستتلقى إشعاراً عند الموافقة على الطلب</li>
              </ul>
            </div>
            
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
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

export default TransferRequestPage;
