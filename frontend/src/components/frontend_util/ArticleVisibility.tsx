import { useState } from 'react';
import { Article } from '../types/Content.type';
import { useAuth } from '../auth/AuthContext';
import "./CSS/ArticleVisibility.css";


function ArticleVisibility({ article, onVisibilityChange } : 
  {
    article: Article,
    onVisibilityChange: any
  }) {
  const { isAdmin } = useAuth();
  const [visibility, setVisibility] = useState<string>(article.editing_status);

  const handleVisibilityChange = (e: any) => {
    const newVisibility = e.target.value;
    setVisibility(newVisibility);
    onVisibilityChange(article.id, newVisibility);
  };

  if (isAdmin) {
    return (
      <select
        name="visibility"
        className="visibility-selector"
        value={visibility}
        onChange={handleVisibilityChange}
        style={{background: visibility === "public" ? "red" : (visibility === "admin_available" ? "yellow" : "green")}}
      >
        <option style={{background: "red"}} value="public">Public</option>
        <option style={{background: "yellow"}} value="admin_available">Admin Only</option>
      </select>
    );
  } else {
    let articleStatus = visibility === "public" ? "Public" : visibility === "admin_available" ? "In Review" : "Private";
    let articleColor = visibility === "public" ? "green" : visibility === "private"? "lightgreen" : "yellow";
    return (
      <div className="visibility-status-indicator" style={{ background: articleColor }}>
        <p>{articleStatus}</p>
      </div>
    )
  }
}

export default ArticleVisibility;