import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/navbar/NavBar";
import Footer from "../components/footer/Footer";
import { isMobile } from 'react-device-detect';
import Hamburger from 'hamburger-react'
import { useAuth } from "../components/auth/AuthContext";
import { UserProfile } from "./Profile";
import { getUserData } from "../components/api/Api";
import { Link } from "react-router-dom";
import "./CSS/BasePage.css";
import { getProfileName } from "../components/util_tools/Util";


const BasePage = () => {
  const { isAuthenticated } = useAuth();
  const username = getProfileName();

  const [currentPage, setCurrentPage] = useState<string>("HOME");
  const [navbarOpenMobile, setNavbarOpenMobile] = useState(!isMobile);

  const [userData, setUserData] = useState<UserProfile | null>(null);
  
  useEffect(() => {
    if (username) {
      getUserData(username).then((data: UserProfile) => {
        setUserData(data);
      });
    }
  }, [username]);

  return (
    <div className="main-container">
      <NavBar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        isOpenMobile={navbarOpenMobile}
        setIsOpenMobile={setNavbarOpenMobile}
      />
      <div style={{ maxWidth: "1800px", margin: "0 auto", paddingTop: isMobile ? "10px" : "80px"}}>
        {isMobile ?  <>
          <div style={{"position":"fixed", "margin":"1em", "zIndex":"99"}}>
            <Hamburger toggled={navbarOpenMobile} toggle={setNavbarOpenMobile} aria-label="sidebar open button" />
          </div>
          {isAuthenticated ? <Link to={`/profile/${username}`} className="profile-picture-container">
            <img
              src={userData?.profilePicture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
              alt="Profile"
              className="mobile-base-profile-picture"
            />          
          </Link> : <></>}
          </>:
        <></>}
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default BasePage;
