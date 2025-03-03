import React, { useState } from "react";
import airbnb from "../../../assets/images/companies/airbnb.png";
import cisco from "../../../assets/images/companies/cisco.png";
import fb from "../../../assets/images/companies/facebook.png";
import apple from "../../../assets/images/companies/apple.png";
import google from "../../../assets/images/companies/google.png";
import DashboardNavbar from "../Dashboard/DashboardNavbar";

const OrganizationList = () => {
  const [showForm, setShowForm] = useState(false);

  const organizations = [
    {
      id: 1,
      name: "Air BnB",
      address: "123 Main St, New York, NY 10001",
      profilePic: airbnb,
      rating: 4.9,
      employees: "10,000+",
      industry: ["Travel", "Technology"],
      yearFounded: 2008,
    },
    {
      id: 2,
      name: "Cisco",
      address: "456 Park Ave, Los Angeles, CA 90012",
      profilePic: cisco,
      rating: 4.7,
      employees: "77,500+",
      industry: ["Networking", "Software"],
      yearFounded: 1984,
    },
    {
      id: 3,
      name: "Facebook",
      address: "789 Oak Rd, Chicago, IL 60601",
      profilePic: fb,
      rating: 4.8,
      employees: "58,604",
      industry: ["Social Media", "Technology"],
      yearFounded: 2004,
    },
    {
      id: 4,
      name: "Apple",
      address: "789 Oak Rd, Chicago, IL 60601",
      profilePic: apple,
      rating: 4.9,
      employees: "147,000",
      industry: ["Technology", "Consumer Electronics"],
      yearFounded: 1976,
    },
    {
      id: 5,
      name: "Google",
      address: "789 Oak Rd, Chicago, IL 60601",
      profilePic: google,
      rating: 4.8,
      employees: "135,301",
      industry: ["Technology", "Internet Services"],
      yearFounded: 1998,
    },
  ];

  return (
    <>
      <DashboardNavbar />
      <div className="py-5 bg-white">
        <h2 className="text-center mb-5 fw-bold" style={{ color: "#2c3e50" }}>
          Partner Organizations
          <div
            className="w-25 mx-auto mt-2"
            style={{
              height: "3px",
              background: "linear-gradient(to right, #3498db, #2ecc71)",
            }}
          ></div>
        </h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 px-5">
          {organizations.map((org) => (
            <div key={org.id} className="col">
              <div className="card h-100 border-0 shadow-sm hover-card">
                <div
                  className="position-relative"
                  style={{ boxShadow: "rgba(50, 50, 93, 0.11) 0px 1px 3px" }}
                >
                  <img
                    src={org.profilePic}
                    className="card-img-top"
                    alt={org.name}
                    style={{
                      height: "220px",
                      objectFit: "contain",
                      padding: "2rem",
                      borderRadius: "12px 12px 0 0",
                      background: "#f8f9fa",
                    }}
                  />
                  <div className="position-absolute top-0 end-0 m-3">
                    <span className="badge bg-light text-dark shadow-sm px-3 py-2">
                      <i className="bi bi-building-fill text-primary me-1"></i>
                      Est. {org.yearFounded}
                    </span>
                  </div>
                </div>
                <div
                  className="card-body"
                  style={{
                    background: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
                  }}
                >
                  <h5 className="card-title fw-bold mb-3">{org.name}</h5>
                  <p
                    className="card-text text-muted mb-2"
                    style={{ fontSize: "0.9rem" }}
                  >
                    <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
                    {org.address}
                  </p>
                  <div className="mb-3">
                    {org.industry.map((type, index) => (
                      <span
                        key={index}
                        className="badge bg-soft-primary me-2 mb-1"
                        style={{ color: "#9e9e9e" }}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  <p className="small text-muted mb-3">
                    <i className="bi bi-people-fill me-2 text-success"></i>
                    Employees: {org.employees}
                  </p>
                  <button className="btn btn-primary w-100 rounded-pill hover-button">
                    View Organization
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Organization button section */}
        <div className="text-center mt-5">
          <button
            className="btn btn-lg btn-outline-primary rounded-pill px-5 py-3 hover-button"
            style={{
              borderWidth: "2px",
              fontSize: "1.1rem",
              boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11)",
            }}
            onClick={() => setShowForm(true)}
          >
            <i className="bi bi-building-add me-2"></i>
            Add Your Organization
          </button>
          <p className="text-muted mt-3">
            Join our network of partner organizations
          </p>
        </div>
      </div>
    </>
  );
};

export default OrganizationList;
