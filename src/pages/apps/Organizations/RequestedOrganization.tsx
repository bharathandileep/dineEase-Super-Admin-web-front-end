import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Row, Spinner, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";
import { toast } from "react-toastify";
import { getUnapprovedOrganizations } from "../../../server/admin/organization";
import { approveOrganisation } from "../../../server/admin/admin";

interface UnapprovedOrganization {
  _id: string;
  organizationName: string;
  managerName: string;
  register_number: string;
  contact_number: string;
  email: string;
  organizationLogo: string;
  addresses: {
    street_address: string;
    city_name: string;
    country_name: string;
    state_name: string;
  }[];
  no_of_employees: number;
  categoryDetails: any[];
  subcategoryDetails: any[];
}

function RequestedOrganization() {
  const [organizations, setOrganizations] = useState<UnapprovedOrganization[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();
  const isLoadingRef = useRef(false);

  const fetchUnapprovedOrganizations = async (currentPage: number, isNewSearch: boolean = false) => {
    if (isLoadingRef.current) return;
    isNewSearch ? setLoading(true) : setLoadingMore(true);
    isLoadingRef.current = true;

    try {
      const params = { page: currentPage, limit: 4, search: searchTerm };
      const response = await getUnapprovedOrganizations(params);

      if (response.status) {
        const { organizations, totalPages, totalOrganizations } = response.data;
        setOrganizations(prev => isNewSearch ? organizations : [...prev, ...organizations.filter((item:any) => !prev.some(p => p._id === item._id))]);
        setTotalItems(totalOrganizations);
        setHasMore(currentPage < totalPages);
        setPage(currentPage + 1);
      } else {
        toast.error(response.message);
      }
    } catch (error:any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchUnapprovedOrganizations(1, true), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingRef.current || !hasMore) return;
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 100) fetchUnapprovedOrganizations(page);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, page]);

  const handleApproveOrganization = async (orgId: string) => {
    try {
      const response = await approveOrganisation(orgId);
      if (response?.status) {
        toast.success(response.message);
        fetchUnapprovedOrganizations(1, true); // Refresh the list after approval
      } else {
        toast.error(response?.message);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "An error occurred while approving.");
    }
  };

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Unapproved Organizations", path: "/apps/organizations/requested-organizations" },
          { label: "List", path: "/apps/organizations/unapproved", active: true },
        ]}
        title={"Unapproved Organizations"}
      />

      <div className="mb-3" style={{ backgroundColor: "#5bd2bc", padding: "10px" }}>
        <h3 className="page-title m-0" style={{ color: "#fff" }}>Unapproved Organizations</h3>
      </div>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Row className='justify-content-between'>
                <Col className='col-auto'>
                  <form className='d-flex align-items-center'>
                    <div>
                      <input
                        type='search'
                        className='form-control my-1 my-lg-0'
                        placeholder='Search'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </form>
                </Col>
                {/* <Col className='col-auto'>
                  <p className="text-muted mt-2">
                    Total Unapproved Organizations: {totalItems}
                  </p>
                </Col> */}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" />
          <p className="mt-2">Loading unapproved organizations...</p>
        </div>
      ) : (
        <Row>
          {organizations.length > 0 ? (
            organizations.map((item) => (
              <Col key={item._id} md={6} xl={3} className="mb-3">
                <Card className="product-box h-100 shadow-sm">
                  <Card.Body className="d-flex flex-column">
                    <div className="bg-light mb-3">
                      <img
                        src={item.organizationLogo || "https://via.placeholder.com/150"}
                        alt={item.organizationName}
                        className="img-fluid"
                        style={{ width: "100%", height: "200px", objectFit: "contain" }}
                      />
                    </div>
                    <div className="product-info mt-auto">
                      <h5 className="font-16 mt-0 text-dark">{item.organizationName}</h5>
                      <p className="text-muted">
                        <i className="mdi mdi-map-marker me-1"></i>
                        {item.addresses[0]?.street_address}, {item.addresses[0]?.city_name}, {item.addresses[0]?.state_name}, {item.addresses[0]?.country_name}
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
                      {/* <p className="text-muted">
                        <i className="mdi mdi-domain me-1"></i>
                        {item.categoryDetails[0]?.name || 'Uncategorized'}
                      </p> */}
                      <div className="d-flex justify-content-between mt-3">
                        <Button variant="outline-info" onClick={() => navigate(`/apps/organizations/${item._id}`)}>
                          View Details
                        </Button>
                        <Button variant="success" onClick={() => handleApproveOrganization(item._id)}>
                          Approve
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <Card>
                <Card.Body className="text-center">
                  <i className="mdi mdi-domain-off text-muted" style={{ fontSize: "48px" }}></i>
                  <h4 className="mt-3">No Unapproved Organizations Found</h4>
                  <p className="text-muted">
                    {searchTerm ? `No unapproved organizations match your search criteria "${searchTerm}".` : "There are no unapproved organizations in the system yet."}
                  </p>
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

export default RequestedOrganization;