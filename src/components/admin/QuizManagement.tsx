
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
import { useAppData } from '@/contexts/AppDataContext';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from '@/components/ui/image-upload';

const QuizManagement = () => {
  const { quizzes, questions, units, subjects, addQuiz, updateQuiz, deleteQuiz, addQuestion, deleteQuestion, getQuestionsByQuiz } = useAppData();
  const { toast } = useToast();
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [quizFormData, setQuizFormData] = useState({
    name: '',
    description: '',
    unitId: '',
    imageUrl: '',
    isPremium: false,
    order: 1,
    isActive: true
  });

  const [questionFormData, setQuestionFormData] = useState({
    text: '',
    type: 'multiple' as 'multiple' | 'boolean',
    options: ['', '', '', ''],
    correctAnswer: '',
    imageUrl: '',
    order: 1
  });

  const handleQuizSubmit = () => {
    if (editingQuiz) {
      updateQuiz(editingQuiz.id, quizFormData);
      toast({
        title: "تم تحديث الاختبار",
        description: "تم حفظ التغييرات بنجاح"
      });
    } else {
      addQuiz(quizFormData);
      toast({
        title: "تم إضافة الاختبار",
        description: "تم إنشاء الاختبار الجديد بنجاح"
      });
    }
    
    setIsQuizDialogOpen(false);
    setEditingQuiz(null);
    setQuizFormData({ 
      name: '', 
      description: '', 
      unitId: '', 
      imageUrl: '', 
      isPremium: false, 
      order: 1, 
      isActive: true 
    });
  };

  const handleQuestionSubmit = () => {
    if (!selectedQuizId) return;
    
    addQuestion({
      ...questionFormData,
      quizId: selectedQuizId,
      correctAnswer: questionFormData.type === 'boolean' 
        ? questionFormData.correctAnswer 
        : questionFormData.options.indexOf(questionFormData.correctAnswer)
    });
    
    toast({
      title: "تم إضافة السؤال",
      description: "تم إضافة السؤال للاختبار بنجاح"
    });
    
    setIsQuestionDialogOpen(false);
    setQuestionFormData({
      text: '',
      type: 'multiple',
      options: ['', '', '', ''],
      correctAnswer: '',
      imageUrl: '',
      order: 1
    });
  };

  const handleEditQuiz = (quiz: any) => {
    setEditingQuiz(quiz);
    setQuizFormData({
      name: quiz.name,
      description: quiz.description,
      unitId: quiz.unitId,
      imageUrl: quiz.imageUrl || '',
      isPremium: quiz.isPremium,
      order: quiz.order,
      isActive: quiz.isActive
    });
    setIsQuizDialogOpen(true);
  };

  const handleDeleteQuiz = (quizId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الاختبار؟ سيتم حذف جميع الأسئلة المرتبطة به.')) {
      // حذف الأسئلة المرتبطة بالاختبار
      const quizQuestions = getQuestionsByQuiz(quizId);
      quizQuestions.forEach(question => deleteQuestion(question.id));
      
      // حذف الاختبار
      deleteQuiz(quizId);
      toast({
        title: "تم حذف الاختبار",
        description: "تم حذف الاختبار وجميع أسئلته بنجاح"
      });
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
                      const unit = units.find(u => u.id === quiz.unitId);
                      const subject = unit ? subjects.find(s => s.id === unit.subjectId) : null;
                      return (
                        <option key={quiz.id} value={quiz.id}>
                          {subject?.name} - {unit?.name} - {quiz.name}
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
                    onChange={(e) => setQuestionFormData({ ...questionFormData, type: e.target.value as 'multiple' | 'boolean' })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="multiple">اختيار من متعدد</option>
                    <option value="boolean">صح أو خطأ</option>
                  </select>
                </div>
                
                {questionFormData.type === 'multiple' ? (
                  <>
                    {questionFormData.options.map((option, index) => (
                      <div key={index}>
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
                    ))}
                    <div>
                      <Label htmlFor="correctAnswer">الإجابة الصحيحة</Label>
                      <select
                        id="correctAnswer"
                        value={questionFormData.correctAnswer}
                        onChange={(e) => setQuestionFormData({ ...questionFormData, correctAnswer: e.target.value })}
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
                      value={questionFormData.correctAnswer}
                      onChange={(e) => setQuestionFormData({ ...questionFormData, correctAnswer: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">اختر الإجابة</option>
                      <option value="true">صح</option>
                      <option value="false">خطأ</option>
                    </select>
                  </div>
                )}
                
                <ImageUpload
                  currentImageUrl={questionFormData.imageUrl}
                  onImageChange={(imageUrl) => setQuestionFormData({ ...questionFormData, imageUrl })}
                  folder="questions"
                  label="صورة السؤال (اختياري)"
                  aspectRatio="600x375"
                />
                
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
                  <Label htmlFor="unitId">الوحدة</Label>
                  <select
                    id="unitId"
                    value={quizFormData.unitId}
                    onChange={(e) => setQuizFormData({ ...quizFormData, unitId: e.target.value })}
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
                  <Label htmlFor="name">اسم الاختبار</Label>
                  <Input
                    id="name"
                    value={quizFormData.name}
                    onChange={(e) => setQuizFormData({ ...quizFormData, name: e.target.value })}
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
                <ImageUpload
                  currentImageUrl={quizFormData.imageUrl}
                  onImageChange={(imageUrl) => setQuizFormData({ ...quizFormData, imageUrl })}
                  folder="quizzes"
                  label="صورة غلاف الاختبار"
                  aspectRatio="600x375"
                />
                <div>
                  <Label htmlFor="order">ترتيب الاختبار</Label>
                  <Input
                    id="order"
                    type="number"
                    value={quizFormData.order}
                    onChange={(e) => setQuizFormData({ ...quizFormData, order: parseInt(e.target.value) })}
                    min="1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPremium"
                    checked={quizFormData.isPremium}
                    onCheckedChange={(checked) => setQuizFormData({ ...quizFormData, isPremium: checked })}
                  />
                  <Label htmlFor="isPremium">اختبار مدفوع</Label>
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
                <TableHead>الصورة</TableHead>
                <TableHead>اسم الاختبار</TableHead>
                <TableHead>الوحدة</TableHead>
                <TableHead>عدد الأسئلة</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quizzes.map((quiz) => {
                const unit = units.find(u => u.id === quiz.unitId);
                const subject = unit ? subjects.find(s => s.id === unit.subjectId) : null;
                const questionCount = getQuestionsByQuiz(quiz.id).length;
                return (
                  <TableRow key={quiz.id}>
                    <TableCell>
                      {quiz.imageUrl ? (
                        <img 
                          src={quiz.imageUrl} 
                          alt={quiz.name}
                          className="w-12 h-8 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">لا توجد</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{quiz.name}</TableCell>
                    <TableCell>
                      {subject?.name} - {unit?.name || 'غير محدد'}
                    </TableCell>
                    <TableCell>{questionCount}</TableCell>
                    <TableCell>
                      <Badge variant={quiz.isPremium ? "destructive" : "secondary"}>
                        {quiz.isPremium ? 'مدفوع' : 'مجاني'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={quiz.isActive ? "default" : "secondary"}>
                        {quiz.isActive ? 'نشط' : 'معطل'}
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
