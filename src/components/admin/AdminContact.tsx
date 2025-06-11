
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Plus, 
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';

const AdminContact: React.FC = () => {
  const { settings, updateSettings } = useData();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentContactIndex, setCurrentContactIndex] = useState<number | null>(null);
  const [newContact, setNewContact] = useState('');
  const [editContact, setEditContact] = useState('');
  
  const { toast } = useToast();

  const handleAddContact = () => {
    if (!newContact.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال طريقة التواصل",
        variant: "destructive"
      });
      return;
    }

    const updatedSettings = {
      ...settings,
      contactMethods: [...settings.contactMethods, newContact]
    };
    
    updateSettings(updatedSettings);
    setNewContact('');
    setShowAddDialog(false);
    
    toast({
      title: "تمت الإضافة",
      description: "تم إضافة طريقة التواصل بنجاح"
    });
  };

  const handleEditContact = (index: number) => {
    setCurrentContactIndex(index);
    setEditContact(settings.contactMethods[index]);
    setShowEditDialog(true);
  };

  const handleDeleteContact = (index: number) => {
    if (!window.confirm('هل أنت متأكد من حذف طريقة التواصل هذه؟')) {
      return;
    }

    const updatedContactMethods = [...settings.contactMethods];
    updatedContactMethods.splice(index, 1);
    
    const updatedSettings = {
      ...settings,
      contactMethods: updatedContactMethods
    };
    
    updateSettings(updatedSettings);
    
    toast({
      title: "تم الحذف",
      description: "تم حذف طريقة التواصل بنجاح"
    });
  };

  const saveContactChanges = () => {
    if (currentContactIndex === null || !editContact.trim()) return;

    const updatedContactMethods = [...settings.contactMethods];
    updatedContactMethods[currentContactIndex] = editContact;
    
    const updatedSettings = {
      ...settings,
      contactMethods: updatedContactMethods
    };
    
    updateSettings(updatedSettings);
    setShowEditDialog(false);
    
    toast({
      title: "تم التحديث",
      description: "تم تحديث طريقة التواصل بنجاح"
    });
  };
  
  const getContactIcon = (contact: string) => {
    if (contact.includes('واتساب') || contact.includes('تليجرام') || contact.includes('هاتف')) {
      return <Phone className="h-5 w-5 text-primary" />;
    } else if (contact.includes('بريد') || contact.includes('ايميل') || contact.includes('email')) {
      return <Mail className="h-5 w-5 text-primary" />;
    } else {
      return <MessageSquare className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">إدارة طرق التواصل</h1>
        <p className="text-muted-foreground mt-2">
          إضافة وتعديل طرق التواصل التي تظهر للمستخدمين
        </p>
      </header>
      
      <div className="flex justify-end mb-6">
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة طريقة تواصل
        </Button>
      </div>
      
      <div className="space-y-4">
        {settings.contactMethods.length > 0 ? (
          settings.contactMethods.map((contact, index) => (
            <Card key={index}>
              <CardContent className="p-6 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="ml-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {getContactIcon(contact)}
                  </div>
                  <span>{contact}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditContact(index)}>
                      <Edit className="ml-2 h-4 w-4" />
                      <span>تعديل</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteContact(index)}
                    >
                      <Trash className="ml-2 h-4 w-4" />
                      <span>حذف</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center p-12 bg-muted/30 rounded-lg">
            <MessageSquare className="h-12 w-12 text-muted-foreground opacity-50 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">لا توجد طرق تواصل مضافة</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className="ml-2 h-4 w-4" />
              إضافة طريقة تواصل
            </Button>
          </div>
        )}
      </div>
      
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة طريقة تواصل جديدة</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="contact" className="text-right pt-2">
                طريقة التواصل
              </Label>
              <Input
                id="contact"
                value={newContact}
                onChange={(e) => setNewContact(e.target.value)}
                className="col-span-3"
                placeholder="مثال: واتساب: +963 123 456 789"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAddContact}>
              إضافة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل طريقة التواصل</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-contact" className="text-right pt-2">
                طريقة التواصل
              </Label>
              <Input
                id="edit-contact"
                value={editContact}
                onChange={(e) => setEditContact(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={saveContactChanges}>
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContact;
