
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Copy, Trash2 } from 'lucide-react';
import { useFirebaseAppData } from '@/contexts/FirebaseAppDataContext';
import { useToast } from '@/hooks/use-toast';

const CodeManagement = () => {
  const { codes, addCode, deleteCode } = useFirebaseAppData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCode, setNewCode] = useState('');

  const activeCodes = codes.filter(code => !code.isUsed && code.isActive);
  const usedCodes = codes.filter(code => code.isUsed);

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleAddCode = async () => {
    const code = newCode || generateRandomCode();
    
    // تحديد تاريخ انتهاء الصلاحية (سنة واحدة من الآن)
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    await addCode({
      code,
      isUsed: false,
      isActive: true,
      expiryDate: expiryDate.toISOString(),
      createdAt: new Date().toISOString()
    });

    toast({
      title: "تم إنشاء كود جديد",
      description: `تم إنشاء الكود: ${code}`
    });

    setNewCode('');
    setIsDialogOpen(false);
  };

  const handleDeleteCode = async (codeId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الكود؟')) {
      await deleteCode(codeId);
      toast({
        title: "تم حذف الكود",
        description: "تم حذف الكود بنجاح"
      });
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "تم النسخ",
      description: "تم نسخ الكود إلى الحافظة"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة أكواد التفعيل</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              إضافة كود جديد
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إنشاء كود تفعيل جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="code">الكود (اتركه فارغاً للتوليد التلقائي)</Label>
                <Input
                  id="code"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="مثال: EDU2024"
                />
              </div>
              <Button onClick={handleAddCode} className="w-full">
                إنشاء الكود
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>إجمالي الأكواد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{codes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>الأكواد المتاحة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{activeCodes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>الأكواد المستخدمة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{usedCodes.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة أكواد التفعيل</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الكود</TableHead>
                <TableHead>تاريخ الإنشاء</TableHead>
                <TableHead>تاريخ الانتهاء</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>مستخدم من قبل</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell className="font-mono font-bold">{code.code}</TableCell>
                  <TableCell>
                    {code.createdAt ? 
                      (code.createdAt.seconds ? 
                        new Date(code.createdAt.seconds * 1000).toLocaleDateString('en-GB') : 
                        new Date(code.createdAt).toLocaleDateString('en-GB')
                      ) : '-'
                    }
                  </TableCell>
                  <TableCell>
                    {code.expiryDate ? 
                      (code.expiryDate.seconds ? 
                        new Date(code.expiryDate.seconds * 1000).toLocaleDateString('en-GB') : 
                        new Date(code.expiryDate).toLocaleDateString('en-GB')
                      ) : '-'
                    }
                  </TableCell>
                  <TableCell>
                    <Badge variant={code.isUsed ? "secondary" : "default"}>
                      {code.isUsed ? 'مستخدم' : 'متاح'}
                    </Badge>
                  </TableCell>
                  <TableCell>{code.usedBy || '-'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(code.code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {!code.isUsed && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCode(code.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
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

export default CodeManagement;
