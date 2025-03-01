import React, { useEffect } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import "./CSS/About.css";
import { Helmet } from 'react-helmet-async';


const About = () => {
  
  useEffect(() => {
    document.title = 'About';
  }, []);

  const listOfMembers = [
    {"name": "Lambertus Robben", "role": "Founder & CEO", 
      "description": "Lambertus first came up with the idea of a youtube channel explaining Europe when he lived in London, during the Brexit campain.", "image": "/images/profile_pictures/paul.jpg"},
    {"name": "Miguel", "role": "Social Media Manager", "description": "Miguel manages the social media of EUMS", "image": "images/profile_pictures/paul.jpg"},
    {"name": "Pablo", "role": "Graphic Designer", "description": "Pablo is our designer", "image": "images/profile_pictures/pablo.jpg"},
    {"name": "Paul Bekaert", "role": "Head of French Channel", "description": "Paul manages both the French channel, l'UE Simplifiée, the EUMS website.", "image": "images/profile_pictures/paul.jpg"},
    {"name": "Johnny", "role": "Head of German Channel", "description": "Johnny is head of the German channel.", "image": "images/profile_pictures/paul.jpg "}
  ];

  return <>
    <Helmet>
      <title>EUMS - About</title>
      <meta name="description" content="What is EU Made Simple?" />
    </Helmet>
    <BrowserView>
      <div className="about-container">
        <div className="about-text-explainers">
          <div className="about-text-explainer eums-shadow-box">
            <h2>Who are we?</h2>
            <br />
            <p>Welcome to EU Made Simple! We're a team of passionate individuals dedicated to making 
              EU news and politics accessible to everyone.</p>
          </div>

          <div className="about-text-explainer eums-shadow-box">
            <h2>What is our Mission?</h2>
            <br />
            <p>Our goal is to simplify EU politics through clear, engaging content. From YouTube to 
              this website, we bring you reliable, easy-to-understand news.</p>
          </div>

          <div className="about-text-explainer eums-shadow-box">
            <h2>Why this Website?</h2>
            <br />
            <p>This website is our latest step in expanding EU Made Simple. Here, we publish concise, 
              well-researched articles to keep you informed.</p>
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
                  <br />
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