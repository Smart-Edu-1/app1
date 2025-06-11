
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Send } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';
import { useToast } from '@/hooks/use-toast';

const NotificationManagement = () => {
  const { notifications, addNotification, users } = useAppData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    userId: '' // empty means send to all users
  });

  const handleSendNotification = () => {
    addNotification({
      title: formData.title,
      message: formData.message,
      isRead: false,
      userId: formData.userId || undefined
    });

    toast({
      title: "تم إرسال الإشعار",
      description: formData.userId ? "تم إرسال الإشعار للمستخدم المحدد" : "تم إرسال الإشعار لجميع المستخدمين"
    });

    setIsDialogOpen(false);
    setFormData({ title: '', message: '', userId: '' });
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
                <TableHead>المستخدم</TableHead>
                <TableHead>تاريخ الإرسال</TableHead>
                <TableHead>الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-medium">{notification.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{notification.message}</TableCell>
                  <TableCell>
                    {notification.userId 
                      ? users.find(u => u.id === notification.userId)?.fullName || 'مستخدم محذوف'
                      : 'جميع المستخدمين'
                    }
                  </TableCell>
                  <TableCell>{new Date(notification.createdAt).toLocaleDateString('ar-SA')}</TableCell>
                  <TableCell>
                    <Badge variant={notification.isRead ? "default" : "secondary"}>
                      {notification.isRead ? 'مقروء' : 'غير مقروء'}
                    </Badge>
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
