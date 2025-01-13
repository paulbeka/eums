import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/navbar/NavBar";
import Footer from "../components/footer/Footer";
import { isMobile } from 'react-device-detect';
import Hamburger from 'hamburger-react'


const BasePage = () => {

  const [currentPage, setCurrentPage] = useState<string>("HOME");
  const [navbarOpenMobile, setNavbarOpenMobile] = useState(!isMobile);

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