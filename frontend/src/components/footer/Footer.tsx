import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";


const Footer = () => {
  
  const footerLinks = [
    {text: "Who We Are", link: "about"},
    {text: "Updates", link: "updates"},
    {text: "Videos", link: ""},
    {text: "Contact Us", link: "contact"},
  ]

  return (
    <div className="footer">
      <div className="footer-content">
        <h1 className="footer-title">EU Made Simple</h1>
        <div className="footer-link-container">
          {footerLinks.map(item => 
            <Link to={item.link}>
              <span className="menu-item">{item.text}</span>
            </Link>
          )}
        </div>
        <p>© Copyright 2024. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Footer;