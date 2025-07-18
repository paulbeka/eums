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


const Home = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { state, dispatch } = useGlobalStore();
  const navigate = useNavigate();

  const [content, setContent] = useState<(Article | Video)[]>([]);
  const [visibleContent, setVisibleContent] = useState<(Article | Video)[]>([]);

  const filterOptions = ["all", "article", "video", "instagram"];
  const [filter, setFilter] = useState("all");
  const Languages = ["English", "French", "German"];

  const [contentError, setContentError] = useState(false);
  const [loading, setLoading] = useState(true);

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
  }

  useEffect(() => {
    setLoading(true);
    getFrontpageContent(state.language).then(res => {
      setContent([{ type: "instagram" }, ...res]);
      setVisibleContent([{ type: "instagram" }, ...res]);
      setContentError(false);
      setLoading(false);
    })
      .catch((err) => {
        setContentError(true)
        setLoading(false);
      });
  }, [state.language]);

  if (contentError) return <ErrorLoading />;
  if (loading) return <Loading />;

  return (<>
    <Helmet>
      <title>{t('home.title')}</title>
      <meta name="description" content={t('home.description')} />
    </Helmet>
    <BrowserView>
      <div className="home">
        <div className="home-sidebar">
          <h3 style={{ margin: "0.5em 0", padding: "0.5em 0.5em" }}>{t('home.sortBy')}</h3>
          {filterOptions.map((item, key) => (
            <div className="filter-option" key={key} onClick={() => {
              setFilter(item);
              if (filter === item && item !== "all") {
                setVisibleContent(content);
                setFilter("all");
              } else if (item === "all") {
                setVisibleContent(content);
              } else {
                setVisibleContent([...content.filter(c => c.type === item.toLowerCase())]);
              }
            }} style={{ backgroundColor: item === filter ? "#f0f0f0" : "transparent" }}>
              <p>{t(`filter.${item}`)}</p>
            </div>
          ))}
          <h3 style={{ margin: "0.5em 0", padding: "0.5em 0.5em" }}>{t('home.language')}</h3>
          {Languages.map((lang, key) => (<div className="filter-option"
            style={{ backgroundColor: lang === state.language ? "#f0f0f0" : "transparent" }}
            key={key}
            onClick={(e) => dispatch({ type: 'SET_LANGUAGE', payload: lang })}
          >
            <p>{lang}</p>
          </div>))}
        </div>
        <div className="post-content">
          {visibleContent.map((item, index) => {
            if (item.type === "article") {
              item = item as Article;
              return (
                <div key={index} className="home-post">
                  <Link to={`/article/${item.id}`}>
                    <img src={`${BASE_URL}/thumbnails/${item.thumbnail}`} alt={item.title} className="home-article-thumbnail" />
                  </Link>

                  <div className="home-article-title">
                    <Link to={`/article/${item.id}`}><h3>{item.title}</h3></Link>
                    <div style={{ display: "flex", alignItems: "center", zIndex: 5 }}>
                      {item?.user_has_liked ? (
                        <AiFillLike
                          size={35}
                          style={{ marginRight: "0.5em", cursor: "pointer" }}
                          onClick={() => clickLike((item as Article).id)}
                        />
                      ) : (
                        <AiOutlineLike
                          size={35}
                          style={{ marginRight: "0.5em", cursor: "pointer" }}
                          onClick={() => clickLike((item as Article).id)}
                        />
                      )}
                      <span style={{ marginTop: "5px" }}>{item.total_likes}</span>
                    </div>
                  </div>
                </div>
              );
            } else if (item.type === "video") {
              item = item as Video;
              return (
                <div key={index} className="home-post video-post">
                  <Link target="_blank" to={item.url}>
                    <div className="video-cropper">
                      <img src={item.thumbnail} alt={item.title} className="home-video-thumbnail" />
                    </div>
                    <h2 className="video-thumbnail-title">{item.title}</h2>
                  </Link>
                </div>
              );
            } else if (item.type === "instagram") {
              return (
                <div key={index} className="home-post-insta">
                  <InstagramEmbed
                    url='https://www.instagram.com/p/DLCOsQzIhmJ/'
                  />
                </div>
              );
            }
          })}
        </div>
        <div className="home-sidebar">
          {content.filter(val => val.type === "article").sort((a, b) => {
            return (b as Article).total_likes - (a as Article).total_likes;
          })
            .slice(0, 5).map((item, index) => {
              item = item as Article;
              return (
                <Link key={index} to={`/article/${item.id}`} className="home-sidebar-article-title">
                  <span>{item.title}</span>
                  <span>{t('likes', { count: item.total_likes })}</span>
                </Link>
              );
            })
          }
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
              item = item as Article;
              return (
                <div key={index} className="home-mobile-post">
                  <Link to={`/article/${item.id}`} className="mobile-post-article-thumbnail">
                    <img src={`${BASE_URL}/thumbnails/${item.thumbnail}`} alt={item.title} className="home-mobile-article-thumbnail" />
                  </Link>
                  <div className="home-mobile-article-title">
                    <Link to={`/article/${item.id}`}><h3>{item.title}</h3></Link>
                    <div style={{ display: "flex", alignItems: "center", zIndex: 5 }}>
                      {item?.user_has_liked ? (
                        <AiFillLike
                          size={35}
                          style={{ marginRight: "0.5em", cursor: "pointer" }}
                          onClick={() => clickLike((item as Article).id)}
                        />
                      ) : (
                        <AiOutlineLike
                          size={35}
                          style={{ marginRight: "0.5em", cursor: "pointer" }}
                          onClick={() => clickLike((item as Article).id)}
                        />
                      )}
                      <span style={{ marginTop: "5px" }}>{item.total_likes}</span>
                    </div>
                  </div>
                </div>
              );
            } else if (item.type === "video") {
              item = item as Video;
              return (
                <div key={index} className="home-mobile-post">
                  <Link target="_blank" to={item.url}>
                    <div className="video-cropper">
                      <img src={item.thumbnail} alt={item.title} className="home-mobile-video-thumbnail" />
                    </div>
                    <h2 className="video-thumbnail-title">{item.title}</h2>
                  </Link>
                </div>
              );
            } else if (item.type === "instagram") {
              return (
                <div key={index} className="home-post-insta">
                  <InstagramEmbed
                    url='https://www.instagram.com/p/DLCOsQzIhmJ/'
                  />
                </div>
              );
            }
          })}
        </div>
      </div>
    </MobileView>
  </>);
};

export default Home;
