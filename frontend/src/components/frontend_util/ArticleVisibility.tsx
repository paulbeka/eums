import { useState } from 'react';
import { Article } from '../types/Content.type';
import { useAuth } from '../auth/AuthContext';


function ArticleVisibility({ article, onVisibilityChange } : 
  {
    article: Article,
    onVisibilityChange: any
  }) {
  const { isAdmin } = useAuth();
  const [visibility, setVisibility] = useState<string>(article.public.toString());

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
    return (
      <div className="status-indicator">
        {visibility === "public" ? "Public" : "In Review"}
      </div>
    )
  }
}

export default ArticleVisibility;