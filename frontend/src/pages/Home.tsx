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
      <div className="top-bar-options">
        <div className="video-options">
          <p className="toolbar-title">Our latest videos</p>
          <Link to={""} className="hot-topics-button">
            <p style={{ padding: "0 1em" }}>See all</p>
          </Link>
        </div>
        <div className="article-options">
          <p className="toolbar-title">Hot topics</p>
          <Link to={""} className="hot-topics-button">
            <p style={{ padding: "0 1em" }}>See all</p>
          </Link>
        </div>
      </div>
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
            <Link to={`/article/${articles[0].id}`} className="main-article-image-container">
              <img className="main-article-thumbnail" src={`${BASE_URL}/thumbnails/${articles[0].thumbnail}`} />
              <div className="main-article-title">
                <p>{articles[0].title}</p>
              </div>
            </Link>
            <div>
              {getArticleParagraphs(articles[0])}
              <div style={{ display: "flex", justifyContent: "flex-end"}}>
                <Link to={`/article/${articles[0].id}`}
                  style={{ color: "gray", paddingBottom: "1em", paddingRight: "2em", cursor: "pointer"}}
                ><i><u>Continue reading...</u></i></Link>
              </div>
              <center><hr style={{width: "50%"}}/></center>
            </div>
          </div>
          <div className="other-articles">
            {articles.slice(1,3).map(article =>
            <Link to={`/article/${article.id}`} className="bottom-article">
              <div className="bottom-article-content-container">
                <img className="bottom-article-thumbnail" src={`${BASE_URL}/thumbnails/${article.thumbnail}`} />
                <div className="other-article-title">
                  <h3>{article.title}</h3>
                </div>
              </div>
            </Link>
            )}
          </div>
          <div className="article-container-footer">
            <Link to={""} className="hot-topics-button">
              <img src="/images/fire-emoji.png" style={{maxWidth: "20px", marginLeft: "0.5em"}} />
              <p style={{padding: "0.5em", marginRight: "0.5em"}}>More Hot Topics!</p>
            </Link>
          </div>
        </> : <></>}
        </div>
      </div>
      <div className="middle-home-content">
        <div className="map-container eums-box-shadow">
          <div className="map-top-bar">
            <p className="map-title">Country by Country</p>
            <Link to={""} className="hot-topics-button">
              <p style={{padding: "0.5em 1em"}}>See All</p>
            </Link>
          </div>
        </div>
        <div className="interview-container eums-box-shadow">

        </div>
      </div>

      <div className="bottom-home-content">
        <div className="media-links-container eums-box-shadow">
          
        </div>
        <div className="support-container eums-box-shadow">

        </div>
      </div>
    </div>
  )
}

export default Home;