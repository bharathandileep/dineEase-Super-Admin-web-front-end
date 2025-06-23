import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./WhyChooseUs.scss";
import MedalIcon from "../../assets/images/Medal Icon.png";
import RocketIcon from "../../assets/images/Rocket Icon.png";
import RewardIcon from "../../assets/images/Reward Icon.png";
import MobileIcon from "../../assets/images/Mobile Icon.png";

const WhyChooseUs = () => {
  // Array of cards with placeholder icon paths
  const cards = [
    {
      icon: MedalIcon,
      title: "Quality Food",
      description:
        "Contrary to popular belief, Lorem Ipsum is not simply random text",
    },
    {
      icon: RocketIcon,
      title: "Quality Food",
      description:
        "Contrary to popular belief, Lorem Ipsum is not simply random text",
    },
    {
      icon: RewardIcon,
      title: "Quality Food",
      description:
        "Contrary to popular belief, Lorem Ipsum is not simply random text",
    },
    {
      icon: MobileIcon,
      title: "Quality Food",
      description:
        "Contrary to popular belief, Lorem Ipsum is not simply random text",
    },
  ];

  return (
    <Container className="why-choose-us-section">
      <Row className="justify-content-center">
        <h2 className="why-choose-us-heading text-center mb-3">
          Why Choose DineEas?
        </h2>
        <p className="why-choose-us-subheading text-center mb-4">
          500+ product-led organizations get stuff done with DineEas
        </p>
      </Row>
      <Row className="justify-content-center">
        {cards.map((card, index) => (
          <Col key={index} xs={12} md={3} className="mb-4">
            <div className="why-choose-us-card text-center">
              <img
                src={card.icon}
                alt={card.title}
                className="why-choose-us-icon mb-3"
              />
              <h5 className="why-choose-us-card-title mb-2">{card.title}</h5>
              <p className="why-choose-us-card-description mb-3">
                {card.description}
              </p>
              <a href="#" className="why-choose-us-learn-more fw-bold">
                Learn More
              </a>
            </div>
          </Col>
        ))}
      </Row>

      <Row className="justify-content-center">
        {cards.map((card, index) => (
          <Col key={index} xs={12} md={3} className="mb-4">
            <div className="why-choose-us-card text-center">
              <img
                src={card.icon}
                alt={card.title}
                className="why-choose-us-icon mb-3"
              />
              <h5 className="why-choose-us-card-title mb-2">{card.title}</h5>
              <p className="why-choose-us-card-description mb-3">
                {card.description}
              </p>
              <a href="#" className="why-choose-us-learn-more fw-bold">
                Learn More
              </a>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default WhyChooseUs;
