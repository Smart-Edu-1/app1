
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';

const HomePage = () => {
  const { subjects } = useData();

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-center mb-2">Smart Edu</h1>
        <p className="text-center text-muted-foreground">
          مرحباً بك في منصة التعليم الذكية
        </p>
      </header>
      
      <section>
        <h2 className="text-xl font-semibold mb-4">المواد الدراسية</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Card 
              key={subject.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              style={{ borderLeft: `4px solid ${subject.color}` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                    style={{ backgroundColor: `${subject.color}20` }}
                  >
                    <span className="text-2xl">{subject.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{subject.name}</h3>
                    <p className="text-muted-foreground text-sm">{subject.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

const MainApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  );
};

export default MainApp;
