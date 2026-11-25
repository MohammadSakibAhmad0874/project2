import React, { useState } from 'react';
import { Shirt } from 'lucide-react';

interface ResilientImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackTitle,
  onLoad,
  ...rest
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#F3EFE6] text-[#1E2A4A]/70 p-4 text-center ${className}`}
        role="img"
        aria-label={alt || fallbackTitle || 'Garment preview'}
      >
        <Shirt className="w-7 h-7 mb-2 stroke-[1.25]" />
        <span className="text-xs font-medium tracking-wide text-[#111111]/70 line-clamp-2">
          {fallbackTitle || alt || 'Local Threads Studio'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      className={`${loaded ? '' : 'skeleton-shimmer'} transition-opacity duration-300 ${className}`}
      {...rest}
    />
  );
}
