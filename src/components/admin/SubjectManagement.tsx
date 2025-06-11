
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';
import { useToast } from '@/hooks/use-toast';

const SubjectManagement = () => {
  const { subjects, addSubject, updateSubject, deleteSubject } = useAppData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    color: '#3B82F6'
  });

  const handleSubmit = () => {
    if (editingSubject) {
      updateSubject(editingSubject.id, formData);
      toast({
        title: "تم تحديث المادة",
        description: "تم حفظ التغييرات بنجاح"
      });
    } else {
      addSubject({
        ...formData,
        order: subjects.length + 1,
        isActive: true
      });
      toast({
        title: "تم إضافة المادة",
        description: "تم إنشاء المادة الجديدة بنجاح"
      });
    }
    
    setIsDialogOpen(false);
    setEditingSubject(null);
    setFormData({ name: '', description: '', icon: '', color: '#3B82F6' });
  };

  const handleEdit = (subject: any) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      description: subject.description,
      icon: subject.icon,
      color: subject.color
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
        <h2 className="text-2xl font-bold">إدارة المواد الدراسية</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              إضافة مادة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent>
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
                <Label htmlFor="icon">الأيقونة (رمز تعبيري)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="⚛️"
                />
              </div>
              <div>
                <Label htmlFor="color">اللون</Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
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
            المواد الدراسية ({subjects.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الأيقونة</TableHead>
                <TableHead>اسم المادة</TableHead>
                <TableHead>الوصف</TableHead>
                <TableHead>اللون</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${subject.color}20` }}
                    >
                      <span className="text-lg">{subject.icon}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{subject.name}</TableCell>
                  <TableCell>{subject.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: subject.color }}
                      />
                      <span className="text-sm font-mono">{subject.color}</span>
                    </div>
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
