import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Spinner, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  getOrgEmployeeById,
  deleteOrgEmployee,
  toggleOrgEmployeeStatus,
} from "../../../server/admin/orgemployeemanagment";
import {
  Pencil,
  Trash,
  ToggleLeft,
  ToggleRight,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
} from "lucide-react";

interface Employee {
  _id: string;
  username: string;
  email: string;
  phone_number: string;
  designation?: { designation_name: string };
  employee_status: string;
  profile_picture?: string;
  aadhar_number?: string;
  pan_number?: string;
  aadhar_image: string;
  pan_image: string;
  address: {
    street_address: string;
    city: string;      // Will be changed to city_name when displaying
    district?: string; // Will be changed to district_name when displaying
    state?: string;    // Will be changed to state_name when displaying
    pincode?: string;
    country?: string;  // Will be changed to country_name when displaying
  };
}

const OrgEmployeeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [orgemployee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        if (id) {
          const response = await getOrgEmployeeById(id);
          if (response.status) {
            setEmployee(response.data);
          } else {
            toast.error(response.message);
          }
        }
      } catch (error:any) {
        console.error("Error fetching employee details:", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        if (id) {
          const response = await deleteOrgEmployee(id);
          if (response.status) {
            toast.success("Employee deleted successfully!");
            navigate("/apps/organizations/employee/list"); 
          } else {
            toast.error(response.message);
          }
        }
      } catch (error:any) {
        console.error("Error deleting employee:", error);
        toast.error(error.message);
      }
    }
  };

  const handleToggleStatus = async () => {
    try {
      if (id) {
        const response = await toggleOrgEmployeeStatus(id);
        if (response.status) {
          toast.success("Employee status updated successfully!");
          setEmployee((prev) =>
            prev
              ? {
                  ...prev,
                  employee_status:
                    prev.employee_status === "Active" ? "Inactive" : "Active",
                }
              : null
          );
        } else {
          toast.error(response.message);
        }
      }
    } catch (error:any) {
      console.error("Error updating employee status:", error);
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!orgemployee) {
    return (
      <div className="text-center my-5">
        <h4>Employee not found.</h4>
      </div>
    );
  }

  // Map the address fields to their proper display names
  const addressDisplay = {
    street: orgemployee.address?.street_address || "N/A",
    city: orgemployee.address?.city || "N/A",
    district: orgemployee.address?.district || "N/A",
    state: orgemployee.address?.state || "N/A",
    pincode: orgemployee.address?.pincode || "N/A",
    country: orgemployee.address?.country || "N/A"
  };

  return (
    <React.Fragment>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb m-2">
          <li className="breadcrumb-item">
            <Link to="/employees/list">Organisation Employees</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Organisation Employee Details
          </li>
        </ol>
      </nav>

      <div
        className="mb-3"
        style={{ backgroundColor: "#5bd2bc", padding: "10px" }}
      >
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="page-title m-0" style={{ color: "#fff" }}>
            Organisation Employee Details
          </h3>
          <div className="d-flex gap-2">
            <Button
              variant="light"
              onClick={() =>
                navigate(`/apps/organizations/employee/edit/${id}`)
              }
            >
              <Pencil size={16} className="me-1" /> Edit
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <Trash size={16} className="me-1" /> Delete
            </Button>
          </div>
        </div>
      </div>
      <Row>
        <Col md={4}>
          <Card className="mb-3 shadow-sm">
            <Card.Body className="text-center">
              <img
                src={
                  orgemployee.profile_picture ||
                  "https://via.placeholder.com/150"
                }
                alt={orgemployee.username}
                className="rounded-circle mb-3"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "contain",
                }}
              />

              {/* Employee Name */}
              <h4 className="mb-2 text-2xl font-bold">
                {orgemployee.username}
              </h4>
              <Badge
                bg={
                  orgemployee.employee_status === "Active"
                    ? "success"
                    : "danger"
                }
                className="mb-3"
                onClick={handleToggleStatus}
                style={{ cursor: "pointer" }} // Add this to indicate the badge is clickable
              >
                {orgemployee.employee_status}
              </Badge>

              {/* Contact Information */}
              <div className="text-start">
                <div className="d-flex align-items-center mb-2">
                  <Mail size={16} className="me-2" />
                  <span>{orgemployee.email}</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <Phone size={16} className="me-2" />
                  <span>{orgemployee.phone_number}</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <Building size={16} className="me-2" />
                  <span>
                    {orgemployee.designation?.designation_name || "Unknown"}
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-3">Identity Documents</h5>
              <Row>
                <Col md={6}>
                  <p>
                    <strong>Aadhaar Number:</strong>{" "}
                    {orgemployee.aadhar_number || "N/A"}
                  </p>
                  {orgemployee.aadhar_image && (
                    <div className="mt-2">
                      <strong>Aadhaar Image:</strong>
                      <img
                        src={orgemployee.aadhar_image}
                        alt="Aadhaar Card"
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                          marginTop: "10px",
                        }}
                      />
                    </div>
                  )}
                </Col>
                <Col md={6}>
                  <p>
                    <strong>PAN Number:</strong>{" "}
                    {orgemployee.pan_number || "N/A"}
                  </p>
                  {orgemployee.pan_image && (
                    <div className="mt-2">
                      <strong>PAN Image:</strong>
                      <img
                        src={orgemployee.pan_image}
                        alt="PAN Card"
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                          marginTop: "10px",
                        }}
                      />
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-3">Address Details</h5>
              <p>
                <MapPin size={16} className="me-2" />{" "}
                {addressDisplay.street}
              </p>
              <p>
                {addressDisplay.city}, {addressDisplay.district}
              </p>
              <p>
                {addressDisplay.state}, {addressDisplay.pincode}
              </p>
              <p>
                {addressDisplay.country}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default OrgEmployeeDetails;