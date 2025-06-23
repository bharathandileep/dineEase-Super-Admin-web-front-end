import React from "react";
import { Container, Row, Col, Accordion } from "react-bootstrap";
import "./Footer.scss";
// import { FaDribbble, FaLinkedin, FaTwitter } from "react-icons/fa";
import playstore from "../../assets/images/PlayStore.png";
import appstore from "../../assets/images/AppStore.png";
import logo from "../../assets/images/logo-dark.png";
import { FaDribbble, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <div className="footer-section">
      {/* Mobile View Layout */}
      <div className="d-block d-md-none">
        {/* Logo */}
        <Row className="logo-row mb-4 justify-content-center">
          <Col xs={12} className="text-center">
            <img
              src="src/assets/DineEas Logo Text.png"
              alt="DineEas Logo"
              className="footer-logo mb-4"
            />
          </Col>
        </Row>

        {/* Accordions for Navigation */}
        <Row className="mb-4">
          <Col xs={12}>
            <Accordion defaultActiveKey="">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Menu 1</Accordion.Header>
                <Accordion.Body>
                  <p className="nav-subitem">Sub menu 1</p>
                  <p className="nav-subitem">Sub menu 1</p>
                  <p className="nav-subitem">Sub menu 1</p>
                  <p className="nav-subitem">Sub menu 1</p>
                  <p className="nav-subitem">Sub menu 1</p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Company</Accordion.Header>
                <Accordion.Body>
                  <p className="nav-subitem">Sub menu 1</p>
                  <p className="nav-subitem">Sub menu 1</p>
                  <p className="nav-subitem">Sub menu 1</p>
                  <p className="nav-subitem">Sub menu 1</p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>Company</Accordion.Header>
                <Accordion.Body>
                  <p className="nav-subitem">Sub menu 1</p>
                  <p className="nav-subitem">Sub menu 1</p>
                  <p className="nav-subitem">Sub menu 1</p>
                  <p className="nav-subitem">Sub menu 1</p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>Support</Accordion.Header>
                <Accordion.Body>
                  <p className="nav-subitem">Help Center</p>
                  <p className="nav-subitem">Help Center</p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>

        {/* Download Buttons */}
        <Row className="mb-4 justify-content-center">
          <Col xs={12} className="app-buttons text-center">
            <a href="" rel="noopener noreferrer">
              <img src={appstore} alt="App Store" className="app-badge" />
            </a>
            <a href="" rel="noopener noreferrer">
              <img src={playstore} alt="Google Play" className="app-badge" />
            </a>
          </Col>
        </Row>

        {/* Horizontal Division */}
        <Row>
          <Col>
            <hr className="footer-divider" />
          </Col>
        </Row>

        {/* Copyright and Links */}
        <Row className="footer-bottom mt-4 mb-5 pb-5">
          <Col xs={12} className="copyright-text text-center">
            <span>© 2025 DineEas. All rights reserved.</span>
          </Col>
          <Col xs={12} className="links-text text-center mt-2">
            <span>Terms & Conditions | Privacy Policy</span>
          </Col>
          <Col xs={12} className="text-center mt-2">
            <a href="" rel="noopener noreferrer" className="me-3">
              <FaTwitter />
            </a>
            <a href="" rel="noopener noreferrer" className="me-3">
              <FaDribbble />
            </a>
            <a href="" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
          </Col>
        </Row>
      </div>

      {/* Desktop View Layout */}
      <div className="d-none d-md-block">
        <Row className="logo-row mb-4">
          <Col xs={3}>
            <img src={logo} alt="DineEas Logo" className="footer-logo mb-4" />
            <Row>
              <Col xs={12} md={4} className="app-buttons">
                <a href="" rel="noopener noreferrer">
                  <img src={appstore} alt="App Store" className="app-badge" />
                </a>
                <a href="" rel="noopener noreferrer">
                  <img
                    src={playstore}
                    alt="Google Play"
                    className="app-badge"
                  />
                </a>
              </Col>
            </Row>
          </Col>
          <Col>
            <Row className="nav-row mb-4">
              <Col xs={3} md={2}>
                <p className="nav-heading mb-1">Menu 1</p>
                <p className="nav-subitem">Sub menu 1</p>
                <p className="nav-subitem">Sub menu 1</p>
                <p className="nav-subitem">Sub menu 1</p>
                <p className="nav-subitem">Sub menu 1</p>
                <p className="nav-subitem">Sub menu 1</p>
              </Col>
              <Col xs={3} md={2}>
                <p className="nav-heading mb-1">Company</p>
                <p className="nav-subitem">Sub menu 1</p>
                <p className="nav-subitem">Sub menu 1</p>
                <p className="nav-subitem">Sub menu 1</p>
                <p className="nav-subitem">Sub menu 1</p>
              </Col>
              <Col xs={3} md={2}>
                <p className="nav-heading mb-1">Company</p>
                <p className="nav-subitem">Sub menu 1</p>
                <p className="nav-subitem">Sub menu 1</p>
                <p className="nav-subitem">Sub menu 1</p>
                <p className="nav-subitem">Sub menu 1</p>
              </Col>
              <Col xs={3} md={2}>
                <p className="nav-heading mb-1">Support</p>
                <p className="nav-subitem">Help Center</p>
                <p className="nav-subitem">Help Center</p>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Horizontal Division */}
        <Row>
          <Col>
            <hr className="footer-divider" />
          </Col>
        </Row>

        {/* Copyright and Links Row */}
        <Row className="footer-bottom mt-4">
          <Col xs={6} className="copyright-text">
            <span>© 2025 DineEas. All rights reserved.</span>
          </Col>
          <Col xs={6} className="links-text text-end">
            <span>Terms & Conditions | Privacy Policy</span>
            <a href="" rel="noopener noreferrer" className="ms-3">
              <FaTwitter />
            </a>
            <a href="" rel="noopener noreferrer" className="ms-2">
              <FaDribbble />
            </a>
            <a href="" rel="noopener noreferrer" className="ms-2">
              <FaLinkedin />
            </a>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Footer;
