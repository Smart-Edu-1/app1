
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page since this is the main entry point
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Smart Edu</h1>
        <p className="text-xl text-muted-foreground">جاري التحميل...</p>
      </div>
    </div>
  );
};

export default Index;
