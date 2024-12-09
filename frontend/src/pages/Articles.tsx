import React, { useState, useEffect } from "react";
import { Article } from '../components/types/Article.type';
import { getArticles } from '../components/api/Api';
import Loading from "../components/frontend_util/Loading";
import "./CSS/Articles.css";
import { Link } from "react-router-dom";


const Articles = () => {

  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    document.title = 'Articles';

    const fetchArticles = async () => {
      try {
        const fetchedArticles = await getArticles();
        setArticles(fetchedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
  
    fetchArticles();
  }, []);

  // todo: make an axios auth fetcher

  return (
    <div className="articles">
      <div className="article-content">
        {articles === undefined ? <Loading /> :
        !articles.length ? <div>No articles.</div> : 
          articles.map(article => (
            <Link to={`/articles/${article.id}`} className="article">
              <h4>{article.title}</h4>
            </Link>
          ))
        }
      </div>
    </div>
  )
}

export default Articles;