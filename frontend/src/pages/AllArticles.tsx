import { useState, useEffect } from "react";
import "./CSS/AllArticles.css";
import { Article } from "../components/types/Content.type";
import { getArticles } from "../components/api/Api";
import { BASE_URL } from "../Config";
import { Link } from "react-router-dom";
import ErrorLoading from "../components/frontend_util/ErrorLoading";
import Loading from "../components/frontend_util/Loading";
import { BrowserView, MobileView } from "react-device-detect";
import { formatArticleContent } from "../components/util_tools/Util";


const AllArticles = () => {
  const [filters, setFilters] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [articles, setArticles] = useState<Article[]>([]);

  const [articleError, setArticleError] = useState(false);

  useEffect(() => {
    document.title = "All Articles";
    getArticles(true).then((res) => setArticles(res))
    .catch((err) => setArticleError(true));
  }, []);

  const filterBy = (filter: string) => {
    if (selectedFilter === filter) {
      setSelectedFilter("");
    } else {
      setSelectedFilter(filter);
    }
  };

  const getArticleParagraphs = (article: Article) => {
    const blockList = article.content.split("\\n")
      .filter(item => item !== "");
    return (
      <div className="all-articles-article-paragraph">
        <p style={{ textAlign: "justify" }}>{formatArticleContent(blockList[0]) || ""}</p>
        <p style={{ textAlign: "justify" }}>{formatArticleContent(blockList[1]) || ""}</p>
      </div>
    );
  };

  const filteredArticles = articles.filter((article) => {
    const searchMatch =
      article.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      JSON.parse(article.content).blocks.some((block: any) =>
        block.text.toLowerCase().includes(searchFilter.toLowerCase())
      );

    const categoryMatch = selectedFilter ? article.title.includes(selectedFilter) : true;

    return searchMatch && categoryMatch;
  });

  return (<>
  <BrowserView>
    <div className="all-articles-container">
      <div className="all-articles-content">
        <div className="item-bar">
          <Link to={"/"} className="back-button">
            <img
              style={{ width: "20px", marginRight: "1em" }}
              src="/images/back-arrow.svg"
              alt="Back"
            />
            <span>Back</span>
          </Link>
          <div className="filter-container">
            {filters.map((filter) => (
              <span
                key={filter}
                className={`all-articles-filter-text ${
                  selectedFilter === filter ? "all-articles-selected-filter-text" : ""
                }`}
                onClick={() => filterBy(filter)}
              >
                {filter}
              </span>
            ))}
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
          {articles.length ? <>
          {filteredArticles.map((article) => (<>
            <Link to={`/article/${article.id}`} key={article.id} className="all-article-container">
              <img
                className="all-articles-article-image"
                src={`${BASE_URL}/thumbnails/${article.thumbnail}`}
                alt="Article Thumbnail"
              />
              <div className="all-articles-side-content">
                <div className="all-articles-article-text-content">
                  <h3 style={{ marginBottom: "1em" }}>{article.title}</h3>
                  {getArticleParagraphs(article)}
                </div>
                <br />
                <Link
                  to={`/article/${article.id}`}
                  style={{ textDecoration: "underline", color: "gray" }}
                >
                  <i>Continue reading...</i>
                </Link>
              </div>
            </Link>
            <center>
              <hr
                style={{
                  width: "50%",
                  height: "3px",
                  backgroundColor: "black",
                }}
              />
            </center>
            </>
          ))}</> : articleError ? <ErrorLoading /> : <Loading />}
        </div>
      </div>
    </div>
  </BrowserView>
  <MobileView>
    <div className="mobile-articles-container">
      {articles.length ? articles.slice(0, 3).map(article => (
        <Link to={`/article/${article.id}`} className="mobile-article-container">
          <img className="mobile-article-thumbnail" src={`${BASE_URL}/thumbnails/${article.thumbnail}`} />
          <h3 style={{ marginLeft: "10px" }}>{article.title}</h3>
        </Link>
      )) : articleError ? <ErrorLoading /> : <Loading />}
    </div>
  </MobileView>
  </>);
};

export default AllArticles;
