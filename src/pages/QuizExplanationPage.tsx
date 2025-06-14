import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';

const QuizExplanationPage: React.FC = () => {
  const { quizId, questionId } = useParams<{ quizId: string; questionId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get explanation and question text from location state
  const { explanation, questionText, questionImage } = location.state || {};

  const handleBackToQuiz = () => {
    navigate(`/app/quiz/${quizId}`);
  };

  if (!explanation) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">التفسير غير متاح</h1>
          <Button onClick={handleBackToQuiz}>العودة للاختبار</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <Button
          variant="ghost"
          onClick={handleBackToQuiz}
          className="mb-6"
        >
          <ArrowLeft className="ml-2 h-4 w-4" />
          العودة للاختبار
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center mb-4">
              <BookOpen className="h-6 w-6 text-primary ml-3" />
              <CardTitle className="text-2xl">تفسير السؤال</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {/* Question Text */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-foreground">السؤال:</h3>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-foreground">{questionText}</p>
                {questionImage && (
                  <div className="mt-3">
                    <img 
                      src={questionImage} 
                      alt="صورة السؤال" 
                      className="max-w-full h-auto rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Explanation */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">التفسير:</h3>
              <div className="p-4 bg-card border rounded-lg">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {explanation}
                </p>
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-6 text-center">
              <Button onClick={handleBackToQuiz} className="w-full max-w-md">
                العودة إلى الاختبار
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizExplanationPage;