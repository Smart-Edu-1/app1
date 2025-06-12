
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Layers } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';
import { useToast } from '@/hooks/use-toast';

const UnitManagement = () => {
  const { units, subjects, addUnit, updateUnit, deleteUnit } = useAppData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subjectId: '',
    order: 1,
    isActive: true
  });

  const handleSubmit = () => {
    if (editingUnit) {
      updateUnit(editingUnit.id, formData);
      toast({
        title: "تم تحديث الوحدة",
        description: "تم حفظ التغييرات بنجاح"
      });
    } else {
      addUnit(formData);
      toast({
        title: "تم إضافة الوحدة",
        description: "تم إنشاء الوحدة الجديدة بنجاح"
      });
    }
    
    setIsDialogOpen(false);
    setEditingUnit(null);
    setFormData({ name: '', description: '', subjectId: '', order: 1, isActive: true });
  };

  const handleEdit = (unit: any) => {
    setEditingUnit(unit);
    setFormData({
      name: unit.name,
      description: unit.description,
      subjectId: unit.subjectId,
      order: unit.order,
      isActive: unit.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (unitId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الوحدة؟')) {
      deleteUnit(unitId);
      toast({
        title: "تم حذف الوحدة",
        description: "تم حذف الوحدة بنجاح"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الوحدات التعليمية</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              إضافة وحدة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUnit ? 'تعديل الوحدة' : 'إضافة وحدة جديدة'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subjectId">المادة الدراسية</Label>
                <select
                  id="subjectId"
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">اختر المادة</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="name">اسم الوحدة</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: الوحدة الأولى"
                />
              </div>
              <div>
                <Label htmlFor="description">وصف الوحدة</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وصف مختصر عن الوحدة"
                />
              </div>
              <div>
                <Label htmlFor="order">ترتيب الوحدة</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  min="1"
                />
              </div>
              <Button onClick={handleSubmit} className="w-full">
                {editingUnit ? 'حفظ التغييرات' : 'إضافة الوحدة'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Layers className="ml-2 h-5 w-5" />
            الوحدات التعليمية ({units.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم الوحدة</TableHead>
                <TableHead>المادة</TableHead>
                <TableHead>الوصف</TableHead>
                <TableHead>الترتيب</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((unit) => {
                const subject = subjects.find(s => s.id === unit.subjectId);
                return (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium">{unit.name}</TableCell>
                    <TableCell>{subject?.name || 'غير محدد'}</TableCell>
                    <TableCell>{unit.description}</TableCell>
                    <TableCell>{unit.order}</TableCell>
                    <TableCell>
                      <Badge variant={unit.isActive ? "default" : "secondary"}>
                        {unit.isActive ? 'نشط' : 'معطل'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(unit)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(unit.id)}
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

export default UnitManagement;
