-- إنشاء trigger لإضافة profile تلقائياً عند إنشاء مستخدم جديد
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- إدراج profile جديد للمستخدم
  INSERT INTO public.profiles (
    id,
    username,
    full_name,
    password,
    governorate,
    student_phone,
    activation_code,
    is_active,
    expiry_date,
    device_id,
    is_logged_out
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'password', ''),
    NEW.raw_user_meta_data->>'governorate',
    NEW.raw_user_meta_data->>'student_phone',
    NEW.raw_user_meta_data->>'activation_code',
    true,
    (NEW.raw_user_meta_data->>'expiry_date')::timestamptz,
    NEW.raw_user_meta_data->>'device_id',
    COALESCE((NEW.raw_user_meta_data->>'is_logged_out')::boolean, false)
  );
  
  -- إضافة دور الطالب الافتراضي
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student'::app_role);
  
  RETURN NEW;
END;
$$;

-- إنشاء trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- تحديث سياسات RLS لجدول profiles
DROP POLICY IF EXISTS "الجميع يمكنهم القراءة" ON public.profiles;
DROP POLICY IF EXISTS "المشرفون يمكنهم الإدراج" ON public.profiles;
DROP POLICY IF EXISTS "المشرفون يمكنهم التحديث" ON public.profiles;

CREATE POLICY "الجميع يمكنهم القراءة"
ON public.profiles
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "المستخدمون يمكنهم إدراج ملفاتهم"
ON public.profiles
FOR INSERT
TO authenticated, anon
WITH CHECK (id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "المستخدمون والمشرفون يمكنهم التحديث"
ON public.profiles
FOR UPDATE
TO authenticated, anon
USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "المشرفون يمكنهم الحذف"
ON public.profiles
FOR DELETE
TO authenticated, anon
USING (public.has_role(auth.uid(), 'admin'::app_role));