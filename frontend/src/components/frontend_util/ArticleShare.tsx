import { useRef, useState } from "react";
import { isMobile } from "react-device-detect";


const ArticleShare = () => {

  const [browserShareDropdown, setBrowserShareDropdown] = useState(false);
  const dropdownRef = useRef(null);

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
        <div ref={dropdownRef} className="share-dropdown" style={{
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "white",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 1000,
        }}>
          <div className="share-arrow" style={{
            position: "absolute",
            top: "-5px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "10px",
            height: "10px",
            backgroundColor: "white",
            borderTop: "1px solid #ccc",
            borderLeft: "1px solid #ccc",
          }}></div>
          <a href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer">X</a>
          <a href={`https://www.instagram.com/`} target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </div>
      )}
    </div>
  );
};

export default ArticleShare;