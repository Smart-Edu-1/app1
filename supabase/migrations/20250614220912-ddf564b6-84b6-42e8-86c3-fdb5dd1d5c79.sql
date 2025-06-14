-- Add more contact page settings to app_settings table
ALTER TABLE public.app_settings 
ADD COLUMN IF NOT EXISTS contact_page_title text DEFAULT 'تواصل معنا',
ADD COLUMN IF NOT EXISTS contact_page_description text DEFAULT 'نحن هنا لمساعدتك في أي وقت',
ADD COLUMN IF NOT EXISTS working_hours_title text DEFAULT 'أوقات العمل',
ADD COLUMN IF NOT EXISTS working_hours jsonb DEFAULT '["الأحد - الخميس: 9:00 صباحاً - 6:00 مساءً", "الجمعة - السبت: 10:00 صباحاً - 4:00 مساءً"]'::jsonb;