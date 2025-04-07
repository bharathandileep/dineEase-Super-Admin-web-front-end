import React from "react";
import "./LandingPage.css";
import logo from "../../assets/images/logo-light.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "./Navbar";
import Slider from "react-slick";
import axios from "axios";

function index() {
  const testimonialSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  const demo = async () => {
    const response = await axios.post(
      "http://localhost:5000/api/v1/auth/new/access-token"
    );
    console.log(response.data);
  };
  const testimonials = [
    {
      text: "DineEas transformed our cafeteria operations. The efficiency gains are remarkable.",
      author: "John Smith",
      position: "University Dining Services",
    },
    {
      text: "The analytics provided by DineEas helped us optimize our menu and reduce waste significantly.",
      author: "Sarah Johnson",
      position: "Corporate Cafeteria Manager",
    },
    {
      text: "Implementation was smooth and the results were immediate. Highly recommended!",
      author: "Michael Brown",
      position: "School District Food Service Director",
    },
    {
      text: "Our students love the reduced waiting times and modern ordering experience.",
      author: "Emily Davis",
      position: "College Dining Hall Manager",
    },
  ];
  return (
    <div className="landing-page">
      <Navbar />

      <section className="hero-section d-flex align-items-center text-white text-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-4 text-white">
                Transform Your Cafeteria Experience
              </h1>
              <p className="lead mb-4 text-white">
                Elevate your dining operations with smart management, real-time
                analytics, and seamless ordering systems
              </p>
              <button
                className="btn btn-primary btn-lg rounded-pill px-5"
                onClick={demo}
              >
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-white">
        <div className="container">
          <h2 className="text-center mb-5">Why Choose DineEas</h2>
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <h3 className="h5">Smart Queue Management</h3>
                  <p className="card-text">
                    Reduce waiting times by up to 60% with our intelligent queue
                    management system
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <h3 className="h5">Inventory Control</h3>
                  <p className="card-text">
                    Real-time tracking and automated reordering to prevent
                    stockouts
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <h3 className="h5">Digital Menu Boards</h3>
                  <p className="card-text">
                    Dynamic menu displays with real-time updates and nutritional
                    information
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <h3 className="h5">Analytics Dashboard</h3>
                  <p className="card-text">
                    Comprehensive insights into sales, customer preferences, and
                    operations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-5">What Our Clients Say</h2>
          <div className="testimonials-slider">
            <Slider {...testimonialSettings}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="px-3">
                  <div className="card shadow-sm">
                    <div className="card-body text-center p-4">
                      <p className="lead mb-3">{testimonial.text}</p>
                      <h4 className="h6 mb-1">- {testimonial.author}</h4>
                      <small className="text-muted">
                        {testimonial.position}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      <section className="about-section text-white py-5">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="mb-4">About Us</h2>
              <p className="lead mb-5">
                DineEas is your ultimate solution for modern cafeteria
                management. We streamline operations, minimize waiting times,
                and enhance the dining experience.
              </p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="p-4 rounded bg-white bg-opacity-10">
                <i className="fas fa-cogs h2 text-warning"></i>
                <h3 className="h4 mt-3">Smart Management</h3>
                <p>Efficient order processing and inventory management.</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-4 rounded bg-white bg-opacity-10">
                <i className="fas fa-chart-line h2 text-warning"></i>
                <h3 className="h4 mt-3">Real-time Analytics</h3>
                <p>Make data-driven decisions with our powerful analytics.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-white">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <h2 className="text-center mb-4">Contact Us</h2>
              <form className="needs-validation">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Your Email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Your Message"
                    required
                  ></textarea>
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <img
                src={logo}
                alt=""
                className="mb-3"
                style={{ maxWidth: "290px" }}
              />
              <p>Revolutionizing Cafeteria Management</p>
            </div>
            <div className="col-md-4">
              <div className="d-flex flex-column gap-2">
                <a href="#home" className="text-white text-decoration-none">
                  Home
                </a>
                <a href="#features" className="text-white text-decoration-none">
                  Features
                </a>
                <a href="#about" className="text-white text-decoration-none">
                  About
                </a>
                <a href="#contact" className="text-white text-decoration-none">
                  Contact
                </a>
              </div>
            </div>
            <div className="col-md-4">
              <p>Email: info@dineas.com</p>
              <p>Phone: (555) 123-4567</p>
            </div>
          </div>
          <div className="text-center border-top border-secondary mt-4 pt-4">
            <p className="mb-0">&copy; 2024 DineEas. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default index;
