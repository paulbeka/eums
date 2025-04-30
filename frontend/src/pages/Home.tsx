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
  const [contentError, setContentError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getFrontpageContent().then(res => {
      setContent(res);
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
      {content.map((item, index) => {
        if (item.type === "article") {
          item = item as Article;
          return (
            <div key={index} className="home-article">
              <Link to={`/articles/${item.id}`}>
                <img src={`${BASE_URL}/thumbnails/${item.thumbnail}`} alt={item.title} />
                <h3>{item.title}</h3>
              </Link>
            </div>
          );
        } else if (item.type === "video") {
          item = item as Video;
          return (
            <div key={index} className="home-video">
              <Link to={item.url}>
                <img src={item.thumbnail} alt={item.title} />
                <h3>{item.title}</h3>
              </Link>
            </div>
          );
        }
      })}
    </div>
    </BrowserView>

    <MobileView>
      <div className="home-mobile-container">
        
      </div>
    </MobileView>
  </>)
}

export default Home;