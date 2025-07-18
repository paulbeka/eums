import React from "react";
import "./NavBar.css";
import { Link } from "react-router-dom";
import { FaBagShopping } from "react-icons/fa6";
import { BrowserView, MobileView } from "react-device-detect";
import { useAuth } from "../auth/AuthContext";
import { getProfileName } from "../util_tools/Util";
import { useTranslation } from "react-i18next";
import path from "path";

const NavBar: React.FC<{ 
  currentPage: string,
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>,
  isOpenMobile: boolean,
  setIsOpenMobile: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ currentPage, setCurrentPage, isOpenMobile, setIsOpenMobile }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { t } = useTranslation();
  
  const navItems = isAuthenticated
  ? (isAdmin ? [
      { path: '/', text: 'navbar.home' },
      { path: '/about', text: 'navbar.aboutus' },
      { path: '/contact', text: 'navbar.contact' },
      { path: '/newsletter-signup', text: 'navbar.newsletter' },
      { path: '/article-manager', text: "navbar.managearticles" },
      { path: '/article-poster', text: 'navbar.postarticle' },
      { path: '/admin-user-management', text: 'navbar.usermanagement' }
    ] : [
      { path: '/', text: 'navbar.home' },
      { path: '/about', text: 'navbar.aboutus' },
      { path: '/contact', text: 'navbar.contact' },
      { path: '/newsletter-signup', text: 'navbar.newsletter' },
      { path: '/article-manager', text: "navbar.managearticles" },
      { path: '/article-poster', text: 'navbar.postarticle' }
    ])
  : [
      { path: '/', text: 'navbar.home' },
      { path: '/about', text: 'navbar.aboutus' },
      { path: '/contact', text: 'navbar.contact' },
      { path: '/newsletter-signup', text: 'navbar.newsletter' },
    ];

  const mobileHandleClick = (item: {path: string, text: string}) => {
    setCurrentPage(item.text);
    setIsOpenMobile(false);
  }
 
  return (<>
    <BrowserView>
    <div className="navbar" style={{ backgroundImage: 'url(/images/navbar-background.svg)' }}>
      <div className="navlink-container">
        <div className="left-content">
          <Link onClick={() => setCurrentPage("")} to="/" className="text-nav nav-img-container">
            <img className="navbar-logo" src="/images/navbar_logo.png" alt={t('navbar.home')} />
          </Link>
          {navItems.map((item, index) => (
            <Link key={index} to={item.path} onClick={() => setCurrentPage(item.text)} className="text-nav">
              <span className={`${currentPage === item.text ? "bold-text-nav" : ""}`}>{t(item.text)}</span>
            </Link>
          ))}
        </div>
        <div className="right-content">
          {isAuthenticated &&
            <Link to={`/profile/${getProfileName()}`} className="navbar-profile-icon-container">
              <img 
                className="navbar-profile-icon"
                height="30"
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" 
                alt={t('navbar.usermanagement')}
              />
            </Link>
          }
          <Link to="https://www.youtube.com/@EUMadeSimple/store" target="_blank" style={{ marginRight: "1em" }}>
            <FaBagShopping color="white" size={25} />
          </Link>
        </div>
      </div>
    
    </div>
    </BrowserView>
    <MobileView>
      <div className={`mobile-navbar-container ${isOpenMobile ? "active" : ""}`}>
        <img className="navbar-logo-mobile" src="/images/navbar_logo.png" alt={t('navbar.home')} />
        <div className="mobile-navbar-link-container">
          {[{path: '/', text: "navbar.home"}, ...navItems].map((item, index) => (
              <Link key={index} to={item.path} onClick={() => mobileHandleClick(item)} className="text-nav-mobile">
                <span className={`${currentPage === item.text ? "bold-text-nav-mobile" : ""} text-nav-mobile`}>{t(item.text)}</span>
              </Link>
            ))}
        </div>
      </div>
    </MobileView>
    </>
  );
}

export default NavBar;
