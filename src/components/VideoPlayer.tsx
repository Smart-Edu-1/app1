
import React, { useEffect, useRef } from 'react';
import { Play } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  title: string;
  onError?: () => void;
}

// Helper function to get YouTube video ID from URL
const getYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Helper function to get Google Drive video ID and convert to embed URL
const getGoogleDriveVideoId = (url: string): string | null => {
  const regExp = /\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

// Helper function to check if URL is a YouTube URL
const isYouTubeUrl = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

// Helper function to check if URL is a Google Drive URL
const isGoogleDriveUrl = (url: string): boolean => {
  return url.includes('drive.google.com');
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // حماية إضافية للفيديو
    const addVideoProtection = () => {
      if (videoRef.current) {
        const video = videoRef.current;
        
        // منع النقر الأيمن على الفيديو
        video.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          return false;
        });

        // منع السحب والإفلات
        video.addEventListener('dragstart', (e) => {
          e.preventDefault();
          return false;
        });

        // منع التحديد
        video.addEventListener('selectstart', (e) => {
          e.preventDefault();
          return false;
        });

        // كشف محاولات فتح الفيديو في تبويب جديد
        video.addEventListener('click', (e) => {
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            return false;
          }
        });

        // منع Picture-in-Picture
        if ('pictureInPictureEnabled' in document) {
          video.disablePictureInPicture = true;
        }

        // حماية من حفظ الفيديو
        video.addEventListener('loadstart', () => {
          video.removeAttribute('src');
          video.src = src;
        });
      }
    };

    // حماية الـ iframe
    const addIframeProtection = () => {
      if (iframeRef.current) {
        const iframe = iframeRef.current;
        
        // منع النقر الأيمن على الإطار
        iframe.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          return false;
        });

        // إضافة طبقة حماية شفافة
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.zIndex = '1';
        overlay.style.pointerEvents = 'none';
        
        if (iframe.parentElement) {
          iframe.parentElement.style.position = 'relative';
          iframe.parentElement.appendChild(overlay);
        }
      }
    };

    addVideoProtection();
    addIframeProtection();
  }, [src]);

  // Check if it's a YouTube URL
  if (isYouTubeUrl(src)) {
    const videoId = getYouTubeVideoId(src);
    
    if (videoId) {
      return (
        <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&disablekb=1&fs=0&controls=1`}
            title={title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={false}
            onError={onError}
            style={{
              pointerEvents: 'auto',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none'
            }}
          />
          {/* طبقة حماية شفافة */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 1 }}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            onSelectStart={(e) => e.preventDefault()}
          />
        </div>
      );
    }
  }

  // Check if it's a Google Drive URL
  if (isGoogleDriveUrl(src)) {
    const fileId = getGoogleDriveVideoId(src);
    
    if (fileId) {
      return (
        <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
          <iframe
            ref={iframeRef}
            src={`https://drive.google.com/file/d/${fileId}/preview`}
            title={title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={false}
            onError={onError}
            style={{
              pointerEvents: 'auto',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none'
            }}
          />
          {/* طبقة حماية شفافة */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 1 }}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            onSelectStart={(e) => e.preventDefault()}
          />
        </div>
      );
    }
  }

  // For regular video files
  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full"
        src={src}
        controls
        preload="metadata"
        onError={onError}
        onContextMenu={(e) => e.preventDefault()}
        disablePictureInPicture
        controlsList="nodownload noremoteplayback"
        playsInline
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          pointerEvents: 'auto'
        }}
        onDragStart={(e) => e.preventDefault()}
        onSelectStart={(e) => e.preventDefault()}
      >
        Your browser does not support the video tag.
      </video>
      {/* طبقة حماية إضافية */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onSelectStart={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default VideoPlayer;
