import React, { useState, useRef, useEffect } from 'react';
import { VideoOff } from 'lucide-react';

interface SafeVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  fallbackPoster?: string;
  containerClassName?: string;
}

export const SafeVideo: React.FC<SafeVideoProps> = ({ 
  src, 
  poster, 
  className = '', 
  containerClassName = '',
  fallbackPoster,
  ...props 
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleError = () => {
    setHasError(true);
  };

  const handleLoadedData = () => {
    setIsLoaded(true);
  };

  useEffect(() => {
    // Attempt to play if autoPlay is set, handling browser policies
    if (props.autoPlay && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.warn("Auto-play prevented by browser policy:", error);
      });
    }
  }, [props.autoPlay, src]);

  return (
    <div className={`relative overflow-hidden bg-[#F4F2EE] ${containerClassName} ${className}`}>
      {(!isLoaded && !hasError) && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#F4F2EE] via-[#E8E6E0] to-[#F4F2EE] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] z-10" />
      )}
      
      {hasError ? (
        fallbackPoster || poster ? (
          <img src={fallbackPoster || poster} alt="Video fallback" className={`w-full h-full object-cover ${className}`} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#8E8E91] bg-[#FAFAF8] border border-[#E8E6E0]">
            <VideoOff className="w-8 h-8 opacity-20 mb-2" />
            <span className="text-[10px] font-mono tracking-widest uppercase opacity-50">Video Unavailable</span>
          </div>
        )
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          onError={handleError}
          onLoadedData={handleLoadedData}
          autoPlay={props.autoPlay ?? true}
          loop={props.loop ?? true}
          muted={props.muted ?? true}
          playsInline={props.playsInline ?? true}
          className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          {...props}
        />
      )}
    </div>
  );
};
