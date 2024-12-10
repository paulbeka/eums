import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Article } from "../components/types/Article.type";
import api from "../components/api/Api";
import Loading from "../components/frontend_util/Loading";


const ArticleDisplay = () => {

  const { articleId } = useParams();
  const [articleContent, setArticleContent] = useState<Article>();

  useEffect(() => {
    api.get(`/article/${articleId}`)
    .then(response => {
      setArticleContent(response.data);
    })
    .catch(error => {
      throw error;
    });
  }, [articleId])

  return (
    <div>
      {articleContent ? <>{articleContent}</> : <Loading />}
    </div>
  )
}

export default ArticleDisplay;