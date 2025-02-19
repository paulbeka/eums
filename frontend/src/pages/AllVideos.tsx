import { useState, useEffect } from "react";
import { Video } from "../components/types/Content.type";
import { Link } from "react-router-dom";
import { getVideos } from "../components/api/Api";
import "./CSS/AllVideos.css";
import ErrorLoading from "../components/frontend_util/ErrorLoading";
import Loading from "../components/frontend_util/Loading";
import { BrowserView, MobileView } from "react-device-detect";


const AllVideos = ({ livestreams } : { livestreams: boolean }) => {

  const [searchFilter, setSearchFilter] = useState<string>("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [sortBy, setSortBy] = useState<string>("");
  
  const [videoLoadError, setVideoLoadError] = useState(false)

  useEffect(() => {
    getVideos(livestreams).then((res: any) => setVideos(res))
    .catch(err => setVideoLoadError(true));
  }, []);

  useEffect(() => {
    if (sortBy === "recent") {
      setVideos((prevVideos) => 
        [...prevVideos].sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime())
      );
    } else if (sortBy === "old") {
      setVideos((prevVideos) => 
        [...prevVideos].sort((a, b) => new Date(a.upload_date).getTime() - new Date(b.upload_date).getTime())
      );
    }
  }, [sortBy]);
  
  const getArticlesAfterFilter = () => {
    if (searchFilter === "") {
      return videos;
    }
    return videos.filter(video => 
      video.title.toLowerCase().includes(searchFilter));
  }

  return (<>
    <BrowserView>
      <div className="all-videos-container">
        <div className="all-videos-content">
          <div className="all-videos-control-bar">
            <Link to={"/"} className="back-button">
              <img
                style={{ width: "20px", marginRight: "1em" }}
                src="/images/back-arrow.svg"
                alt="Back"
              />
              <span>Back</span>
            </Link>
            <div className="search-container-features">
              <div className="video-search-quicklinks">
                <div onClick={() => setSortBy("recent")} className="video-quicklink">
                  <span>Most Recent</span>
                </div>
                <div onClick={() => setSortBy("old")} className="video-quicklink">
                  <span>Oldest</span>
                </div>
              </div>
              <div className="searchbar-container">
                <div className="searchbar-icon"></div>
                <input
                  type="text"
                  className="searchbar"
                  placeholder="Search..."
                  onChange={(e) => setSearchFilter(e.target.value.toLowerCase())}
                />
              </div>
            </div>
          </div>

          <div className="all-videos-video-container">
            {videos.length ? <>
            {getArticlesAfterFilter().map(video => {
              return (
                <Link to={video.url} target="_blank" className="all-videos-video">
                  <div className="video-thumbnail-container" style={{border: "3px solid black" }}>
                    <img src={video.thumbnail} className="video-thumbnail"/>
                  </div>
                  <div style={{margin: "1em"}}>
                    {video.title}
                  </div>
                </Link>
              )
            })}</> : videoLoadError ? <ErrorLoading /> : <Loading />}
          </div>
        </div>
      </div>
    </BrowserView>

    <MobileView>
      <div className="mobile-all-videos-container">
        {videos.length ? videos.slice(0, 10).map(video => (
          <Link to={video.url} target="_blank" className="mobile-article-container">
            <img className="mobile-video-thumbnail" src={video.thumbnail} />
            <h3 style={{ marginLeft: "10px" }}>{video.title}</h3>
          </Link>
        )) : videoLoadError ? <ErrorLoading /> : <Loading />}
      </div>
    </MobileView>
  </>)
}

export default AllVideos;