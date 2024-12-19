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
    return <></>
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
            <div className="main-article-thumbnail"></div>
            <div className="main-article-content">
              <h2>{articles[0].title}</h2>
              <p>{getArticleParagraphs(articles[0])}</p>
            </div>
          </div>
          <div className="other-articles">
            {articles.slice(1,3).map(article =>
            <div className="bottom-article">
              <img src={`${BASE_URL}/thumbnails/${article.thumbnail}`} />
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