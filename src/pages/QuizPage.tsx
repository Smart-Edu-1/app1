
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { useSupabaseAppData } from '@/contexts/SupabaseAppDataContext';

const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { quizzes, units, subjects } = useSupabaseAppData();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string | number }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const quiz = quizzes.find(q => q.id === id);
  const unit = quiz && quiz.subject_id ? units.find(u => u.subject_id === quiz.subject_id) : null;
  const subject = unit ? subjects.find(s => s.id === unit.subject_id) : null;
  const questions = quiz?.questions || [];

  if (!quiz || !unit || !subject) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">الاختبار غير موجود</h1>
          <Button onClick={() => navigate('/app')}>العودة للصفحة الرئيسية</Button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/app/subject/${subject.id}`)}
          className="mb-4"
        >
          <ArrowLeft className="ml-2 h-4 w-4" />
          العودة لصفحة المادة
        </Button>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{quiz.name}</h1>
          <p className="text-gray-600">لا توجد أسئلة في هذا الاختبار حالياً</p>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (questionId: string, answer: string | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate score
      let correctAnswers = 0;
      questions.forEach(question => {
        if (answers[question.id] === question.correctAnswer) {
          correctAnswers++;
        }
      });
      setScore(correctAnswers);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (showResults) {
    const percentage = (score / questions.length) * 100;
    
    return (
      <div className="container mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/app/subject/${subject.id}`)}
          className="mb-4"
        >
          <ArrowLeft className="ml-2 h-4 w-4" />
          العودة لصفحة المادة
        </Button>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">نتائج الاختبار</CardTitle>
            <p className="text-gray-600">{quiz.name}</p>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <div className={`text-6xl font-bold mb-2 ${percentage >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                {percentage.toFixed(0)}%
              </div>
              <p className="text-lg">
                {score} من {questions.length} إجابة صحيحة
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              {questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">السؤال {index + 1}: {question.text}</h4>
                        {question.imageUrl && (
                          <img src={question.imageUrl} alt="صورة السؤال" className="max-w-xs mb-2" />
                        )}
                        <p className="text-sm text-gray-600">
                          إجابتك: {question.type === 'boolean' 
                            ? (userAnswer === 1 ? 'صحيح' : 'خطأ')
                            : (question.options?.[userAnswer as number] || 'لم تجب')
                          }
                        </p>
                        <p className="text-sm text-gray-600">
                          الإجابة الصحيحة: {question.type === 'boolean' 
                            ? (question.correctAnswer === 1 ? 'صحيح' : 'خطأ')
                            : (question.options?.[question.correctAnswer as number])
                          }
                        </p>
                      </div>
                      <div className="mr-4">
                        {isCorrect ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-600" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <Button onClick={restartQuiz} className="w-full">
              إعادة الاختبار
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="container mx-auto p-6">
      <Button
        variant="ghost"
        onClick={() => navigate(`/app/subject/${subject.id}`)}
        className="mb-4"
      >
        <ArrowLeft className="ml-2 h-4 w-4" />
        العودة لصفحة المادة
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">{subject.name} - {unit.name}</span>
            <span className="text-sm text-gray-500">
              السؤال {currentQuestion + 1} من {questions.length}
            </span>
          </div>
          <CardTitle className="text-xl">{quiz.name}</CardTitle>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">{question.text}</h3>
            {question.imageUrl && (
              <img 
                src={question.imageUrl} 
                alt="صورة السؤال" 
                className="max-w-md mb-4 rounded-lg"
              />
            )}
            
            <div className="space-y-3">
              {question.type === 'multiple' ? (
                question.options?.map((option, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="radio"
                      id={`option-${index}`}
                      name={`question-${question.id}`}
                      value={index}
                      checked={answers[question.id] === index}
                      onChange={() => handleAnswerSelect(question.id, index)}
                      className="ml-3"
                    />
                    <label htmlFor={`option-${index}`} className="cursor-pointer">
                      {option}
                    </label>
                  </div>
                ))
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="true"
                      name={`question-${question.id}`}
                      value={1}
                      checked={answers[question.id] === 1}
                      onChange={() => handleAnswerSelect(question.id, 1)}
                      className="ml-3"
                    />
                    <label htmlFor="true" className="cursor-pointer">صحيح</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="false"
                      name={`question-${question.id}`}
                      value={0}
                      checked={answers[question.id] === 0}
                      onChange={() => handleAnswerSelect(question.id, 0)}
                      className="ml-3"
                    />
                    <label htmlFor="false" className="cursor-pointer">خطأ</label>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              السابق
            </Button>
            <Button
              onClick={handleNext}
              disabled={answers[question.id] === undefined}
            >
              {currentQuestion === questions.length - 1 ? 'إنهاء الاختبار' : 'التالي'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizPage;
