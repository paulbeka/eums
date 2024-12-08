import React from "react";
import "./NavBar.css"
import { Link } from "react-router-dom";

const NavBar: React.FC<{ 
  currentPage: string,
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>
 }> = ({ currentPage, setCurrentPage }) => {
  
  const navItems = [
    { path: '', text: 'HOME'},
    { path: '/articles', text: 'ARTICLES'},
    { path: '/videos', text: 'VIDEOS'},
    { path: '/contact', text: 'CONTACT US'}
  ]

  return (
    <div className="navbar">
      <div className="navlink-container">
        {navItems.map(item => 
          <Link to={item.path} onClick={() => setCurrentPage(item.text)} className="text-nav">
            <span className={`${currentPage === item.text.toLowerCase() ? "bold-text-nav" : ""}`}>{item.text}</span>
          </Link>
        )}
      </div>
    </div>
  )
}

export default NavBar;