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

  const mediaIcons = [
    { icon: "/images/social_media_icons/youtube", link: "" },
    { icon: "/images/social_media_icons/instagram", link: "" },
    { icon: "/images/social_media_icons/discord", link: "" },
    { icon: "/images/social_media_icons/patreon", link: "" },
    { icon: "/images/social_media_icons/x", link: "" },
    { icon: "/images/social_media_icons/tiktok", link: "" },
    { icon: "/images/social_media_icons/linkedin", link: "" },
    { icon: "/images/social_media_icons/spotify", link: "" }  
  ]

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
          <div style={{display: "flex"}}>
            <img src="/images/down-arrow.svg" style={{ width: "20px", marginRight: "10px" }} />
            <p className="toolbar-title">Our latest videos</p>
          </div>
          <Link to={"all-videos"} className="hot-topics-button">
            <p style={{ padding: "0 1em" }}>See all</p>
          </Link>
        </div>
        <div className="article-options">
          <div style={{display: "flex"}}>
            <img src="/images/down-arrow.svg" style={{ width: "20px", marginRight: "10px" }} />
            <p className="toolbar-title">Hot topics</p>
          </div>
          <Link to={"all-articles"} className="hot-topics-button">
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
            <div style={{display: "flex"}}>
              <img src="/images/down-arrow.svg" style={{ width: "20px", marginRight: "10px" }} />
              <p className="map-title">Country by Country</p>
            </div>
            <Link to={""} className="hot-topics-button">
              <p style={{padding: "0.5em 1em"}}>See All</p>
            </Link>
          </div>
          <div className="map-section-container">
            <img src="/images/eu-map.svg" style={{ width: "50%", margin: "1em", maxWidth: "700px"}}/>
            <div style={{ margin: "1em" }}>
              <p style={{ fontWeight: "bold", fontSize: "16pt", marginTop: "1em"}}>Country by country</p>
              <p style={{ marginTop: "1em", textAlign: "justify"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent in arcu porttitor, accumsan urna vel, efficitur ipsum. Etiam dapibus ut mi a sollicitudin. Aenean non tempor felis, et hendrerit mauris. Integer ex felis, iaculis non eros faucibus, tempus sodales metus. Suspendisse dignissim a mauris eget blandit. Nunc fringilla ut velit nec rhoncus. In in dui ullamcorper, rhoncus velit non, laoreet augue. Nulla purus velit, vehicula in finibus ac, viverra ac dui. Cras imperdiet est lacus, at tempus mi ultrices sed.</p>
            </div>
          </div>
        </div>
        <div className="interview-container eums-box-shadow">
          <div className="map-top-bar">
            <div style={{display: "flex"}}>
              <img src="/images/down-arrow.svg" style={{ width: "20px", marginRight: "10px" }} />
              <p className="map-title" style={{color: "black"}}>Interviews</p>
            </div>
            <Link to={""} className="hot-topics-button">
              <p style={{padding: "0.5em 1em"}}>See All</p>
            </Link>
          </div>
        </div>
      </div>

      <div className="bottom-home-content">
        <div className="media-links-container eums-box-shadow">
          <div style={{display: "flex"}}>
            <img src="/images/down-arrow.svg" style={{ width: "20px", marginRight: "10px" }} />
            <p className="map-title" style={{color: "black"}}>Join the Community</p>
          </div>
          <div className="media-links-content">
            <p>Get involved, connect with others and <b>make a difference.</b></p>
            <br />
            <div className="media-icons">
              {mediaIcons.map(icon => (
                <Link to={icon.link} className="media-icon">
                  <img
                    src={`${icon.icon}.svg`}
                    onMouseOver={(event) => {
                      const img = event.currentTarget as HTMLImageElement;
                      img.src = `${icon.icon}-shadow.svg`;
                    }}
                    onMouseOut={(event) => {
                      const img = event.currentTarget as HTMLImageElement;
                      img.src = `${icon.icon}.svg`;
                    }}
                  />              
                </Link>)
              )}
            </div>
          </div>
        </div>
        <div className="support-container eums-box-shadow">
          <div style={{display: "flex"}}>
            <img src="/images/color-arrow.svg" style={{ width: "20px", marginRight: "10px" }} />
            <p className="map-title" style={{color: "black"}}>Support Us</p>
          </div>
          <div className="support-content">
            <p>You can <b>support EU Made Simple </b> by many different means, here's how:</p>
            <div className="bottom-content">
              <div className="split-content" style={{ paddingRight: "2em" }}>
                <p style={{ textAlign: "justify", marginRight: "1em" }}><b>Become a Patreon</b> and be part of the EUMS members! By becoming a Patreon you can even have influence over <b>decision making</b> of the community strategy or choose which topics we will treat in our videos*.</p>
                <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginTop: "1em" }}>
                  <button className="color-button">Join!</button>
                </div>
              </div>
              <div className="split-content">
                <p style={{ textAlign: "justify" }}><b>Create content</b> for us by writing your own <b>articles</b> that could be published on our site, or do a coverage on our <b>YouTube content</b> in your local language to engage with a wider audience and help us create more social media content!</p>
                <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginTop: "1em" }}>
                  <button className="color-button">Start Creating!</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;