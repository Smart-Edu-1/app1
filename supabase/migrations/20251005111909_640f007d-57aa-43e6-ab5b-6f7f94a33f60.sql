-- إصلاح مشكلة التكرار اللانهائي في user_roles
-- حذف السياسات القديمة التي تسبب التكرار
DROP POLICY IF EXISTS "الجميع يمكنهم قراءة الأدوار" ON public.user_roles;
DROP POLICY IF EXISTS "المشرفون يمكنهم إدارة الأدوار" ON public.user_roles;

-- إنشاء دالة آمنة للتحقق من الأدوار (بدون تكرار)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- إنشاء سياسات جديدة باستخدام الدالة الآمنة
CREATE POLICY "الجميع يمكنهم قراءة الأدوار"
ON public.user_roles
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "المشرفون يمكنهم إدارة الأدوار"
ON public.user_roles
FOR ALL
TO authenticated, anon
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- تحديث باقي السياسات لاستخدام الدالة الآمنة
DROP POLICY IF EXISTS "المشرفون يمكنهم إدارة المواد" ON public.subjects;
CREATE POLICY "المشرفون يمكنهم إدارة المواد"
ON public.subjects
FOR ALL
TO authenticated, anon
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "المشرفون يمكنهم إدارة الوحدات" ON public.units;
CREATE POLICY "المشرفون يمكنهم إدارة الوحدات"
ON public.units
FOR ALL
TO authenticated, anon
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "المشرفون يمكنهم إدارة الدروس" ON public.lessons;
CREATE POLICY "المشرفون يمكنهم إدارة الدروس"
ON public.lessons
FOR ALL
TO authenticated, anon
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "المشرفون يمكنهم إدارة الاختبارات" ON public.quizzes;
CREATE POLICY "المشرفون يمكنهم إدارة الاختبارات"
ON public.quizzes
FOR ALL
TO authenticated, anon
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "المشرفون يمكنهم إدارة الإعدادات" ON public.app_settings;
CREATE POLICY "المشرفون يمكنهم إدارة الإعدادات"
ON public.app_settings
FOR ALL
TO authenticated, anon
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "المشرفون يمكنهم إدارة مراكز التوزيع" ON public.distribution_centers;
CREATE POLICY "المشرفون يمكنهم إدارة مراكز التوزيع"
ON public.distribution_centers
FOR ALL
TO authenticated, anon
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "المشرفون يمكنهم إنشاء الإشعارات" ON public.notifications;
CREATE POLICY "المشرفون يمكنهم إنشاء الإشعارات"
ON public.notifications
FOR INSERT
TO authenticated, anon
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));