import { Link } from "react-router-dom";
import { BrowserView, MobileView } from "react-device-detect";
import "./Footer.css";

const Footer = () => {
  const footerLinks = [
    { text: "Who We Are", link: "about" },
    { text: "Videos", link: "videos" },
    { text: "Contact Us", link: "contact" },
  ];

  return (
    <>
      <BrowserView>
        <div className="footer">
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
