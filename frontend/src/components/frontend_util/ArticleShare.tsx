import { useRef, useState, useEffect } from "react";
import { isMobile } from "react-device-detect";
import { Link } from 'react-router-dom';
import "./CSS/ArticleShare.css";


const ArticleShare = () => {

  const [browserShareDropdown, setBrowserShareDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const mediaIcons = [
    { icon: "/images/social_media_icons/linkedin", link: "https://www.linkedin.com/shareArticle?url=" },
    { icon: "/images/social_media_icons/x", link: "https://x.com/intent/tweet?url" },
  ];

  const handleShare = async () => {
    if (navigator.share && isMobile) {
      try {
        await navigator.share({
          title: document.title,
          text: "Check out this article!",
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      setBrowserShareDropdown(!browserShareDropdown);
    } 
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setBrowserShareDropdown(false);
      }
    };
  
    if (browserShareDropdown) {
      document.addEventListener("mouseup", handleClickOutside);
    }
  
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [browserShareDropdown]);
  
  return (
    <div className="article-share-and-download-container">
      <div 
        onClick={handleShare} 
        className="article-share-button" 
      >
        <img src="/images/share.svg" className="article-share-icon" alt="Share" />
        <span>Share</span>
      </div>
      {browserShareDropdown && (
        <div ref={dropdownRef} className="share-dropdown">
          <div className="share-arrow" />
          {mediaIcons.map(icon => (
            <Link to={`${icon.link}${encodeURIComponent(window.location.href)}`} target="_blank" className="share-media-icon">
              <img
                src={`${icon.icon}.svg`}
                onMouseOver={(event) => {
                  const img = event.currentTarget as HTMLImageElement;
                  img.src = `${icon.icon}-shadow.svg`;
                }}
                onMouseOut={(event) => {
                  const img = event.currentTarget as HTMLImageElement;
                  img.src = `${icon.icon}.svg`;
                }}
              />              
            </Link>)
          )}
       </div>
      )}
    </div>
  );
};

export default ArticleShare;