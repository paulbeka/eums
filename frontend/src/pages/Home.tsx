import React, { useEffect } from 'react';
import "./CSS/Home.css";
import { Link } from 'react-router-dom';


const Home = () => {

  const listOfLinks = [
    {url: "www.google.com", logo: "https://streetphotography.com/wp-content/uploads/2017/08/test.png"},
    {url: "www.google.com", logo: "https://streetphotography.com/wp-content/uploads/2017/08/test.png"},
    {url: "www.google.com", logo: "https://streetphotography.com/wp-content/uploads/2017/08/test.png"},
    {url: "www.google.com", logo: "https://streetphotography.com/wp-content/uploads/2017/08/test.png"},
    {url: "www.google.com", logo: "https://streetphotography.com/wp-content/uploads/2017/08/test.png"},
    {url: "www.google.com", logo: "https://streetphotography.com/wp-content/uploads/2017/08/test.png"}
  ]

  const fetchVideos = async () => {
    const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    const channelId = 'UC8KFs307LrTkQCu-P1Fl6dw';
    const maxResults = 5;

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}`
    );
    const data = await response.json();
    // setVideos(data.items);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    document.title = 'Home';
  }, []);

  return (
    <div className="home">
      <div className="top-home-content">
        <h3>Who Are We?</h3>
        <br />
        <p>At EU Made Simple, we aim to educate and impower 449 million Europeans to vote and engage in the EU.</p>

        <div className="display-container">
          <div className="display-content-holder">
            <img className="display-content-img" src="/images/thumbnail1.png" />
            <div className="display-content-text">
              <h4>Educational Videos</h4>
              <p>Lorem ipsum dolor si amet</p>
            </div>
          </div>
          <div className="display-content-holder">
            <img className="display-content-img" src="/images/thumbnail2.png" />
          <div className="display-content-text">
              <h4>Educational Videos</h4>
              <p>Lorem ipsum dolor si amet</p>
            </div>
          </div>
          <div className="display-content-holder">
            <img className="display-content-img" src="/images/thumbnail3.png" />
          <div className="display-content-text">
              <h4>Educational Videos</h4>
              <p>Lorem ipsum dolor si amet</p>
            </div>
          </div>
        </div>

        <br />
        <p>EU Made Simple is independently run by Lambertus Robben, a passionate Dutch national Living in Germany, dedicated to making the EU comprehensible for all Europeans.</p>
        <br />
        <p>Join us to learn, engage, and vote - because a well informed Europe is a stronger Europe.</p>
      </div>

      <div className="international-reach-container">
        <div className="international-reach-content">
          <div className="eu-map">
            <img className="eu-map-img" src="https://streetphotography.com/wp-content/uploads/2017/08/test.png" />
          </div>
          <div className="international-reach-text-content">
            <h3>International Reach</h3>
            <br />
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </div>

        <div className="check-out-channels">
          <h4>Check all our channels!</h4>
        </div>
        
        <div className="connection-links">
          <h3>Stay connected and join the community!</h3>
          <br />
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
          <br />
          <div className="links-set">
            {listOfLinks.map(link => 
              <Link to={link.url}>
                <img src={link.logo} className="link-logo"/>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;