import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Spinner, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { createOrgEmployee } from "../../../server/admin/orgemployeemanagment";
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

      const response = await getAllOrgEmployees(params);
      if (response.status) {
        const { orgEmployees, totalPages, totalEmployees } = response.data;

        if (isNewSearch) {
          setEmployees(orgEmployees);
        } else {
          setEmployees((prev) => {
            const existingIds = new Set(prev.map((item) => item._id));
            const newItems = orgEmployees.filter(
              (item: any) => !existingIds.has(item._id)
            );
            return [...prev, ...newItems];
          });
        }

        setTotalItems(totalEmployees);
        setHasMore(currentPage < totalPages);
        setPage(currentPage + 1);
      } else {
        toast.error("Failed to load employees.");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("An error occurred while fetching employees.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    fetchEmployees(1, true, searchTerm);
  }, []);

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
    navigate(`/apps/organizations/employee/edit/${id}`);
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

  const handleToggleStatus = async (id: string) => {
    try {
      const response = await toggleOrgEmployeeStatus(id);
      if (response.status) {
        toast.success("Employee status updated successfully!");
        setEmployees(
          orgemployees.map((emp) =>
            emp._id === id
              ? {
                  ...emp,
                  employee_status:
                    emp.employee_status === "Active" ? "Inactive" : "Active",
                }
              : emp
          )
        );
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating employee status:", error);
      toast.error("An error occurred while updating status.");
    }
  };

  return (
    <React.Fragment>
      <nav aria-label='breadcrumb'>
        <ol className='breadcrumb m-2'>
          <li className='breadcrumb-item'>
            <Link to='/employees/list'>Organisation Employees</Link>
          </li>
          <li className='breadcrumb-item active' aria-current='page'>
            Organisation Employee List
          </li>
        </ol>
      </nav>

      <div
        className='mb-3'
        style={{ backgroundColor: "#5bd2bc", padding: "10px" }}
      >
        <div className='d-flex align-items-center justify-content-between'>
          <h3 className='page-title m-0' style={{ color: "#fff" }}>
            Employees
          </h3>
          <Link
            to='/apps/organizations/employ/add'
            className='btn btn-danger waves-effect waves-light'
          >
            <i className='mdi mdi-plus-circle me-1'></i> Add New Employee
          </Link>
        </div>
      </div>

      {/* <div className="mb-3">
        <Form.Group controlId="searchEmployees">
          <Form.Control
            type="text"
            placeholder="Search by username, email, phone number, or designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
      </div> */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Row className='justify-content-between'>
                <Col className='col-auto'>
                  <form className='d-flex align-items-center'>
                    <label htmlFor='inputPassword2' className='visually-hidden'>
                      Search
                    </label>
                    <div>
                      <input
                        type='search'
                        className='form-control my-1 my-lg-0'
                        id='inputPassword2'
                        placeholder='Search...'
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
        <div className='text-center my-3'>
          <Spinner animation='border' />
        </div>
      ) : (
        <Row>
          {orgemployees.length > 0 ? (
            orgemployees.map((employee) => (
              <Col md={6} xl={3} className='mb-3' key={employee._id}>
                <Card
                  className='product-box h-100 shadow-sm position-relative'
                  style={{
                    transition: "all 0.3s ease-in-out",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    navigate(
                      `/apps/organizations/employee/details/${employee._id}`
                    )
                  }
                >
                  <Card.Body className='d-flex flex-column align-items-center text-center'>
                    <div className='position-relative'>
                      <img
                        src={
                          employee.profile_picture ||
                          "https://via.placeholder.com/150"
                        }
                        alt={employee.username}
                        className='rounded-circle mb-2'
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          transition: "transform 0.3s ease-in-out",
                        }}
                      />
                    </div>

                    <div className='product-info mt-auto w-100'>
                      <h5 className='font-16 mt-0 sp-line-1'>
                        <Link to='#' className='text-dark text-decoration-none'>
                          {employee.username}
                        </Link>
                      </h5>
                      <h6 className='m-0 text-muted'>
                        Email: {employee.email}
                      </h6>
                      <h6 className='m-0 text-muted'>
                        Phone: {employee.phone_number}
                      </h6>
                      <h6 className='m-0 text-muted'>
                        Designation:{" "}
                        {employee.designation?.designation_name || "Unknown"}
                      </h6>
                      <h6 className='m-0'>
                        <span
                          className={`badge ${
                            employee.employee_status === "Active"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {employee.employee_status}
                        </span>
                      </h6>
                    </div>

                    <div className='product-action d-flex justify-content-center mt-2'>
                      <Button
                        variant='success'
                        size='sm'
                        className='me-1'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(employee._id);
                        }}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant='danger'
                        size='sm'
                        className='me-1'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(employee._id);
                        }}
                      >
                        <Trash size={16} />
                      </Button>
                      <Button
                        variant={
                          employee.employee_status === "Active"
                            ? "warning"
                            : "secondary"
                        }
                        size='sm'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(employee._id);
                        }}
                      >
                        {employee.employee_status === "Active" ? (
                          <ToggleLeft size={16} />
                        ) : (
                          <ToggleRight size={16} />
                        )}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <Card>
                <Card.Body className='text-center'>
                  <i
                    className='mdi mdi-account-off text-muted'
                    style={{ fontSize: "48px" }}
                  ></i>
                  <h4 className='mt-3'>No Employees Found</h4>
                  <p className='text-muted'>
                    {searchTerm
                      ? `No employees match your search criteria "${searchTerm}".`
                      : "There are no employees in the system yet."}
                  </p>
                  <Button
                    variant='primary'
                    onClick={() => navigate("/apps/organizations/employee/add")}
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
        <div className='text-center my-3'>
          <Spinner animation='border' size='sm' />
        </div>
      )}
    </React.Fragment>
  );
};

export default OrgEmployeeList;
