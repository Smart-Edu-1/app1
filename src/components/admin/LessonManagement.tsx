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
import { Plus, Edit, Trash2, Play, Loader2 } from 'lucide-react';
import { useSupabaseAppData } from '@/contexts/SupabaseAppDataContext';
import { useToast } from '@/hooks/use-toast';
import { useThumbnailUpload } from '@/hooks/useThumbnailUpload';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Upload } from 'lucide-react';

const LessonManagement = () => {
  const { lessons, units, subjects, addLesson, updateLesson, deleteLesson } = useSupabaseAppData();
  const { toast } = useToast();
  const { uploadThumbnail, uploading } = useThumbnailUpload();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unitId: '',
    youtubeUrl: '',
    thumbnailPath: '',
    isPremium: false,
    order: 1,
    isActive: true
  });

  const handleSubmit = async () => {
    try {
      let thumbnailPath = formData.thumbnailPath;

      // Upload thumbnail if a new file is selected
      if (thumbnailFile) {
        const tempId = editingLesson?.id || `temp_${Date.now()}`;
        const thumbnails = await uploadThumbnail(thumbnailFile, tempId);
        if (thumbnails) {
          thumbnailPath = thumbnails.large;
        }
      }

      // Extract YouTube ID from URL if provided
      let youtubeId = '';
      if (formData.youtubeUrl) {
        youtubeId = extractYouTubeId(formData.youtubeUrl);
        if (!youtubeId) {
          toast({
            title: "خطأ",
            description: "رابط YouTube غير صحيح. يرجى التحقق من الرابط",
            variant: "destructive"
          });
          return;
        }
      }

      const lessonData = {
        ...formData,
        youtubeId,
        thumbnailPath,
        videoUrl: formData.youtubeUrl // Keep for backward compatibility
      };

      if (editingLesson) {
        await updateLesson(editingLesson.id, lessonData);
        toast({
          title: "تم تحديث الدرس",
          description: "تم حفظ التغييرات بنجاح"
        });
      } else {
        await addLesson(lessonData);
        toast({
          title: "تم إضافة الدرس",
          description: "تم إنشاء الدرس الجديد بنجاح"
        });
      }
      
      setIsDialogOpen(false);
      setEditingLesson(null);
      setThumbnailFile(null);
      setFormData({ 
        name: '', 
        description: '', 
        unitId: '', 
        youtubeUrl: '',
        thumbnailPath: '',
        isPremium: false, 
        order: 1,
        isActive: true 
      });
    } catch (error) {
      console.error('Error saving lesson:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الدرس",
        variant: "destructive"
      });
    }
  };

  // Extract YouTube ID from various URL formats
  const extractYouTubeId = (url: string): string => {
    // If it's already just an ID
    if (url.length === 11 && !url.includes('/') && !url.includes('?')) {
      return url;
    }

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const handleEdit = (lesson: any) => {
    setEditingLesson(lesson);
    setFormData({
      name: lesson.name || '',
      description: lesson.description || '',
      unitId: lesson.unitId || '',
      youtubeUrl: lesson.videoUrl || '',
      thumbnailPath: lesson.thumbnailPath || '',
      isPremium: lesson.isPremium || false,
      order: lesson.order || 1,
      isActive: lesson.isActive
    });
    setThumbnailFile(null);
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
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>تنبيه أمني:</strong> هذا النظام يطبق إجراءات حماية متقدمة لمنع استخراج روابط الفيديو عبر فحص الصفحة. 
                  ومع ذلك، لا توجد طريقة تكنولوجية تضمن حماية 100% ضد المستخدمين المحترفين الذين يمكنهم استخدام أدوات متقدمة أو تسجيل الشاشة.
                </AlertDescription>
              </Alert>

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
                <Label htmlFor="youtubeUrl">رابط أو ID فيديو YouTube</Label>
                <Input
                  id="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=... أو ABC123xyz"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  يمكنك إدخال رابط YouTube كامل أو فقط معرف الفيديو (11 حرف)
                </p>
              </div>
              <div>
                <Label htmlFor="thumbnail">الصورة المصغرة (1280x720 موصى به)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                    disabled={uploading}
                  />
                  {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
                {formData.thumbnailPath && (
                  <div className="mt-2">
                    <img 
                      src={formData.thumbnailPath} 
                      alt="Preview" 
                      className="w-32 h-18 object-cover rounded"
                    />
                  </div>
                )}
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
              <Button onClick={handleSubmit} className="w-full" disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري الرفع...
                  </>
                ) : (
                  editingLesson ? 'حفظ التغييرات' : 'إضافة الدرس'
                )}
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