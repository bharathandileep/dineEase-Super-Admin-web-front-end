import React from "react";
import { Container, Row, Col } from "react-bootstrap";
// import { FaRegCheckCircle } from 'react-icons/fa';
import "./AboutUs.scss";
import { PiStarFourFill } from "react-icons/pi";

import image1 from "../../assets/images/About Us Image 1.png";
import image2 from "../../assets/images/About Us Image 3.png";
import image3 from "../../assets/images/About Us Image 3.png";
import { FaRegCheckCircle } from "react-icons/fa";

const AboutUs: React.FC = () => {
  const blocks = [
    {
      title: "Making a daily meal plan",
      description:
        "Lorem ipsum dolor sit amet consectetur. Facilisis facilisis non in arcu malesuada ipsum leo eget. Consequat incididunt varius id dictum. Ac convallis scelerisque porta mi amet ut eleifend id viverra.",
      image: image3,
      points: [
        "Best service and fast response",
        "Userfriendly app",
        "Professional staff",
      ],
    },
    {
      title: "Pre-order Food Here",
      description:
        "Lorem ipsum dolor sit amet consectetur. Facilisis facilisis non in arcu malesuada ipsum leo eget. Consequat incididunt varius id dictum. Ac convallis scelerisque porta mi amet ut eleifend id viverra.",
      image: image1,
      points: [
        "Best service and fast response",
        "Userfriendly app",
        "Professional staff",
      ],
    },
    {
      title: "Fresh Food Delivery",
      description:
        "Lorem ipsum dolor sit amet consectetur. Facilisis facilisis non in arcu malesuada ipsum leo eget. Consequat incididunt varius id dictum. Ac convallis scelerisque porta mi amet ut eleifend id viverra.",
      image: image2,
      points: [
        "Best service and fast response",
        "Userfriendly app",
        "Professional staff",
      ],
    },
  ];

  return (
    <Container fluid className="about-us-section">
      <Row className="justify-content-center mb-2 mb-md-2">
        <Col xs="auto">
          <Row className="about-us-button">
            <Col className="d-flex align-items-center">
              <PiStarFourFill className="me-2" />
              <span>About Us</span>
            </Col>
          </Row>
        </Col>
      </Row>
      <h2 className="text-center about-us-title mb-md-5">About DineEas Apps</h2>
      {blocks.map((block, index) => (
        <Row
          key={index}
          className={`about-us-block mb-4 mb-md-5 g-1 g-md-4 align-items-center ${
            index === 1 ? "flex-md-row-reverse flex-column-reverse" : ""
          }`}
        >
          <Col
            xs={12}
            md={6}
            lg={5}
            className={`text-content ${
              index === 1 ? "order-2 order-md-1" : ""
            }`}
          >
            <h3 className="block-title">{block.title}</h3>
            <p className="block-description">{block.description}</p>
            <ul className="block-points">
              {block.points.map((point, i) => (
                <li key={i} className="point-item">
                  <FaRegCheckCircle className="checkmark" />
                  <span className="point-text">{point}</span>
                </li>
              ))}
            </ul>
          </Col>
          <Col
            xs={12}
            md={6}
            lg={5}
            className={`image-content ${
              index === 1 ? "order-1 order-md-2" : ""
            }`}
          >
            <div className="image-wrapper">
              <img
                src={block.image}
                alt={block.title}
                className="block-image"
              />
            </div>
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default AboutUs;
