import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Row, Spinner, Form } from "react-bootstrap";
import { getAllKitches } from "../../../server/admin/kitchens";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

interface Kitchen {
  _id: string;
  kitchen_name: string;
  kitchen_owner_name: string;
  kitchen_type: string;
  kitchen_phone_number: string;
  kitchen_image: string;
  addresses: { street_address: string; city: string; country: string }[];
  owner_email: string;
  kitchen_status: string;
}

function OrganizationKitchenList() {
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const isLoadingRef = useRef(false);

  const fetchKitchens = async (
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
        limit: 10,
        search: searchQuery,
      };

      const response = await getAllKitches(params);
      if (response.status) {
        const { kitchens, totalPages, totalKitchens } = response.data;

        if (isNewSearch) {
          setKitchens(kitchens);
        } else {
          setKitchens((prev) => {
            const existingIds = new Set(prev.map((item) => item._id));
            const newItems = kitchens.filter(
              (item: any) => !existingIds.has(item._id)
            );
            return [...prev, ...newItems];
          });
        }

        setTotalItems(totalKitchens);
        setHasMore(currentPage < totalPages);
        setPage(currentPage + 1);
      } else {
        toast.error("Failed to load kitchens.");
      }
    } catch (error) {
      console.error("Error fetching kitchens:", error);
      toast.error("An error occurred while fetching kitchens.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchKitchens(1, true, searchTerm);
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
        fetchKitchens(page, false, searchTerm);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, page, searchTerm]);

  return (
    <>
      <div className="mb-4">
        <div
          className="mb-3"
          style={{ backgroundColor: "#5bd2bc", padding: "20px", borderRadius: "8px" }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="page-title m-0" style={{ color: "#fff" }}>
              Available Kitchens
            </h3>
          </div>
        </div>
      </div>
      
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Row className="justify-content-between">
                <Col className="col-auto">
                  <form className="d-flex align-items-center">
                    <div>
                      <input
                        type="search"
                        className="form-control my-1 my-lg-0"
                        placeholder="Search kitchens..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </form>
                </Col>
                <Col className="col-auto">
                  <div className="text-muted">
                    Total kitchens: {totalItems}
                  </div>
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
          <p className="mt-2">Loading kitchens...</p>
        </div>
      ) : (
        <Row className="mt-3">
          {kitchens.length > 0 ? (
            kitchens.map((item) => (
              <Col key={item._id} md={6} xl={3} className="mb-4">
                <Link 
                  to={`/organization/kitchen/${item._id}`} 
                  className="text-decoration-none"
                >
                  <Card className="h-100 hover-shadow">
                    <div className="position-relative">
                      <img
                        src={item.kitchen_image || "https://via.placeholder.com/300x200"}
                        alt={item.kitchen_name}
                        className="card-img-top"
                        style={{
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                      <div 
                        className={`position-absolute top-0 end-0 m-2 badge ${item.kitchen_status === "Active" ? "bg-success" : "bg-secondary"}`}
                      >
                        {item.kitchen_status}
                      </div>
                    </div>
                    <Card.Body>
                      <h5 className="card-title">{item.kitchen_name}</h5>
                      <div className="text-muted mb-2">
                        <i className="mdi mdi-store me-1"></i> {item.kitchen_type}
                      </div>
                      
                      <div className="d-flex align-items-center mb-2 text-muted small">
                        <i className="mdi mdi-map-marker me-1"></i>
                        <span>
                          {item.addresses && item.addresses.length > 0
                            ? `${item.addresses[0].street_address}, ${item.addresses[0].city}`
                            : "Address not available"}
                        </span>
                      </div>
                      
                      <div className="d-flex align-items-center mb-2 text-muted small">
                        <i className="mdi mdi-phone me-1"></i>
                        <span>{item.kitchen_phone_number}</span>
                      </div>
                      
                      <div className="d-flex align-items-center text-muted small">
                        <i className="mdi mdi-email me-1"></i>
                        <span>{item.owner_email}</span>
                      </div>
                    </Card.Body>
                    <Card.Footer className="bg-transparent border-top-0">
                      <Button 
                        variant="outline-primary" 
                        className="w-100"
                      >
                        View Details
                      </Button>
                    </Card.Footer>
                  </Card>
                </Link>
              </Col>
            ))
          ) : (
            <Col>
              <Card className="text-center p-5">
                <i className="mdi mdi-food-off text-muted" style={{ fontSize: "48px" }}></i>
                <h4 className="mt-3">No Kitchens Found</h4>
                <p className="text-muted">
                  {searchTerm
                    ? `No kitchens match your search criteria "${searchTerm}"`
                    : "There are no kitchens available at the moment"}
                </p>
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

export default OrganizationKitchenList;