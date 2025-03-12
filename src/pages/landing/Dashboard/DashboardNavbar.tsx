import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./DashboardNavbar.css";
import dashlogo from "../../../assets/images/logo-dark.png";

const DashboardNavbar = () => {
  const location = useLocation();
  return (
    <nav className="dashboard-navbar">
      <div className="dashboard-navbar-logo">
        <Link to="/">
          <img src={dashlogo} alt="DineEas Logo"/>
        </Link>
      </div>
      <div className="dashboard-navbar-links"> 
        <Link 
          to="/user/dashboard"
          className={location.pathname === '/user/dashboard' ? 'active' : ''}
        >
          Home
        </Link>
        <Link 
          to="/dashboard/organization-list"
          className={location.pathname === '/dashboard/organization' ? 'active' : ''}
        >
          My Organization
        </Link>
        <Link 
          to="/dashboard/kitchen-list"
          className={location.pathname === '/dashboard/kitchen' ? 'active' : ''}
        >
          My Kitchen
        </Link>
        <Link 
          to="/auth/logout"
          className={location.pathname ==='/auth/logout' ? 'active' : ''}
        >
          Logout
        </Link>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
