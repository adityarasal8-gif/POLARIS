import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  containerClassName?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  containerClassName = '',
  fallbackSrc,
  ...props 
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = () => {
    if (!hasError) setHasError(true);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden bg-[#F4F2EE] ${containerClassName} ${className}`}>
      {(!isLoaded && !hasError) && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#F4F2EE] via-[#E8E6E0] to-[#F4F2EE] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
      )}
      
      {hasError ? (
        fallbackSrc ? (
          <img src={fallbackSrc} alt={alt} className={`w-full h-full object-cover ${className}`} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#8E8E91] bg-[#FAFAF8] border border-[#E8E6E0]">
            <ImageIcon className="w-8 h-8 opacity-20 mb-2" />
            <span className="text-[10px] font-mono tracking-widest uppercase opacity-50">Media Unavailable</span>
          </div>
        )
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={handleError}
          onLoad={handleLoad}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          {...props}
        />
      )}
    </div>
  );
};
