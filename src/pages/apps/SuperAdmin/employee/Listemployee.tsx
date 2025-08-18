import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Spinner, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  getAllEmployees,
  deleteEmployee,
  toggleEmployeeStatus,
} from "../../../../services/admin/employeemanagment";
import { Pencil, Trash, ToggleLeft, ToggleRight } from "lucide-react";

interface Employee {
  _id: string;
  fullName: string;
  email: string;
  phone_number: string;
  roleName: string;
  employee_status: string;
  profile_picture: string;
}

const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const isLoadingRef = useRef(false);

  const fetchEmployees = async (
    currentPage: number,
    isNewSearch: boolean = false,
    searchQuery: string = ""
  ) => {
    if (isLoadingRef.current) return;

    if (isNewSearch) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    isLoadingRef.current = true;

    try {
      const params = {
        page: currentPage,
        limit: 8,
        search: searchQuery,
      };

      const response = await getAllEmployees(params);
      if (response.status) {
        const { employees, totalPages, totalEmployees } = response.data;

        if (isNewSearch) {
          setEmployees(employees);
        } else {
          setEmployees((prev) => {
            const existingIds = new Set(prev.map((item) => item._id));
            const newItems = employees.filter(
              (item: any) => !existingIds.has(item._id)
            );
            return [...prev, ...newItems];
          });
        }

        setTotalItems(totalEmployees);
        setHasMore(currentPage < totalPages);
        setPage(currentPage + 1);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      console.error("Error fetching employees:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchEmployees(1, true, searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingRef.current || !hasMore) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        fetchEmployees(page, false, searchTerm);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, page, searchTerm]);

  const handleEdit = (id: string) => {
    navigate(`/apps/admin/edit-employee/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await deleteEmployee(id);
        if (response.status) {
          toast.success("Employee deleted successfully!");
          setEmployees(employees.filter((emp) => emp._id !== id));
        } else {
          toast.error(response.message);
        }
      } catch (error: any) {
        console.error("Error deleting employee:", error);
        toast.error(error.message);
      }
    }
  };

  return (
    <React.Fragment>
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

      <div
        className="mb-3"
        style={{ backgroundColor: "#5bd2bc", padding: "10px" }}
      >
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="page-title m-0" style={{ color: "#fff" }}>
            Employees
          </h3>
          <Link
            to="/apps/admin/add-employee"
            className="btn btn-danger waves-effect waves-light"
          >
            <i className="mdi mdi-plus-circle me-1"></i> Add New Employee
          </Link>
        </div>
      </div>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Row className="justify-content-between">
                <Col className="col-auto">
                  <form className="d-flex align-items-center">
                    <label htmlFor="inputPassword2" className="visually-hidden">
                      Search
                    </label>
                    <div>
                      <input
                        type="search"
                        className="form-control my-1 my-lg-0"
                        id="inputPassword2"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </form>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center my-3">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <Col md={6} xl={3} className="mb-3" key={employee._id}>
                <Link
                  to={`/apps/admin/employee/${employee._id}`}
                  className="text-decoration-none"
                >
                  <Card className="h-100 shadow-sm border-0">
                    <Card.Body className="d-flex flex-column">

                      <div
                        className="bg-light mb-2 d-flex justify-content-center align-items-center"
                        style={{ height: "200px" }}
                      >
                        <img
                          src={
                            employee.profile_picture ||
                            "https://via.placeholder.com/150"
                          }
                          alt={employee.fullName}
                          className="img-fluid"
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "contain",
                          }}
                        />
                      </div>

                      {/* Employee Info */}
                      <div className="mt-auto">
                        <h5 className="fw-bold text-dark mb-3 fs-4">
                          {employee.fullName}
                        </h5>

                        <div className="text-muted fs-6">
                          <div className="d-flex align-items-center font-14 mb-2 text-black text-wrap text-break">
                            <i className="mdi mdi-email me-2"></i>
                            <span>{employee.email || "N/A"}</span>
                          </div>
                          <div className="d-flex font-14 align-items-center mb-2 text-black">
                            <i className="mdi mdi-phone-classic me-2"></i>
                            <span>{employee.phone_number || "N/A"}</span>
                          </div>
                          <div className="d-flex font-14 align-items-center text-black">
                            <i className="mdi mdi-account-tie me-2"></i>
                            <span>{employee.roleName || "Unknown"}</span>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))
          ) : (
            <Col>
              <Card>
                <Card.Body className="text-center">
                  <i
                    className="mdi mdi-account-off text-muted font-14"
                  ></i>
                  <h4 className="mt-3">No Employees Found</h4>
                  <p className="text-muted">
                    {searchTerm
                      ? `No employees match your search criteria "${searchTerm}".`
                      : "There are no employees in the system yet."}
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => navigate("/apps/admin/add-employee")}
                  >
                    Add New Employee
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      )}

      {loadingMore && (
        <div className="text-center my-3">
          <Spinner animation="border" size="sm" />
        </div>
      )}
    </React.Fragment>
  );
};

export default EmployeeList;
