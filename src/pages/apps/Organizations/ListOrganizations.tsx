import React, { useEffect, useState, useCallback, useRef } from "react";
import { Button, Card, Col, Row, Spinner, Form } from "react-bootstrap";
import {
  getAllOrg,
  orgGetAllCategories,
  orgGetSubcategoriesByCategory,
} from "../../../server/admin/organization";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";
import { toast } from "react-toastify";
import { useAuthDetails } from "../../../hooks/useAuthDetails";

interface Organization {
  _id: string;
  organizationName: string;
  managerName: string;
  register_number: string;
  contact_number: string;
  email: string;
  organizationLogo: string;
  no_of_employees: number;
  slug: string;
  addresses: {
    street_address: string;
    city_name: string;
    country_name: string;
    pincode: string;
    state_name: string;
    district_name: string;
    landmark: string;
    address_type: string;
  };
  categoryInfo: {
    _id: string;
    category_name: string;
  };
  subcategoryInfo: {
    _id: string;
    subcategory_name: string;
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

function ListOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
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
  const { context } = useAuthDetails();

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
        const response = await orgGetAllCategories({});
        let categoryData = [];
        if (response?.status && Array.isArray(response.data)) {
          categoryData = response.data;
        } else if (
          response?.status &&
          Array.isArray(response.data?.categories)
        ) {
          categoryData = response.data.categories;
        } else {
          console.warn("Unexpected categories response structure:", response);
          toast.error("Unexpected categories response structure");
          return;
        }
        setCategories(categoryData);
      } catch (error: any) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories: " + error.message);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!categoryFilter) {
        setSubcategories([]);
        setSubcategoryFilter("");
        return;
      }
      try {
        const response = await orgGetSubcategoriesByCategory(categoryFilter);
        let subcategoryData = [];
        if (response?.status && Array.isArray(response.data)) {
          subcategoryData = response.data;
        } else if (
          response?.status &&
          Array.isArray(response.data?.subcategories)
        ) {
          subcategoryData = response.data.subcategories;
        } else {
          console.warn(
            "Unexpected subcategories response structure:",
            response
          );
          toast.error("Unexpected subcategories response structure");
          return;
        }
        setSubcategories(subcategoryData);
      } catch (error: any) {
        console.error("Error fetching subcategories:", error);
        toast.error("Failed to load subcategories: " + error.message);
      }
    };
    fetchSubcategories();
  }, [categoryFilter]);

  // Fetch organizations
  const fetchOrganizations = useCallback(
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
          limit: 4,
          search: searchTerm.trim(),
          category: categoryFilter,
          subcategory: subcategoryFilter,
        };
        const response = await getAllOrg(params);
        if (response?.status && Array.isArray(response.data?.organizations)) {
          const { organizations: fetchedOrganizations, hasMore } =
            response.data;
          setOrganizations((prev) =>
            isNewSearch
              ? fetchedOrganizations
              : [...prev, ...fetchedOrganizations]
          );
          setHasMore(hasMore);
          setPage(currentPage + 1);
        } else {
          toast.error("Failed to fetch organizations: Invalid response");
          setHasMore(false);
        }
      } catch (error: any) {
        toast.error(error.message || "Error fetching organizations");
        setHasMore(false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [searchTerm, categoryFilter, subcategoryFilter]
  );

  // Handle search and filter changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setOrganizations([]);
      setPage(1);
      setHasMore(true);
      fetchOrganizations(1, true);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, categoryFilter, subcategoryFilter, fetchOrganizations]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (
      scrollTop + clientHeight >= scrollHeight - 10 &&
      !loadingRef.current &&
      !loadingMoreRef.current &&
      hasMoreRef.current
    ) {
      fetchOrganizations(pageRef.current);
    }
  }, [fetchOrganizations]);

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
          { label: "Organizations", path: "/apps/organizations/list" },
          { label: "List", path: "/apps/organizations/list", active: true },
        ]}
        title={"Organizations"}
      />

      <div
        className="mb-3"
        style={{ backgroundColor: "#5bd2bc", padding: "10px" }}
      >
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="page-title m-0" style={{ color: "#fff" }}>
            Organizations
          </h3>
          {context?.contextType !== "Kitchen" && (
            <Link
              to="/apps/organizations/new"
              className="btn btn-danger waves-effect waves-light"
            >
              <i className="mdi mdi-plus-circle me-1"></i> Add New Organization
            </Link>
          )}
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
                        placeholder="Search ..."
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

      {loading && organizations.length === 0 ? (
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
                <Link to={`/apps/organizations/${item.slug}`}>
                  <Card className="product-box h-100 shadow-sm">
                    <Card.Body className="d-flex flex-column">
                      <div className="bg-light mb-1">
                        <img
                          src={
                            item.organizationLogo ||
                            "https://via.placeholder.com/150"
                          }
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
                        <h5 className="font-24 mt-0 sp-line-1 bold">
                          {item.organizationName}
                        </h5>
                        <div className="text-muted font-14">
                          <div className="d-flex align-items-start mb-1 text-black text-wrap text-break">
                            <i className="mdi mdi-map-marker me-1"></i>
                            <span>
                              {item.addresses?.street_address || "N/A"},{" "}
                              {item.addresses?.city_name || "N/A"},{" "}
                              {item.addresses?.state_name || "N/A"},{" "}
                              {item.addresses?.district_name || "N/A"},{" "}
                              {item.addresses?.country_name || "N/A"}
                            </span>
                          </div>
                          <div className="d-flex align-items-center mb-1 text-black">
                            <i className="mdi mdi-phone-classic me-1"></i>
                            <span>{item.contact_number || "N/A"}</span>
                          </div>
                          <div className="d-flex align-items-center text-black">
                            <i className="mdi mdi-email me-1"></i>
                            <span>{item.email || "N/A"}</span>
                          </div>
                          <div className="d-flex align-items-center text-black">
                            <i className="mdi mdi-account-group me-1"></i>
                            <span>{item.no_of_employees} Employees</span>
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
                  <h4 className="mt-3">No Organizations Found</h4>
                  <p className="text-muted">
                    {searchTerm || categoryFilter || subcategoryFilter
                      ? "No organizations match your search criteria."
                      : "There are no organizations in the system yet."}
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => navigate("/apps/organizations/new")}
                  >
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
