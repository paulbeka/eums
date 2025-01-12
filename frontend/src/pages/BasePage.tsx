import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/navbar/NavBar";
import Footer from "../components/footer/Footer";
import { isMobile } from 'react-device-detect';
import Hamburger from 'hamburger-react'


const BasePage = () => {

  const [currentPage, setCurrentPage] = useState<string>("HOME");
  const [navbarOpenMobile, setNavbarOpenMobile] = useState(!isMobile);

  const [pageTitle, setPageTitle] = useState('EUMS');
  const [pageDescription, setPageDescription] = useState("Welcome to my professional website! I'm Paul Bekaert, and here you can explore my CV, skills, and past experience. Dive into my React-based portfolio to see my work in action and learn more about my qualifications.");

  useEffect(() => {

  }, []);

  return (
    <div className="main-container">
      <NavBar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        isOpenMobile={navbarOpenMobile}
        setIsOpenMobile={setNavbarOpenMobile}
      />
      <div>
        {isMobile ? 
          <div style={{"position":"fixed", "margin":"1em", "zIndex":"99"}}>
            <Hamburger toggled={navbarOpenMobile} toggle={setNavbarOpenMobile} aria-label="sidebar open button" />
          </div>:
        <></>}
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default BasePage;