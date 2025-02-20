import React, { useEffect } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import "./CSS/About.css";


const About = () => {
  
  useEffect(() => {
    document.title = 'About';
  }, []);

  const listOfMembers = [
    {"name": "Lambertus Robben", "role": "Founder & CEO", "description": "", "image": "https://streetphotography.com/wp-content/uploads/2017/08/test.png"},
    {"name": "Miguel", "role": "Social Media Manager", "description": "", "image": "https://streetphotography.com/wp-content/uploads/2017/08/test.png"},
    {"name": "Pablo", "role": "Graphic Designer", "description": "", "image": "https://streetphotography.com/wp-content/uploads/2017/08/test.png"},
    {"name": "Paul Bekaert", "role": "Head of French Channel", "description": "", "image": "https://streetphotography.com/wp-content/uploads/2017/08/test.png"},
    {"name": "Johnny", "role": "Head of German Channel", "description": "", "image": "https://streetphotography.com/wp-content/uploads/2017/08/test.png"}
  ];

  return <>
    <BrowserView>
      <div className="about-container">
        <div className="about-text-explainers">
          <div className="about-text-explainer eums-shadow-box">
            <h2>Who are we?</h2>
            <br />
            <p>Welcome to EU Made Simple! Our purpose? Delivering easy to digest, comprehensive, and easy to understand information about EU news and politics.
              Originally starting with English youtube videos, we now have over 7 channels in different European languages! This website is the newest addition
              to our media presence, where we share with you custom written news articles!
            </p>
          </div>
          <div className="about-text-explainer eums-shadow-box">
            <h2>What is our Mission?</h2>
            <br />
            <p>Welcome to EU Made Simple! Our purpose? Delivering easy to digest, comprehensive, and easy to understand information about EU news and politics.
              Originally starting with English youtube videos, we now have over 7 channels in different European languages! This website is the newest addition
              to our media presence, where we share with you custom written news articles!
            </p>
          </div>
          <div className="about-text-explainer eums-shadow-box">
            <h2>Who are we?</h2>
            <br />
            <p>Welcome to EU Made Simple! Our purpose? Delivering easy to digest, comprehensive, and easy to understand information about EU news and politics.
              Originally starting with English youtube videos, we now have over 7 channels in different European languages! This website is the newest addition
              to our media presence, where we share with you custom written news articles!
            </p>
          </div>
        </div>

        <hr style={{ width: "90%", margin: "3em auto" }} />

        <div className="team-container">
          <h1 style={{ textAlign: "center", fontSize: "30pt", marginBottom: "1em" }}>The EUMS Team</h1>
          <div className="team-members-container">
            {listOfMembers.map(person => 
              <div className="member-container eums-shadow-box">
                <div className="about-person-image">
                  <img style={{ width: "100%", height: "auto" }} src={person.image} />
                </div>
                <div className="about-person-details-container">
                  <h3>{person.name}</h3>
                  <p>{person.role}</p>
                  <p>{person.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </BrowserView>

    <MobileView>
      <div className="mobile-about-container">
        <div className="about-text-explainers">
          <div className="about-text-explainer eums-shadow-box">
            <h2>Who are we?</h2>
            <br />
            <p>Welcome to EU Made Simple! Our purpose? Delivering easy to digest, comprehensive, and easy to understand information about EU news and politics.
              Originally starting with English youtube videos, we now have over 7 channels in different European languages! This website is the newest addition
              to our media presence, where we share with you custom written news articles!
            </p>
          </div>
          <div className="about-text-explainer eums-shadow-box">
            <h2>What is our Mission?</h2>
            <br />
            <p>Welcome to EU Made Simple! Our purpose? Delivering easy to digest, comprehensive, and easy to understand information about EU news and politics.
              Originally starting with English youtube videos, we now have over 7 channels in different European languages! This website is the newest addition
              to our media presence, where we share with you custom written news articles!
            </p>
          </div>
          <div className="about-text-explainer eums-shadow-box">
            <h2>Who are we?</h2>
            <br />
            <p>Welcome to EU Made Simple! Our purpose? Delivering easy to digest, comprehensive, and easy to understand information about EU news and politics.
              Originally starting with English youtube videos, we now have over 7 channels in different European languages! This website is the newest addition
              to our media presence, where we share with you custom written news articles!
            </p>
          </div>
        </div>

        <hr style={{ width: "80%", margin: "auto", marginBottom: "3em" }} />

        <div className="team-members-container">
            {listOfMembers.map(person => 
              <div className="member-container eums-shadow-box">
                <div className="about-person-image">
                  <img style={{ width: "100%", height: "auto" }} src={person.image} />
                </div>
                <div className="about-person-details-container">
                  <h3>{person.name}</h3>
                  <p>{person.role}</p>
                  <p>{person.description}</p>
                </div>
              </div>
            )}
          </div>
        
      </div>
    </MobileView>
  </>
}

export default About;