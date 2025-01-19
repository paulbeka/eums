import { useState, useEffect } from "react";
import { Video } from "../components/types/Content.type";
import { Link } from "react-router-dom";
import { getVideos } from "../components/api/Api";
import "./CSS/AllVideos.css";


const AllVideos = ({ livestreams } : { livestreams: boolean }) => {

  const [searchFilter, setSearchFilter] = useState<string>("");
  const [videos, setVideos] = useState<Video[]>([]);
  
  useEffect(() => {
    getVideos(livestreams).then((res: any) => setVideos(res))
  }, []);

  const getArticlesAfterFilter = () => {
    if (searchFilter === "") {
      return videos;
    }
    return videos.filter(video => video.title.includes(searchFilter));
  }

  return (
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
              <div className="video-quicklink">
                <span>Most Recent</span>
              </div>
              <div className="video-quicklink">
                <span>Popular</span>
              </div>
              <div className="video-quicklink">
                <span>Oldest</span>
              </div>
            </div>
            <div className="searchbar-container">
              <div className="searchbar-icon"></div>
              <input
                type="text"
                className="searchbar"
                placeholder="Search..."
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="all-videos-video-container">
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
          })}
        </div>
      </div>
    </div>
  )
}

export default AllVideos;