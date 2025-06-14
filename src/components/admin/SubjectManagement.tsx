
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { useSupabaseAppData } from '@/contexts/SupabaseAppDataContext';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from '@/components/ui/image-upload';

const SubjectManagement = () => {
  const { subjects, addSubject, updateSubject, deleteSubject } = useSupabaseAppData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    color: '#3B82F6',
    imageUrl: '',
    order: 1,
    isActive: true
  });

  const handleSubmit = () => {
    if (editingSubject) {
      updateSubject(editingSubject.id, formData);
      toast({
        title: "تم تحديث المادة",
        description: "تم حفظ التغييرات بنجاح"
      });
    } else {
      addSubject(formData);
      toast({
        title: "تم إضافة المادة",
        description: "تم إنشاء المادة الجديدة بنجاح"
      });
    }
    
    setIsDialogOpen(false);
    setEditingSubject(null);
    setFormData({ 
      name: '', 
      description: '', 
      icon: '', 
      color: '#3B82F6', 
      imageUrl: '', 
      order: 1, 
      isActive: true 
    });
  };

  const handleEdit = (subject: any) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      description: subject.description,
      icon: subject.icon,
      color: subject.color,
      imageUrl: subject.imageUrl || '',
      order: subject.order,
      isActive: subject.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (subjectId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه المادة؟')) {
      deleteSubject(subjectId);
      toast({
        title: "تم حذف المادة",
        description: "تم حذف المادة بنجاح"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة المواد</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              إضافة مادة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSubject ? 'تعديل المادة' : 'إضافة مادة جديدة'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">اسم المادة</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: الفيزياء"
                />
              </div>
              <div>
                <Label htmlFor="description">وصف المادة</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وصف مختصر عن المادة"
                />
              </div>
              <div>
                <Label htmlFor="icon">رمز المادة (إيموجي)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="⚛️"
                />
              </div>
              <div>
                <Label htmlFor="color">لون المادة</Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
              <ImageUpload
                currentImageUrl={formData.imageUrl}
                onImageChange={(imageUrl) => setFormData({ ...formData, imageUrl })}
                folder="subjects"
                label="صورة غلاف المادة"
                aspectRatio="600x375"
              />
              <div>
                <Label htmlFor="order">ترتيب المادة</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  min="1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">نشط</Label>
              </div>
              <Button onClick={handleSubmit} className="w-full">
                {editingSubject ? 'حفظ التغييرات' : 'إضافة المادة'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="ml-2 h-5 w-5" />
            المواد ({subjects.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الصورة</TableHead>
                <TableHead>اسم المادة</TableHead>
                <TableHead>الرمز</TableHead>
                <TableHead>اللون</TableHead>
                <TableHead>الترتيب</TableHead>
                <TableHead>تاريخ الإنشاء</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>
                    {subject.imageUrl ? (
                      <img 
                        src={subject.imageUrl} 
                        alt={subject.name}
                        className="w-12 h-8 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">لا توجد</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{subject.name}</TableCell>
                  <TableCell className="text-2xl">{subject.icon}</TableCell>
                  <TableCell>
                    <div 
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: subject.color }}
                    />
                  </TableCell>
                  <TableCell>{subject.order}</TableCell>
                  <TableCell>
                    {subject.createdAt ? new Date(subject.createdAt.seconds * 1000).toLocaleDateString('en-GB') : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={subject.isActive ? "default" : "secondary"}>
                      {subject.isActive ? 'نشط' : 'معطل'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(subject)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(subject.id)}
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
    </div>
  );
};

export default SubjectManagement;
