import React, { useEffect, useState } from "react";
import { getArticles, deleteArticle } from "../components/api/Api";
import { Link } from "react-router-dom";
import { Article } from "../components/types/Article.type";
import { FaRegPenToSquare, FaRegTrashCan } from "react-icons/fa6";
import "./CSS/ArticleManager.css";

const AdminArticleManager = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  const fetchArticles = async () => {
    try {
      const fetchedArticles = await getArticles(false);
      setArticles(fetchedArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const handleDelete = async (articleId: number) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        const response = await deleteArticle(articleId);
        if (response) {
          fetchArticles(); 
        } else {
          alert("Failed to delete the article. Contact admin.");
        }
      } catch (error) {
        console.error("Error deleting article:", error);
        alert("An error occurred. Please try again or contact admin.");
      }
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div className="article-manager">
      <div className="article-manager-content">
        <h2>Manage articles here</h2>
        <div className="article-container">
          {articles.map((article) => (
            <div className="article-div" key={article.id}>
              <Link to={`/article/${article.id}`}>{article.title}</Link>
              <div className="article-button-container">
                <select>
                  <option value="Private" />
                  <option value="Public"/>
                </select>
                
                <Link to={`edit/${article.id}`}>
                  <FaRegPenToSquare />
                </Link>
                <div
                  style={{ marginLeft: "1em", cursor: "pointer" }}
                  onClick={() => handleDelete(article.id)}
                >
                  <FaRegTrashCan />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminArticleManager;
