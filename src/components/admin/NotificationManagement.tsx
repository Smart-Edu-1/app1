
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Send, Trash2 } from 'lucide-react';
import { useSupabaseAppData } from '@/contexts/SupabaseAppDataContext';
import { useToast } from '@/hooks/use-toast';

const NotificationManagement = () => {
  const { notifications, addNotification, deleteNotification, users } = useSupabaseAppData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    userId: '' // empty means send to all users
  });

  const handleSendNotification = async () => {
    await addNotification({
      title: formData.title,
      message: formData.message,
      type: formData.type,
      userId: formData.userId || null
    });

    toast({
      title: "تم إرسال الإشعار",
      description: formData.userId ? "تم إرسال الإشعار للمستخدم المحدد" : "تم إرسال الإشعار لجميع المستخدمين"
    });

    setIsDialogOpen(false);
    setFormData({ title: '', message: '', type: 'info', userId: '' });
  };

  const handleDeleteNotification = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الإشعار؟')) {
      await deleteNotification(id);
      toast({
        title: "تم حذف الإشعار",
        description: "تم حذف الإشعار بنجاح"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الإشعارات</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              إرسال إشعار جديد
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إرسال إشعار جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان الإشعار</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="عنوان الإشعار"
                />
              </div>
              <div>
                <Label htmlFor="message">محتوى الإشعار</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="محتوى الإشعار"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="type">نوع الإشعار</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="info">معلومات</option>
                  <option value="success">نجاح</option>
                  <option value="warning">تحذير</option>
                  <option value="error">خطأ</option>
                </select>
              </div>
              <div>
                <Label htmlFor="userId">المستخدم (اتركه فارغاً للإرسال للجميع)</Label>
                <select
                  id="userId"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">جميع المستخدمين</option>
                  {users.filter(u => !u.isAdmin).map(user => (
                    <option key={user.id} value={user.id}>
                      {user.fullName} ({user.username})
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={handleSendNotification} className="w-full">
                <Send className="ml-2 h-4 w-4" />
                إرسال الإشعار
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>سجل الإشعارات ({notifications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العنوان</TableHead>
                <TableHead>المحتوى</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>المستخدم</TableHead>
                <TableHead>تاريخ الإرسال</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-medium">{notification.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{notification.message}</TableCell>
                  <TableCell>
                    <Badge variant={
                      notification.type === 'error' ? 'destructive' : 
                      notification.type === 'warning' ? 'secondary' : 'default'
                    }>
                      {notification.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {notification.userId 
                      ? users.find(u => u.id === notification.userId)?.fullName || 'مستخدم محذوف'
                      : 'جميع المستخدمين'
                    }
                  </TableCell>
                  <TableCell>{new Date(notification.createdAt).toLocaleDateString('en-GB')}</TableCell>
                  <TableCell>
                    <Badge variant={notification.isRead ? "default" : "secondary"}>
                      {notification.isRead ? 'مقروء' : 'غير مقروء'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      onClick={() => handleDeleteNotification(notification.id)}
                      variant="destructive" 
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationManagement;
