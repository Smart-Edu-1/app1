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
import { useAppData } from '@/contexts/AppDataContext';
import { useToast } from '@/hooks/use-toast';

const LessonManagement = () => {
  const { lessons, units, subjects, addLesson, updateLesson, deleteLesson } = useAppData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    unit_id: '',
    video_url: '',
    image_url: '',
    is_free: false,
    order_index: 1,
    is_active: true
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
      title: '', 
      description: '', 
      unit_id: '', 
      video_url: '', 
      image_url: '', 
      is_free: false, 
      order_index: 1,
      is_active: true 
    });
  };

  const handleEdit = (lesson: any) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title || '',
      description: lesson.description || '',
      unit_id: lesson.unit_id || '',
      video_url: lesson.video_url || '',
      image_url: lesson.image_url || '',
      is_free: lesson.is_free || false,
      order_index: lesson.order_index || 1,
      is_active: lesson.is_active
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
                <Label htmlFor="unit_id">الوحدة</Label>
                <select
                  id="unit_id"
                  value={formData.unit_id}
                  onChange={(e) => setFormData({ ...formData, unit_id: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">اختر الوحدة</option>
                  {units.map(unit => {
                    const subject = subjects.find(s => s.id === unit.subject_id);
                    return (
                      <option key={unit.id} value={unit.id}>
                        {subject?.name} - {unit.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <Label htmlFor="title">اسم الدرس</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                <Label htmlFor="video_url">رابط الفيديو</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://example.com/video.mp4"
                />
              </div>
              <div>
                <Label htmlFor="order_index">ترتيب الدرس</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                  min="1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_free"
                  checked={formData.is_free}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_free: checked })}
                />
                <Label htmlFor="is_free">درس مجاني</Label>
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
                const unit = units.find(u => u.id === lesson.unit_id);
                const subject = unit ? subjects.find(s => s.id === unit.subject_id) : null;
                return (
                  <TableRow key={lesson.id}>
                    <TableCell className="font-medium">{lesson.title}</TableCell>
                    <TableCell>
                      {subject?.name} - {unit?.name || 'غير محدد'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={lesson.is_free ? "secondary" : "destructive"}>
                        {lesson.is_free ? 'مجاني' : 'مدفوع'}
                      </Badge>
                    </TableCell>
                    <TableCell>{lesson.order_index}</TableCell>
                    <TableCell>
                      <Badge variant={lesson.is_active ? "default" : "secondary"}>
                        {lesson.is_active ? 'نشط' : 'معطل'}
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