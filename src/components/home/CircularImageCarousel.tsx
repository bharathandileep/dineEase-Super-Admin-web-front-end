import React, { useState, useEffect } from "react";
import "./CircularImageCarousel.scss";
import carouselImage1 from "../../assets/images/SliderImage1.png";
import carouselImage2 from "../../assets/images/SliderImage2.png";
import carouselImage3 from "../../assets/images/SliderImage3.png";
import carouselImage4 from "../../assets/images/SliderImage4.png";
import carouselImage5 from "../../assets/images/SliderImage5.png";

const CircularImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [carouselImage1, carouselImage2, carouselImage3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const getCardTransform = (index: number) => {
    const position = (index - currentIndex + images.length) % images.length;

    switch (position) {
      case 0:
        return {
          transform: "translateX(0) translateY(0) scale(1)",
          zIndex: 30,
          opacity: 1,
        };
      case 1:
        return {
          transform: "translateX(120px) translateY(10px) scale(0.85)",
          zIndex: 20,
          opacity: 0.8,
        };
      case 2:
        return {
          transform: "translateX(-120px) translateY(10px) scale(0.85)",
          zIndex: 10,
          opacity: 0.8,
        };
      default:
        return {
          transform: "translateX(0) translateY(20px) scale(0.7)",
          zIndex: 0,
          opacity: 0,
        };
    }
  };

  const handleCardClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="circular-carousel-container">
      <div className="circular-carousel-wrapper">
        {images.map((imageUrl, index) => (
          <div
            key={index}
            className="circular-carousel-card"
            style={getCardTransform(index)}
            onClick={() => handleCardClick(index)}
          >
            <div className="circular-carousel-card-inner">
              <img src={imageUrl} alt={`Image ${index + 1}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CircularImageCarousel;
