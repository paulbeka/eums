import React, { useEffect, useState } from "react";
import { getArticles, deleteArticle, changeVisibility } from "../components/api/Api";
import { Link } from "react-router-dom";
import { Article } from "../components/types/Content.type";
import { FaRegPenToSquare, FaRegTrashCan } from "react-icons/fa6";
import ArticleVisibility from "../components/frontend_util/ArticleVisibility";
import { useAuth } from "../components/auth/AuthContext";
import { fetchArticlesPostedByUser } from "../components/api/Api";
import { postArticleToAdminsApi } from "../components/api/Api";
import "./CSS/ArticleManager.css";


const AdminArticleManager = () => {
  const { isAdmin, userId } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [changedArticles, setChangedArticles] = useState<Record<number, string>>({});

  const fetchArticles = async () => {
    try {
      let fetchedArticles;
      if (isAdmin && userId !== null) {
        fetchedArticles = await getArticles(false, 100);
      } else {
        fetchedArticles = await fetchArticlesPostedByUser(userId!, false);
      }
      if (fetchedArticles === null) {
        throw new Error("Failed to fetch articles");
      }
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


  const handleVisibilityChange = (articleId: number, visibility: string) => {
    setChangedArticles((prev) => ({ ...prev, [articleId]: visibility }));
  };


  const handleSaveChanges = async () => {
    try {
      changeVisibility(changedArticles)
      .then(res => {
        setChangedArticles({});
        alert("Changes saved successfully!");
        fetchArticles();
      })
      .catch(err => alert(err));
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("An error occurred while saving changes.");
    }
  };

  const postArticleToAdmins = (article: Article) => {
    postArticleToAdminsApi(article.id.toString()).then(res => {
      setChangedArticles({});
      alert("Article posted to admins successfully!");
      fetchArticles();
    })
    .catch(err => alert(err));
  }

  useEffect(() => {
    fetchArticles();
  }, [isAdmin, userId]);

  console.log(articles);

  return (
    <div className="article-manager">
      <div className="article-manager-content">
        <h2>Manage articles here</h2>
        <div>
          {articles.map((article) => (
            <div className="article-div" key={article.id}>
              <Link to={`/article/${article.id}`}>{article.title}</Link>
              <div className="article-button-container">
                {!isAdmin && article.editing_status === "private" &&
                <div className="post-to-admin-button" onClick={() => postArticleToAdmins(article)}>
                  <p>Click here to post to Admins</p>
                </div>}
                {isAdmin && 
                  <div style={{ marginRight: "1em"}}>
                    <Link to={`/profile/${article.author?.username}`}>Posted by: <u>{article.author?.username}</u></Link>
                  </div>
                }
                <ArticleVisibility
                  article={article}
                  onVisibilityChange={handleVisibilityChange}
                />
                {(isAdmin || article.editing_status === "private") && <>
                <Link to={`edit/${article.id}`}>
                  <FaRegPenToSquare />
                </Link>
                <div
                  style={{ marginLeft: "1em", cursor: "pointer" }}
                  onClick={() => handleDelete(article.id)}
                >
                  <FaRegTrashCan />
                </div></>}
              </div>
            </div>
          ))}
        </div>
        <button
          className="save-button"
          onClick={handleSaveChanges}
          disabled={Object.keys(changedArticles).length === 0}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AdminArticleManager;
