-- Create distribution centers table
CREATE TABLE public.distribution_centers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  working_hours TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  is_active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.distribution_centers ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Distribution centers are viewable by everyone" 
ON public.distribution_centers 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_distribution_centers_updated_at
BEFORE UPDATE ON public.distribution_centers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add support contact info to app_settings
ALTER TABLE public.app_settings 
ADD COLUMN support_contacts JSONB DEFAULT '{"whatsapp": "", "telegram": "", "phone": ""}'::jsonb;