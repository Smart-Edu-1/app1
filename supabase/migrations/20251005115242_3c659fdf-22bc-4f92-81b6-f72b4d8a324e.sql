-- إزالة trigger handle_new_user لأننا لا نستخدم Supabase Auth بعد الآن

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();