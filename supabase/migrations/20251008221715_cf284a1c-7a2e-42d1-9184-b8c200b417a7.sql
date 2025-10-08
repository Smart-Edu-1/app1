-- تحديث جدول subjects لإضافة teacher_phone, teacher_email, teacher_whatsapp إذا لم تكن موجودة
ALTER TABLE public.subjects 
ADD COLUMN IF NOT EXISTS teacher_phone TEXT,
ADD COLUMN IF NOT EXISTS teacher_email TEXT,
ADD COLUMN IF NOT EXISTS teacher_whatsapp TEXT;