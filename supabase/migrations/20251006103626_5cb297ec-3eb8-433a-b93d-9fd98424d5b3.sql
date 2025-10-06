-- إضافة قيد فريد على عمود key في جدول app_settings لتمكين upsert
ALTER TABLE public.app_settings ADD CONSTRAINT app_settings_key_unique UNIQUE (key);