import React, { useState } from 'react';
import './CSS/YoutubeThumbnail.css';

export const YouTubeThumbnail = ({
  videoId,
  title,
  className
}: {
  videoId: string;
  title: string;
  className?: string;
}) => {
  const resolutions = ["maxresdefault", "sddefault", "hqdefault", "mqdefault", "default"];
  const [currentResIndex, setCurrentResIndex] = useState(0);

  const [imgSrc, setImgSrc] = useState(
    `https://img.youtube.com/vi/${videoId}/${resolutions[currentResIndex]}.jpg`
  );

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (
      img.naturalWidth === 120 &&
      img.naturalHeight === 90 &&
      currentResIndex < resolutions.length - 1
    ) {
      const nextIndex = currentResIndex + 1;
      setCurrentResIndex(nextIndex);
      setImgSrc(`https://img.youtube.com/vi/${videoId}/${resolutions[nextIndex]}.jpg`);
    }
  };

  return (
    <div className={currentResIndex > 0 ? "video-cropper": ""}>
      <img
        src={imgSrc}
        alt={title}
        className={className}
        onLoad={handleImageLoad}
      />
    </div>
  );
};
