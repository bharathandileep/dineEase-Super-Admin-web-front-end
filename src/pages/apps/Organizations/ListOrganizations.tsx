import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Row, Spinner, Form } from "react-bootstrap";
import { getAllOrg } from "../../../server/admin/organization";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";
import { toast } from "react-toastify";

interface Organization {
  _id: string;
  organizationName: string;
  managerName: string;
  register_number: string;
  contact_number: string;
  email: string;
  organizationLogo: string;
  addresses: { street_address: string; city: string; country: string }[];
  no_of_employees: number;
}

function ListOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();
  const isLoadingRef = useRef(false);

  const fetchOrganizations = async (currentPage: number, isNewSearch: boolean = false, searchQuery: string = "") => {
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
        limit: 10,
        search: searchQuery,
      };

      const response = await getAllOrg(params);
      if (response.status) {
        const { organizations, totalPages, totalOrganization } = response.data;

        if (isNewSearch) {
          setOrganizations(organizations);
        } else {
          setOrganizations((prev) => {
            const existingIds = new Set(prev.map((item) => item._id));
            const newItems = organizations.filter((item: any) => !existingIds.has(item._id));
            return [...prev, ...newItems];
          });
        }

        setTotalItems(totalOrganization);
        setHasMore(currentPage < totalPages);
        setPage(currentPage + 1);
      } else {
        toast.error("Failed to load organizations.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching organizations.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchOrganizations(1, true, searchTerm);
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
        fetchOrganizations(page, false, searchTerm);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, page, searchTerm]);

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Organizations", path: "/apps/organizations/list" },
          { label: "List", path: "/apps/organizations/list", active: true },
        ]}
        title={"Organizations"}
      />

      <div className="mb-3" style={{ backgroundColor: "#5bd2bc", padding: "10px" }}>
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="page-title m-0" style={{ color: "#fff" }}>
            Organizations
          </h3>
          <Link to="/apps/organizations/new" className="btn btn-danger waves-effect waves-light">
            <i className="mdi mdi-plus-circle me-1"></i> Add New Organization
          </Link>
        </div>
      </div>
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
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading organizations...</p>
        </div>
      ) : (
        <Row>
          {organizations.length > 0 ? (
            organizations.map((item) => (
              <Col key={item._id} md={6} xl={3} className="mb-3">
                <Link to={`/apps/organizations/${item._id}`}>
                  <Card className="product-box h-100 shadow-sm">
                    <Card.Body className="d-flex flex-column">
                      <div className="bg-light mb-3">
                        <img
                          src={item.organizationLogo || "https://via.placeholder.com/150"}
                          alt={item.organizationName}
                          className="img-fluid"
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                      <div className="product-info mt-auto">
                        <h5 className="font-16 mt-0">
                          <Link to={`/apps/organizations/${item._id}`} className="text-dark">
                            {item.organizationName}
                          </Link>
                        </h5>
                        <p className="text-muted">
                          <i className="mdi mdi-map-marker me-1"></i>
                          {item.addresses[0]?.street_address}, {item.addresses[0]?.city},{" "}
                          {item.addresses[0]?.country}
                        </p>
                        <p className="text-muted">
                          <i className="mdi mdi-phone-classic me-1"></i>
                          {item.contact_number}
                        </p>
                        <p className="text-muted">
                          <i className="mdi mdi-email me-1"></i>
                          {item.email}
                        </p>
                        <p className="text-muted">
                          <i className="mdi mdi-account-group me-1"></i>
                          {item.no_of_employees} Employees
                        </p>
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
                  <i className="mdi mdi-domain-off text-muted" style={{ fontSize: "48px" }}></i>
                  <h4 className="mt-3">No Organizations Found</h4>
                  <p className="text-muted">
                    {searchTerm
                      ? `No organizations match your search criteria "${searchTerm}".`
                      : "There are no organizations in the system yet."}
                  </p>
                  <Button variant="primary" onClick={() => navigate("/apps/organizations/new")}>
                    Add New Organization
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      )}

      {loadingMore && (
        <div className="text-center my-4">
          <Spinner animation="border" size="sm" /> Loading more...
        </div>
      )}
    </>
  );
}

export default ListOrganizations;