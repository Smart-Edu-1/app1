-- تفعيل RLS على جميع الجداول وإضافة policies للوصول العام للقراءة
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activation_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- إضافة policies للقراءة العامة للمواد والوحدات والدروس
CREATE POLICY "Allow public read access to active subjects" 
ON public.subjects 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Allow public read access to active units" 
ON public.units 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Allow public read access to active lessons" 
ON public.lessons 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Allow public read access to active quizzes" 
ON public.quizzes 
FOR SELECT 
USING (is_active = true);

-- السماح بقراءة أكواد التفعيل غير المستخدمة للتحقق من صحتها
CREATE POLICY "Allow read access to unused activation codes" 
ON public.activation_codes 
FOR SELECT 
USING (is_used = false);

-- السماح بإدراج أكواد تفعيل جديدة (للإدارة)
CREATE POLICY "Allow insert activation codes" 
ON public.activation_codes 
FOR INSERT 
WITH CHECK (true);

-- السماح بتحديث حالة استخدام أكواد التفعيل
CREATE POLICY "Allow update activation codes" 
ON public.activation_codes 
FOR UPDATE 
USING (true);

-- السماح بإنشاء profiles جديدة
CREATE POLICY "Allow insert new profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

-- السماح بقراءة الملفات الشخصية
CREATE POLICY "Allow read profiles" 
ON public.profiles 
FOR SELECT 
USING (true);