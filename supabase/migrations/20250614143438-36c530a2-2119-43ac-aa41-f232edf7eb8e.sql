-- إزالة جميع RLS policies والبدء من جديد
DROP POLICY IF EXISTS "Allow public read access to active subjects" ON public.subjects;
DROP POLICY IF EXISTS "Allow public read access to active units" ON public.units;
DROP POLICY IF EXISTS "Allow public read access to active lessons" ON public.lessons;
DROP POLICY IF EXISTS "Allow public read access to active quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Allow read access to unused activation codes" ON public.activation_codes;
DROP POLICY IF EXISTS "Allow insert activation codes" ON public.activation_codes;
DROP POLICY IF EXISTS "Allow update activation codes" ON public.activation_codes;
DROP POLICY IF EXISTS "Allow insert new profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow read profiles" ON public.profiles;

-- تعطيل RLS مؤقتاً لاختبار الاتصال
ALTER TABLE public.subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.units DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.activation_codes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;