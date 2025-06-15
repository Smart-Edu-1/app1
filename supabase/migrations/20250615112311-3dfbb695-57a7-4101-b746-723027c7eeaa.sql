-- Add unit_id column to quizzes table
ALTER TABLE public.quizzes 
ADD COLUMN unit_id UUID REFERENCES public.units(id);