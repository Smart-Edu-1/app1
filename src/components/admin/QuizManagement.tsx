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
import { Plus, Edit, Trash2, FileText, HelpCircle } from 'lucide-react';
import { useSupabaseAppData } from '@/contexts/SupabaseAppDataContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ImageUpload from '@/components/ui/image-upload';

const QuizManagement = () => {
  const { quizzes, units, subjects } = useSupabaseAppData();
  const { toast } = useToast();
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [quizFormData, setQuizFormData] = useState({
    title: '',
    description: '',
    subject_id: '',
    unit_id: '',
    is_active: true
  });

  const [questionFormData, setQuestionFormData] = useState({
    text: '',
    type: 'multiple_choice' as 'multiple_choice' | 'true_false',
    options: ['', ''], // Start with 2 options by default
    correct_answer: '',
    explanation: '',
    image_url: ''
  });

  const refreshData = async () => {
    // تحديث البيانات
    window.location.reload();
  };

  const handleQuizSubmit = async () => {
    try {
      if (editingQuiz) {
        const { error } = await supabase
          .from('quizzes')
          .update(quizFormData)
          .eq('id', editingQuiz.id);
        
        if (error) throw error;
        
        toast({
          title: "تم تحديث الاختبار",
          description: "تم حفظ التغييرات بنجاح"
        });
      } else {
        const { error } = await supabase
          .from('quizzes')
          .insert([quizFormData]);
        
        if (error) throw error;
        
        toast({
          title: "تم إضافة الاختبار",
          description: "تم إنشاء الاختبار الجديد بنجاح"
        });
      }
      
      refreshData();
      setIsQuizDialogOpen(false);
      setEditingQuiz(null);
      setQuizFormData({ 
        title: '', 
        description: '', 
        subject_id: '', 
        unit_id: '',
        is_active: true 
      });
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الاختبار",
        variant: "destructive"
      });
    }
  };

  const handleQuestionSubmit = async () => {
    if (!selectedQuizId) return;
    
    try {
      // إضافة السؤال إلى الاختبار المحدد
      const quiz = quizzes.find(q => q.id === selectedQuizId);
      if (!quiz) return;
      
      const currentQuestions = quiz.questions || [];
      const newQuestion = {
        id: Date.now().toString(),
        text: questionFormData.text,
        type: questionFormData.type,
        options: questionFormData.options.filter(option => option.trim() !== ''),
        correct_answer: questionFormData.correct_answer,
        explanation: questionFormData.explanation,
        image_url: questionFormData.image_url
      };
      
      const updatedQuestions = [...currentQuestions, newQuestion];
      
      const { error } = await supabase
        .from('quizzes')
        .update({ questions: updatedQuestions })
        .eq('id', selectedQuizId);
      
      if (error) throw error;
      
      toast({
        title: "تم إضافة السؤال",
        description: "تم إضافة السؤال للاختبار بنجاح"
      });
      
      refreshData();
      setIsQuestionDialogOpen(false);
      setQuestionFormData({
        text: '',
        type: 'multiple_choice',
        options: ['', ''], // Reset to 2 options
        correct_answer: '',
        explanation: '',
        image_url: ''
      });
    } catch (error) {
      console.error('Error adding question:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة السؤال",
        variant: "destructive"
      });
    }
  };

  const handleEditQuiz = (quiz: any) => {
    setEditingQuiz(quiz);
    setQuizFormData({
      title: quiz.title,
      description: quiz.description,
      subject_id: quiz.subject_id || '',
      unit_id: quiz.unit_id || '',
      is_active: quiz.is_active
    });
    setIsQuizDialogOpen(true);
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الاختبار؟ سيتم حذف جميع الأسئلة المرتبطة به.')) {
      try {
        const { error } = await supabase
          .from('quizzes')
          .delete()
          .eq('id', quizId);
        
        if (error) throw error;
        
        toast({
          title: "تم حذف الاختبار",
          description: "تم حذف الاختبار وجميع أسئلته بنجاح"
        });
        
        refreshData();
      } catch (error) {
        console.error('Error deleting quiz:', error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء حذف الاختبار",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الاختبارات</h2>
        <div className="flex space-x-2">
          <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <HelpCircle className="ml-2 h-4 w-4" />
                إضافة سؤال
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>إضافة سؤال جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="quizSelect">اختر الاختبار</Label>
                  <select
                    id="quizSelect"
                    value={selectedQuizId}
                    onChange={(e) => setSelectedQuizId(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">اختر الاختبار</option>
                    {quizzes.map(quiz => {
                      const subject = subjects.find(s => s.id === quiz.subject_id);
                      return (
                        <option key={quiz.id} value={quiz.id}>
                          {subject?.name} - {quiz.title}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <Label htmlFor="questionText">نص السؤال</Label>
                  <Textarea
                    id="questionText"
                    value={questionFormData.text}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, text: e.target.value })}
                    placeholder="اكتب السؤال هنا"
                  />
                </div>
                <div>
                  <Label htmlFor="questionType">نوع السؤال</Label>
                  <select
                    id="questionType"
                    value={questionFormData.type}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, type: e.target.value as 'multiple_choice' | 'true_false' })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="multiple_choice">اختيار من متعدد</option>
                    <option value="true_false">صح أو خطأ</option>
                  </select>
                </div>
                
                {questionFormData.type === 'multiple_choice' ? (
                  <>
                    {questionFormData.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="flex-1">
                          <Label htmlFor={`option${index}`}>الخيار {index + 1}</Label>
                          <Input
                            id={`option${index}`}
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...questionFormData.options];
                              newOptions[index] = e.target.value;
                              setQuestionFormData({ ...questionFormData, options: newOptions });
                            }}
                            placeholder={`الخيار ${index + 1}`}
                          />
                        </div>
                        {questionFormData.options.length > 2 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const newOptions = questionFormData.options.filter((_, i) => i !== index);
                              setQuestionFormData({ ...questionFormData, options: newOptions });
                            }}
                            className="mt-6"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setQuestionFormData({
                          ...questionFormData,
                          options: [...questionFormData.options, '']
                        });
                      }}
                      className="w-full"
                    >
                      <Plus className="ml-2 h-4 w-4" />
                      إضافة خيار
                    </Button>
                    <div>
                      <Label htmlFor="correctAnswer">الإجابة الصحيحة</Label>
                      <select
                        id="correctAnswer"
                        value={questionFormData.correct_answer}
                        onChange={(e) => setQuestionFormData({ ...questionFormData, correct_answer: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">اختر الإجابة الصحيحة</option>
                        {questionFormData.options.map((option, index) => (
                          option && <option key={index} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <div>
                    <Label htmlFor="booleanAnswer">الإجابة الصحيحة</Label>
                    <select
                      id="booleanAnswer"
                      value={questionFormData.correct_answer}
                      onChange={(e) => setQuestionFormData({ ...questionFormData, correct_answer: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">اختر الإجابة</option>
                      <option value="true">صح</option>
                      <option value="false">خطأ</option>
                    </select>
                  </div>
                )}
                
                <div>
                  <Label>صورة السؤال</Label>
                  <ImageUpload
                    currentImageUrl={questionFormData.image_url}
                    onImageChange={(imageUrl) => setQuestionFormData({ ...questionFormData, image_url: imageUrl })}
                    folder="quiz-questions"
                    label=""
                    aspectRatio="800x600"
                  />
                </div>
                
                <div>
                  <Label htmlFor="explanation">تفسير السؤال</Label>
                  <Textarea
                    id="explanation"
                    value={questionFormData.explanation}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, explanation: e.target.value })}
                    placeholder="اكتب تفسير السؤال والإجابة الصحيحة"
                    rows={3}
                  />
                </div>
                
                <Button onClick={handleQuestionSubmit} className="w-full" disabled={!selectedQuizId}>
                  إضافة السؤال
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isQuizDialogOpen} onOpenChange={setIsQuizDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="ml-2 h-4 w-4" />
                إضافة اختبار جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingQuiz ? 'تعديل الاختبار' : 'إضافة اختبار جديد'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                 <div>
                   <Label htmlFor="subjectId">المادة</Label>
                   <select
                     id="subjectId"
                     value={quizFormData.subject_id}
                     onChange={(e) => setQuizFormData({ ...quizFormData, subject_id: e.target.value, unit_id: '' })}
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
                 
                 {quizFormData.subject_id && (
                   <div>
                     <Label htmlFor="unitId">الوحدة</Label>
                     <select
                       id="unitId"
                       value={quizFormData.unit_id}
                       onChange={(e) => setQuizFormData({ ...quizFormData, unit_id: e.target.value })}
                       className="w-full p-2 border rounded-md"
                     >
                       <option value="">اختر الوحدة</option>
                       {units
                         .filter(unit => unit.subject_id === quizFormData.subject_id && unit.is_active)
                         .sort((a, b) => a.order_index - b.order_index)
                         .map(unit => (
                           <option key={unit.id} value={unit.id}>
                             {unit.name}
                           </option>
                         ))}
                     </select>
                   </div>
                 )}
                <div>
                  <Label htmlFor="title">اسم الاختبار</Label>
                  <Input
                    id="title"
                    value={quizFormData.title}
                    onChange={(e) => setQuizFormData({ ...quizFormData, title: e.target.value })}
                    placeholder="مثال: اختبار الوحدة الأولى"
                  />
                </div>
                <div>
                  <Label htmlFor="description">وصف الاختبار</Label>
                  <Textarea
                    id="description"
                    value={quizFormData.description}
                    onChange={(e) => setQuizFormData({ ...quizFormData, description: e.target.value })}
                    placeholder="وصف مختصر عن الاختبار"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={quizFormData.is_active}
                    onCheckedChange={(checked) => setQuizFormData({ ...quizFormData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">اختبار نشط</Label>
                </div>
                <Button onClick={handleQuizSubmit} className="w-full">
                  {editingQuiz ? 'حفظ التغييرات' : 'إضافة الاختبار'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="ml-2 h-5 w-5" />
            الاختبارات ({quizzes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
               <TableRow>
                 <TableHead>اسم الاختبار</TableHead>
                 <TableHead>المادة</TableHead>
                 <TableHead>الوحدة</TableHead>
                 <TableHead>عدد الأسئلة</TableHead>
                 <TableHead>الحالة</TableHead>
                 <TableHead>الإجراءات</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {quizzes.map((quiz) => {
                 const subject = subjects.find(s => s.id === quiz.subject_id);
                 const unit = units.find(u => u.id === quiz.unit_id);
                 const questionCount = quiz.questions ? quiz.questions.length : 0;
                 return (
                   <TableRow key={quiz.id}>
                     <TableCell className="font-medium">{quiz.title}</TableCell>
                     <TableCell>{subject?.name || 'غير محدد'}</TableCell>
                     <TableCell>{unit?.name || 'غير محدد'}</TableCell>
                     <TableCell>{questionCount}</TableCell>
                     <TableCell>
                       <Badge variant={quiz.is_active ? "default" : "secondary"}>
                         {quiz.is_active ? 'نشط' : 'معطل'}
                       </Badge>
                     </TableCell>
                     <TableCell>
                       <div className="flex space-x-2">
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => handleEditQuiz(quiz)}
                         >
                           <Edit className="h-4 w-4" />
                         </Button>
                         <Button
                           variant="destructive"
                           size="sm"
                           onClick={() => handleDeleteQuiz(quiz.id)}
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

export default QuizManagement;