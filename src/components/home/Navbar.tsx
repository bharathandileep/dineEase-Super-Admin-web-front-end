import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Dropdown,
  Image,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo-dark.png";
import { FiMenu } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { FaUserCircle } from "react-icons/fa";
import LogoutModal from "../LogoutModal";
import profilePlaceHolder from "../../assets/images/users/profileplaceholder.png";

const NavbarComponent: React.FC = () => {
  const navigate = useNavigate();
  const { userLoggedIn, user, loading } = useSelector(
    (state: RootState) => state.Auth
  );


  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleCloseLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <Navbar
        expand="lg"
        className="py-2 fixed-top"
        style={{
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Container fluid className="px-3 px-md-5">
          <Navbar.Brand
            href="#home"
            className="me-auto"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home");
            }}
          >
            <img src={logo} alt="DineEas Logo" className="navbar-logo" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav">
            <FiMenu size={24} />
          </Navbar.Toggle>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto d-flex gap-2 gap-lg-4 mb-2 mb-lg-0">
              <Nav.Link
                as={Link}
                to="/#home"
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault();
                    scrollToSection("home");
                  }
                }}
                className="nav-link-custom"
              >
                Home
              </Nav.Link>
              <Nav.Link
                href="#preorder"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("preorder");
                }}
                className="nav-link-custom"
              >
                Pre Order
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/#about"
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault();
                    scrollToSection("about");
                  }
                }}
                className="nav-link-custom"
              >
                About Us
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/#contactus"
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault();
                    scrollToSection("contactus");
                  }
                }}
                className="nav-link-custom"
              >
                Contact Us
              </Nav.Link>
            </Nav>
            <div className="d-flex justify-content-center justify-content-lg-end">
              {userLoggedIn ? (
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="light"
                    id="dropdown-profile"
                    className="d-flex align-items-center gap-2 bg-transparent border-0"
                  >
                    {user?.profile_photo ? (
                      <>
                        <Image
                          src={user?.profile_photo}
                          roundedCircle
                          width={32}
                          height={32}
                          alt="Profile"
                        />
                      </>
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white"
                        style={{ width: "32px", height: "32px" }}
                      >
                        <span className="fw-bold">
                          {user?.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="d-none d-lg-inline">
                      {user?.fullName || "Profile"}
                    </span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/user/profile/123">
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => setShowLogoutModal(true)}>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Button
                  className="rounded-pill sign-in-btn"
                  variant="primary"
                  onClick={() => navigate("/auth")}
                >
                  SIGN IN
                </Button>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <LogoutModal
        showLogoutModal={showLogoutModal}
        onHide={handleCloseLogout}
      />
    </>
  );
};

export default NavbarComponent;
