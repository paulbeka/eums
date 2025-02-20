import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Article } from "../components/types/Content.type";
import api from "../components/api/Api";
import Loading from "../components/frontend_util/Loading";
import { convertFromRaw } from 'draft-js'
import { stateToHTML } from "draft-js-export-html";
import { Link } from "react-router-dom";
import { BASE_URL } from "../Config";
import "./CSS/ArticleDisplay.css";
import { BrowserView, MobileView } from "react-device-detect";


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

  return (<>
  <BrowserView>
    <div className="article-display-container">
      <div className="article-display-content">
        <div className="article-display-control-bar">
          <Link to={"/"} className="back-button">
            <img
              style={{ width: "20px", marginRight: "1em" }}
              src="/images/back-arrow.svg"
              alt="Back"
            />
            <span>Back</span>
          </Link>
          <div className="article-share-and-download-container">
            <Link to="" className="article-share-button">
              <img src="/images/share.svg" className="article-share-icon" />
              <span>Share</span>
            </Link>
          </div>
        </div>
        {articleContent ? 
        <div className="post-content-container">
          <div className="main-article-image-container">
            <img src={`${BASE_URL}/thumbnails/${articleContent.thumbnail}`} className="article-main-image" />
            <div className="article-display-main-article-title">
                <p>{articleContent["title"]}</p>
              </div>
          </div>
          <div 
            className="post-content" 
            dangerouslySetInnerHTML={{__html: stateToHTML(convertFromRaw(JSON.parse(articleContent['content'])))}} 
          />
        </div>
        : <Loading />}
      </div>
    </div>
  </BrowserView>

  <MobileView>
    <div className="article-display-mobile-container">
      {articleContent ? 
        <div>
          <div style={{ margin: "auto" }}>
            <img src={`${BASE_URL}/thumbnails/${articleContent.thumbnail}`} className="article-main-image" />
            <h2 style={{ marginBlock: "1em" }}>{articleContent["title"]}</h2>
          </div>
          <div 
            dangerouslySetInnerHTML={{__html: stateToHTML(convertFromRaw(JSON.parse(articleContent['content'])))}} 
          />
        </div>
        : <Loading />}
    </div>
  </MobileView>
  </>)
}

export default ArticleDisplay;