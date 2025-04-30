import { Link } from "react-router-dom";
import { BrowserView, MobileView } from "react-device-detect";
import "./Footer.css";

const Footer = () => {
  const footerLinks = [
    { text: "Who We Are", link: "about" },
    { text: "Contact Us", link: "contact" },
  ];

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

  return (
    <>
      <BrowserView>
        <div className="footer">
          <div className="bottom-home-content">
            <div className="media-links-container">
              <p className="sub-title" style={{color: "black"}}>Join the Community</p>
              <p>Get involved, connect with others and <b>make a difference.</b></p>
              <br />
              <div className="media-icons">
                {mediaIcons.map(icon => (
                  <Link to={icon.link} target="_blank" className="media-icon">
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
                  </Link>)
                )}
              </div>
            </div>
            <div className="support-container eums-box-shadow">
              <div style={{display: "flex"}}>
                <p className="sub-title" style={{color: "black"}}>Support Us</p>
              </div>
              <div className="support-content">
                <p>You can <b>support EU Made Simple </b> by many different means, here's how:</p>
                <div className="bottom-content">
                  <div className="split-content" style={{ paddingRight: "2em" }}>
                    <p style={{ textAlign: "justify", marginRight: "1em" }}><b>Become a Patreon</b> and be part of the EUMS members! By becoming a Patreon you can even have influence over <b>decision making</b> of the community strategy or choose which topics we will treat in our videos*.</p>
                    <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginTop: "1em" }}>
                      <Link to="https://www.patreon.com/eumadesimple" className="color-button">Join!</Link>
                    </div>
                  </div>
                  <div style={{ paddingLeft: "2em" }} className="split-content">
                    <p style={{ textAlign: "justify" }}><b>Create content</b> for us by writing your own <b>articles</b> that could be published on our site, or do a coverage on our <b>YouTube content</b> in your local language to engage with a wider audience and help us create more social media content!</p>
                    <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginTop: "1em" }}>
                      <button className="color-button">Start Creating!</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-content">
            <h1 className="footer-title">EU Made Simple</h1>
            <div className="footer-link-container">
              {footerLinks.map((item) => (
                <Link className="menu-item" to={item.link} key={item.text}>
                  <span>{item.text}</span>
                </Link>
              ))}
            </div>
            <p>© Copyright 2024. All rights reserved.</p>
          </div>
        </div>
      </BrowserView>

      <MobileView>
        <div className="mobile-footer">
          <div className="mobile-footer-content">
            <h1 className="mobile-footer-title">EU Made Simple</h1>
            <p>© Copyright 2024. All rights reserved.</p>
          </div>
        </div>
      </MobileView>
    </>
  );
};

export default Footer;
