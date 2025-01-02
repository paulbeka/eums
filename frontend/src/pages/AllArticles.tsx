import { useState, useEffect } from "react";
import "./CSS/AllArticles.css";
import { Article } from "../components/types/Content.type";
import { getArticles } from "../components/api/Api";
import { BASE_URL } from "../Config";
import { Link } from "react-router-dom";


const AllArticles = () => {
  
  const [filters, setFilters] = useState(["France", "Ukraine", "Mercosaur", "Germany"]);
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    document.title = 'All Articles';
    getArticles(true).then(res => setArticles(res));
  }, []);

  const filterBy = (filter: string) => {
    setSelectedFilter(filter);
  }

  const getArticleParagraphs = (article: Article) => {
    const parsedBlogPost = JSON.parse(article.content);
    return (
      <div className="">
        <p className="">{parsedBlogPost.blocks[0].text}</p>
        <p className="">{parsedBlogPost.blocks[1].text}</p>
      </div>
    )
  }

  return (
    <div className="all-articles-container">
      <div className="all-articles-content">
        <div className="item-bar">
          <Link to={"/"} className="back-button">
            <img style={{ width: "20px", marginRight: "1em"}} src="/images/back-arrow.svg" />
            <span>Back</span>
          </Link>
          <div className="filter-container">
            {filters.map(filter => {
              return (
                <span 
                  className={`all-articles-filter-text ${selectedFilter === filter ? "all-articles-selected-filter-text" : ""}`} 
                  onClick={() => filterBy(filter)}>{filter}</span>
              )
            })}
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

        <div className="all-articles-container">
          {articles.map(article => {
            return (<>
              <div className="all-article-container">
                <img src={`${BASE_URL}/thumbnails/${article.thumbnail}`} className="article-thumbnail" />
                <div>
                  <h3>{article.title}</h3>
                  {getArticleParagraphs(article)}
                </div>
              </div>
              <center>
                <hr style={{ width: "50%", height: "3px", backgroundColor: "black" }} />
              </center>
              </>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AllArticles;