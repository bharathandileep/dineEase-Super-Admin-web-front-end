import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Row, Spinner, Form } from "react-bootstrap";
import { 
  getAllKitches, 
  kitchensGetAllCategories, 
  kitchensGetSubcategoriesByCategory 
} from "../../../server/admin/kitchens";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";
import { toast } from "react-toastify";

interface Kitchen {
  _id: string;
  kitchen_name: string;
  kitchen_owner_name: string;
  kitchen_type: string;
  kitchen_phone_number: string;
  kitchen_image: string;
  addresses: { 
    street_address: string; 
    city_name: string; 
    country_name: string;
    pincode: string;
  }[];
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
  const isLoadingRef = useRef(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryResponse = await kitchensGetAllCategories({});
        console.log("Raw Category Response:", categoryResponse);

        let categoryData = [];
        if (categoryResponse?.status && Array.isArray(categoryResponse.data)) {
          categoryData = categoryResponse.data;
        } else if (categoryResponse?.status && Array.isArray(categoryResponse.data?.categories)) {
          categoryData = categoryResponse.data.categories;
        } else if (Array.isArray(categoryResponse)) {
          categoryData = categoryResponse;
        }

        console.log("Extracted Category Data:", categoryData);
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
        const subcategoryResponse = await kitchensGetSubcategoriesByCategory(categoryFilter);
        console.log("Raw Subcategory Response:", subcategoryResponse);

        let subcategoryData = [];
        if (subcategoryResponse?.status && Array.isArray(subcategoryResponse.data)) {
          subcategoryData = subcategoryResponse.data;
        } else if (subcategoryResponse?.status && Array.isArray(subcategoryResponse.data?.subcategories)) {
          subcategoryData = subcategoryResponse.data.subcategories;
        } else if (Array.isArray(subcategoryResponse)) {
          subcategoryData = subcategoryResponse;
        }

        console.log("Extracted Subcategory Data:", subcategoryData);
        setSubcategories(Array.isArray(subcategoryData) ? subcategoryData : []);
      } catch (error: any) {
        console.error("Error fetching subcategories:", error);
        toast.error("Failed to load subcategories: " + error.message);
        setSubcategories([]);
      }
    };
    fetchSubcategories();
  }, [categoryFilter]);

  const fetchKitchens = async (
    currentPage: number,
    isNewSearch: boolean = false,
    searchQuery: string = "",
    category: string = "",
    subcategory: string = ""
  ) => {
    if (isLoadingRef.current) {
      console.log("Fetch skipped: Already loading");
      return;
    }

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
        search: searchQuery || "",
        category: category || "",
        subcategory: subcategory || "",
      };
      console.log("Fetching kitchens with params:", params);

      const response = await getAllKitches(params);
      if (response.status) {
        const { kitchens: fetchedKitchens, totalPages, totalKitchens } = response.data;
        console.log("Fetched kitchens:", fetchedKitchens);

        if (isNewSearch) {
          setKitchens(fetchedKitchens || []);
        } else {
          setKitchens((prev) => {
            const existingIds = new Set(prev.map((item) => item._id));
            const uniqueNewItems = (fetchedKitchens || []).filter(
              (item: Kitchen) => !existingIds.has(item._id)
            );
            console.log("Appending unique kitchens:", uniqueNewItems);
            return [...prev, ...uniqueNewItems];
          });
        }

        setTotalItems(totalKitchens || 0);
        setHasMore(currentPage < totalPages);
        setPage(currentPage + 1);
        console.log("Updated page to:", currentPage + 1);
        console.log("Has more kitchens:", currentPage < totalPages);
      } else {
        toast.error(response.message || "Failed to fetch kitchens");
        setHasMore(false);
      }
    } catch (error: any) {
      console.error("Error fetching kitchens:", error);
      toast.error(error.message || "Error fetching kitchens");
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  };

  // Debounced search and filter effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchKitchens(1, true, searchTerm, categoryFilter, subcategoryFilter);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, categoryFilter, subcategoryFilter]);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingRef.current || !hasMore) {
        console.log("Scroll skipped: Loading or no more kitchens");
        return;
      }

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      console.log("Scroll position:", { scrollTop, scrollHeight, clientHeight });

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        console.log("Triggering fetch for page:", page);
        fetchKitchens(page, false, searchTerm, categoryFilter, subcategoryFilter);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, page, searchTerm, categoryFilter, subcategoryFilter]);

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Kitchens", path: "/apps/kitchen/list" },
          { label: "List", path: "/apps/kitchen/list", active: true },
        ]}
        title={"Kitchens"}
      />

      <div className='mb-3' style={{ backgroundColor: "#5bd2bc", padding: "10px" }}>
        <div className='d-flex align-items-center justify-content-between'>
          <h3 className='page-title m-0' style={{ color: "#fff" }}>
            Kitchens
          </h3>
          <Link to='/apps/kitchen/new' className='btn btn-danger waves-effect waves-light'>
            <i className='mdi mdi-plus-circle me-1'></i> Add New Kitchen
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
                        placeholder='Search kitchens...'
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
                      {Array.isArray(categories) && categories.length > 0 ? (
                        categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.category}
                          </option>
                        ))
                      ) : (
                        <option disabled>No categories available</option>
                      )}
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
                      {Array.isArray(subcategories) && subcategories.length > 0 ? (
                        subcategories.map((sub) => (
                          <option key={sub._id} value={sub._id}>
                            {sub.subcategoryName}
                          </option>
                        ))
                      ) : (
                        <option disabled>No subcategories available</option>
                      )}
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
          <p className='mt-2'>Loading kitchens...</p>
        </div>
      ) : (
        <Row>
          {kitchens.length > 0 ? (
            kitchens.map((item) => (
              <Col key={item._id} md={6} xl={3} className='mb-3'>
                <Link to={`/apps/kitchen/${item._id}`}>
                  <Card className='product-box h-100 shadow-sm'>
                    <Card.Body className='d-flex flex-column'>
                      <div className='bg-light mb-1'>
                        <img
                          src={item.kitchen_image || "https://via.placeholder.com/150"}
                          alt={item.kitchen_name}
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
                          {item.kitchen_name}
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
                            <span>{item.kitchen_phone_number}</span>
                          </div>
                          <div className='d-flex align-items-center text-black'>
                            <i className='mdi mdi-email me-1'></i>
                            <span>{item.owner_email}</span>
                          </div>
                          <div className='d-flex align-items-center text-black'>
                            <i className='mdi mdi-home-variant me-1'></i>
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
                <Card.Body className='text-center'>
                  <i className='mdi mdi-alert-circle-outline text-muted' style={{ fontSize: "48px" }}></i>
                  <h4 className='mt-3'>No Kitchens Found</h4>
                  <p className='text-muted'>
                    {searchTerm || categoryFilter || subcategoryFilter
                      ? "No kitchens match your search criteria."
                      : "There are no kitchens in the system yet."}
                  </p>
                  <Button variant='primary' onClick={() => navigate("/apps/kitchen/new")}>
                    Add New Kitchen
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
    </>
  );
}

export default ListKitchens;