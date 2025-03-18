import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button, Card, Col, Row, Spinner, Form } from "react-bootstrap";
import { 
  getAllKitches, 
  kitchensGetAllCategories, 
  kitchensGetSubcategoriesByCategory 
} from "../../../server/admin/kitchens";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";

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
  const [loading, setLoading] = useState(false);
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
  const observer = useRef<IntersectionObserver | null>(null);
  const lastFetchParams = useRef<string>("");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await kitchensGetAllCategories({});
        let categoryData = [];
        if (response?.status && Array.isArray(response.data)) {
          categoryData = response.data; // Direct array of categories
        } else if (response?.status && Array.isArray(response.data?.categories)) {
          categoryData = response.data.categories; // Nested categories
        } else {
          console.warn("Unexpected categories response structure:", response);
        }
        setCategories(categoryData);
      } catch (error: any) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories: " + error.message);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories based on categoryFilter
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!categoryFilter) {
        setSubcategories([]);
        return;
      }
      try {
        const response = await kitchensGetSubcategoriesByCategory(categoryFilter);
        let subcategoryData = [];
        if (response?.status && Array.isArray(response.data)) {
          subcategoryData = response.data; // Direct array of subcategories
        } else if (response?.status && Array.isArray(response.data?.subcategories)) {
          subcategoryData = response.data.subcategories; // Nested subcategories
        } else {
          console.warn("Unexpected subcategories response structure:", response);
        }
        setSubcategories(subcategoryData);
      } catch (error: any) {
        console.error("Error fetching subcategories:", error);
        toast.error("Failed to load subcategories: " + error.message);
        setSubcategories([]);
      }
    };
    fetchSubcategories();
  }, [categoryFilter]);

  // Fetch kitchens
  const fetchKitchens = useCallback(async (
    currentPage: number,
    isNewSearch: boolean = false,
    searchQuery: string = "",
    category: string = "",
    subcategory: string = ""
  ) => {
    if (isLoadingRef.current) return;

    const paramsKey = JSON.stringify({ page: currentPage, searchQuery, category, subcategory });
    if (!isNewSearch && lastFetchParams.current === paramsKey) {
  
      return;
    }

    isLoadingRef.current = true;
    if (isNewSearch) setLoading(true);
    else setLoadingMore(true);

    try {
      const params = {
        page: currentPage,
        limit: 4,
        search: searchQuery.trim(),
        category,
        subcategory,
      };

      const response = await getAllKitches(params);
      if (response?.status && Array.isArray(response.data?.kitchens)) {
        const { kitchens: fetchedKitchens, totalPages, totalKitchens, hasMore } = response.data;

        setKitchens((prev) => {
          const existingIds = new Set(prev.map(k => k._id));
          const uniqueNewKitchens = fetchedKitchens.filter((k: Kitchen) => !existingIds.has(k._id));
          const updatedList = isNewSearch ? fetchedKitchens : [...prev, ...uniqueNewKitchens];
          return updatedList.sort((a: { kitchen_name: string; _id: string; }, b: { kitchen_name: any; _id: any; }) => {
            const nameCompare = a.kitchen_name.localeCompare(b.kitchen_name);
            return nameCompare !== 0 ? nameCompare : a._id.localeCompare(b._id);
          });
        });
        setTotalItems(totalKitchens || 0);
        setHasMore(hasMore || currentPage < totalPages);
        setPage(currentPage + 1);
        lastFetchParams.current = paramsKey;
      } else {
        console.warn("Invalid response structure:", response);
        toast.error("Failed to fetch kitchens: Invalid response");
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
  }, []);

  // Debounced fetch for search and filters
  const debouncedFetchKitchens = useCallback(
    debounce((search, category, subcategory) => {
      setKitchens([]);
      setPage(1);
      lastFetchParams.current = "";
      fetchKitchens(1, true, search, category, subcategory);
    }, 500),
    [fetchKitchens]
  );

  useEffect(() => {
    debouncedFetchKitchens(searchTerm, categoryFilter, subcategoryFilter);
  }, [searchTerm, categoryFilter, subcategoryFilter, debouncedFetchKitchens]);

  // Intersection Observer for infinite scroll
  const lastKitchenElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || loadingMore || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !isLoadingRef.current) {
            fetchKitchens(page, false, searchTerm, categoryFilter, subcategoryFilter);
          }
        },
        { threshold: 0.5 }
      );

      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore, page, searchTerm, categoryFilter, subcategoryFilter, fetchKitchens]
  );

  // Initial fetch on mount
  useEffect(() => {
    fetchKitchens(1, true);
  }, [fetchKitchens]);

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
          <h3 className='page-title m-0' style={{ color: "#fff" }}>Kitchens</h3>
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
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
                        setSubcategoryFilter(""); // Reset subcategory when category changes
                      }}
                      style={{ minWidth: "150px" }}
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.category}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group>
                    <Form.Select
                      value={subcategoryFilter}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSubcategoryFilter(e.target.value)}
                      style={{ minWidth: "150px" }}
                      disabled={!categoryFilter || subcategories.length === 0}
                    >
                      <option value="">All Subcategories</option>
                      {subcategories.map((sub) => (
                        <option key={sub._id} value={sub._id}>{sub.subcategoryName}</option>
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
        <div className='text-center my-5'>
          <Spinner animation='border' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </Spinner>
          <p className='mt-2'>Loading kitchens...</p>
        </div>
      ) : (
        <Row>
          {kitchens.length > 0 ? (
            kitchens.map((item, index) => {
              const isLastElement = index === kitchens.length - 1;
              return (
                <Col 
                  key={item._id} 
                  md={6} 
                  xl={3} 
                  className='mb-3' 
                  ref={isLastElement ? lastKitchenElementRef : null}
                >
                  <Link to={`/apps/kitchen/${item._id}`}>
                    <Card className='product-box h-100 shadow-sm'>
                      <Card.Body className='d-flex flex-column'>
                        <div className='bg-light mb-1'>
                          <img
                            src={item.kitchen_image || "https://via.placeholder.com/150"}
                            alt={item.kitchen_name}
                            className='img-fluid'
                            style={{ width: "100%", height: "200px", objectFit: "contain" }}
                          />
                        </div>
                        <div className='product-info mt-auto'>
                          <h5 className='font-24 mt-0 sp-line-1 bold'>{item.kitchen_name}</h5>
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
              );
            })
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