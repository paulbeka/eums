import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Article } from "../components/types/Content.type";
import api from "../components/api/Api";
import Loading from "../components/frontend_util/Loading";
import { BASE_URL } from "../Config";
import "./CSS/ArticleDisplay.css";
import { BrowserView, MobileView } from "react-device-detect";
import { formatArticleContent } from "../components/util_tools/Util";
import ArticleShare from "../components/frontend_util/ArticleShare"; 
import { Helmet } from 'react-helmet-async';
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useAuth } from "../components/auth/AuthContext";


const ArticleDisplay = () => {
  const { articleId } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [articleContent, setArticleContent] = useState<Article>();

  useEffect(() => {
    api
      .get(`/article/${articleId}`)
      .then((response) => {
        setArticleContent(response.data);
      })
      .catch((error) => {
        throw error;
      });
  }, [articleId]);

  const likeArticle = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    api
      .post(`/like/${articleId}`)
      .then((response) => {
        if (response.status === 200) {
          const data = response.data;
          setArticleContent((prev) => {
            if (!prev) return prev; 
            return { 
              ...prev, 
              total_likes: prev.total_likes + (data.like ? 1 : -1),
              user_has_liked: data.like
            };
          });
        }
      })
      .catch((error) => {
        console.error("Error liking article:", error);
      });
  }

  return (
    <>
      <Helmet>
        <title>{articleContent ? articleContent["title"] : "Loading..."}</title>
        <meta name="description" content={articleContent? articleContent["content"].split(".")[0] : ""} />
      </Helmet>
      <BrowserView>
        <div className="article-display-container">
          <div className="article-display-content">
            <div className="article-display-control-bar">
              <div onClick={() => navigate(-1)} className="back-button">
                <img
                  style={{ width: "20px", marginRight: "1em" }}
                  src="/images/back-arrow.svg"
                  alt="Back"
                />
                <span>Back</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", marginRight: "1em" }}>
                  {articleContent?.user_has_liked ? (
                    <AiFillLike 
                      size={35} 
                      style={{ marginRight: "0.5em", cursor: "pointer" }}
                      onClick={likeArticle} 
                    />
                  ) : (
                    <AiOutlineLike 
                      size={35} 
                      style={{ marginRight: "0.5em", cursor: "pointer" }}
                      onClick={likeArticle} 
                    />
                  )}
                  <p style={{ minWidth: "10px"}}>{articleContent?.total_likes}</p>
                </div>
                <ArticleShare />
              </div>
            </div>
            {articleContent ? (
              <div className="post-content-container">
                <div className="main-article-image-container">
                  <img
                    src={`${BASE_URL}/thumbnails/${articleContent.thumbnail}`}
                    className="article-main-image"
                  />
                  <div className="article-display-main-article-title">
                    <p>{articleContent["title"]}</p>
                  </div>
                </div>
                <div className="article-display-metadata">
                  <div className="article-display-date">
                    <p>{new Date(articleContent.posting_date).toDateString().toUpperCase()}</p>
                  </div>
                  <div className="article-display-author">
                    <p>BY {articleContent.author.full_name.toUpperCase()}</p>
                  </div>
                </div>
                <div
                  className="post-content"
                  dangerouslySetInnerHTML={{
                    __html:
                      "<p>" + formatArticleContent(articleContent["content"]) + "</p>",
                  }}
                />
              </div>
            ) : (
              <Loading />
            )}
          </div>
        </div>
      </BrowserView>

      <MobileView>
        <div className="article-display-mobile-container">
          {articleContent ? (
            <div>
              <div style={{ margin: "auto" }}>
                <img
                  src={`${BASE_URL}/thumbnails/${articleContent.thumbnail}`}
                  className="article-main-image"
                />
                <h2 style={{ marginBlock: "1em" }}>{articleContent["title"]}</h2>
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    "<p>" + formatArticleContent(articleContent["content"]) + "</p>",
                }}
              />
              <br />
              <div style={{width: "100%", display: "flex", justifyContent: "flex-end"}}>
                <ArticleShare />
              </div>
            </div>
          ) : (
            <Loading />
          )}
        </div>
      </MobileView>
    </>
  );
};

export default ArticleDisplay;
