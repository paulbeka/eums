import React from "react";
import { Outlet } from "react-router-dom";


const BasePage = () => {
  return (
    <div className="main-container">
      <Outlet />
    </div>
  )
}

export default BasePage;