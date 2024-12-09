import React, { useEffect } from 'react';
import "./CSS/Home.css";


const Home = () => {

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
            <img />
            <div className="display-content-text">
              <h4>Educational Videos</h4>
              <p>Lorem ipsum dolor si amet</p>
            </div>
          </div>
          <div className="display-content-holder">
            <img />
            <div className="display-content-text">
              <h4>Educational Videos</h4>
              <p>Lorem ipsum dolor si amet</p>
            </div>
          </div>
          <div className="display-content-holder">
            <img />
            <div className="display-content-text">
              <h4>Educational Videos</h4>
              <p>Lorem ipsum dolor si amet</p>
            </div>
          </div>
        </div>

        <p>EU Made Simple is independently run by Lambertus Robben, a passionate Dutch national Living in Germany, dedicated to making the EU comprehensible for all Europeans.</p>
        <br />
        <p>Join us to learn, engage, and vote - because a well informed Europe is a stronger Europe.</p>
      </div>

      <div className="international-reach-container">
        <div className="international-reach-content">
          <div className="eu-map">

          </div>
          <div className="text-content">
            <h4>International Reach</h4>
          </div>
        </div>
        <div className="connection-links">
          <h3>Stay connected and join the community!</h3>
        </div>
      </div>
    </div>
  )
}

export default Home;