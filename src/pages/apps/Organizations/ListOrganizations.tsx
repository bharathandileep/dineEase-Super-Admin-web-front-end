import React, { useEffect, useMemo, useState, useRef } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { getAllOrg } from "../../../server/admin/organization";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";

function ListOrganizations() {
  const [companyInfo, setCompanyInfo] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  const navigate = useNavigate();
  const isLoadingRef = useRef(false);

  // Fetch data with pagination
  const fetchData = async (currentPage: number, isNewSearch: boolean = false) => {
    if (isLoadingRef.current) return;

    if (isNewSearch) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    isLoadingRef.current = true;

    try {
      const response = await getAllOrg({ page: currentPage, limit: 4 });
      console.log(response);
      const { organizations
        , totalPages, totalOrganizations } = response.data;

      if (isNewSearch) {
        setCompanyInfo(organizations);
      } else {
        // Prevent duplicates
        setCompanyInfo((prev) => {
          const existingIds = new Set(prev.map((item) => item._id));
          const newItems = organizations.filter(
            (item: any) => !existingIds.has(item._id)
          );
          return [...prev, ...newItems];
        });
      }

      setTotalItems(totalOrganizations);
      setHasMore(currentPage < totalPages);
      setPage(currentPage + 1);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  };

  // Initial load
  useEffect(() => {
    fetchData(1, true);
  }, []);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value.toLowerCase().trim());
    setPage(1);
    setHasMore(true);
    fetchData(1, true);
  };

  // Throttle function for scroll handling
  const throttle = (func: (...args: any[]) => void, limit: number) => {
    let inThrottle = false;
    return (...args: any[]) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  // Scroll handler
  useEffect(() => {
    const handleScroll = throttle(() => {
      if (isLoadingRef.current || !hasMore) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        fetchData(page, false);
      }
    }, 200);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, page]);

  // Filtered items based on search term
  const filteredMenuItems = useMemo(() => {
    if (!searchTerm.trim()) return companyInfo;
  
    return companyInfo?.filter((item) => {
      return (
        item.contact_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.managerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.employeeCount?.toString().includes(searchTerm.toLowerCase()) ||
        item.organizationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.register_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.addresses?.some((address: any) =>
          address.street_address?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    });
  }, [searchTerm, companyInfo]);
  

  // Loading state
  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading organizations...</p>
      </div>
    );
  }

  // No data available
  if (!companyInfo || companyInfo.length === 0) {
    return (
      <div className="text-center my-5">
        <Card>
          <Card.Body>
            <i
              className="mdi mdi-domain-off text-muted"
              style={{ fontSize: "48px" }}
            ></i>
            <h4 className="mt-3">No Organizations Available</h4>
            <p className="text-muted">
              There are no organizations in the system yet.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate("/apps/organizations/new")}
            >
              Add New Organization
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Organizations", path: "/apps/organizations/list" },
          {
            label: "List",
            path: "/apps/organizations/list",
            active: true,
          },
        ]}
        title={"Customers"}
      />
      <div
        className="mb-3"
        style={{ backgroundColor: "#5bd2bc", padding: "10px" }}
      >
        <div
          className="d-flex align-items-center justify-content-between"
          onClick={() => navigate("/apps/organizations/new")}
        >
          <h3 className="page-title m-0" style={{ color: "#fff" }}>
            Organizations
          </h3>
          <Link to="#" className="btn btn-danger waves-effect waves-light">
            <i className="mdi mdi-plus-circle me-1"></i> Add New
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
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </div>
                  </form>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {searchTerm && (!filteredMenuItems || filteredMenuItems.length === 0) ? (
        <div className="text-center my-5">
          <Card>
            <Card.Body>
              <i
                className="mdi mdi-file-search-outline text-muted"
                style={{ fontSize: "48px" }}
              ></i>
              <h4 className="mt-3">No Results Found</h4>
              <p className="text-muted">
                No organizations match your search criteria "{searchTerm}".
              </p>
            </Card.Body>
          </Card>
        </div>
      ) : (
        <Row>
          {filteredMenuItems?.map((item, index) => (
            <Col key={item._id || index} md={6} xl={3} className="mb-3">
              <Link to={`/apps/organizations/${item._id}`}>
                <Card className="product-box h-100">
                  <Card.Body className="d-flex flex-column">
                    <div className="bg-light mb-3">
                      <img
                        src={item?.organizationLogo}
                        alt={item?.organizationName}
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
                        <Link
                          to={`/apps/organizations/${item._id}`}
                          className="text-dark"
                        >
                          {item?.organizationName}
                        </Link>
                      </h5>
                      <p className="text-black font-14 ">
                        
                        <i className="mdi mdi-map-marker me-1"></i>
                        {item?.addresses[0]?.street_address},{" "}
                        {item?.addresses[0]?.city},{" "}
                        {item?.addresses[0]?.country}
                      </p>
                      <p className="text-black">
                        <i className="mdi mdi-phone-classic me-1"></i>
                        {item?.contact_number}
                      </p>
                      <p className="text-black">
                        <i className="mdi mdi-email me-1"></i>
                        {item?.email}
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}

      {loadingMore && (
        <div className="text-center my-4">
          <i className="mdi mdi-spin mdi-loading me-1"></i> Loading more...
        </div>
      )}
    </>
  );
}

export default ListOrganizations;