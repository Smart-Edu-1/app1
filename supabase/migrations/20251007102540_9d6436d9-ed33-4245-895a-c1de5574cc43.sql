-- إضافة الحقول الناقصة في جدول subjects
ALTER TABLE public.subjects 
ADD COLUMN IF NOT EXISTS icon text,
ADD COLUMN IF NOT EXISTS color text;

-- إضافة الحقول الناقصة في جدول lessons
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS teacher_contact text;

-- تحديث القيم الافتراضية للحقول الموجودة
UPDATE public.subjects 
SET icon = '📚', color = '#3B82F6' 
WHERE icon IS NULL OR color IS NULL;

UPDATE public.lessons 
SET is_premium = false 
WHERE is_premium IS NULL;