-- إضافة مستخدم المشرف
INSERT INTO public.profiles (
  username,
  password,
  full_name,
  is_admin,
  is_active,
  expiry_date
) VALUES (
  'Yousef55',
  'yousef18',
  'يوسف المشرف',
  true,
  true,
  '2025-12-31 23:59:59'
) ON CONFLICT (username) DO NOTHING;

-- إنشاء جدول إعدادات التطبيق
CREATE TABLE IF NOT EXISTS public.app_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key text NOT NULL UNIQUE,
  setting_value text,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- إضافة trigger لتحديث updated_at في جدول app_settings
CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- إضافة بعض الإعدادات الافتراضية
INSERT INTO public.app_settings (setting_key, setting_value, description) VALUES
  ('app_name', 'Smart Edu', 'اسم التطبيق'),
  ('app_version', '1.0.0', 'إصدار التطبيق'),
  ('maintenance_mode', 'false', 'وضع الصيانة'),
  ('max_users', '1000', 'أقصى عدد مستخدمين'),
  ('welcome_message', 'مرحباً بك في منصة التعليم الذكية', 'رسالة الترحيب')
ON CONFLICT (setting_key) DO NOTHING;