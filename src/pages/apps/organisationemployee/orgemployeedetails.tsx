

import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Spinner, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import { getOrgEmployeeById, deleteOrgEmployee, toggleOrgEmployeeStatus } from "../../../server/admin/orgemployeemanagment";
import { Pencil, Trash, Mail, Phone, MapPin, Building } from "lucide-react";

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
  aadhar_image?: string;
  pan_image?: string;
  address?: {
    street_address?: string;
    city?: string;
    district?: string;
    state?: string;
    pincode?: string;
    country?: string;
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
            toast.error("Failed to load employee details.");
          }
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
        toast.error("An error occurred while fetching employee details.");
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
            toast.error("Failed to delete employee.");
          }
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
        toast.error("An error occurred while deleting the employee.");
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
              ? { ...prev, employee_status: prev.employee_status === "Active" ? "Inactive" : "Active" }
              : null
          );
        } else {
          toast.error("Failed to update status.");
        }
      }
    } catch (error) {
      console.error("Error updating employee status:", error);
      toast.error("An error occurred while updating status.");
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

      <div className="mb-3" style={{ backgroundColor: "#5bd2bc", padding: "10px" }}>
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="page-title m-0" style={{ color: "#fff" }}>Organisation Employee Details</h3>
          <div className="d-flex gap-2">
            <Button variant="light" onClick={() => navigate(`/apps/organizations/employ/edit/${id}`)}>
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
                src={orgemployee.profile_picture || "https://via.placeholder.com/150"}
                alt={orgemployee.username}
                className="rounded-circle mb-3"
                style={{ width: "150px", height: "150px", objectFit: "contain" }}
              />
              <h4 className="mb-2">{orgemployee.username}</h4>
              <Badge
                bg={orgemployee.employee_status === "Active" ? "success" : "danger"}
                className="mb-3"
                style={{ cursor: "pointer" }}
                onClick={handleToggleStatus}
              >
                {orgemployee.employee_status}
              </Badge>
              <div className="text-start">
                <p><Mail size={16} className="me-2" /> {orgemployee.email}</p>
                <p><Phone size={16} className="me-2" /> {orgemployee.phone_number}</p>
                <p><Building size={16} className="me-2" /> {orgemployee.designation?.designation_name || "Unknown"}</p>
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
                  <p><strong>Aadhaar Number:</strong> {orgemployee.aadhar_number || "N/A"}</p>
                  {orgemployee.aadhar_image && <img src={orgemployee.aadhar_image} alt="Aadhaar" style={{ maxWidth: "100%" }} />}
                </Col>
                <Col md={6}>
                  <p><strong>PAN Number:</strong> {orgemployee.pan_number || "N/A"}</p>
                  {orgemployee.pan_image && <img src={orgemployee.pan_image} alt="PAN" style={{ maxWidth: "100%" }} />}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-3">Address Details</h5>
              <p><MapPin size={16} className="me-2" /> {orgemployee.address?.street_address}</p>
              <p>{orgemployee.address?.city}, {orgemployee.address?.district}</p>
              <p>{orgemployee.address?.state}, {orgemployee.address?.pincode}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default OrgEmployeeDetails;
