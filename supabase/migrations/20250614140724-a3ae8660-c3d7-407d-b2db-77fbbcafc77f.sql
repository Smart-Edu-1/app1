-- Make user_id nullable in profiles table since we're not using Supabase Auth anymore
ALTER TABLE public.profiles ALTER COLUMN user_id DROP NOT NULL;

-- Remove the unique constraint on user_id since it's no longer the primary way to identify users
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_key;

-- Remove the foreign key constraint since we're not using auth.users anymore
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;