import React from "react";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HomePage.scss";
import logo from "../../assets/images/logo-dark.png";
import CoverflowSlider from "../../components/home/CoverflowSlider";
import TestimonialCards from "../../components/home/TestimonialCards";
import AboutUs from "../../components/home/AboutUs";
import Footer from "../../components/home/Footer";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import DeliveryIcon from "../../assets/images/DeliveryIcon.png";
import PickupIcon from "../../assets/images/PickupIcon.png";
import PreorderIcon from "../../assets/images/PreorderIcon.png";

import { FaGooglePlay } from "react-icons/fa";
import NavbarComponent from "../../components/home/Navbar";

const HomePage: React.FC = () => {
  return (
    <div className="home-page-section">
      <NavbarComponent />
      <Container id="home" fluid className="px-3 px-md-5 pt-3 page-container">
        <Row className="align-items-center md-g-4">
          <Col
            xs={12}
            md={6}
            className="order-1 order-md-1 text-center text-md-start ps-md-5"
          >
            <h6 className="hero-title-sub fs-5 fs-md-4 mb-2">
              Lorem Ipsum Lorem
            </h6>
            <h1 className="hero-title fw-bold mb-3">
              <span className="text-primary">Dine</span>
              <span className="text-warning">Eas</span>
            </h1>
            <p className="hero-description mb-2">
              Lorem ipsum dolor sit amet consectetur. Egestas velit condimentum
              curabitur et pharetra at adipiscing tincidunt ante. Nisl semper
              gravida non elit id dictum mus amet.
            </p>

            <div className="d-none d-md-flex flex-sm-row gap-3 justify-content-center justify-content-md-start pt-4">
              <Button
                className="custom-order-button rounded-pill fw-bold"
                variant="warning"
              >
                Order Now
              </Button>
              <Button
                className="custom-download-button rounded-pill fw-bold"
                variant="outline-warning"
              >
                <span>{(<FaGooglePlay className="me-2" />) as any}</span>
                Download App
              </Button>
            </div>
          </Col>
          <Col xs={12} md={6} className="order-2 order-md-2 mb-0 mb-md-0">
            <div className="slider-container">
              <CoverflowSlider />
            </div>
          </Col>
        </Row>
        <div className="sticky-button-container d-md-none ">
          <div className="d-flex flex-row gap-3 justify-content-center">
            <Button
              className="custom-order-button rounded-pill fw-bold"
              variant="warning"
            >
              Order Now
            </Button>
            <Button
              className="custom-download-button rounded-pill fw-bold"
              variant="outline-warning"
            >
              <FaGooglePlay className="me-2" />
              Download App
            </Button>
          </div>
        </div>
        <Row className="justify-content-start ps-md-5">
          <Col xs={12} lg={10} xl={8}>
            <Row className="features-container flex-nowrap">
              <Col xs={3} className="feature-item feature-item-vertical ">
                <Card className="border-0 bg-transparent text-center text-md-start">
                  <Card.Img
                    src={DeliveryIcon}
                    alt="Fast Delivery"
                    className="feature-img mx-auto mx-md-0"
                  />
                  <Card.Body className="p-0 text-white">
                    <Card.Title as="h5" className="fw-bold mb-1 ">
                      Fast Delivery
                    </Card.Title>
                    <Card.Text className="mb-0">
                      Deliver within 15 minutes
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={3} className="feature-item feature-item-vertical">
                <Card className="border-0 bg-transparent text-center text-md-start text-white">
                  <Card.Img
                    src={PickupIcon}
                    alt="Pre Order"
                    className="feature-img mx-auto mx-md-0"
                  />
                  <Card.Body className="p-0">
                    <Card.Title as="h5" className="fw-bold mb-1">
                      Pre Order
                    </Card.Title>
                    <Card.Text className="mb-0">
                      Enjoy your food fresh and healthy
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={3} className="feature-item feature-item-vertical">
                <Card className="border-0 bg-transparent text-center text-md-start">
                  <Card.Img
                    src={PreorderIcon}
                    alt="Pick up"
                    className="feature-img mx-auto mx-md-0"
                  />
                  <Card.Body className="p-0 text-white">
                    <Card.Title as="h5" className="fw-bold mb-1">
                      Pick up
                    </Card.Title>
                    <Card.Text className="mb-0">
                      Delivery at your doorstep
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <Container fluid className="">
        <WhyChooseUs />
      </Container>
      <Container fluid className="pt-1 md-pb-5">
        <TestimonialCards />
      </Container>

      {/* About Us */}

      <Container id="about" fluid className="pt-1 pb-1">
        <AboutUs />
      </Container>

      {/* Footer */}
      <Container id="contactus" fluid className="footer-container p-0">
        <Footer />
      </Container>
    </div>
  );
};

export default HomePage;
