import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo-light.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { userLoggedIn, user, loading } = useSelector(
    (state: RootState) => state.Auth
  );
  console.log(userLoggedIn, user,loading,"dd")
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="DineEas Logo" height="40" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>
            {!userLoggedIn && !user ? (
              <li className="nav-item ms-2">
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={() => navigate("/auth/signin-signup")}
                >
                  Login
                </button>
              </li>
            ) : (
              <li className="nav-item ms-2">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/user/dashboard")}
                >
                  Dashboard
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
