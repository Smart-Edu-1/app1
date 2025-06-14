import React from 'react';
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

// Helper function to check if URL is a YouTube URL
const isYouTubeUrl = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title, onError }) => {
  // Check if it's a YouTube URL
  if (isYouTubeUrl(src)) {
    const videoId = getYouTubeVideoId(src);
    
    if (videoId) {
      return (
        <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title={title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onError={onError}
          />
        </div>
      );
    }
  }

  // For regular video files
  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      <video
        className="w-full h-full"
        src={src}
        controls
        preload="metadata"
        onError={onError}
        onContextMenu={(e) => e.preventDefault()}
        disablePictureInPicture
        controlsList="nodownload"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;