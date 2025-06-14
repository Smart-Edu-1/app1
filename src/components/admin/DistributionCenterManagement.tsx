import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Plus, Edit, Trash2, Phone, Clock } from 'lucide-react';
import { useSupabaseAppData } from '@/contexts/SupabaseAppDataContext';
import { useToast } from '@/hooks/use-toast';

interface DistributionCenter {
  id: string;
  name: string;
  address: string;
  phone: string;
  working_hours: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  order_index: number;
}

const DistributionCenterManagement = () => {
  const { distributionCenters, createDistributionCenter, updateDistributionCenter, deleteDistributionCenter } = useSupabaseAppData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState<DistributionCenter | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    working_hours: '',
    latitude: '',
    longitude: '',
    is_active: true,
    order_index: 1
  });

  const handleSave = async () => {
    try {
      const centerData = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      };

      if (editingCenter) {
        await updateDistributionCenter(editingCenter.id, centerData);
        toast({
          title: "تم تحديث المركز",
          description: "تم حفظ التغييرات بنجاح"
        });
      } else {
        await createDistributionCenter(centerData);
        toast({
          title: "تم إنشاء المركز",
          description: "تم إضافة المركز الجديد بنجاح"
        });
      }

      setIsDialogOpen(false);
      setEditingCenter(null);
      setFormData({
        name: '',
        address: '',
        phone: '',
        working_hours: '',
        latitude: '',
        longitude: '',
        is_active: true,
        order_index: 1
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ البيانات",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (center: DistributionCenter) => {
    setEditingCenter(center);
    setFormData({
      name: center.name,
      address: center.address,
      phone: center.phone,
      working_hours: center.working_hours,
      latitude: center.latitude?.toString() || '',
      longitude: center.longitude?.toString() || '',
      is_active: center.is_active,
      order_index: center.order_index
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (centerId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المركز؟')) {
      try {
        await deleteDistributionCenter(centerId);
        toast({
          title: "تم حذف المركز",
          description: "تم حذف المركز بنجاح"
        });
      } catch (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء حذف المركز",
          variant: "destructive"
        });
      }
    }
  };

  const openNewCenterDialog = () => {
    setEditingCenter(null);
    setFormData({
      name: '',
      address: '',
      phone: '',
      working_hours: '',
      latitude: '',
      longitude: '',
      is_active: true,
      order_index: Math.max(...distributionCenters.map(c => c.order_index), 0) + 1
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة مراكز التوزيع</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewCenterDialog}>
              <Plus className="ml-2 h-4 w-4" />
              إضافة مركز جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCenter ? 'تعديل مركز التوزيع' : 'إضافة مركز توزيع جديد'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>اسم المركز</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: مركز الرياض"
                />
              </div>
              <div>
                <Label>العنوان</Label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="العنوان الكامل للمركز"
                />
              </div>
              <div>
                <Label>رقم الهاتف</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+966123456789"
                />
              </div>
              <div>
                <Label>ساعات العمل</Label>
                <Input
                  value={formData.working_hours}
                  onChange={(e) => setFormData({ ...formData, working_hours: e.target.value })}
                  placeholder="السبت - الخميس: 8:00 ص - 6:00 م"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>خط العرض</Label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="24.7136"
                  />
                </div>
                <div>
                  <Label>خط الطول</Label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="46.6753"
                  />
                </div>
              </div>
              <div>
                <Label>ترتيب العرض</Label>
                <Input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                {editingCenter ? 'حفظ التغييرات' : 'إضافة المركز'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {distributionCenters.map((center) => (
          <Card key={center.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <MapPin className="ml-2 h-5 w-5 text-primary" />
                  {center.name}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(center)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(center.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start">
                <MapPin className="ml-2 h-4 w-4 text-gray-500 mt-1" />
                <span className="text-sm text-gray-600">{center.address}</span>
              </div>
              
              <div className="flex items-center">
                <Phone className="ml-2 h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{center.phone}</span>
              </div>
              
              <div className="flex items-start">
                <Clock className="ml-2 h-4 w-4 text-gray-500 mt-1" />
                <span className="text-sm text-gray-600">{center.working_hours}</span>
              </div>

              {center.latitude && center.longitude && (
                <div className="text-xs text-gray-500">
                  الإحداثيات: {center.latitude}, {center.longitude}
                </div>
              )}
              
              <div className="text-xs text-gray-500">
                الترتيب: {center.order_index} | {center.is_active ? 'نشط' : 'غير نشط'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {distributionCenters.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد مراكز توزيع</h3>
            <p className="text-gray-600 mb-4">ابدأ بإضافة مراكز التوزيع لعرضها للمستخدمين</p>
            <Button onClick={openNewCenterDialog}>
              <Plus className="ml-2 h-4 w-4" />
              إضافة أول مركز
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DistributionCenterManagement;