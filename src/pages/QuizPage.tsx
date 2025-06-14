import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, X, BookOpen, Trophy } from 'lucide-react';
import { useSupabaseAppData } from '@/contexts/SupabaseAppDataContext';

const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { quizzes, units, subjects } = useSupabaseAppData();
  
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [checkedQuestions, setCheckedQuestions] = useState<{ [key: string]: boolean }>({});
  const [showResults, setShowResults] = useState(false);

  // Load saved data from sessionStorage on component mount
  useEffect(() => {
    if (id) {
      const savedAnswers = sessionStorage.getItem(`quiz-answers-${id}`);
      const savedChecked = sessionStorage.getItem(`quiz-checked-${id}`);
      
      if (savedAnswers) {
        try {
          setAnswers(JSON.parse(savedAnswers));
        } catch (error) {
          console.error('Error parsing saved answers:', error);
        }
      }
      
      if (savedChecked) {
        try {
          setCheckedQuestions(JSON.parse(savedChecked));
        } catch (error) {
          console.error('Error parsing saved checked questions:', error);
        }
      }
    }
  }, [id]);

  // Save answers to sessionStorage whenever they change
  useEffect(() => {
    if (id && Object.keys(answers).length > 0) {
      sessionStorage.setItem(`quiz-answers-${id}`, JSON.stringify(answers));
    }
  }, [answers, id]);

  // Save checked questions to sessionStorage whenever they change
  useEffect(() => {
    if (id && Object.keys(checkedQuestions).length > 0) {
      sessionStorage.setItem(`quiz-checked-${id}`, JSON.stringify(checkedQuestions));
    }
  }, [checkedQuestions, id]);

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
          <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
          <p className="text-muted-foreground">لا توجد أسئلة في هذا الاختبار حالياً</p>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleCheckQuestion = (questionId: string) => {
    setCheckedQuestions(prev => ({ ...prev, [questionId]: true }));
  };

  const handleCheckAllQuiz = () => {
    const checkedAll: { [key: string]: boolean } = {};
    questions.forEach(q => {
      checkedAll[q.id] = true;
    });
    setCheckedQuestions(checkedAll);
    setShowResults(true);
  };

  const isQuestionCorrect = (question: any) => {
    const userAnswer = answers[question.id];
    if (question.type === 'true_false') {
      return userAnswer === question.correct_answer;
    }
    return userAnswer === question.correct_answer;
  };

  const handleExplanation = (question: any) => {
    navigate(`/app/quiz/${quiz.id}/explanation/${question.id}`, {
      state: {
        explanation: question.explanation,
        questionText: question.text,
        questionImage: question.image_url
      }
    });
  };

  const getScore = () => {
    let correct = 0;
    questions.forEach(question => {
      if (isQuestionCorrect(question)) correct++;
    });
    return correct;
  };

  if (showResults) {
    const score = getScore();
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
            <div className="flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-primary ml-3" />
              <CardTitle className="text-2xl">نتائج الاختبار</CardTitle>
            </div>
            <p className="text-muted-foreground">{quiz.title}</p>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <div className={`text-6xl font-bold mb-2 ${percentage >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                {percentage.toFixed(0)}%
              </div>
              <p className="text-lg">
                {score} من {questions.length} إجابة صحيحة
              </p>
              <p className="text-muted-foreground">
                {percentage >= 70 ? 'مبروك! لقد نجحت في الاختبار' : 'يجب المزيد من المراجعة'}
              </p>
            </div>
            
            <Button 
              onClick={() => {
                setAnswers({});
                setCheckedQuestions({});
                setShowResults(false);
                sessionStorage.removeItem(`quiz-answers-${id}`);
                sessionStorage.removeItem(`quiz-checked-${id}`);
              }} 
              className="w-full max-w-md"
            >
              إعادة الاختبار
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">{subject.name} - {unit.name}</span>
            <span className="text-sm text-muted-foreground">
              {Object.keys(answers).length} من {questions.length} سؤال مُجاب
            </span>
          </div>
          <CardTitle className="text-xl">{quiz.title}</CardTitle>
          <p className="text-muted-foreground">{quiz.description}</p>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        {questions.map((question, index) => {
          const isAnswered = answers[question.id] !== undefined;
          const isChecked = checkedQuestions[question.id];
          const isCorrect = isChecked ? isQuestionCorrect(question) : null;
          
          return (
            <Card 
              key={question.id} 
              className={`${
                isChecked 
                  ? isCorrect 
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                    : 'border-red-500 bg-red-50 dark:bg-red-950/20'
                  : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-4">
                    السؤال {index + 1}: {question.text}
                  </h3>
                  {question.image_url && (
                    <div className="mb-4">
                      <img 
                        src={question.image_url} 
                        alt="صورة السؤال" 
                        className="max-w-full h-auto rounded-lg border"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {question.type === 'multiple_choice' ? (
                      question.options?.map((option: string, optionIndex: number) => {
                        const isSelected = answers[question.id] === option;
                        const isCorrectOption = option === question.correct_answer;
                        
                        let optionClass = 'flex items-center p-3 border rounded-lg cursor-pointer transition-colors';
                        
                        if (isChecked) {
                          if (isCorrectOption) {
                            optionClass += ' border-green-500 bg-green-100 dark:bg-green-950/30';
                          } else if (isSelected && !isCorrectOption) {
                            optionClass += ' border-red-500 bg-red-100 dark:bg-red-950/30';
                          } else {
                            optionClass += ' border-muted bg-muted/30';
                          }
                        } else {
                          if (isSelected) {
                            optionClass += ' border-primary bg-primary/10';
                          } else {
                            optionClass += ' border-muted hover:border-primary/50';
                          }
                        }
                        
                        return (
                          <div
                            key={optionIndex}
                            className={optionClass}
                            onClick={() => !isChecked && handleAnswerSelect(question.id, option)}
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              checked={isSelected}
                              onChange={() => !isChecked && handleAnswerSelect(question.id, option)}
                              className="ml-3"
                              disabled={isChecked}
                            />
                            <span className="flex-1">{option}</span>
                            {isChecked && isCorrectOption && (
                              <Check className="h-5 w-5 text-green-600" />
                            )}
                            {isChecked && isSelected && !isCorrectOption && (
                              <X className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="space-y-3">
                        {['true', 'false'].map((boolValue) => {
                          const isSelected = answers[question.id] === boolValue;
                          const isCorrectOption = boolValue === question.correct_answer;
                          const label = boolValue === 'true' ? 'صحيح' : 'خطأ';
                          
                          let optionClass = 'flex items-center p-3 border rounded-lg cursor-pointer transition-colors';
                          
                          if (isChecked) {
                            if (isCorrectOption) {
                              optionClass += ' border-green-500 bg-green-100 dark:bg-green-950/30';
                            } else if (isSelected && !isCorrectOption) {
                              optionClass += ' border-red-500 bg-red-100 dark:bg-red-950/30';
                            } else {
                              optionClass += ' border-muted bg-muted/30';
                            }
                          } else {
                            if (isSelected) {
                              optionClass += ' border-primary bg-primary/10';
                            } else {
                              optionClass += ' border-muted hover:border-primary/50';
                            }
                          }
                          
                          return (
                            <div
                              key={boolValue}
                              className={optionClass}
                              onClick={() => !isChecked && handleAnswerSelect(question.id, boolValue)}
                            >
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                checked={isSelected}
                                onChange={() => !isChecked && handleAnswerSelect(question.id, boolValue)}
                                className="ml-3"
                                disabled={isChecked}
                              />
                              <span className="flex-1">{label}</span>
                              {isChecked && isCorrectOption && (
                                <Check className="h-5 w-5 text-green-600" />
                              )}
                              {isChecked && isSelected && !isCorrectOption && (
                                <X className="h-5 w-5 text-red-600" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex space-x-3">
                    {!isChecked && isAnswered && (
                      <Button
                        onClick={() => handleCheckQuestion(question.id)}
                        size="sm"
                      >
                        تصحيح السؤال
                      </Button>
                    )}
                    
                    {isChecked && question.explanation && (
                      <Button
                        onClick={() => handleExplanation(question)}
                        variant="outline"
                        size="sm"
                      >
                        <BookOpen className="ml-2 h-4 w-4" />
                        التفسير
                      </Button>
                    )}
                  </div>
                  
                  {isChecked && (
                    <div className="flex items-center">
                      {isCorrect ? (
                        <span className="text-green-600 font-medium">إجابة صحيحة</span>
                      ) : (
                        <span className="text-red-600 font-medium">إجابة خاطئة</span>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {Object.keys(answers).length === questions.length && (
        <div className="mt-8 text-center">
          <Button 
            onClick={handleCheckAllQuiz}
            size="lg"
            className="w-full max-w-md"
          >
            <Trophy className="ml-2 h-5 w-5" />
            تصحيح الاختبار وعرض النتائج
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;