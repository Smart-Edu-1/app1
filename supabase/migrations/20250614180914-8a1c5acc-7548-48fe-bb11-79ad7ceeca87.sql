-- Drop the old app_settings table and create a new structured one
DROP TABLE IF EXISTS public.app_settings;

-- Create a comprehensive app_settings table
CREATE TABLE public.app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  app_name TEXT NOT NULL DEFAULT 'منصة التعلم',
  about_text TEXT DEFAULT 'منصة تعليمية شاملة تقدم أفضل المحتوى التعليمي',
  
  -- Subscription prices
  monthly_price DECIMAL(10,2) DEFAULT 9.99,
  quarterly_price DECIMAL(10,2) DEFAULT 24.99,
  yearly_price DECIMAL(10,2) DEFAULT 89.99,
  
  -- Theme colors
  primary_color TEXT DEFAULT '#3B82F6',
  secondary_color TEXT DEFAULT '#10B981', 
  accent_color TEXT DEFAULT '#F59E0B',
  
  -- Contact methods (JSON array)
  contact_methods JSONB DEFAULT '["example@email.com", "+1234567890"]'::jsonb,
  
  -- Subscription plans (JSON array)
  subscription_plans JSONB DEFAULT '[]'::jsonb,
  
  -- Admin credentials
  admin_username TEXT DEFAULT 'admin',
  admin_password TEXT DEFAULT 'admin123',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default settings
INSERT INTO public.app_settings (app_name, about_text) VALUES 
('منصة التعلم', 'منصة تعليمية شاملة تقدم أفضل المحتوى التعليمي');

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for app settings
CREATE POLICY "Everyone can view app settings" 
ON public.app_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can update app settings" 
ON public.app_settings 
FOR UPDATE 
USING (true);

CREATE POLICY "Only admins can insert app settings" 
ON public.app_settings 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();