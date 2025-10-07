-- Add youtube_id and thumbnail_path columns to lessons table
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS youtube_id TEXT,
ADD COLUMN IF NOT EXISTS thumbnail_path TEXT;

-- Update video_url column to be nullable since we'll use youtube_id instead
ALTER TABLE public.lessons 
ALTER COLUMN video_url DROP NOT NULL;

-- Create storage bucket for lesson thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('lesson-thumbnails', 'lesson-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for lesson thumbnails
CREATE POLICY "Anyone can view lesson thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'lesson-thumbnails');

CREATE POLICY "Authenticated users can upload lesson thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'lesson-thumbnails' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update lesson thumbnails"
ON storage.objects FOR UPDATE
USING (bucket_id = 'lesson-thumbnails' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete lesson thumbnails"
ON storage.objects FOR DELETE
USING (bucket_id = 'lesson-thumbnails' AND auth.role() = 'authenticated');