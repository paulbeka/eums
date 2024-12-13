import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Article } from "../components/types/Article.type";
import api from "../components/api/Api";
import Loading from "../components/frontend_util/Loading";
import { convertFromRaw } from 'draft-js'
import { stateToHTML } from "draft-js-export-html";
import "./CSS/ArticleDisplay.css";


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
      {articleContent ? 
      <div 
        className="post-content" 
        dangerouslySetInnerHTML={{__html: stateToHTML(convertFromRaw(JSON.parse(articleContent['content'])))}} 
      />
      : <Loading />}
    </div>
  )
}

export default ArticleDisplay;