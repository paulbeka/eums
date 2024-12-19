import React, { useEffect, useState } from "react";
import "./NavBar.css";
import { Link } from "react-router-dom";
import { FaBagShopping } from "react-icons/fa6";

const NavBar: React.FC<{ 
  currentPage: string,
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>
}> = ({ currentPage, setCurrentPage }) => {
  
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

  const renderLanguageSelector = () => {
    return (
      <select name="languages" className="language-selector">
        <option value="english">English</option>
        <option value="french">French</option>      
      </select>
    );
  };

  return (
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
          <Link to="/" style={{ marginRight: "1em" }}>
            <FaBagShopping color="white" />
          </Link>
          {renderLanguageSelector()}
        </div>
      </div>
      <div className="navlogo-container">

      </div>
    </div>
  );
}

export default NavBar;
