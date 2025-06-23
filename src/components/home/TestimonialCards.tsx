import React, { useEffect, useRef, useState } from 'react';
import { Container, Card } from 'react-bootstrap';
import "./TestimonialCards.scss";
import {PiStarFourFill}  from 'react-icons/pi';


interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  text: string;
}

interface TestimonialCardsProps {
  testimonials?: Testimonial[];
}

const TestimonialCards: React.FC<TestimonialCardsProps> = ({ testimonials }) => {
  const defaultTestimonials: Testimonial[] = [
    {
      id: 1,
      name: "Putriana Sari",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "I really like this DineEas app because it's incredibly convenient. I can make payments with just a few taps on my phone. It's very user-friendly, even for people who aren't very tech-savvy."
    },
    {
      id: 2,
      name: "Farhan Ibrahim",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "I feel secure using this DineEas app. They have multiple layers of security, including two-factor authentication, so I never worry about my data or money being compromised."
    },
    {
      id: 3,
      name: "Rizky Firmansyah",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "I once encountered an issue with my transaction, but the customer support team from this DineEas app was extremely helpful. They quickly resolved my problem and provided clear guidance."
    },
    {
      id: 4,
      name: "Melati Wulandari",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "This DineEas app isn't limited to just one payment method. They support various methods, including credit cards, debit cards, and bank transfers, so I can choose the most convenient way for me."
    },
    {
      id: 5,
      name: "Ahmad Rizal",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "The transaction history feature is really helpful for tracking my expenses. I can easily see where my money goes and manage my budget better."
    },
    {
      id: 6,
      name: "Siti Nurhaliza",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Fast and reliable service! I've never experienced any downtime, and transactions are processed instantly. Perfect for my daily needs."
    },
    {
      id: 7,
      name: "Budi Santoso",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "The loyalty rewards program is amazing! I earn points with every transaction and can redeem them for various benefits. Great value for money."
    },
    {
      id: 8,
      name: "Diana Putri",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Customer service is top-notch. Whenever I have questions, they respond quickly and professionally. Makes me feel valued as a customer."
    },
  ];

  const testimonialsData = testimonials || defaultTestimonials;
  const rowRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  useEffect(() => {
    if (isPaused) return; 

    const interval = setInterval(() => {
      if (rowRef.current && !isPaused) {
        const totalWidth = rowRef.current.scrollWidth / 2;
        const currentPosition = Math.abs(rowRef.current.getBoundingClientRect().x);
        
        if (currentPosition >= totalWidth) {
          rowRef.current.style.transition = 'none';
          rowRef.current.style.transform = 'translateX(0)';
          void rowRef.current.offsetWidth;
          rowRef.current.style.transition = 'transform linear';
        }
      }
    }, 20);

    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    if (rowRef.current) {
      rowRef.current.style.animationPlayState = isPaused ? 'paused' : 'running';
    }
  }, [isPaused]);

  const handleCardClick = () => {
    setIsPaused(prev => !prev);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : 'empty'}`}>
        ★
      </span>
    ));
  };

  const duplicatedTestimonials = [...testimonialsData, ...testimonialsData];

  return (
      <Container className="testimonial-section ">
        <div className="text-center mb-5">
          <div className="testimonial-badge">
            <div className="testimonial-icon me-2">
                <PiStarFourFill/>
            </div>
            Testimonial
          </div>
          <h2 className="testimonial-title pb-2">
            What Our Happy User Says
          </h2>
        </div>
        <div className="testimonial-carousel py-3">
          <div
            ref={rowRef}
            className="testimonial-row"
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <div key={`${testimonial.id}-${index}`} className="testimonial-card-wrapper">
                <Card 
                  className={`testimonial-card ${isPaused ? 'paused' : ''}`}
                  onClick={handleCardClick}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body className="d-flex flex-column">
                    <div className="testimonial-content flex-grow-1 mb-4">
                      <p className="testimonial-text">"{testimonial.text}"</p>
                    </div>
                    <div className="testimonial-footer mt-auto">
                      <div className="d-flex align-items-center">
                        <div className="avatar-container me-3">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="avatar"
                          />
                        </div>
                        <div className="user-info">
                          <h6 className="user-name">{testimonial.name}</h6>
                          <div className="rating">
                            {renderStars(testimonial.rating)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </Container>

  );
};

export default TestimonialCards;