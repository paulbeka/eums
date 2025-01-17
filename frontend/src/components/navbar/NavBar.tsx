import React, { useEffect, useState } from "react";
import "./NavBar.css";
import { Link } from "react-router-dom";
import { FaBagShopping } from "react-icons/fa6";
import { BrowserView, MobileView } from "react-device-detect";

const NavBar: React.FC<{ 
  currentPage: string,
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>,
  isOpenMobile: boolean,
  setIsOpenMobile: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ currentPage, setCurrentPage, isOpenMobile, setIsOpenMobile }) => {
  
  const [navItems, setNavItems] = useState([
    { path: '/about', text: 'About Us'},
    { path: '/contact', text: 'Contact'}
  ]);

  // todo: use redux instead of getItem("access_item")
  useEffect(() => {
    if (localStorage.getItem("access_token")?.length) {
      setNavItems(prevItems => {
        const newItems = [
          { path: '/article-manager', text: "Manage Articles" },
          { path: '/article-poster', text: 'Post Article' }
        ];
        
        const paths = prevItems.map(item => item.path);
        const filteredNewItems = newItems.filter(item => !paths.includes(item.path));
  
        return [...prevItems, ...filteredNewItems];
      });
    }
  }, []);

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
          <Link to="/" target="_blank" style={{ marginRight: "1em" }}>
            <FaBagShopping color="white" size={25} />
          </Link>
        </div>
      </div>
      <div className="navlogo-container">
        {/* <img src="/images/eumadesimplelogo.svg" style={{ width: "100%" }}/> */}
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
