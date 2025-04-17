import { useState, useEffect } from 'react';
import "./CSS/Home.css";
import { Video, Article } from '../components/types/Content.type';
import { Link } from 'react-router-dom';
import { getArticles, getVideos } from '../components/api/Api';
import { BASE_URL } from "../Config";
import { BrowserView, MobileView } from "react-device-detect";
import Loading from '../components/frontend_util/Loading';
import ErrorLoading from '../components/frontend_util/ErrorLoading';
import { Helmet } from 'react-helmet-async';
import { formatArticleContent } from "../components/util_tools/Util";


const Home = () => {

  const N_VIDEOS = 4;

  const [videos, setVideos] = useState<Video[]>([]);
  const [interviews, setInterviews] = useState<Video[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  const [videoError, setVideoError] = useState(false);
  const [interviewError, setInterviewError] = useState(false);
  const [articleError, setArticleError] = useState(false);



  useEffect(() => {
    getArticles(true).then(res => {
      setArticles([...res].sort((a, b) => b.id - a.id));
      setArticleError(false);
    })
    .catch((err) => setArticleError(true)); 
    getVideos(false).then(res => {
      setVideos(res);
      setVideoError(false);
    })
    .catch((err) => setVideoError(true));
    getVideos(true).then(res => {
      setInterviews(res);
      setInterviewError(false)
    })
    .catch((err) => setInterviewError(true));
  }, []);

  const getArticleParagraphs = (article: Article) => {
    const blockList = article.content.split("\\n")
      .filter(item => item !== "");
    if (blockList.length > 1) {
      return (
        <div className="main-article-paragraph-containers">
          <p className="main-article-paragraph">{formatArticleContent(blockList[0])}</p>
          <p className="main-article-paragraph">{formatArticleContent(blockList[1])}</p>
        </div>
      )
    } else {
      return <><br /></>
    }
  }

  return (<>
    <Helmet>
      <title>EUMS - Home</title>
      <meta name="description" content="The EUMS Home page." />
    </Helmet>
    <BrowserView>
    <div className="home">
      <div className="top-bar-options">
        <div className="video-options">
          <div style={{display: "flex"}}>
            <p className="toolbar-title">Videos</p>
          </div>
          <Link to={"all-videos"} className="hot-topics-button">
            <p style={{ padding: "0 1em" }}>See all</p>
          </Link>
        </div>
        <div className="article-options">
          <div style={{display: "flex"}}>
            <p className="toolbar-title">Hot topics</p>
          </div>
          <Link to={"all-articles"} className="hot-topics-button">
            <p style={{ padding: "0 1em" }}>See all</p>
          </Link>
        </div>
      </div>
      <div className="top-home-content">
        <div className="video-container eums-box-shadow">
          {videos.length ? <>
          {videos.slice(0, N_VIDEOS).map(video => 
            <Link to={video.url} target="_blank" className="video-item">
              <div className="video-thumbnail-container">
                <img src={video.thumbnail} className="video-thumbnail"/>
              </div>
              <p style={{
                  width: "90%",
                  margin: "0 auto",
                  marginTop: "10px"
                }}
              >{video.title}</p>
            </Link>
          )}</> : videoError ? <ErrorLoading /> : <Loading />}
        </div>
        <div className="article-container eums-box-shadow">
          {articles.length ? <>

          <div className="main-article">
            <Link to={`/article/${articles[0].id}`} className="main-article-image-container">
              <img className="main-article-thumbnail" src={`${BASE_URL}/thumbnails/${articles[0].thumbnail}`} />
              <div className="main-article-title">
                {articles[0].tags[0]?.tag ? 
                  <h2 style={{ fontSize: "30px" }} className="home-page-article-title">
                    {articles[0].tags[0]?.tag.toUpperCase()}
                  </h2>
                  : <></>
                }
                <h2 style={{ fontSize: "30px" }} className="home-page-article-title">{articles[0].title}</h2>
              </div>
            </Link>
            <div>
              {getArticleParagraphs(articles[0])}
              <div style={{ display: "flex", justifyContent: "flex-end"}}>
                <Link 
                  to={`/article/${articles[0].id}`}
                  className="home-page-continue-reading-link"
                ><i>Continue reading...</i></Link>
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
                    {article.tags[0]?.tag ?
                      <h3 className="home-page-article-title">{article.tags[0]?.tag.toUpperCase()}</h3>
                      : <></>
                    }
                    <h3 className="home-page-article-title">{article.title}</h3>
                  </div>
                </div>
              </Link>
            )}
          </div>
          <div className="article-container-footer">
            <Link to={"all-articles"} className="hot-topics-button">
              <img src="/images/fire-emoji.png" style={{maxWidth: "20px", marginLeft: "0.5em"}} />
              <p style={{padding: "0.5em", marginRight: "0.5em"}}>More Hot Topics!</p>
            </Link>
          </div>
          </> : articleError ? <ErrorLoading /> : <Loading />}
          <br />
        </div>
      </div>
      <div className="middle-home-content">
        <div className="map-container eums-box-shadow">
          <div className="map-top-bar">
            <div style={{display: "flex"}}>
              <p className="map-title">Country by Country (Under Construction)</p>
            </div>
          </div>
          <div className="map-section-container">
            <img src="/images/eu-map.svg" style={{ width: "60%", margin: "1em", maxWidth: "700px"}}/>
            <div style={{ margin: "1em" }}>
              <p style={{ fontWeight: "bold", fontSize: "16pt", marginTop: "1em"}}>Country by country</p>
              <p style={{ marginTop: "1em"}}>This section is currently under construction, and so is not yet accessible to all users. Future goals include creating an interactive European map where users 
                can access EU data by country, such as important elections, news, and events! 
                Keep a look out, as we will be releasing this feature as soon as possible.</p>
            </div>
          </div>
        </div>
        <div className="interview-container eums-box-shadow">
          <div className="map-top-bar">
            <div style={{display: "flex"}}>
              <p className="map-title" style={{color: "black"}}>Livestreams</p>
            </div>
            <Link to={"all-interviews"} className="hot-topics-button">
              <p style={{padding: "0.5em 1em"}}>See All</p>
            </Link>
          </div>

          <div style={{ margin: "1em", display: "flex", flexDirection: "column", height: "100%" }}>
            {interviews.length ? <>
            {interviews.slice(0,2).map(video => 
              <Link to={video.url} target="_blank" style={{ marginTop: "20px"}}>
                <div className="video-thumbnail-container">
                  <img src={video.thumbnail} className="video-thumbnail"/>
                </div>
                <p style={{
                    width: "90%",
                    margin: "0 auto",
                    marginTop: "10px"
                  }}
                >{video.title}</p>
              </Link>
            )}</> : interviewError ? <ErrorLoading /> : <Loading />}
          </div>
        </div>
      </div>
    </div>
    </BrowserView>

    <MobileView>
      <div className="home-mobile-container">
        <div className="mobile-articles-container">
          <h1 style={{textAlign: "center"}}>Articles</h1>

          {articles.length ? articles.slice(0, 3).map(article => (
            <Link to={`/article/${article.id}`} className="mobile-article-container">
              <img className="mobile-article-thumbnail" src={`${BASE_URL}/thumbnails/${article.thumbnail}`} />
              <h3 style={{ marginLeft: "10px" }}>{article.title}</h3>
            </Link>
          )) : articleError ? <ErrorLoading /> : <Loading />}
        </div>

        <Link to={"all-articles"} className="mobile-hot-topics-button">
          <p>See All</p>
        </Link>
        
        <hr style={{ width: "90%", margin: "auto" }}/>

        <div className="mobile-articles-container">
          <h1 style={{textAlign: "center"}}>Videos</h1>
          {videos.length ? videos.slice(0, 3).map(video => (
            <Link to={video.url} target="_blank" className="mobile-article-container">
              <img className="mobile-video-thumbnail" src={video.thumbnail} />
              <h3 style={{ marginLeft: "10px" }}>{video.title}</h3>
            </Link>
          )) : videoError ? <ErrorLoading /> : <Loading />}
        </div>

        <Link to={"all-videos"} className="mobile-hot-topics-button">
          <p>See All</p>
        </Link>

        <hr style={{ width: "90%", margin: "auto" }}/>

        <div className="mobile-articles-container">
          <h1 style={{textAlign: "center"}}>Interviews</h1>
          {interviews.length ? interviews.slice(0, 2).map(interview => (
            <Link to={interview.url} target="_blank" className="mobile-article-container">
              <img className="mobile-video-thumbnail" src={interview.thumbnail} />
              <h3 style={{ marginLeft: "10px" }}>{interview.title}</h3>
            </Link>
          )) : interviewError ? <ErrorLoading /> : <Loading />}
        </div>

        <Link to={"all-interviews"} className="mobile-hot-topics-button">
          <p>See All</p>
        </Link>
      </div>
    </MobileView>
  </>)
}

export default Home;