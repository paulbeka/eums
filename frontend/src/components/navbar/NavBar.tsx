import React from "react";
import "./NavBar.css";
import { Link } from "react-router-dom";
import { FaBagShopping } from "react-icons/fa6";
import { BrowserView, MobileView } from "react-device-detect";
import { jwtDecode } from 'jwt-decode';
import { useAuth } from "../auth/AuthContext";


const NavBar: React.FC<{ 
  currentPage: string,
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>,
  isOpenMobile: boolean,
  setIsOpenMobile: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ currentPage, setCurrentPage, isOpenMobile, setIsOpenMobile }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  const navItems = isAuthenticated
  ? (isAdmin ? [
      { path: '/about', text: 'About Us' },
      { path: '/newsletter-signup', text: 'Newsletter' },
      { path: '/contact', text: 'Contact' },
      { path: '/article-manager', text: "Manage Articles" },
      { path: '/article-poster', text: 'Post Article' },
      { path: '/admin-user-management', text: 'User Management' }
    ] : [
      { path: '/about', text: 'About Us' },
      { path: '/newsletter-signup', text: 'Newsletter' },
      { path: '/contact', text: 'Contact' },
      { path: '/article-manager', text: "Manage Articles" },
      { path: '/article-poster', text: 'Post Article' }
    ])
  : [
      { path: '/about', text: 'About Us' },
      { path: '/newsletter-signup', text: 'Newsletter' },
      { path: '/contact', text: 'Contact' },
      { path: '/register', text: 'Register' },
      { path: '/login', text: 'Login' }
    ];

  const getProfileName = () => {
    if (localStorage.getItem("access_token")) {
      return jwtDecode(localStorage.getItem("access_token")!)["sub"];
    }
    return false;
  }

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
            <img className="navbar-logo" src="/images/navbar_logo.png" alt="Navbar Logo" />
          </Link>
          {navItems.map((item, index) => (
            <Link key={index} to={item.path} onClick={() => setCurrentPage(item.text)} className="text-nav">
              <span className={`${currentPage === item.text ? "bold-text-nav" : ""}`}>{item.text}</span>
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
        <img className="navbar-logo-mobile" src="/images/navbar_logo.png" alt="Navbar Logo" />
        <div className="mobile-navbar-link-container">
          {[{path: '/', text: "Home"}, ...navItems].map((item, index) => (
              <Link key={index} to={item.path} onClick={() => mobileHandleClick(item)} className="text-nav-mobile">
                <span className={`${currentPage === item.text ? "bold-text-nav-mobile" : ""} text-nav-mobile`}>{item.text}</span>
              </Link>
            ))}
        </div>
      </div>
    </MobileView>
    </>
  );
}

export default NavBar;
