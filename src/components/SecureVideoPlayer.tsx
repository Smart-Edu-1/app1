import React, { useState, useEffect, useRef } from 'react';
import { Play, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecureVideoPlayerProps {
  lessonId: string;
  thumbnailUrl?: string;
  title: string;
  deviceId?: string;
}

const SecureVideoPlayer: React.FC<SecureVideoPlayerProps> = ({
  lessonId,
  thumbnailUrl,
  title,
  deviceId = 'web-browser'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [youtubeId, setYoutubeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Cleanup function to remove iframe
  const cleanupIframe = () => {
    if (iframeRef.current) {
      iframeRef.current.remove();
    }
    setYoutubeId(null);
    setIsPlaying(false);
  };

  // Handle video authorization and loading
  const handlePlayClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call edge function to authorize video access
      const { data, error } = await supabase.functions.invoke('authorize-video', {
        body: { lessonId, deviceId }
      });

      if (error) {
        console.error('Authorization error:', error);
        throw new Error('فشل التحقق من الصلاحية');
      }

      if (!data.ok || !data.youtubeId) {
        throw new Error(data.error || 'فشل في الحصول على بيانات الفيديو');
      }

      // Store youtube ID temporarily (will be cleared on component unmount)
      setYoutubeId(data.youtubeId);
      setIsPlaying(true);

      // Auto-cleanup after token expires
      setTimeout(() => {
        cleanupIframe();
        toast({
          title: "انتهت الجلسة",
          description: "انقر على زر التشغيل مرة أخرى لمواصلة المشاهدة",
        });
      }, (data.expiresIn || 600) * 1000);

    } catch (err: any) {
      console.error('Video load error:', err);
      setError(err.message || 'حدث خطأ أثناء تحميل الفيديو');
      toast({
        title: "خطأ",
        description: err.message || 'حدث خطأ أثناء تحميل الفيديو',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupIframe();
    };
  }, []);

  // Prevent context menu and other events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventActions = (e: Event) => {
      e.preventDefault();
      return false;
    };

    container.addEventListener('contextmenu', preventActions);
    container.addEventListener('dragstart', preventActions);
    
    return () => {
      container.removeEventListener('contextmenu', preventActions);
      container.removeEventListener('dragstart', preventActions);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-black rounded-lg overflow-hidden"
      style={{ userSelect: 'none' }}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {!isPlaying ? (
        // Poster view with play button
        <div className="relative w-full h-full">
          {thumbnailUrl ? (
            <img 
              src={thumbnailUrl} 
              alt={title}
              className="w-full h-full object-cover"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Play className="h-24 w-24 text-white/30" />
            </div>
          )}
          
          {/* Overlay with play button */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Button
              size="lg"
              onClick={handlePlayClick}
              disabled={isLoading}
              className="rounded-full w-20 h-20 p-0"
            >
              {isLoading ? (
                <Loader2 className="h-10 w-10 animate-spin" />
              ) : (
                <Play className="h-10 w-10 mr-1" />
              )}
            </Button>
          </div>

          {error && (
            <div className="absolute bottom-0 left-0 right-0 bg-destructive/90 text-destructive-foreground p-4 text-center">
              <Lock className="h-5 w-5 inline-block ml-2" />
              {error}
            </div>
          )}
        </div>
      ) : youtubeId ? (
        // Dynamic iframe (created only after authorization)
        <div className="relative w-full h-full">
          <iframe
            ref={iframeRef}
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&controls=1&playsinline=1&iv_load_policy=3&disablekb=1`}
            title={title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={false}
            referrerPolicy="no-referrer"
            style={{
              pointerEvents: 'auto',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none'
            }}
            onContextMenu={(e) => e.preventDefault()}
          />
          {/* Protection overlay */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 1 }}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
        </div>
      ) : null}
    </div>
  );
};

export default SecureVideoPlayer;