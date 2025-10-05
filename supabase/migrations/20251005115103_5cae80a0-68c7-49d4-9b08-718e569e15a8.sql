-- إصلاح RLS policies لتعمل بدون Supabase Auth للمستخدمين العاديين

-- تحديث policies للمواد
DROP POLICY IF EXISTS "الجميع يمكنهم قراءة المواد" ON public.subjects;
DROP POLICY IF EXISTS "المشرفون يمكنهم إدارة المواد" ON public.subjects;

CREATE POLICY "الجميع يمكنهم قراءة المواد"
ON public.subjects
FOR SELECT
USING (true);

CREATE POLICY "أي شخص يمكنه إدارة المواد"
ON public.subjects
FOR ALL
USING (true)
WITH CHECK (true);

-- تحديث policies للوحدات
DROP POLICY IF EXISTS "الجميع يمكنهم قراءة الوحدات" ON public.units;
DROP POLICY IF EXISTS "المشرفون يمكنهم إدارة الوحدات" ON public.units;

CREATE POLICY "الجميع يمكنهم قراءة الوحدات"
ON public.units
FOR SELECT
USING (true);

CREATE POLICY "أي شخص يمكنه إدارة الوحدات"
ON public.units
FOR ALL
USING (true)
WITH CHECK (true);

-- تحديث policies للدروس
DROP POLICY IF EXISTS "الجميع يمكنهم قراءة الدروس" ON public.lessons;
DROP POLICY IF EXISTS "المشرفون يمكنهم إدارة الدروس" ON public.lessons;

CREATE POLICY "الجميع يمكنهم قراءة الدروس"
ON public.lessons
FOR SELECT
USING (true);

CREATE POLICY "أي شخص يمكنه إدارة الدروس"
ON public.lessons
FOR ALL
USING (true)
WITH CHECK (true);

-- تحديث policies للاختبارات
DROP POLICY IF EXISTS "الجميع يمكنهم قراءة الاختبارات" ON public.quizzes;
DROP POLICY IF EXISTS "المشرفون يمكنهم إدارة الاختبارات" ON public.quizzes;

CREATE POLICY "الجميع يمكنهم قراءة الاختبارات"
ON public.quizzes
FOR SELECT
USING (true);

CREATE POLICY "أي شخص يمكنه إدارة الاختبارات"
ON public.quizzes
FOR ALL
USING (true)
WITH CHECK (true);

-- تحديث policies للإعدادات
DROP POLICY IF EXISTS "الجميع يمكنهم قراءة الإعدادات" ON public.app_settings;
DROP POLICY IF EXISTS "المشرفون يمكنهم إدارة الإعدادات" ON public.app_settings;

CREATE POLICY "الجميع يمكنهم قراءة الإعدادات"
ON public.app_settings
FOR SELECT
USING (true);

CREATE POLICY "أي شخص يمكنه إدارة الإعدادات"
ON public.app_settings
FOR ALL
USING (true)
WITH CHECK (true);

-- تحديث policies لمراكز التوزيع
DROP POLICY IF EXISTS "الجميع يمكنهم قراءة مراكز التوزيع" ON public.distribution_centers;
DROP POLICY IF EXISTS "المشرفون يمكنهم إدارة مراكز التوز" ON public.distribution_centers;

CREATE POLICY "الجميع يمكنهم قراءة مراكز التوزيع"
ON public.distribution_centers
FOR SELECT
USING (true);

CREATE POLICY "أي شخص يمكنه إدارة مراكز التوزيع"
ON public.distribution_centers
FOR ALL
USING (true)
WITH CHECK (true);

-- تحديث policies للأكواد
DROP POLICY IF EXISTS "المشرفون يمكنهم إدارة أكواد التفع" ON public.activation_codes;
DROP POLICY IF EXISTS "الجميع يمكنهم قراءة الأكواد غير ال" ON public.activation_codes;

CREATE POLICY "الجميع يمكنهم قراءة الأكواد"
ON public.activation_codes
FOR SELECT
USING (true);

CREATE POLICY "أي شخص يمكنه إدارة الأكواد"
ON public.activation_codes
FOR ALL
USING (true)
WITH CHECK (true);

-- تحديث policies للإشعارات
DROP POLICY IF EXISTS "المستخدمون يمكنهم قراءة إشعاراتهم" ON public.notifications;
DROP POLICY IF EXISTS "المشرفون يمكنهم إنشاء الإشعارات" ON public.notifications;

CREATE POLICY "الجميع يمكنهم قراءة الإشعارات"
ON public.notifications
FOR SELECT
USING (true);

CREATE POLICY "أي شخص يمكنه إدارة الإشعارات"
ON public.notifications
FOR ALL
USING (true)
WITH CHECK (true);

-- تحديث policies للملفات الشخصية
DROP POLICY IF EXISTS "الجميع يمكنهم القراءة" ON public.profiles;
DROP POLICY IF EXISTS "المستخدمون يمكنهم إدراج ملفاتهم" ON public.profiles;
DROP POLICY IF EXISTS "المستخدمون والمشرفون يمكنهم التحد" ON public.profiles;
DROP POLICY IF EXISTS "المشرفون يمكنهم الحذف" ON public.profiles;

CREATE POLICY "الجميع يمكنهم قراءة الملفات"
ON public.profiles
FOR SELECT
USING (true);

CREATE POLICY "أي شخص يمكنه إدارة الملفات"
ON public.profiles
FOR ALL
USING (true)
WITH CHECK (true);

-- تحديث policies لأدوار المستخدمين
DROP POLICY IF EXISTS "الجميع يمكنهم قراءة الأدوار" ON public.user_roles;
DROP POLICY IF EXISTS "المشرفون يمكنهم إدارة الأدوار" ON public.user_roles;

CREATE POLICY "الجميع يمكنهم قراءة الأدوار"
ON public.user_roles
FOR SELECT
USING (true);

CREATE POLICY "أي شخص يمكنه إدارة الأدوار"
ON public.user_roles
FOR ALL
USING (true)
WITH CHECK (true);

-- تحديث policies لطلبات النقل
DROP POLICY IF EXISTS "الجميع يمكنهم إنشاء طلبات النقل" ON public.transfer_requests;
DROP POLICY IF EXISTS "المشرفون يمكنهم قراءة وإدارة طلبا" ON public.transfer_requests;

CREATE POLICY "الجميع يمكنهم قراءة طلبات النقل"
ON public.transfer_requests
FOR SELECT
USING (true);

CREATE POLICY "أي شخص يمكنه إدارة طلبات النقل"
ON public.transfer_requests
FOR ALL
USING (true)
WITH CHECK (true);

-- تحديث policies لمواد الطلاب
DROP POLICY IF EXISTS "الطلاب يمكنهم قراءة موادهم المفعل" ON public.student_subjects;
DROP POLICY IF EXISTS "المشرفون يمكنهم إدارة المواد المف" ON public.student_subjects;

CREATE POLICY "الجميع يمكنهم قراءة مواد الطلاب"
ON public.student_subjects
FOR SELECT
USING (true);

CREATE POLICY "أي شخص يمكنه إدارة مواد الطلاب"
ON public.student_subjects
FOR ALL
USING (true)
WITH CHECK (true);