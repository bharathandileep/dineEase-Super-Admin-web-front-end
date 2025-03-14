import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Row, Spinner, Form } from "react-bootstrap";
import { 
  getAllOrg, 
  orgGetAllCategories, 
  orgGetSubcategoriesByCategory 
} from "../../../server/admin/organization";
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
  no_of_employees: number;
  addresses: { 
    street_address: string; 
    city_name: string; 
    country_name: string;
    pincode: string;
    state_name: string;
    district_name: string;
    landmark: string;
    address_type: string;
  }[];
  categoryDetails: {
    _id: string;
    category_name: string;
  };
  subcategoryDetails: {
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
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryResponse = await orgGetAllCategories({});
        console.log("Raw Category Response:", categoryResponse);

        let categoryData = [];
        if (categoryResponse?.status && Array.isArray(categoryResponse.data)) {
          categoryData = categoryResponse.data;
        } else if (categoryResponse?.status && Array.isArray(categoryResponse.data?.categories)) {
          categoryData = categoryResponse.data.categories;
        } else if (Array.isArray(categoryResponse)) {
          categoryData = categoryResponse;
        }

        setCategories(Array.isArray(categoryData) ? categoryData : []);
      } catch (error: any) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories: " + error.message);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!categoryFilter) {
        setSubcategories([]);
        return;
      }

      try {
        const subcategoryResponse = await orgGetSubcategoriesByCategory(categoryFilter);
        console.log("Raw Subcategory Response:", subcategoryResponse);

        let subcategoryData = [];
        if (subcategoryResponse?.status && Array.isArray(subcategoryResponse.data)) {
          subcategoryData = subcategoryResponse.data;
        } else if (subcategoryResponse?.status && Array.isArray(subcategoryResponse.data?.subcategories)) {
          subcategoryData = subcategoryResponse.data.subcategories;
        } else if (Array.isArray(subcategoryResponse)) {
          subcategoryData = subcategoryResponse;
        }

        setSubcategories(Array.isArray(subcategoryData) ? subcategoryData : []);
      } catch (error: any) {
        console.error("Error fetching subcategories:", error);
        toast.error("Failed to load subcategories: " + error.message);
        setSubcategories([]);
      }
    };
    fetchSubcategories();
  }, [categoryFilter]);

  const fetchOrganizations = async (
    currentPage: number,
    isNewSearch: boolean = false,
    searchQuery: string = "",
    category: string = "",
    subcategory: string = ""
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
        limit: 4,
        search: searchQuery.trim(),
        category: category || "",
        subcategory: subcategory || "",
      };

      console.log("Fetching with params:", params);

      const response = await getAllOrg(params);
      console.log("API Response:", response);

      if (response.status) {
        const { organizations: fetchedOrganizations, totalPages, totalOrganizations, hasMore: serverHasMore } = response.data;

        if (isNewSearch) {
          setOrganizations(fetchedOrganizations || []);
        } else {
          setOrganizations((prev) => {
            const existingIds = new Set(prev.map((item) => item._id));
            const newItems = (fetchedOrganizations || []).filter(
              (item: any) => !existingIds.has(item._id)
            );
            return [...prev, ...newItems];
          });
        }

        setTotalItems(totalOrganizations || 0);
        setHasMore(serverHasMore); // Use server-provided hasMore
        setPage(currentPage + 1);
      } else {
        toast.error(response.message || "Failed to fetch organizations");
      }
    } catch (error: any) {
      console.error("Error fetching organizations:", error);
      toast.error(error.message || "Error fetching organizations");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchOrganizations(1, true, searchTerm, categoryFilter, subcategoryFilter);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, categoryFilter, subcategoryFilter]);

  useEffect(() => {
    if (!hasMore || loading || loadingMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingRef.current) {
          fetchOrganizations(page, false, searchTerm, categoryFilter, subcategoryFilter);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current && loadMoreRef.current) {
        observerRef.current.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, page, searchTerm, categoryFilter, subcategoryFilter, loading, loadingMore]);

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Organizations", path: "/apps/organizations/list" },
          { label: "List", path: "/apps/organizations/list", active: true },
        ]}
        title={"Organizations"}
      />

      <div className='mb-3' style={{ backgroundColor: "#5bd2bc", padding: "10px" }}>
        <div className='d-flex align-items-center justify-content-between'>
          <h3 className='page-title m-0' style={{ color: "#fff" }}>
            Organizations
          </h3>
          <Link to='/apps/organizations/new' className='btn btn-danger waves-effect waves-light'>
            <i className='mdi mdi-plus-circle me-1'></i> Add New Organization
          </Link>
        </div>
      </div>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Row className='justify-content-between align-items-center'>
                <Col className='col-auto'>
                  <Form className='d-flex align-items-center gap-2'>
                    <Form.Group>
                      <Form.Control
                        type='search'
                        placeholder='Search...'
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setSearchTerm(e.target.value)}
                        style={{ minWidth: "200px" }}
                      />
                    </Form.Group>
                  </Form>
                </Col>
                <Col className='col-auto d-flex gap-2'>
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
                        setSubcategoryFilter(e.target.value)}
                      style={{ minWidth: "150px" }}
                      disabled={!categoryFilter}
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

      {loading ? (
        <div className='text-center my-5'>
          <Spinner animation='border' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </Spinner>
          <p className='mt-2'>Loading organizations...</p>
        </div>
      ) : (
        <Row>
          {organizations.length > 0 ? (
            organizations.map((item) => (
              <Col key={item._id} md={6} xl={3} className='mb-3'>
                <Link to={`/apps/organizations/${item._id}`}>
                  <Card className='product-box h-100 shadow-sm'>
                    <Card.Body className='d-flex flex-column'>
                      <div className='bg-light mb-1'>
                        <img
                          src={item.organizationLogo || "https://via.placeholder.com/150"}
                          alt={item.organizationName}
                          className='img-fluid'
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                      <div className='product-info mt-auto'>
                        <h5 className='font-24 mt-0 sp-line-1 bold'>
                          {item.organizationName}
                        </h5>
                        <div className='text-muted font-14'>
                          <div className='d-flex align-items-center mb-1 text-black'>
                            <i className='mdi mdi-map-marker me-1'></i>
                            <span>
                              {item.addresses[0]?.street_address}, {item.addresses[0]?.city_name}, 
                              {item.addresses[0]?.country_name}
                            </span>
                          </div>
                          <div className='d-flex align-items-center mb-1 text-black'>
                            <i className='mdi mdi-phone-classic me-1'></i>
                            <span>{item.contact_number}</span>
                          </div>
                          <div className='d-flex align-items-center text-black'>
                            <i className='mdi mdi-email me-1'></i>
                            <span>{item.email}</span>
                          </div>
                          <div className='d-flex align-items-center text-black'>
                            <i className='mdi mdi-account-group me-1'></i>
                            <span>{item.no_of_employees} Employees</span>
                          </div>
                          {/* <div className='d-flex align-items-center text-black'>
                            <i className='mdi mdi-shape me-1'></i>
                            <span>
                              {item.categoryDetails?.category_name} - {item.subcategoryDetails?.subcategory_name}
                            </span>
                          </div> */}
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
                <Card.Body className='text-center'>
                  <i className='mdi mdi-alert-circle-outline text-muted' style={{ fontSize: "48px" }}></i>
                  <h4 className='mt-3'>No Organizations Found</h4>
                  <p className='text-muted'>
                    {searchTerm || categoryFilter || subcategoryFilter
                      ? "No organizations match your search criteria."
                      : "There are no organizations in the system yet."}
                  </p>
                  <Button variant='primary' onClick={() => navigate("/apps/organizations/new")}>
                    Add New Organization
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      )}

      {loadingMore && (
        <div className='text-center my-4'>
          <Spinner animation='border' size='sm' /> Loading more...
        </div>
      )}
      <div ref={loadMoreRef} style={{ height: "20px" }} />
    </>
  );
}

export default ListOrganizations;