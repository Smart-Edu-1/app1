import React, { useState, useEffect, useRef } from 'react';
import { Play, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Declare YouTube IFrame API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

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
  const [apiReady, setApiReady] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load YouTube IFrame API
  useEffect(() => {
    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      setApiReady(true);
      return;
    }

    // Load the IFrame Player API code asynchronously
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Set up callback for when API is ready
    window.onYouTubeIframeAPIReady = () => {
      setApiReady(true);
    };
  }, []);

  // Cleanup function
  const cleanupPlayer = () => {
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (e) {
        console.error('Error destroying player:', e);
      }
      playerRef.current = null;
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

      // Store youtube ID and wait for API to be ready
      setYoutubeId(data.youtubeId);
      setIsPlaying(true);

      // Auto-cleanup after token expires
      setTimeout(() => {
        cleanupPlayer();
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

  // Create YouTube player when ready
  useEffect(() => {
    if (!apiReady || !youtubeId || !playerContainerRef.current || playerRef.current) {
      return;
    }

    try {
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        height: '100%',
        width: '100%',
        videoId: youtubeId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 1,
          origin: window.location.origin
        },
        events: {
          onError: (event: any) => {
            console.error('YouTube Player Error:', event.data);
            let errorMessage = 'حدث خطأ في تحميل الفيديو';
            
            switch (event.data) {
              case 2:
                errorMessage = 'معرف الفيديو غير صحيح';
                break;
              case 5:
                errorMessage = 'خطأ في مشغل HTML5';
                break;
              case 100:
                errorMessage = 'الفيديو غير موجود أو تم حذفه';
                break;
              case 101:
              case 150:
                errorMessage = 'صاحب الفيديو لا يسمح بتشغيله على مواقع أخرى. يرجى تغيير إعدادات الفيديو في YouTube';
                break;
            }
            
            setError(errorMessage);
            toast({
              title: "خطأ في تشغيل الفيديو",
              description: errorMessage,
              variant: "destructive"
            });
          }
        }
      });
    } catch (err) {
      console.error('Error creating player:', err);
      setError('فشل في إنشاء مشغل الفيديو');
    }
  }, [apiReady, youtubeId, toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupPlayer();
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
        // YouTube Player Container (API will inject player here)
        <div className="relative w-full h-full bg-black">
          <div 
            ref={playerContainerRef}
            className="w-full h-full"
            style={{
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none'
            }}
          />
          {error && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
              <div className="text-center text-white">
                <Lock className="h-12 w-12 mx-auto mb-4 text-red-500" />
                <p className="text-lg mb-2">{error}</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    cleanupPlayer();
                    setError(null);
                  }}
                  className="mt-4"
                >
                  إعادة المحاولة
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default SecureVideoPlayer;