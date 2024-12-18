import { AnyARecord } from 'dns';
import { useState } from 'react';
import { Article } from '../types/Article.type';

function ArticleVisibility({ article, onVisibilityChange } : 
  {
    article: Article,
    onVisibilityChange: any
  }) {
  const [visibility, setVisibility] = useState(article.public ? 'public' : 'private');

  const handleVisibilityChange = (e: any) => {
    const newVisibility = e.target.value;
    setVisibility(newVisibility);
    onVisibilityChange(article.id, newVisibility);
  };

  return (
    <select
      name="visibility"
      className="visibility-selector"
      value={visibility}
      onChange={handleVisibilityChange}
      style={{background: visibility === "public" ? "red": "green"}}
    >
      <option style={{background: "red"}} value="public">Public</option>
      <option style={{background: "green"}} value="private">Private</option>
    </select>
  );
}

export default ArticleVisibility;