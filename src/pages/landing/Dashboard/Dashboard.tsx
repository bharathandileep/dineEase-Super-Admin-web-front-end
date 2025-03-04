import React from "react";
import dashboardHero from "../../../assets/images/bg-landing.png";
import "./HomePage.css";
import DashboardNavbar from "./DashboardNavbar";

const Dashboard = () => {
  return (
    <>
      <div className="dashboard-navbr">
        <DashboardNavbar />
      </div>
      <div className="dashboard">
        <section className="dashboard-hero">
          <div className="hero-content">
            <h1>Welcome to Your Dashboard</h1>
            <p>
              Manage your cafeteria operations and track performance metrics
            </p>
          </div>
          <div className="hero-image">
            <img src={dashboardHero} alt="Dashboard Overview" />
          </div>
        </section>

        <section className="dashboard-overview">
          <h2>Today's Overview</h2>
          <div className="overview-grid">
            <div className="overview-card">
              <h3>Total Orders</h3>
              <p className="number">156</p>
              <span className="trend positive">+12% from yesterday</span>
            </div>
            <div className="overview-card">
              <h3>Revenue</h3>
              <p className="number">$2,450</p>
              <span className="trend positive">+8% from yesterday</span>
            </div>
            <div className="overview-card">
              <h3>Active Customers</h3>
              <p className="number">89</p>
              <span className="trend neutral">Same as yesterday</span>
            </div>
          </div>
        </section>

        <section className="dashboard-contact">
          <div className="contact-container">
            <div className="contact-header">
              <h2>Need Support?</h2>
              <p>Our team is here to assist you</p>
            </div>
            <form className="support-form">
              <div className="form-row">
                <div className="form-group">
                  <input type="text" id="name" required />
                  <label htmlFor="name">Your Name</label>
                </div>
                <div className="form-group">
                  <input type="email" id="email" required />
                  <label htmlFor="email">Email Address</label>
                </div>
              </div>
              <div className="form-group">
                <input type="text" id="subject" required />
                <label htmlFor="subject">Subject</label>
              </div>
              <div className="form-group">
                <textarea id="message" rows={5} required></textarea>
                <label htmlFor="message">Your Message</label>
              </div>
              <div className="form-group select-group">
                <select id="priority" required>
                  <option value="">Select Priority</option>
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
