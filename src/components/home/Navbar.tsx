import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo-dark.png";
import { FiMenu } from "react-icons/fi";

const NavbarComponent: React.FC = () => {
  const navigate = useNavigate();
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
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
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("home");
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
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("about");
              }}
              className="nav-link-custom"
            >
              About Us
            </Nav.Link>
            <Nav.Link
              href="#contactus"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contactus");
              }}
              className=""
            >
              Contact Us
            </Nav.Link>
          </Nav>
          <div className="d-flex justify-content-center justify-content-lg-end">
            <Button
              className="rounded-pill sign-in-btn"
              variant="primary"
              onClick={() => navigate("/auth/signin-signup")}
            >
              SIGN IN
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
