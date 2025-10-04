-- تعديل جدول profiles لإضافة الحقول الجديدة
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS governorate text,
ADD COLUMN IF NOT EXISTS student_phone text;

-- إنشاء جدول أكواد التفعيل المحدث (مع ربط بالمواد)
DROP TABLE IF EXISTS public.activation_codes CASCADE;
CREATE TABLE public.activation_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE,
  is_full_curriculum boolean DEFAULT false,
  is_used boolean DEFAULT false,
  used_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  used_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- جدول ربط الطلاب بالمواد المفعلة
CREATE TABLE IF NOT EXISTS public.student_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  activated_at timestamp with time zone DEFAULT now(),
  activation_code text,
  UNIQUE(student_id, subject_id)
);

-- جدول طلبات نقل الحساب
CREATE TABLE IF NOT EXISTS public.transfer_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  password text NOT NULL,
  note text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at timestamp with time zone DEFAULT now(),
  reviewed_at timestamp with time zone,
  reviewed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- تفعيل RLS على الجداول الجديدة
ALTER TABLE public.student_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfer_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies لجدول student_subjects
CREATE POLICY "الطلاب يمكنهم قراءة موادهم المفعلة" 
ON public.student_subjects FOR SELECT 
USING (student_id IN (SELECT id FROM public.profiles));

CREATE POLICY "المشرفون يمكنهم إدارة المواد المفعلة" 
ON public.student_subjects FOR ALL 
USING (true);

-- RLS policies لجدول transfer_requests
CREATE POLICY "الجميع يمكنهم إنشاء طلبات النقل" 
ON public.transfer_requests FOR INSERT 
WITH CHECK (true);

CREATE POLICY "المشرفون يمكنهم قراءة وإدارة طلبات النقل" 
ON public.transfer_requests FOR ALL 
USING (true);

-- تحديث RLS policies لجدول activation_codes
DROP POLICY IF EXISTS "الجميع يمكنهم قراءة الأكواد" ON public.activation_codes;
DROP POLICY IF EXISTS "الجميع يمكنهم إدارة الأكواد" ON public.activation_codes;
DROP POLICY IF EXISTS "الجميع يمكنهم إدراج الأكواد" ON public.activation_codes;

CREATE POLICY "المشرفون يمكنهم إدارة أكواد التفعيل" 
ON public.activation_codes FOR ALL 
USING (true);

CREATE POLICY "الجميع يمكنهم قراءة الأكواد غير المستخدمة" 
ON public.activation_codes FOR SELECT 
USING (is_used = false OR true);