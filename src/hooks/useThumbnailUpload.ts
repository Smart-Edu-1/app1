import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ThumbnailSizes {
  large: string; // 1280x720
  small: string; // 320x180
}

export const useThumbnailUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadThumbnail = async (file: File, lessonId: string): Promise<ThumbnailSizes | null> => {
    if (!file) return null;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار ملف صورة صحيح",
        variant: "destructive"
      });
      return null;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "خطأ",
        description: "حجم الصورة كبير جداً. الحد الأقصى 5MB",
        variant: "destructive"
      });
      return null;
    }

    setUploading(true);
    try {
      // Create two versions: large (1280x720) and small (320x180)
      const largeImage = await resizeImage(file, 1280, 720);
      const smallImage = await resizeImage(file, 320, 180);

      const timestamp = Date.now();
      const largePath = `${lessonId}/large_${timestamp}.jpg`;
      const smallPath = `${lessonId}/small_${timestamp}.jpg`;

      // Upload large version
      const { error: largeError } = await supabase.storage
        .from('lesson-thumbnails')
        .upload(largePath, largeImage, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (largeError) throw largeError;

      // Upload small version
      const { error: smallError } = await supabase.storage
        .from('lesson-thumbnails')
        .upload(smallPath, smallImage, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (smallError) throw smallError;

      // Get public URLs
      const { data: largeUrlData } = supabase.storage
        .from('lesson-thumbnails')
        .getPublicUrl(largePath);

      const { data: smallUrlData } = supabase.storage
        .from('lesson-thumbnails')
        .getPublicUrl(smallPath);

      toast({
        title: "تم رفع الصورة",
        description: "تم رفع الصورة المصغرة بنجاح"
      });

      return {
        large: largeUrlData.publicUrl,
        small: smallUrlData.publicUrl
      };
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      toast({
        title: "خطأ في رفع الصورة",
        description: "حدث خطأ أثناء رفع الصورة. يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadThumbnail, uploading };
};

// Helper function to resize image
async function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Could not create blob'));
            }
          },
          'image/jpeg',
          0.9
        );
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}