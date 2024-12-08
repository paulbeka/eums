import React from "react";
import "./NavBar.css"
import { Link } from "react-router-dom";

const NavBar: React.FC<{ 
  currentPage: string,
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>
 }> = ({ currentPage, setCurrentPage }) => {
  
  const navItems = [
    { path: '', text: 'WHO WE ARE'},
    { path: '/updates', text: 'UPDATES'},
    { path: '/votingdata', text: 'VOTING'},
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