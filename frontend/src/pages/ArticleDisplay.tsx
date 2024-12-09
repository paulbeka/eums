import React from "react";
import { useParams } from 'react-router-dom';


const ArticleDisplay = () => {

  const { titleId } = useParams();

  // now fetch the article from the articleId

  return (
    <div>
      We are displaying an article!
    </div>
  )
}

export default ArticleDisplay;