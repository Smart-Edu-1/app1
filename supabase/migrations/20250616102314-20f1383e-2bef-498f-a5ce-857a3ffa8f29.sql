
-- إضافة عمود device_id إلى جدول profiles لتخزين معرف الجهاز
ALTER TABLE public.profiles 
ADD COLUMN device_id TEXT,
ADD COLUMN is_logged_out BOOLEAN DEFAULT false;

-- إنشاء فهرس على device_id لتحسين الأداء
CREATE INDEX idx_profiles_device_id ON public.profiles(device_id);

-- تحديث التعليق على الجدول
COMMENT ON COLUMN public.profiles.device_id IS 'معرف الجهاز الذي تم إنشاء/تسجيل الدخول للحساب منه';
COMMENT ON COLUMN public.profiles.is_logged_out IS 'حالة تسجيل الخروج - true إذا سجل المستخدم الخروج يدوياً';
