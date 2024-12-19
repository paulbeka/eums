import React, { useState, useEffect } from 'react';
import "./CSS/Home.css";
import { Video, Article } from '../components/types/Content.type';
import { Link } from 'react-router-dom';
import { getArticles, getVideos } from '../components/api/Api';
import { BASE_URL } from "../Config";


const Home = () => {

  const [videos, setVideos] = useState<Video[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    document.title = 'Home';
    // TODO: handle errors
    getArticles(true).then(res => setArticles(res))  
    getVideos().then(res => setVideos(res))
  }, []);

  const getArticleParagraphs = (article: Article) => {
    const parsedBlogPost = JSON.parse(article.content);
    return (
      <div className="main-article-paragraph-containers">
        <p className="main-article-paragraph">{parsedBlogPost.blocks[0].text}</p>
        <p className="main-article-paragraph">{parsedBlogPost.blocks[1].text}</p>
      </div>
    )
  }

  return (
    <div className="home">
      <div className="top-home-content">
        <div className="video-container eums-box-shadow">
          {videos.map(video => 
            <div className="video-item">
              <img src={video.thumbnail} className="video-thumbnail"/>
              <p>{video.title}</p>
            </div>
          )}
        </div>
        <div className="article-container eums-box-shadow">
          {articles.length ? <>
          <div className="main-article">
            <div className="main-article-image-container">
              <img className="main-article-thumbnail" src={`${BASE_URL}/thumbnails/${articles[0].thumbnail}`} />
              <div className="main-article-title">
                <p>{articles[0].title}</p>
              </div>
            </div>
            <div>
              {getArticleParagraphs(articles[0])}
              <div style={{ display: "flex", justifyContent: "flex-end"}}>
                <span
                  style={{ color: "gray", paddingBottom: "1em", paddingRight: "2em"}}
                ><i><u>Continue reading...</u></i></span>
              </div>
              <center><hr style={{width: "50%"}}/></center>
            </div>
          </div>
          <div className="other-articles">
            {articles.slice(1,3).map(article =>
            <div className="bottom-article">
              <img className="bottom-article-thumbnail" src={`${BASE_URL}/thumbnails/${article.thumbnail}`} />
              <h3>{article.title}</h3>
            </div>
            )}
          </div> </> : <></>}
        </div>
      </div>
      <div className="middle-home-content">
        <div className="map-container">

        </div>
        <div className="interview-container">

        </div>
      </div>

      <div className="bottom-home-content">
        <div className="media-links-container">

        </div>
        <div className="support-container">

        </div>
      </div>
    </div>
  )
}

export default Home;