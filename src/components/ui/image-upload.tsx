
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Image, X } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string) => void;
  folder: string;
  label: string;
  aspectRatio?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  onImageChange,
  folder,
  label,
  aspectRatio = "600x375"
}) => {
  const [imageUrl, setImageUrl] = useState(currentImageUrl || '');
  const [useUrl, setUseUrl] = useState(!!currentImageUrl);
  const { uploadImage, uploading } = useImageUpload();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const downloadURL = await uploadImage(file, folder);
      if (downloadURL) {
        setImageUrl(downloadURL);
        onImageChange(downloadURL);
      }
    }
  };

  const handleUrlSubmit = () => {
    onImageChange(imageUrl);
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    onImageChange('');
  };

  return (
    <div className="space-y-4">
      <Label>{label} (المقاس المفضل: {aspectRatio})</Label>
      
      <div className="flex space-x-2 mb-4">
        <Button
          type="button"
          variant={!useUrl ? "default" : "outline"}
          onClick={() => setUseUrl(false)}
          size="sm"
        >
          <Upload className="ml-2 h-4 w-4" />
          رفع ملف
        </Button>
        <Button
          type="button"
          variant={useUrl ? "default" : "outline"}
          onClick={() => setUseUrl(true)}
          size="sm"
        >
          <Image className="ml-2 h-4 w-4" />
          رابط صورة
        </Button>
      </div>

      {!useUrl ? (
        <div>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          {uploading && <p className="text-sm text-gray-500 mt-2">جاري رفع الصورة...</p>}
        </div>
      ) : (
        <div className="flex space-x-2">
          <Input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          <Button type="button" onClick={handleUrlSubmit}>
            تطبيق
          </Button>
        </div>
      )}

      {(currentImageUrl || imageUrl) && (
        <div className="relative">
          <img
            src={currentImageUrl || imageUrl}
            alt="معاينة الصورة"
            className="w-full max-w-sm h-32 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
