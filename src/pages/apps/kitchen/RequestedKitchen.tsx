import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Row, Spinner, Form } from "react-bootstrap";
 // Adjust import path as needed
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";
import { toast } from "react-toastify";
import { getUnapprovedKitchens } from "../../../server/admin/kitchens";

interface UnapprovedKitchen {
  _id: string;
  kitchen_name: string;
  kitchen_owner_name: string;
  // owner_phone_number: string;
  owner_email: string;
  kitchen_image: string;
  addresses: { 
    street_address: string; 
    city_name: string; 
    country_name: string; 
    state_name: string;
  }[];
  categoryDetails: any[];
  subcategoryDetails: any[];
}

function RequestedKitchen() {
  const [kitchens, setKitchens] = useState<UnapprovedKitchen[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();
  const isLoadingRef = useRef(false);

  const fetchUnapprovedKitchens = async (currentPage: number, isNewSearch: boolean = false, searchQuery: string = "") => {
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
        limit: 4,
        search: searchQuery,
      };
  
  
      const response = await getUnapprovedKitchens(params);
      if (response.status) {
        const { kitchens, totalPages, totalKitchens } = response.data;
  
        console.log("Received organizations:", kitchens); // Debugging statement
  
        if (isNewSearch) {
          setKitchens(kitchens);
        } else {
          setKitchens((prev) => {
            const existingIds = new Set(prev.map((item) => item._id));
            const newItems = kitchens.filter((item: UnapprovedKitchen) => !existingIds.has(item._id));
            return [...prev, ...newItems];
          });
        }
  
        setTotalItems(totalKitchens);
        setHasMore(currentPage < totalPages);
        setPage(currentPage + 1);
      } else {
        toast.error("Failed to load unapproved organizations.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching unapproved organizations.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchUnapprovedKitchens(1, true, searchTerm);
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
        fetchUnapprovedKitchens(page, false, searchTerm);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, page, searchTerm]);

  const handleApproveKitchen = async (orgId: string) => {
    // TODO: Implement organization approval logic
    toast.info("Approval functionality to be implemented");
  };

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Unapproved Organizations", path: "/apps/kitchen/requested-kitchens" },
          { label: "List", path: "/apps/kitchen/unapproved", active: true },
        ]}
        title={"Unapproved Kitchens"}
      />

      <div className="mb-3" style={{ backgroundColor: "#5bd2bc", padding: "10px" }}>
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="page-title m-0" style={{ color: "#fff" }}>
            Unapproved Kitchens
          </h3>
        </div>
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
                        placeholder='Search Unapproved Organizations...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </form>
                </Col>
                <Col className='col-auto'>
                  <p className="text-muted mt-2">
                    Total Unapproved Organizations: {totalItems}
                  </p>
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
          <p className="mt-2">Loading unapproved organizations...</p>
        </div>
      ) : (
        <Row>
          {kitchens.length > 0 ? (
            kitchens.map((item) => (
              <Col key={item._id} md={6} xl={3} className="mb-3">
                <Card className="product-box h-100 shadow-sm">
                  <Card.Body className="d-flex flex-column">
                    <div className="bg-light mb-3">
                      <img
                        src={item.kitchen_image || "https://via.placeholder.com/150"}
                        alt={item.kitchen_name}
                        className="img-fluid"
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                    <div className="product-info mt-auto">
                      <h5 className="font-16 mt-0 text-dark">
                        {item.kitchen_name}
                      </h5>
                      <p className="text-muted">
                        <i className="mdi mdi-map-marker me-1"></i>
                        {item.addresses[0]?.street_address}, {item.addresses[0]?.city_name}, 
                        {item.addresses[0]?.state_name}, {item.addresses[0]?.country_name}
                      </p>
                      {/* <p className="text-muted">
                        <i className="mdi mdi-phone-classic me-1"></i>
                        {item.owner_phone_number}
                      </p> */}
                      <p className="text-muted">
                        <i className="mdi mdi-email me-1"></i>
                        {item.owner_email}
                      </p>
                     
                      <p className="text-muted">
                        <i className="mdi mdi-domain me-1"></i>
                        {item.categoryDetails[0]?.name || 'Uncategorized'}
                      </p>
                      <div className="d-flex justify-content-between mt-3">
                        <Button 
                          variant="outline-info" 
                          onClick={() => navigate(`/apps/kitchen/${item._id}`)}
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="success" 
                          onClick={() => handleApproveKitchen(item._id)}
                        >
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
                    {searchTerm
                      ? `No unapproved kitchens match your search criteria "${searchTerm}".`
                      : "There are no unapproved kitchens in the system yet."}
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

export default RequestedKitchen;