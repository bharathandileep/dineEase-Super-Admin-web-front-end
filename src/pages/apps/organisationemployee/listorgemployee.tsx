import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { getAllOrgEmployees, deleteOrgEmployee, toggleOrgEmployeeStatus } from "../../../server/admin/orgemployeemanagment";
import { Pencil, Trash, ToggleLeft, ToggleRight } from "lucide-react"; 

interface OrgEmployee {
  _id: string;
  username: string;
  email: string;
  phone_number: string;
  designation: { designation_name: string };
  employee_status: string;
  profile_picture: string;
}

const OrgEmployeeList = () => {
  const [orgemployees, setEmployees] = useState<OrgEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getAllOrgEmployees();
        if (response.status) {
          setEmployees(response.data);
        } else {
          toast.error("Failed to load employees.");
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("An error occurred while fetching employees.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/apps/organizations/employ/edit/${id}`);  
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await deleteOrgEmployee(id);
        if (response.status) {
          toast.success("Employee deleted successfully!");
          setEmployees(orgemployees.filter((emp) => emp._id !== id));
        } else {
          toast.error("Failed to delete employee.");
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
        toast.error("An error occurred while deleting the employee.");
      }
    }
  };

//  const handleToggleStatus = async (id: string) => {
//      try {
//        const response = await toggleOrgEmployeeStatus(id);
//        if (response.status) {
//          toast.success("Employee status updated successfully!");
//          setEmployees(orgemployees.map(emp => emp._id === id ? { ...emp, employee_status: emp.employee_status === "Active" ? "Inactive" : "Active" } : emp));
//        } else {
//          toast.error("Failed to update status.");
//        }
//      } catch (error) {
//        console.error("Error updating employee status:", error);
//        toast.error("An error occurred while updating status.");
//      }
//    };
 
  return (
    <React.Fragment>
      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb m-2">
          <li className="breadcrumb-item">
            <Link to="/employees/list">Organisation Employees</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
          Organisation Employee List
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="mb-3" style={{ backgroundColor: "#5bd2bc", padding: "10px" }}>
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="page-title m-0" style={{ color: "#fff" }}>Organisation Employees</h3>
          <Link to="/apps/organizations/employ/add"className="btn btn-danger waves-effect waves-light">
            <i className="mdi mdi-plus-circle me-1"></i> Add New Employee
          </Link>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="text-center my-3">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          {orgemployees.length > 0 ? (
            orgemployees.map((orgemployees) => (
              <Col md={6} xl={3} className="mb-3" key={orgemployees._id}>
                <Card
                  className="product-box h-100 shadow-sm position-relative"
                  style={{ transition: "all 0.3s ease-in-out", cursor: "pointer" }}
                  onClick={() => navigate(`/apps/organizations/employ/details/${orgemployees._id}`)}  
                >
                  <Card.Body className="d-flex flex-column align-items-center text-center">
                    {/* Profile Picture */}
                    <div className="position-relative">
                      <img
                        src={orgemployees.profile_picture || "https://via.placeholder.com/150"}
                        alt={orgemployees.username}
                        className="rounded-circle mb-2"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "contain",
                          transition: "transform 0.3s ease-in-out",
                        }}
                      />
                    </div>

                    {/* User Details */}
                    <div className="product-info mt-auto w-100">
                      <h5 className="text-2xl mt-0 sp-line-1">
                        <Link to="#" className="text-dark text-decoration-none">{orgemployees.username}</Link>
                      </h5>
                      <h6 className="m-0 text-muted">Email: {orgemployees.email}</h6>
                      <h6 className="m-0 text-muted">Phone: {orgemployees.phone_number}</h6>
                      <h6 className="m-0 text-muted">
                        Designation: {orgemployees.designation?.designation_name || "Unknown"}
                      </h6>
                      <h6 className="m-0">
                        <span className={`badge ${orgemployees.employee_status === "Active" ? "bg-success" : "bg-danger"}`}>
                          {orgemployees.employee_status}
                        </span>
                      </h6>
                    </div>

                    {/* Action Buttons */}
                    <div className="product-action d-flex justify-content-center mt-2">
                      <Button
                        variant="success"
                        size="sm"
                        className="me-1"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents triggering card click
                          handleEdit(orgemployees._id);
                        }}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="me-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(orgemployees._id);
                        }}
                      >
                        <Trash size={16} />
                      </Button>
                      {/* <Button
                        variant={orgemployees.employee_status === "Active" ? "warning" : "secondary"}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(orgemployees._id);
                        }}
                      >
                        {orgemployees.employee_status === "Active" ? <ToggleLeft size={16} /> : <ToggleRight size={16} />}
                      </Button> */}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center">No employees found.</p>
          )}
        </Row>
      )}
    </React.Fragment>
  );
};

export default OrgEmployeeList;
