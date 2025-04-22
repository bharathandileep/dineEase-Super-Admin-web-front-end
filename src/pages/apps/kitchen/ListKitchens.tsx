import React, { useEffect, useState, useCallback, useRef } from "react";
import { Button, Card, Col, Row, Spinner, Form } from "react-bootstrap";
import {
  getAllKitches,
  kitchensGetAllCategories,
  kitchensGetSubcategoriesByCategory,
} from "../../../server/admin/kitchens";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";
import { toast } from "react-toastify";

interface Kitchen {
  _id: string;
  kitchen_name: string;
  slug: string;
  kitchen_owner_name: string;
  kitchen_type: string;
  kitchen_phone_number: string;
  kitchen_image: string;
  addresses: {
    street_address: string;
    city_name: string;
    country_name: string;
    pincode: string;
  };
  owner_email: string;
  kitchen_status: string | null;
  categoryDetails: {
    _id: string;
    category: string;
  };
  subcategoryDetails: {
    _id: string;
    subcategoryName: string;
    category: string;
  };
}

interface Category {
  _id: string;
  category: string;
}

interface Subcategory {
  _id: string;
  subcategoryName: string;
  category: string;
}

function ListKitchens() {
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  

  const loadingRef = useRef(loading);
  const loadingMoreRef = useRef(loadingMore);
  const hasMoreRef = useRef(hasMore);
  const pageRef = useRef(page);

  useEffect(() => {
    loadingRef.current = loading;
    loadingMoreRef.current = loadingMore;
    hasMoreRef.current = hasMore;
    pageRef.current = page;
  }, [loading, loadingMore, hasMore, page]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await kitchensGetAllCategories({});
        setCategories(response.data?.categories || []);
      } catch (error: any) {
        toast.error("Failed to load categories: " + error.message);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!categoryFilter) {
        setSubcategories([]);
        setSubcategoryFilter("");
        return;
      }
      try {
        const response = await kitchensGetSubcategoriesByCategory(
          categoryFilter
        );
        setSubcategories(response.data || []);
      } catch (error: any) {
        toast.error("Failed to load subcategories: " + error.message);
      }
    };
    fetchSubcategories();
  }, [categoryFilter]);

  const fetchKitchens = useCallback(
    async (currentPage: number, isNewSearch: boolean = false) => {
      if (
        loadingRef.current ||
        loadingMoreRef.current ||
        (!hasMoreRef.current && !isNewSearch)
      )
        return;

      isNewSearch ? setLoading(true) : setLoadingMore(true);

      try {
        const params = {
          page: currentPage,
          limit: 8,
          search: searchTerm.trim(),
          category: categoryFilter,
          subcategory: subcategoryFilter,
        };
        const response = await getAllKitches(params);
        if (response?.status && Array.isArray(response.data?.kitchens)) {
          const { kitchens: fetchedKitchens, hasMore } = response.data;
          setKitchens((prev) =>
            isNewSearch ? fetchedKitchens : [...prev, ...fetchedKitchens]
          );
          setHasMore(hasMore);
          setPage(currentPage + 1);
        } else {
          toast.error("Failed to fetch kitchens: Invalid response");
          setHasMore(false);
        }
      } catch (error: any) {
        toast.error(error.message || "Error fetching kitchens");
        setHasMore(false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [searchTerm, categoryFilter, subcategoryFilter]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setKitchens([]);
      setPage(1);
      setHasMore(true);
      fetchKitchens(1, true);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, categoryFilter, subcategoryFilter, fetchKitchens]);

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (
      scrollTop + clientHeight >= scrollHeight - 10 &&
      !loadingRef.current &&
      !loadingMoreRef.current &&
      hasMoreRef.current
    ) {
      fetchKitchens(pageRef.current);
    }
  }, [fetchKitchens]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Kitchens", path: "/apps/kitchen/list" },
          { label: "List", path: "/apps/kitchen/list", active: true },
        ]}
        title={"Kitchens"}
      />

      <div
        className="mb-3"
        style={{ backgroundColor: "#5bd2bc", padding: "10px" }}
      >
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="page-title m-0" style={{ color: "#fff" }}>
            Kitchens
          </h3>
          <Link
            to="/apps/kitchen/new"
            className="btn btn-danger waves-effect waves-light"
          >
            <i className="mdi mdi-plus-circle me-1"></i> Add New Kitchen
          </Link>
        </div>
      </div>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Row className="justify-content-between align-items-center">
                <Col className="col-auto">
                  <Form className="d-flex align-items-center gap-2">
                    <Form.Group>
                      <Form.Control
                        type="search"
                        placeholder="Search kitchens..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ minWidth: "200px" }}
                      />
                    </Form.Group>
                  </Form>
                </Col>
                <Col className="col-auto d-flex gap-2">
                  <Form.Group>
                    <Form.Select
                      value={categoryFilter}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        setCategoryFilter(e.target.value);
                        setSubcategoryFilter("");
                      }}
                      style={{ minWidth: "150px" }}
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.category}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group>
                    <Form.Select
                      value={subcategoryFilter}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setSubcategoryFilter(e.target.value)
                      }
                      style={{ minWidth: "150px" }}
                      disabled={!categoryFilter || subcategories.length === 0}
                    >
                      <option value="">All Subcategories</option>
                      {subcategories.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          {sub.subcategoryName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {loading && kitchens.length === 0 ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading kitchens...</p>
        </div>
      ) : (
        <Row>
          {kitchens.length > 0 ? (
            kitchens.map((item) => (
              <Col key={item._id} md={6} xl={3} className="mb-3">
                <Link to={`/apps/kitchen/${item.slug}`}>
                  <Card className="product-box h-100 shadow-sm">
                    <Card.Body className="d-flex flex-column">
                      <div className="bg-light mb-1">
                        <img
                          src={
                            item.kitchen_image ||
                            "https://via.placeholder.com/150"
                          }
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
                        <h5 className="font-24 mt-0 sp-line-1 bold">
                          {item.kitchen_name}
                        </h5>
                        <div className="text-muted font-14">
                          <div className="d-flex align-items-center mb-1 text-black">
                            <i className="mdi mdi-map-marker me-1"></i>
                            <span>
                              {item.addresses?.street_address},{" "}
                              {item.addresses?.city_name},
                              {item.addresses?.country_name}
                            </span>
                          </div>
                          <div className="d-flex align-items-center mb-1 text-black">
                            <i className="mdi mdi-phone-classic me-1"></i>
                            <span>{item.kitchen_phone_number}</span>
                          </div>
                          <div className="d-flex align-items-center text-black">
                            <i className="mdi mdi-email me-1"></i>
                            <span>{item.owner_email}</span>
                          </div>
                          <div className="d-flex align-items-center text-black">
                            <i className="mdi mdi-home-variant me-1"></i>
                            <span>{item.kitchen_type}</span>
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
                    className="mdi mdi-alert-circle-outline text-muted"
                    style={{ fontSize: "48px" }}
                  ></i>
                  <h4 className="mt-3">No Kitchens Found</h4>
                  <p className="text-muted">
                    {searchTerm || categoryFilter || subcategoryFilter
                      ? "No kitchens match your search criteria."
                      : "There are no kitchens in the system yet."}
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => navigate("/apps/kitchen/new")}
                  >
                    Add New Kitchen
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

export default ListKitchens;
