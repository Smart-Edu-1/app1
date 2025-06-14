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
import { Plus, Edit, Trash2, Play } from 'lucide-react';
import { useSupabaseAppData } from '@/contexts/SupabaseAppDataContext';
import { useToast } from '@/hooks/use-toast';

const LessonManagement = () => {
  const { lessons, units, subjects, addLesson, updateLesson, deleteLesson } = useSupabaseAppData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unitId: '',
    videoUrl: '',
    imageUrl: '',
    isPremium: false,
    order: 1,
    isActive: true
  });

  const handleSubmit = () => {
    if (editingLesson) {
      updateLesson(editingLesson.id, formData);
      toast({
        title: "تم تحديث الدرس",
        description: "تم حفظ التغييرات بنجاح"
      });
    } else {
      addLesson(formData);
      toast({
        title: "تم إضافة الدرس",
        description: "تم إنشاء الدرس الجديد بنجاح"
      });
    }
    
    setIsDialogOpen(false);
    setEditingLesson(null);
    setFormData({ 
      name: '', 
      description: '', 
      unitId: '', 
      videoUrl: '', 
      imageUrl: '', 
      isPremium: false, 
      order: 1,
      isActive: true 
    });
  };

  const handleEdit = (lesson: any) => {
    setEditingLesson(lesson);
    setFormData({
      name: lesson.name || '',
      description: lesson.description || '',
      unitId: lesson.unitId || '',
      videoUrl: lesson.videoUrl || '',
      imageUrl: lesson.imageUrl || '',
      isPremium: lesson.isPremium || false,
      order: lesson.order || 1,
      isActive: lesson.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (lessonId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الدرس؟')) {
      deleteLesson(lessonId);
      toast({
        title: "تم حذف الدرس",
        description: "تم حذف الدرس بنجاح"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الدروس</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              إضافة درس جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingLesson ? 'تعديل الدرس' : 'إضافة درس جديد'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="unitId">الوحدة</Label>
                <select
                  id="unitId"
                  value={formData.unitId}
                  onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">اختر الوحدة</option>
                  {units.map(unit => {
                    const subject = subjects.find(s => s.id === unit.subjectId);
                    return (
                      <option key={unit.id} value={unit.id}>
                        {subject?.name} - {unit.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <Label htmlFor="name">اسم الدرس</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: مقدمة في الفيزياء"
                />
              </div>
              <div>
                <Label htmlFor="description">وصف الدرس</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وصف مختصر عن الدرس"
                />
              </div>
              <div>
                <Label htmlFor="videoUrl">رابط الفيديو</Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://example.com/video.mp4"
                />
              </div>
              <div>
                <Label htmlFor="order">ترتيب الدرس</Label>
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
                  id="isPremium"
                  checked={!formData.isPremium}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPremium: !checked })}
                />
                <Label htmlFor="isPremium">درس مجاني</Label>
              </div>
              <Button onClick={handleSubmit} className="w-full">
                {editingLesson ? 'حفظ التغييرات' : 'إضافة الدرس'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Play className="ml-2 h-5 w-5" />
            الدروس ({lessons.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم الدرس</TableHead>
                <TableHead>الوحدة</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الترتيب</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessons.map((lesson) => {
                const unit = units.find(u => u.id === lesson.unitId);
                const subject = unit ? subjects.find(s => s.id === unit.subjectId) : null;
                return (
                  <TableRow key={lesson.id}>
                    <TableCell className="font-medium">{lesson.name}</TableCell>
                    <TableCell>
                      {subject?.name} - {unit?.name || 'غير محدد'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={!lesson.isPremium ? "secondary" : "destructive"}>
                        {!lesson.isPremium ? 'مجاني' : 'مدفوع'}
                      </Badge>
                    </TableCell>
                    <TableCell>{lesson.order}</TableCell>
                    <TableCell>
                      <Badge variant={lesson.isActive ? "default" : "secondary"}>
                        {lesson.isActive ? 'نشط' : 'معطل'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(lesson)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(lesson.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonManagement;