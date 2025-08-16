import { useState, useEffect } from 'react';
import "./CSS/Home.css";
import { Video, Article } from '../components/types/Content.type';
import { Link, useNavigate } from 'react-router-dom';
import { getFrontpageContent } from '../components/api/Api';
import { BASE_URL } from "../Config";
import { BrowserView, MobileView } from "react-device-detect";
import Loading from '../components/frontend_util/Loading';
import ErrorLoading from '../components/frontend_util/ErrorLoading';
import { Helmet } from 'react-helmet-async';
import { likeArticle } from '../components/util_tools/UserActions';
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useAuth } from '../components/auth/AuthContext';
import { InstagramEmbed } from 'react-social-media-embed';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '../store/GlobalStore';
import { YouTubeThumbnail } from '../components/frontend_util/YoutubeThumbnail';
import { NewsletterRegistrationForm } from '../components/frontend_util/NewsletterRegistrationForm';

const Home = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { state, dispatch } = useGlobalStore();
  const navigate = useNavigate();

  const [content, setContent] = useState<(Article | Video)[]>([]);
  const [visibleContent, setVisibleContent] = useState<(Article | Video)[]>([]);

  const filterOptions = ["all", "article", "video", "instagram"];
  const [filter, setFilter] = useState("all");
  const Languages = ["English", "French", "German", "Polish", "Romanian"];

  const [contentError, setContentError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const BATCH_SIZE = 20;
  const adsPresent = true;

  const clickLike = (articleId: number) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    likeArticle(articleId).then((data) => {
      setVisibleContent(prev =>
        prev.map(item => {
          if (item.type !== "article") return item;
          item = item as Article;
          if (item.id === articleId) {
            return {
              ...item,
              total_likes: item.total_likes + (data.like ? 1 : -1),
              user_has_liked: data.like
            } as Article;
          }
          return item;
        })
      );
    }).catch((err) => {
      console.error("Error liking article:", err);
    });
  };

  const loadMoreContent = async () => {
    setLoading(true);
    try {
      const res = await getFrontpageContent(state.language, offset, BATCH_SIZE);
      const newContent = offset === 0 ? [...res] : res;

      const combined = [...content, ...newContent];
      setContent(combined);

      const filtered = filter === "all"
        ? combined
        : combined.filter(c => c.type === filter.toLowerCase());
      setVisibleContent(filtered);

      setOffset(prev => prev + BATCH_SIZE);
      if (res.length < BATCH_SIZE) setHasMore(false);
      setContentError(false);
    } catch (err) {
      console.error(err);
      setContentError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    setContent([]);
    setVisibleContent([]);
    loadMoreContent();
  }, [state.language]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const currentScroll = window.innerHeight + window.scrollY;
      if (currentScroll + 100 >= scrollHeight && !loading && hasMore) {
        loadMoreContent();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, offset, filter]);

  const applyFilter = (item: string) => {
    setFilter(item);
    if (item === "all") {
      setVisibleContent(content);
    } else {
      const filtered = content.filter(c => c.type === item.toLowerCase());
      setVisibleContent(filtered);
    }
  };

  if (contentError) return <ErrorLoading />;

  return (<>
    <Helmet>
      <title>{t('home.title')}</title>
      <meta name="description" content={t('home.description')} />
    </Helmet>
    <BrowserView>
      <div className="home">
        <div className="home-sidebar-container home-sidebar">
          <h3 style={{ margin: "0.5em 0", padding: "0.5em 0.5em" }}>{t('home.sortBy')}</h3>
          {filterOptions.map((item, key) => (
            <div className="filter-option" key={key} onClick={() => applyFilter(item)}
              style={{ backgroundColor: item === filter ? "#f0f0f0" : "transparent" }}>
              <p>{t(`filter.${item}`)}</p>
            </div>
          ))}
          <h3 style={{ margin: "0.5em 0", padding: "0.5em 0.5em" }}>{t('home.language')}</h3>
          {Languages.map((lang, key) => (
            <div className="filter-option"
              style={{ backgroundColor: lang === state.language ? "#f0f0f0" : "transparent" }}
              key={key}
              onClick={() => {
                if (lang === state.language) return;
                setContent([]);
                setOffset(0);
                setHasMore(true);
                dispatch({ type: 'SET_LANGUAGE', payload: lang })
              }}>
              <p>{lang}</p>
            </div>
          ))}
        </div>

        <div className="post-content">
          {visibleContent.map((item, index) => {
            if (item.type === "article") {
              const article = item as Article;
              return (
                <div key={index} className="home-post">
                  <Link to={`/article/${article.id}`}>
                    <img src={`${BASE_URL}/thumbnails/${article.thumbnail}`} alt={article.title} className="home-article-thumbnail" />
                  </Link>
                  <div className="home-article-title">
                    <Link to={`/article/${article.id}`}><h3>{article.title}</h3></Link>
                    <div style={{ display: "flex", alignItems: "center", zIndex: 5 }}>
                      {article.user_has_liked ? (
                        <AiFillLike size={35} style={{ marginRight: "0.5em", cursor: "pointer" }} onClick={() => clickLike(article.id)} />
                      ) : (
                        <AiOutlineLike size={35} style={{ marginRight: "0.5em", cursor: "pointer" }} onClick={() => clickLike(article.id)} />
                      )}
                      <span style={{ marginTop: "5px" }}>{article.total_likes}</span>
                    </div>
                  </div>
                </div>
              );
            } else if (item.type === "video") {
              const video = item as Video;
              return (
                <div key={index} className="home-post video-post">
                  <Link target="_blank" to={video.url}>
                    <YouTubeThumbnail videoId={video.url.split("=")[1]} title={video.title} className="home-video-thumbnail" />
                  </Link>
                </div>
              );
            } else if (item.type === "instagram") {
              return (
                <div key={index} className="home-post-insta">
                  <InstagramEmbed url='https://www.instagram.com/p/DLCOsQzIhmJ/' />
                </div>
              );
            }
          })}
          <Loading />
        </div>
        
        <div className="home-sidebar-container">
          <div className="home-sidebar" style={{ marginTop: 0 }}>
            {content.filter(val => val.type === "article").sort((a, b) => (b as Article).total_likes - (a as Article).total_likes).slice(0, 5).map((item, index) => {
              const article = item as Article;
              return (
                <Link key={index} to={`/article/${article.id}`} className="home-sidebar-article-title">
                  <span title={article.title} className="truncated-title">{article.title}</span>
                  <span>{t('likes', { count: article.total_likes })}</span>
                </Link>
              );
            })}
          </div>
          <div className="home-sidebar">
            <h2>{t('homepage.newsletter.title')}</h2>
            <p>{t('homepage.newsletter.description')}</p>
            <br />
            <NewsletterRegistrationForm />
          </div>
        </div>
        
        {adsPresent && <div className="ad-slot"></div>}
      </div>
    </BrowserView>

    <MobileView>
      <div className="home-mobile-container">
        <center><h1 style={{ paddingBlock: "0.5em" }}>{t('mobile.feed')}</h1></center>
        <div className="mobile-feed-content">
          {visibleContent.map((item, index) => {
            if (item.type === "article") {
              const article = item as Article;
              return (
                <div key={index} className="home-mobile-post">
                  <Link to={`/article/${article.id}`} className="mobile-post-article-thumbnail">
                    <img src={`${BASE_URL}/thumbnails/${article.thumbnail}`} alt={article.title} className="home-mobile-article-thumbnail" />
                  </Link>
                  <div className="home-mobile-article-title">
                    <Link to={`/article/${article.id}`}><h3>{article.title}</h3></Link>
                    <div style={{ display: "flex", alignItems: "center", zIndex: 5 }}>
                      {article.user_has_liked ? (
                        <AiFillLike size={35} style={{ marginRight: "0.5em", cursor: "pointer" }} onClick={() => clickLike(article.id)} />
                      ) : (
                        <AiOutlineLike size={35} style={{ marginRight: "0.5em", cursor: "pointer" }} onClick={() => clickLike(article.id)} />
                      )}
                      <span style={{ marginTop: "5px" }}>{article.total_likes}</span>
                    </div>
                  </div>
                </div>
              );
            } else if (item.type === "video") {
              const video = item as Video;
              return (
                <div key={index} className="home-mobile-post">
                  <Link target="_blank" to={video.url}>
                    <YouTubeThumbnail videoId={video.url.split("=")[1]} title={video.title} className="home-video-thumbnail" />
                  </Link>
                </div>
              );
            } else if (item.type === "instagram") {
              return (
                <div key={index} className="home-post-insta">
                  <InstagramEmbed url='https://www.instagram.com/p/DLCOsQzIhmJ/' />
                </div>
              );
            }
          })}
          <Loading />
        </div>
      </div>
    </MobileView>
  </>);
};

export default Home;
