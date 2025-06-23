import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./CoverflowSlider.scss";

// Import images directly in the component
import carouselImage1 from '../../assets/images/SliderImage1.png';
import carouselImage2 from '../../assets/images/SliderImage2.png';
import carouselImage3 from '../../assets/images/SliderImage3.png';
import carouselImage4 from '../../assets/images/SliderImage4.png';
import carouselImage5 from '../../assets/images/SliderImage5.png';

interface CoverflowSliderProps {
  autoSlide?: boolean;
  slideInterval?: number;
}

const CoverflowSlider: React.FC<CoverflowSliderProps> = ({ 
  slideInterval = 3000 
}) => {
  const images = [
    carouselImage1,
    carouselImage2,
    carouselImage3,
    carouselImage4,
    carouselImage5,
  ];

  const [currentIndex, setCurrentIndex] = useState<number>(
    Math.floor(images.length / 2)
  );
  const [screenSize, setScreenSize] = useState<string>('');

  // Detect screen size for additional logic if needed
  const getScreenSize = useCallback(() => {
    const width = window.innerWidth;
    if (width < 320) return 'xs';
    if (width < 481) return 'sm';
    if (width < 768) return 'md';
    if (width < 1024) return 'lg';
    return 'xl';
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setScreenSize(getScreenSize());
    };

    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getScreenSize]);

  // Auto-slide functionality
  useEffect(() => {

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, slideInterval);

    return () => clearInterval(interval);
  }, [images.length, slideInterval ]);

  return (
    <Container fluid className="d-flex justify-content-center coverflow-container md-pt-5">
      <Row className="w-100 d">
        <Col className="d-flex flex-column align-items-center">
          <div 
            className="coverflow"
          >
            {images.map((image, index) => {
              // Calculate the raw offset
              let offset = index - currentIndex;
              // Adjust offset for looping
              if (offset < -Math.floor(images.length / 2)) {
                offset += images.length;
              } else if (offset > Math.floor(images.length / 2)) {
                offset -= images.length;
              }
              
              const style = {
                zIndex: 5 - Math.abs(offset),
                opacity: Math.max(0.3, 2 - Math.abs(offset) * 0.6),
              };

              return (
                <div
                  key={index}
                  className={`coverflow-item ${offset === 0 ? 'center' : ''}`}
                  style={style}
                  data-offset={offset}
                >
                  <img 
                    src={image} 
                    alt={`Slide ${index + 1}`}
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CoverflowSlider;