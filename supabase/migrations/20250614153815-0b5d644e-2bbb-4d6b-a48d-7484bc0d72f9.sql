-- Enable RLS and create policies for all tables

-- Activation codes policies (public read access)
ALTER TABLE public.activation_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to activation codes"
ON public.activation_codes
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow insert activation codes"
ON public.activation_codes
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow update activation codes"
ON public.activation_codes
FOR UPDATE
TO public
USING (true);

CREATE POLICY "Allow delete activation codes"
ON public.activation_codes
FOR DELETE
TO public
USING (true);

-- Subjects policies (public read access)
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to subjects"
ON public.subjects
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow insert subjects"
ON public.subjects
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow update subjects"
ON public.subjects
FOR UPDATE
TO public
USING (true);

CREATE POLICY "Allow delete subjects"
ON public.subjects
FOR DELETE
TO public
USING (true);

-- Units policies (public read access)
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to units"
ON public.units
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow insert units"
ON public.units
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow update units"
ON public.units
FOR UPDATE
TO public
USING (true);

CREATE POLICY "Allow delete units"
ON public.units
FOR DELETE
TO public
USING (true);

-- Lessons policies (public read access)
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to lessons"
ON public.lessons
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow insert lessons"
ON public.lessons
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow update lessons"
ON public.lessons
FOR UPDATE
TO public
USING (true);

CREATE POLICY "Allow delete lessons"
ON public.lessons
FOR DELETE
TO public
USING (true);

-- Quizzes policies (public read access)
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to quizzes"
ON public.quizzes
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow insert quizzes"
ON public.quizzes
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow update quizzes"
ON public.quizzes
FOR UPDATE
TO public
USING (true);

CREATE POLICY "Allow delete quizzes"
ON public.quizzes
FOR DELETE
TO public
USING (true);

-- Profiles policies (public read access)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to profiles"
ON public.profiles
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow insert profiles"
ON public.profiles
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow update profiles"
ON public.profiles
FOR UPDATE
TO public
USING (true);

CREATE POLICY "Allow delete profiles"
ON public.profiles
FOR DELETE
TO public
USING (true);

-- Notifications policies (public read access)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to notifications"
ON public.notifications
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow insert notifications"
ON public.notifications
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow update notifications"
ON public.notifications
FOR UPDATE
TO public
USING (true);

CREATE POLICY "Allow delete notifications"
ON public.notifications
FOR DELETE
TO public
USING (true);

-- App settings policies (public read access)
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to app settings"
ON public.app_settings
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow insert app settings"
ON public.app_settings
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow update app settings"
ON public.app_settings
FOR UPDATE
TO public
USING (true);

CREATE POLICY "Allow delete app settings"
ON public.app_settings
FOR DELETE
TO public
USING (true);