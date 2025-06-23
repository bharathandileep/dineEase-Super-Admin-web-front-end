import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Spinner, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { listItems, deleteItem } from "../../../server/admin/items";
import PageTitle from "../../../components/PageTitle";

interface Item {
  _id: string;
  item_image: string;
  item_name: string;
  item_description: string;
  status: boolean;
  category?: { _id: string; category: string };
  subcategory?: { _id: string; subcategoryName: string };
}

function FoodItemsList() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
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

  const fetchItems = useCallback(
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
        const response = await listItems(params);
        if (response?.status && Array.isArray(response.data?.items)) {
          const { items: fetchedItems, hasMore } = response.data;
          setItems((prev) =>
            isNewSearch ? fetchedItems : [...prev, ...fetchedItems]
          );
          setHasMore(hasMore);
          setPage(currentPage + 1);
        } else {
          toast.error("Failed to fetch items: Invalid response");
          setHasMore(false);
        }
      } catch (error: any) {
        toast.error(error.message || "Error fetching items");
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
      setItems([]);
      setPage(1);
      setHasMore(true);
      fetchItems(1, true);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, categoryFilter, subcategoryFilter, fetchItems]);

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (
      scrollTop + clientHeight >= scrollHeight - 10 &&
      !loadingRef.current &&
      !loadingMoreRef.current &&
      hasMoreRef.current
    ) {
      fetchItems(pageRef.current);
    }
  }, [fetchItems]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (id: string) => {
    navigate(`/apps/menu-item/editing/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await deleteItem(id);
        if (response.status) {
          toast.success("Item deleted successfully!");
          setItems((prevItems) => prevItems.filter((item) => item._id !== id));
        } else {
          toast.error(response.message);
        }
      } catch (error: any) {
        console.error("Error deleting item:", error);
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Kitchen", path: "/apps/menu-item/new" },
          { label: "Food Items", path: "/apps/menu-item/list", active: true },
        ]}
        title={"Food Items"}
      />

      <div
        className="mb-3"
        style={{ backgroundColor: "#5bd2bc", padding: "10px" }}
      >
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="page-title m-0" style={{ color: "#fff" }}>
            Food Items
          </h3>
          <Link
            to="/apps/menu-item/new"
            className="btn btn-danger waves-effect waves-light"
          >
            <i className="mdi mdi-plus-circle me-1"></i> Add New Item
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
                        placeholder="Search by name, description, category, or subcategory..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ minWidth: "200px" }}
                      />
                    </Form.Group>
                  </Form>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {loading && items.length === 0 ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading food items...</p>
        </div>
      ) : (
        <Row>
          {items.length > 0 ? (
            items.map((item) => (
              <Col md={6} xl={3} className="mb-3" key={item._id}>
                <Card
                  className="product-box h-100 shadow-sm"
                  style={{
                    transition: "all 0.3s ease-in-out",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/apps/menu-item/${item._id}`)}
                >
                  <Card.Body className="d-flex flex-column">
                    <div className="product-action">
                      <Button
                        variant="success"
                        size="sm"
                        className="me-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(item._id);
                        }}
                      >
                        <i className="mdi mdi-square-edit-outline"></i>
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item._id);
                        }}
                      >
                        <i className="mdi mdi-delete"></i>
                      </Button>
                    </div>
                    <div className="bg-light mb-1">
                      <img
                        src={
                          item.item_image || "https://via.placeholder.com/150"
                        }
                        alt={item.item_name}
                        className="img-fluid"
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div className="product-info mt-auto">
                      <h5 className="font-16 mt-0 sp-line-1 bold">
                        {item.item_name}
                      </h5>
                      <div className="text-muted font-14">
                        <div className="d-flex align-items-center mb-1 text-black">
                          <i className="mdi mdi-food me-1"></i>
                          <span>
                            {item.category?.category || "Unknown Category"}
                          </span>
                        </div>
                        <div className="d-flex align-items-center mb-1 text-black">
                          <i className="mdi mdi-food-variant me-1"></i>
                          <span>
                            {item.subcategory?.subcategoryName ||
                              "Unknown Subcategory"}
                          </span>
                        </div>
                        <div className="d-flex align-items-center text-black">
                          <i className="mdi mdi-text me-1"></i>
                          <span>
                            {item.item_description?.length > 80
                              ? `${item.item_description.slice(0, 80)}...`
                              : item.item_description || "No description"}
                          </span>
                        </div>
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
                  <i
                    className="mdi mdi-alert-circle-outline text-muted"
                    style={{ fontSize: "48px" }}
                  ></i>
                  <h4 className="mt-3">No Food Items Found</h4>
                  <p className="text-muted">
                    {searchTerm || categoryFilter || subcategoryFilter
                      ? "No food items match your search criteria."
                      : "There are no food items in the system yet."}
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => navigate("/apps/menu-item/new")}
                  >
                    Add New Item
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

export default FoodItemsList;
