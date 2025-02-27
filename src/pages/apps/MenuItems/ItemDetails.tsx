import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, Button, Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { deleteItem, getItemById, changeItemStatus } from "../../../server/admin/items";
import { Pencil, Trash } from "lucide-react"; // Icons

interface Item {
  _id: string;
  item_image: string;
  item_name: string;
  item_description: string;
  status: boolean;
  category?: { category: string }; // Adjusted based on FoodItemsList
  subcategory?: { subcategoryName: string }; // Adjusted based on FoodItemsList
}

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await getItemById(id);
        if (response.status) {
          setItem(response.data);
          console.log("Item data:", response.data); // For debugging
        } else {
          toast.error("Failed to load item details.");
        }
      } catch (error) {
        console.error("Error fetching item details:", error);
        toast.error("An error occurred while fetching item details.");
      } finally {
        setLoading(false);
      }
    };
    fetchItemDetails();
  }, [id]);

  const handleEdit = () => {
    navigate(`/apps/kitchen/editing/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await deleteItem(id);
        if (response.status) {
          toast.success("Item deleted successfully!");
          navigate("/apps/kitchen/menu");
        } else {
          toast.error("Failed to delete item.");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error("An error occurred while deleting the item.");
      }
    }
  };

  const handleStatusToggle = async () => {
    if (!id) return;
    try {
      const response = await changeItemStatus(id);
      if (response.status) {
        setItem(prev => prev ? { ...prev, status: response.data.status } : null);
        toast.success("Item status updated successfully!");
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("An error occurred while updating status.");
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!item) {
    return <div className="text-center my-5">No item found.</div>;
  }

  return (
    <div className="container-fluid px-4 py-3">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb m-0">
          <li className="breadcrumb-item">
            <Link to="/apps/kitchen/menu">Kitchen</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {item.item_name}
          </li>
        </ol>
      </nav>

      <div
        className="mb-4 position-relative overflow-hidden"
        style={{
          backgroundColor: "#5bd2bc",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(91, 210, 188, 0.2)",
        }}
      >
        <Row className="align-items-start">
          <Col xs={12} md={3} className="text-center text-md-start">
            <div className="position-relative bg-white rounded-circle d-inline-block">
              <img
                src={item.item_image}
                alt={item.item_name}
                className="rounded-circle"
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                  border: "4px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>
          </Col>
          <Col xs={12} md={6} className="text-center text-md-start mt-4 mt-md-0">
            <div className="d-flex flex-column h-100">
              <h2
                className="text-white mb-3"
                style={{
                  fontSize: "2rem",
                  fontWeight: "600",
                  lineHeight: "1.2",
                }}
              >
                {item.item_name}
              </h2>
              <div
                className="mb-3"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div
                  className="d-flex align-items-center gap-2 mb-2"
                  style={{ color: "rgba(255, 255, 255, 0.9)" }}
                >
                  <i className="mdi mdi-text" style={{ fontSize: "18px" }}></i>
                  <span style={{ fontSize: "0.95rem" }}>
                    Description: {item.item_description}
                  </span>
                </div>
                <div
                  className="d-flex align-items-center gap-2 mb-2"
                  style={{ color: "rgba(255, 255, 255, 0.9)" }}
                >
                  <i className="mdi mdi-folder" style={{ fontSize: "18px" }}></i>
                  <span style={{ fontSize: "0.95rem" }}>
                    Category: {item.category?.category || "Unknown Category"}
                  </span>
                </div>
                <div
                  className="d-flex align-items-center gap-2 mb-2"
                  style={{ color: "rgba(255, 255, 255, 0.9)" }}
                >
                  <i className="mdi mdi-folder-outline" style={{ fontSize: "18px" }}></i>
                  <span style={{ fontSize: "0.95rem" }}>
                    Subcategory: {item.subcategory?.subcategoryName || "Unknown Subcategory"}
                  </span>
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button
                  variant={item.status ? "success" : "secondary"}
                  size="sm"
                  onClick={handleStatusToggle}
                  style={{ fontSize: "0.75rem", fontWeight: "500" }}
                >
                  {item.status ? "Active" : "Inactive"}
                </Button>
              </div>
            </div>
          </Col>
          <Col xs={12} md={3} className="d-flex justify-content-md-end mt-4 mt-md-0">
            <div className="d-flex gap-2">
              <Button
                variant="light"
                className="d-flex align-items-center gap-1 px-3 py-1"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "none",
                  fontSize: "0.9rem",
                  height: "35px",
                }}
                onClick={handleEdit}
              >
                <Pencil size={16} />
                Edit
              </Button>
              <Button
                variant="danger"
                className="d-flex align-items-center gap-1 px-3 py-1"
                style={{
                  backgroundColor: "rgba(220, 53, 69, 0.9)",
                  border: "none",
                  fontSize: "0.9rem",
                  height: "35px",
                }}
                onClick={handleDelete}
              >
                <Trash size={16} />
                Delete
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ItemDetails;