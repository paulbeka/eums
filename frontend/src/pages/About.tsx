import { BrowserView, MobileView } from "react-device-detect";
import "./CSS/About.css";
import { Helmet } from 'react-helmet-async';
import listOfMembers from "./data/aboutList.json";


const About = () => {

  const mediaIcons = [
    { icon: "/images/social_media_icons/youtube", link: "https://www.youtube.com/@EUMadeSimple/videos" },
    { icon: "/images/social_media_icons/instagram", link: "https://www.instagram.com/eu_made_simple/" },
    { icon: "/images/social_media_icons/discord", link: "https://discord.gg/jrzyVUjW" },
    { icon: "/images/social_media_icons/patreon", link: "https://www.patreon.com/eumadesimple" },
    { icon: "/images/social_media_icons/x", link: "https://x.com/EU_Made_Simple/" },
    { icon: "/images/social_media_icons/tiktok", link: "https://www.tiktok.com/@eumadesimple" },
    { icon: "/images/social_media_icons/linkedin", link: "https://www.linkedin.com/company/eumadesimple/" },
    { icon: "/images/social_media_icons/spotify", link: "https://open.spotify.com/show/0Nb6smcVnEtmRI2IkRqP56" }  
  ]
  
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
          <div className="media-icons-container">
            {mediaIcons.map(icon => (
              <a key={icon.link} href={icon.link} target="_blank" rel="noopener noreferrer" className="media-icon">
                <img
                  src={`${icon.icon}.svg`}
                  onMouseOver={(event) => {
                    const img = event.currentTarget as HTMLImageElement;
                    img.src = `${icon.icon}-shadow.svg`;
                  }}
                  onMouseOut={(event) => {
                    const img = event.currentTarget as HTMLImageElement;
                    img.src = `${icon.icon}.svg`;
                  }}
                />
              </a>
            ))}
          </div>
        </div>

        <hr style={{ width: "90%", margin: "3em auto" }} />

        <div className="team-container">
          <h1 style={{ textAlign: "center", fontSize: "30pt" }}>The EUMS Team</h1>
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
                  <img style={{ width: "100%", height: "auto" }} src={person.image} alt={person.name} />
                </div>
                <div className="about-person-details-container">
                  <h3>{person.name}</h3>
                  <p>{person.role}</p>
                  <br />
                  <p>{person.description}</p>
                  <br />
                  <p style={{ color: "gray" }}>Email: {person.email}</p>
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