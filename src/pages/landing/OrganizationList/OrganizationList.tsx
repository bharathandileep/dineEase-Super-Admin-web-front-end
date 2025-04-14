import React, { useState, useEffect } from "react";
import DashboardNavbar from "../Dashboard/DashboardNavbar";
import { useNavigate } from "react-router-dom";
import { getUserApprovedOrganizations } from "../../../server/admin/organization";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { getEmployeeOrg } from "../../../server/admin/orgemployeemanagment";
import { setContext } from "../../../helpers/api/utils";

interface Organization {
  id: number;
  profilePic?: string;
  name: string;
  yearFounded?: number;
  address: string;
  industry?: string[];
  employees?: number;
  isapproved: string;
  slug: String;
}

const OrganizationList = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [showloading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userLoggedIn, user, loading } = useSelector(
    (state: RootState) => state.Auth
  );

  useEffect(() => {
    const fetchUserOrganizations = async () => {
      try {
        let response;
        if (user.role === "Employee") {
          response = await getEmployeeOrg(user.email);
          setOrganizations(response.data.organizations);
        } else {
          response = await getUserApprovedOrganizations();
          setOrganizations(response.data.organizations);
        }
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching organizations:", error);
        setLoading(false);
      }
    };

    fetchUserOrganizations();
  }, []);
  const handleNavigateOrg = (organization: Organization) => {
    let organizationViewDetails = {
      role: "Organization",
      organization: organization.name,
      orgId: organization.id,
      slug: organization.slug,
    };
    setContext({
      contextId: organization.id,
      contextType: "Organization",
      slug: organization.slug,
    });
    if (user.role === "Employee") {
      organizationViewDetails.role = "Employee";
    }

    if (organization.isapproved === "approved") {
      localStorage.setItem(
        "accessDetails",
        JSON.stringify(organizationViewDetails)
      );
      navigate(`/apps/${organization.slug}`);
    }
  };

  if (showloading) {
    return (
      <div
        className="text-center py-5"
        style={{
          backgroundColor: "white",
          height: "100vh",
          margin: 0,
        }}
      >
        <h3>Loading organizations...</h3>
      </div>
    );
  }

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
              background:
                "linear-gradient(to right,rgb(253, 253, 253),rgb(254, 255, 255))",
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
                    src={org.profilePic || "https://via.placeholder.com/220"}
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
                    <span
                      className={`badge text-dark shadow-sm text-white px-3 py-2 ${
                        org.isapproved === "approved"
                          ? "bg-success"
                          : org.isapproved === "rejected"
                          ? "bg-danger"
                          : "bg-warning"
                      }`}
                    >
                      <i className="bi  bi-building-fill text-primary me-1"></i>
                      {org.isapproved || "N/A"}
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
                    {(org.industry || []).map((type, index) => (
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
                    Employees: {org.employees || "Not specified"}
                  </p>
                  <button
                    className="btn btn-primary w-100 rounded-pill hover-button"
                    onClick={() => handleNavigateOrg(org)}
                  >
                    View Organization
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <button
            className="btn btn-lg btn-outline-primary rounded-pill px-5 py-3 hover-button"
            style={{
              borderWidth: "2px",
              fontSize: "1.1rem",
              boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11)",
            }}
            onClick={() => navigate("/request/organization")}
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
