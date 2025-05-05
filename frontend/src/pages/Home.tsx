import { useState, useEffect } from 'react';
import "./CSS/Home.css";
import { Video, Article } from '../components/types/Content.type';
import { Link } from 'react-router-dom';
import { getArticles, getFrontpageContent, getVideos } from '../components/api/Api';
import { BASE_URL } from "../Config";
import { BrowserView, MobileView } from "react-device-detect";
import Loading from '../components/frontend_util/Loading';
import ErrorLoading from '../components/frontend_util/ErrorLoading';
import { Helmet } from 'react-helmet-async';


const Home = () => {

  const [content, setContent] = useState<(Article | Video)[]>([]);
  const [visibleContent, setVisibleContent] = useState<(Article | Video)[]>([]);
  
  const [contentError, setContentError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [sortType, setSortType] = useState<Set<string>>(new Set([]));
  const [rankBy, setRankBy] = useState<string>("");

  const adsPresent = true;

  const rankByCallback = (newRank: string) => {
    if (rankBy === newRank) {
      setRankBy("");
      setVisibleContent(content);
      return;
    }
    setRankBy(newRank);
    switch (newRank) {
      case "date":
        setVisibleContent(prevContent =>
          [...prevContent].sort((a, b) => {
        const dateA = new Date(a.upload_date).getTime();
        const dateB = new Date(b.upload_date).getTime();
        return dateB - dateA; // Newest first
          })
        );
        break;
      case "likes":
        setVisibleContent(prevContent =>
          [...prevContent].sort((a, b) => {
            const likesA = a.type === "article" ? (a as Article).total_likes : 0;
            const likesB = b.type === "article" ? (b as Article).total_likes : 0;
            return likesB - likesA; 
          })
        );
        break;
    }
  }

  const sortBy = (chosenSortType: string) => {
    if (sortType.size && sortType.has(chosenSortType)) {
      setSortType(prev => {
        const newSortType = new Set(prev);
        newSortType.delete(chosenSortType);
        return newSortType;
      });
      return;
    }
    setSortType(prev => {
      const newSortType = new Set(prev);
      newSortType.add(chosenSortType);
      return newSortType;
    });
  }

  useEffect(() => {
    if (sortType.size) {
      setVisibleContent(content.filter(item => sortType.has(item.type)));
    } else {
      setVisibleContent(content);
    }
  }, [sortType]);

  useEffect(() => {
    setLoading(true);
    getFrontpageContent().then(res => {
      setContent(res);
      setVisibleContent(res);
      setContentError(false);
      setLoading(false);
    })
    .catch((err) => {
      setContentError(true)
      setLoading(false);
    });
  }, []);

  if (contentError) return <ErrorLoading />;
  if (loading) return <Loading />;

  return (<>
    <Helmet>
      <title>EUMS - Home</title>
      <meta name="description" content="The EUMS Home page." />
    </Helmet>
    <BrowserView>
    <div className="home">
      <div className="home-options-container">
        <div className="home-options">
          <h3 className="home-options-title">Sort By</h3>
          <div className="home-category-buttons-container">
            <button className={`home-category-botton ${rankBy === "date" ? "home-category-botton-active": ""}`} onClick={() => rankByCallback("date")}>
              <span>Newest</span>
            </button>
            <button className={`home-category-botton ${rankBy === "likes" ? "home-category-botton-active": ""}`} onClick={() => rankByCallback("likes")}>
              <span>Most Liked</span>
            </button>
          </div>
          
          <h3 className="home-options-title">Categories</h3>
          <div className="home-category-buttons-container">
            <button className={`home-category-botton ${sortType.has("article") ? "home-category-botton-active": ""}`} onClick={() => sortBy("article")}><span>Articles</span></button>
            <button className={`home-category-botton ${sortType.has("video") ? "home-category-botton-active": ""}`} onClick={() => sortBy("video")}><span>Videos</span></button>
            <button className={`home-category-botton ${sortType.has("social_media") ? "home-category-botton-active": ""}`} onClick={() => sortBy("social_media")}><span>Media</span></button>
          </div>
        </div>
      </div>
      <div className="post-content">
        {visibleContent.map((item, index) => {
          if (item.type === "article") {
            item = item as Article;
            return (
              <div key={index} className="home-post">
                <Link to={`/articles/${item.id}`}>
                  <img src={`${BASE_URL}/thumbnails/${item.thumbnail}`} alt={item.title} className="home-article-thumbnail" />
                  <h3>{item.title}</h3>
                </Link>
              </div>
            );
          } else if (item.type === "video") {
            item = item as Video;
            return (
              <div key={index} className="home-post">
                <Link target="_blank" to={item.url}>
                  <div className="video-cropper">
                    <img src={item.thumbnail} alt={item.title} className="home-video-thumbnail" />
                  </div>
                  <h2 className="video-thumbnail-title">{item.title}</h2>
                </Link>
              </div>
            );
          }
        })}
      </div>
      {adsPresent && <div className="ad-slot">

      </div>}
    </div>
    </BrowserView>

    <MobileView>
      <div className="home-mobile-container">
        
      </div>
    </MobileView>
  </>)
}

export default Home;