import { BrowserView, MobileView } from "react-device-detect";
import "./CSS/About.css";
import { Helmet } from 'react-helmet-async';
import listOfMembers from "./data/aboutList.json";


const About = () => {
  
  return <>
    <Helmet>
      <title>EUMS - About</title>
      <meta name="description" content="What is EU Made Simple?" />
    </Helmet>
    <BrowserView>
      <div className="about-container">
        <div className="quote-container">
          <h1 style={{ textAlign: "center", fontSize: "30pt", marginBottom: "1em" }}>
            Welcome to EU Made Simple!
          </h1>
          <p style={{ textAlign: "center", fontSize: "16pt" }}>
            Our purpose? Delivering easy-to-digest, comprehensive, and easy-to-understand information about EU news and politics.
          </p>
        </div>

        <hr style={{ width: "70%", margin: "3em auto" }} />

        <div className="team-container">
          <h1 style={{ textAlign: "center", fontSize: "30pt", marginBottom: "1em" }}>The EUMS Team</h1>
          <div className="team-members-container">
            {listOfMembers.map((person, index) => (<>
              <div key={index} className={`member-container ${((index+1) % 2) === 0 ? 'align-right' : 'align-left'}`}>
                <div className="about-person-image">
                  <img style={{ width: "100%", height: "auto" }} src={person.image} />
                </div>
                <div className="about-person-details-container">
                  <h3>{person.name}</h3>
                  <p style={{ fontSize: "14pt"}}>{person.role}</p>
                  <br />
                  <div style={{ width: "70%", marginLeft: `${(index + 1) % 2 === 0 ? 'auto' : '0'}`, marginRight: `${(index + 1) % 2 === 0 ? '0' : 'auto'}`,}}>
                    {person.description.split("\n").map((line, index) => <><p key={index}>{line}</p><br /></>)}
                  </div>
                  <br />
                  <p style={{ color: "gray" }}>Email: {person.email}</p>
                </div>
              </div>
              {index !== listOfMembers.length - 1 && <hr style={{width: "40%", border: "1px solid #bdbdbd4e 26% / 0.537"}}/>}
            </>))}
          </div>
        </div>
      </div>

    </BrowserView>

    <MobileView>
      <div className="mobile-about-container">
        <div className="quote-container">
          <h1 style={{ textAlign: "center", fontSize: "30pt", marginBottom: "1em" }}>Welcome to EU Made Simple!</h1>
          <p style={{ textAlign: "center", fontSize: "16pt" }}>
            Our purpose? Delivering easy to digest, comprehensive, and easy to understand information about EU news and politics.
          </p>  
        </div>

        <hr style={{ width: "80%", margin: "auto", marginBottom: "3em" }} />

        <div className="team-members-container">
            {listOfMembers.map(person => 
              <div className="member-container">
                <div className="about-person-image">
                  <img style={{ width: "100%", height: "auto" }} src={person.image} />
                </div>
                <div className="about-person-details-container">
                  <h3>{person.name}</h3>
                  <p>{person.role}</p>
                  <br />
                  <p>{person.description}</p>
                  <br />
                </div>
              </div>
            )}
          </div>
        
      </div>
    </MobileView>
  </>
}

export default About;