import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Clock, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TransferRequest {
  id: string;
  username: string;
  password: string;
  note: string | null;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

const TransferRequestManagement: React.FC = () => {
  const [requests, setRequests] = useState<TransferRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transfer_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      if (error) {
        console.error('خطأ في تحميل الطلبات:', error);
        toast({
          title: "خطأ",
          description: "فشل تحميل طلبات النقل",
          variant: "destructive"
        });
        return;
      }

      setRequests((data || []) as TransferRequest[]);
    } catch (error) {
      console.error('خطأ في تحميل الطلبات:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (request: TransferRequest) => {
    if (!user) return;

    setProcessing(request.id);

    try {
      // البحث عن المستخدم
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', request.username)
        .eq('password', request.password)
        .single();

      if (profileError || !profile) {
        toast({
          title: "خطأ",
          description: "لم يتم العثور على المستخدم",
          variant: "destructive"
        });
        setProcessing(null);
        return;
      }

      // حذف معرف الجهاز القديم
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          device_id: null,
          is_logged_out: true
        })
        .eq('id', profile.id);

      if (updateError) {
        console.error('خطأ في تحديث الحساب:', updateError);
        toast({
          title: "خطأ",
          description: "فشل في تحديث الحساب",
          variant: "destructive"
        });
        setProcessing(null);
        return;
      }

      // تحديث حالة الطلب
      const { error: requestError } = await supabase
        .from('transfer_requests')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id
        })
        .eq('id', request.id);

      if (requestError) {
        console.error('خطأ في تحديث الطلب:', requestError);
      }

      toast({
        title: "تم الموافقة",
        description: "تم قبول طلب النقل بنجاح"
      });

      loadRequests();
    } catch (error) {
      console.error('خطأ في معالجة الطلب:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء معالجة الطلب",
        variant: "destructive"
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!user) return;

    setProcessing(requestId);

    try {
      const { error } = await supabase
        .from('transfer_requests')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id
        })
        .eq('id', requestId);

      if (error) {
        console.error('خطأ في رفض الطلب:', error);
        toast({
          title: "خطأ",
          description: "فشل في رفض الطلب",
          variant: "destructive"
        });
        setProcessing(null);
        return;
      }

      toast({
        title: "تم الرفض",
        description: "تم رفض طلب النقل"
      });

      loadRequests();
    } catch (error) {
      console.error('خطأ في رفض الطلب:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء رفض الطلب",
        variant: "destructive"
      });
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700"><Clock className="ml-1 h-3 w-3" />قيد المراجعة</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700"><Check className="ml-1 h-3 w-3" />موافق عليه</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700"><X className="ml-1 h-3 w-3" />مرفوض</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>جارٍ تحميل الطلبات...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>إدارة طلبات نقل الحساب</CardTitle>
            <CardDescription>مراجعة والموافقة على طلبات نقل الحسابات</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={loadRequests}>
            <RefreshCw className="ml-2 h-4 w-4" />
            تحديث
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>لا توجد طلبات نقل حالياً</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="border">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{request.username}</p>
                        <p className="text-sm text-gray-500">
                          تاريخ الطلب: {new Date(request.requested_at).toLocaleString('ar-SA')}
                        </p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>

                    {request.note && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>الملاحظة:</strong> {request.note}
                        </p>
                      </div>
                    )}

                    {request.status === 'pending' && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => handleApprove(request)}
                          disabled={processing === request.id}
                          className="flex-1"
                        >
                          <Check className="ml-2 h-4 w-4" />
                          {processing === request.id ? 'جارٍ المعالجة...' : 'موافقة'}
                        </Button>
                        <Button
                          onClick={() => handleReject(request.id)}
                          disabled={processing === request.id}
                          variant="destructive"
                          className="flex-1"
                        >
                          <X className="ml-2 h-4 w-4" />
                          رفض
                        </Button>
                      </div>
                    )}

                    {request.reviewed_at && (
                      <p className="text-xs text-gray-500">
                        تمت المراجعة: {new Date(request.reviewed_at).toLocaleString('ar-SA')}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransferRequestManagement;
