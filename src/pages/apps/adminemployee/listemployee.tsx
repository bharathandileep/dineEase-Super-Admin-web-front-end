import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { getAllEmployees, deleteEmployee, toggleEmployeeStatus } from "../../../server/admin/employeemanagment";
import { Pencil, Trash, ToggleLeft, ToggleRight } from "lucide-react"; 

interface Employee {
  _id: string;
  username: string;
  email: string;
  phone_number: string;
  designation: { designation_name: string };
  employee_status: string;
  profile_picture: string;
}

const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getAllEmployees();
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
    navigate(`/apps/employee/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await deleteEmployee(id);
        if (response.status) {
          toast.success("Employee deleted successfully!");
          setEmployees(employees.filter((emp) => emp._id !== id));
        } else {
          toast.error("Failed to delete employee.");
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
        toast.error("An error occurred while deleting the employee.");
      }
    }
  };

  // const handleToggleStatus = async (id: string) => {
  //   try {
  //     const response = await toggleEmployeeStatus(id);
  //     if (response.status) {
  //       toast.success("Employee status updated successfully!");
  //       setEmployees(employees.map(emp => emp._id === id ? { ...emp, employee_status: emp.employee_status === "Active" ? "Inactive" : "Active" } : emp));
  //     } else {
  //       toast.error("Failed to update status.");
  //     }
  //   } catch (error) {
  //     console.error("Error updating employee status:", error);
  //     toast.error("An error occurred while updating status.");
  //   }
  // };

  return (
    <React.Fragment>
      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb m-2">
          <li className="breadcrumb-item">
            <Link to="/employees/list">Employees</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Employee List
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="mb-3" style={{ backgroundColor: "#5bd2bc", padding: "10px" }}>
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="page-title m-0" style={{ color: "#fff" }}>Employees</h3>
          <Link to="/apps/employee/add" className="btn btn-danger waves-effect waves-light">
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
          {employees.length > 0 ? (
            employees.map((employee) => (
              <Col md={6} xl={3} className="mb-3" key={employee._id}>
                <Card
                  className="product-box h-100 shadow-sm position-relative"
                  style={{ transition: "all 0.3s ease-in-out", cursor: "pointer" }}
                  onClick={() => navigate(`/apps/employee/details/${employee._id}`)}
                >
                  <Card.Body className="d-flex flex-column align-items-center text-center">
                    {/* Profile Picture */}
                    <div className="position-relative">
                      <img
                        src={employee.profile_picture || "https://via.placeholder.com/150"}
                        alt={employee.username}
                        className="rounded-circle mb-2"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          transition: "transform 0.3s ease-in-out",
                        }}
                      />
                    </div>

                    {/* User Details */}
                    <div className="product-info mt-auto w-100">
                      <h5 className="font-16 mt-0 sp-line-1">
                        <Link to="#" className="text-dark text-decoration-none">{employee.username}</Link>
                      </h5>
                      <h6 className="m-0 text-muted">Email: {employee.email}</h6>
                      <h6 className="m-0 text-muted">Phone: {employee.phone_number}</h6>
                      <h6 className="m-0 text-muted">
                        Designation: {employee.designation?.designation_name || "Unknown"}
                      </h6>
                      <h6 className="m-0">
                        <span className={`badge ${employee.employee_status === "Active" ? "bg-success" : "bg-danger"}`}>
                          {employee.employee_status}
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
                          handleEdit(employee._id);
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
                          handleDelete(employee._id);
                        }}
                      >
                        <Trash size={16} />
                      </Button>
                      {/* <Button
                        variant={employee.employee_status === "Active" ? "warning" : "secondary"}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(employee._id);
                        }}
                      >
                        {employee.employee_status === "Active" ? <ToggleLeft size={16} /> : <ToggleRight size={16} />}
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

export default EmployeeList;
