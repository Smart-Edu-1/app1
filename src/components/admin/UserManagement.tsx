
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Edit, Trash2, Calendar } from 'lucide-react';
import { useFirebaseData } from '@/hooks/useFirebaseData';
import { useToast } from '@/hooks/use-toast';

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const { updateData, deleteData, subscribeToData } = useFirebaseData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // الاستماع للتغييرات في المستخدمين
    const unsubscribe = subscribeToData('users', setUsers, {
      orderBy: { field: 'createdAt', direction: 'desc' }
    });
    
    return () => unsubscribe();
  }, []);

  const filteredUsers = users.filter(user => 
    !user.isAdmin && (
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    await updateData('users', userId, { isActive });
    toast({
      title: "تم تحديث حالة المستخدم",
      description: `تم ${isActive ? 'تفعيل' : 'تعطيل'} الحساب بنجاح`
    });
  };

  const handleExtendExpiry = async (userId: string) => {
    const newExpiryDate = new Date();
    newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);
    await updateData('users', userId, { expiryDate: newExpiryDate.toISOString() });
    toast({
      title: "تم تمديد الاشتراك",
      description: "تم تمديد اشتراك المستخدم لسنة إضافية"
    });
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      await deleteData('users', userId);
      toast({
        title: "تم حذف المستخدم",
        description: "تم حذف المستخدم بنجاح"
      });
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editingUser) {
      await updateData('users', editingUser.id, {
        fullName: editingUser.fullName,
        username: editingUser.username,
        password: editingUser.password
      });
      toast({
        title: "تم تحديث بيانات المستخدم",
        description: "تم حفظ التغييرات بنجاح"
      });
      setIsDialogOpen(false);
      setEditingUser(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة المستخدمين</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="البحث عن مستخدم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة المستخدمين ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم الثلاثي</TableHead>
                <TableHead>اسم المستخدم</TableHead>
                <TableHead>تاريخ الإنشاء</TableHead>
                <TableHead>تاريخ الانتهاء</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    {user.createdAt ? 
                      (user.createdAt.seconds ? 
                        new Date(user.createdAt.seconds * 1000).toLocaleDateString('en-GB') : 
                        new Date(user.createdAt).toLocaleDateString('en-GB')
                      ) : '-'
                    }
                  </TableCell>
                  <TableCell>
                    {user.expiryDate ? 
                      (user.expiryDate.seconds ? 
                        new Date(user.expiryDate.seconds * 1000).toLocaleDateString('en-GB') : 
                        new Date(user.expiryDate).toLocaleDateString('en-GB')
                      ) : '-'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={user.isActive}
                        onCheckedChange={(checked) => handleToggleActive(user.id, checked)}
                      />
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? 'نشط' : 'معطل'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExtendExpiry(user.id)}
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل بيانات المستخدم</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">الاسم الثلاثي</Label>
                <Input
                  id="fullName"
                  value={editingUser.fullName}
                  onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input
                  id="username"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  value={editingUser.password}
                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                />
              </div>
              <Button onClick={handleSaveEdit} className="w-full">
                حفظ التغييرات
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
