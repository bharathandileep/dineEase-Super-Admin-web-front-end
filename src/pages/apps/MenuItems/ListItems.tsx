import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Spinner, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  listItems,
  deleteItem,
  changeItemStatus,
} from "../../../server/admin/items";
import { Pencil, Trash } from "lucide-react";

interface Item {
  _id: string;
  item_image: string;
  item_name: string;
  item_description: string;
  status: boolean;
  category?: {
    name: string;
    category: string; // Added to match the actual data structure
  };
  subcategory?: {
    name: string;
    subcategoryName: string; // Added to match the actual data structure
  };
  categoryName?: string;
  subcategoryName?: string;
}

const FoodItemsList = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await listItems();
        if (response.status) {
          setItems(
            response.data.map((item: Item) => ({
              ...item,
              categoryName: item.category?.category || "Unknown Category",
              subcategoryName:
                item.subcategory?.subcategoryName || "Unknown Subcategory",
            }))
          );
        } else {
          toast.error("Failed to load items.");
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        toast.error("An error occurred while fetching items.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/apps/menu-item/editing/${id}`);
  };

  const handleDelete = async (id: any) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await deleteItem(id);
        if (response.status) {
          toast.success("Item deleted successfully!");
          setItems(items.filter((item) => item._id !== id));
        } else {
          toast.error("Failed to delete item.");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error("An error occurred while deleting the item.");
      }
    }
  };
  const filteredItems = items.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.item_name.toLowerCase().includes(searchLower) ||
      (item.categoryName &&
        item.categoryName.toLowerCase().includes(searchLower)) ||
      (item.subcategoryName &&
        item.subcategoryName.toLowerCase().includes(searchLower))
    );
  });

  return (
    <React.Fragment>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb m-2">
          <li className="breadcrumb-item">
            <Link to="/apps/menu-item/new">Kitchen</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Food Items
          </li>
        </ol>
      </nav>

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
        <div className="text-center my-3">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          {filteredItems?.length > 0 ? (
            filteredItems?.map((item: any) => (
              <Col md={6} xl={3} className="mb-3" key={item._id}>
                <Card
                  className="product-box h-100"
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
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item._id);
                        }}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                    <div className="bg-light mb-3 d-flex justify-content-center">
                      <img
                        src={item?.item_image}
                        alt={item?.item_name}
                        className="img-fluid"
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div className="product-info">
                      <h5 className="font-16 mt-0 sp-line-1">
                        <Link to="#" className="text-dark">
                          {item?.item_name}
                        </Link>
                      </h5>
                      <h5 className="m-0">
                        <span className="text-muted">
                          Category: {item?.categoryName}
                        </span>
                      </h5>
                      <h5 className="m-0">
                        <span className="text-muted">
                          Subcategory: {item?.subcategoryName}
                        </span>
                      </h5>
                      <h5 className="m-0">
                        <span className="text-muted">
                          Description: {item?.item_description}
                        </span>
                      </h5>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center">No food items found.</p>
          )}
        </Row>
      )}
    </React.Fragment>
  );
};

export default FoodItemsList;
