import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Spinner, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { listItems, deleteItem, changeItemStatus } from "../../../server/admin/items";
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

const FoodItemsList = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const isLoadingRef = useRef(false);

  const fetchItems = async (
    currentPage: number,
    isNewSearch: boolean = false,
    searchQuery: string = ""
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
        limit: 4, // Fixed limit of 4 items per page
        search: searchQuery,
      };
      console.log("Fetching items with params:", params);

      const response = await listItems(params);
      if (response.status) {
        const { items: newItems, pagination } = response.data;
        console.log("Fetched items:", newItems);
        console.log("Pagination data:", pagination);

        if (isNewSearch) {
          setItems(newItems);
        } else {
          setItems((prev) => {
            const existingIds = new Set(prev.map((item) => item._id));
            const uniqueNewItems = newItems.filter(
              (item: Item) => !existingIds.has(item._id)
            );
            console.log("Appending unique items:", uniqueNewItems);
            return [...prev, ...uniqueNewItems];
          });
        }

        setTotalItems(pagination.totalItems);
        setHasMore(currentPage < pagination.totalPages);
        setPage(currentPage + 1); // Increment page after successful fetch
        console.log("Updated page to:", currentPage + 1);
        console.log("Has more items:", currentPage < pagination.totalPages);
      } else {
        toast.error("Failed to load items.");
        setHasMore(false);
      }
    } catch (error: any) {
      console.error("Error fetching items:", error);
      toast.error("An error occurred while fetching items.");
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchItems(1, true, searchTerm);
    }, 500); // Debounce search by 500ms

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingRef.current || !hasMore) {
        console.log("Scroll skipped: Loading or no more items");
        return;
      }

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      console.log("Scroll position:", { scrollTop, scrollHeight, clientHeight });

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        console.log("Triggering fetch for page:", page);
        fetchItems(page, false, searchTerm);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, page, searchTerm]);

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
          setTotalItems((prev) => prev - 1);
        } else {
          toast.error("Failed to delete item.");
        }
      } catch (error: any) {
        console.error("Error deleting item:", error);
        toast.error("An error occurred while deleting the item.");
      }
    }
  };

  return (
    <React.Fragment>
      <PageTitle
        breadCrumbItems={[
          { label: "Kitchen", path: "/apps/menu-item/new" },
          { label: "Food Items", path: "/apps/menu-item/list", active: true },
        ]}
        title={"Food Items"}
      />

      <div className="mb-3" style={{ backgroundColor: "#5bd2bc", padding: "10px" }}>
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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </form>
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
                        src={item.item_image || "https://via.placeholder.com/150"}
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
                          <span>{item.category?.category || "Unknown Category"}</span>
                        </div>
                        <div className="d-flex align-items-center mb-1 text-black">
                          <i className="mdi mdi-food-variant me-1"></i>
                          <span>{item.subcategory?.subcategoryName || "Unknown Subcategory"}</span>
                        </div>
                        <div className="d-flex align-items-center text-black">
                          <i className="mdi mdi-text me-1"></i>
                          <span>{item.item_description}</span>
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
                    {searchTerm
                      ? `No food items match your search criteria "${searchTerm}".`
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
    </React.Fragment>
  );
};

export default FoodItemsList;