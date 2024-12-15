import React from "react";
import "./NavBar.css"
import { Link } from "react-router-dom";
import { FaBagShopping } from "react-icons/fa6";


const NavBar: React.FC<{ 
  currentPage: string,
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>
 }> = ({ currentPage, setCurrentPage }) => {
  
  const navItems = [
    { path: '/about', text: 'About Us'},
    { path: '/contact', text: 'Contact'}
  ]

  const renderLanguageSelector = () => {
    return (
      <select name="languages" className="language-selector">
        <option value="english">English</option>
        <option value="french">French</option>      
      </select>
    )
  }

  return (
    <div className="navbar">
      <div className="navlink-container">
        <div className="left-content">
          <Link onClick={() => setCurrentPage("")} to="/" className="text-nav nav-img-container">
            <img className="navbar-logo" src="/images/navbar_logo.png" />
          </Link>
          {navItems.map(item => 
            <Link to={item.path} onClick={() => setCurrentPage(item.text)} className="text-nav">
              <span className={`${currentPage === item.text ? "bold-text-nav" : ""}`}>{item.text}</span>
            </Link>
          )}
        </div>
        <div className="right-content">
          <Link to="/" style={{"marginRight": "1em"}}>
            <FaBagShopping color="white" />
          </Link>
          {renderLanguageSelector()}
        </div>
      </div>
    </div>
  )
}

export default NavBar;