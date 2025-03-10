import React, { useState, useEffect } from "react";
import DashboardNavbar from "../Dashboard/DashboardNavbar";
import { useNavigate } from "react-router-dom";
import { getUserApprovedKitchens } from "../../../server/admin/kitchens"; // Adjust path to your API service file

const KitchenList = () => {
  interface Kitchen {
    id: string;
    profilePic?: string;
    name: string;
    rating?: number;
    address: string;
    cuisine?: string[];
    specialty?: string;
  }
  
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserKitchens = async () => {
      try {
        const response = await getUserApprovedKitchens();
        setKitchens(response.data.kitchens); // Adjust based on your backend response structure
        setLoading(false);
      } catch (error) {
        console.error("Error fetching kitchens:", error);
        setLoading(false);
      }
    };

    fetchUserKitchens();
  }, []);

  if (loading) {
    return (
      <div
      className="text-center py-5"
      style={{
        backgroundColor: 'white',
        height: '100vh', 
        margin: 0,
      }}
    >
      <h3>Loading kitchens...</h3>
    </div>
    
    );
  }

  return (
    <>
      <DashboardNavbar />
      <div className="py-5 bg-white">
        <h2 className="text-center mb-5 fw-bold" style={{ color: "#2c3e50" }}>
          Featured Kitchens
          <div
            className="w-25 mx-auto mt-2"
            style={{ height: "3px", background: "linear-gradient(to right, #3498db, #2ecc71)" }}
          ></div>
        </h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 px-5">
          {kitchens.map((kitchen) => (
            <div key={kitchen.id} className="col">
              <div className="card h-100 border-0 shadow-sm hover-card">
                <div
                  className="position-relative"
                  style={{ boxShadow: "rgba(50, 50, 93, 0.11) 0px 1px 3px" }}
                >
                  <img
                    src={kitchen.profilePic || "https://via.placeholder.com/220"} // Fallback image
                    className="card-img-top"
                    alt={kitchen.name}
                    style={{
                      height: "220px",
                      objectFit: "cover",
                      borderRadius: "12px 12px 0 0",
                    }}
                  />
                  <div className="position-absolute top-0 end-0 m-3">
                    <span className="badge bg-light text-dark shadow-sm px-3 py-2">
                      <i className="bi bi-star-fill text-warning me-1"></i>
                      {kitchen.rating || "N/A"}
                    </span>
                  </div>
                </div>
                <div
                  className="card-body"
                  style={{ background: "linear-gradient(to bottom, #ffffff, #f8f9fa)" }}
                >
                  <h5 className="card-title fw-bold mb-3">{kitchen.name}</h5>
                  <p
                    className="card-text text-muted mb-2"
                    style={{ fontSize: "0.9rem" }}
                  >
                    <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
                    {kitchen.address}
                  </p>
                  <div className="mb-3">
                    {(kitchen.cuisine || []).map((type, index) => (
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
                    <i className="bi bi-award-fill me-2 text-success"></i>
                    Specialty: {kitchen.specialty || "Not specified"}
                  </p>
                  <button className="btn btn-primary w-100 rounded-pill hover-button">
                    Explore Menu
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Your Kitchen button section */}
        <div className="text-center mt-5">
          <button
            className="btn btn-lg btn-outline-primary rounded-pill px-5 py-3 hover-button"
            style={{
              borderWidth: "2px",
              fontSize: "1.1rem",
              boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11)",
            }}
            onClick={() => navigate("/request/kitchen")}
          >
            <i className="bi bi-building-add me-2"></i>
            Add Your Kitchen
          </button>
          <p className="text-muted mt-3">Join our network of partner Kitchens</p>
        </div>
      </div>
    </>
  );
};

export default KitchenList;