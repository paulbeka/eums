import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/navbar/NavBar";
import Footer from "../components/footer/Footer";

const BasePage = () => {

  const [currentPage, setCurrentPage] = useState<string>("HOME");

  return (
    <div className="main-container">
      <NavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <Outlet />
      <Footer />
    </div>
  )
}

export default BasePage;