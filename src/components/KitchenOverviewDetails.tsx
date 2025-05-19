import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Accordion,
  Tab,
  Tabs,
  Badge,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import {
  deletekitchenDetails,
  toggleKitchenStatus,
} from "../server/admin/kitchens";
import { toast } from "react-toastify";
import { useAuthDetails } from "../hooks/useAuthDetails";

function KitchenOverviewDetails({ kitchenData }: any) {
   const { user, context, isContext, isSuperAdmin } = useAuthDetails();
  const { kitchen } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(true);


  const onEdit = () => navigate(`/apps/kitchen/edit/${kitchen}`);

  const onDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this kitchen?"
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const response = await deletekitchenDetails(kitchen);
      if (response?.status) {
        toast.success(response.message);
        navigate("/apps/kitchen/list");
      } else {
        toast.error(response?.message || "Failed to delete kitchen.");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleStatusToggle = async () => {
    try {
      const response = await toggleKitchenStatus(kitchen);
      if (response.status) {
        setStatus((prev) => !prev);
        toast.success(response.message);
      } else {
        toast.error(response.message || "Failed to toggle kitchen status.");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error toggling kitchen status."
      );
    }
  };
  return (
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
              src={kitchenData?.kitchen_image}
              alt="Business Profile"
              className="rounded-circle"
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                border: "4px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
              }}
            />
            <div
              className="position-absolute bg-success rounded-circle"
              style={{
                border: "2px solid white",
                width: "24px",
                height: "24px",
                bottom: "-10px",
                right: "90px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i
                className="mdi mdi-check text-white"
                style={{ fontSize: "14px" }}
              ></i>
            </div>
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
              {kitchenData?.kitchen_name}
            </h2>
            <div
              className="mb-3"
              style={{ display: "flex", flexDirection: "column" }}
            >
              {[
                { icon: "account", text: "Dine Eas" },
                { icon: "email", text: kitchenData?.owner_email },
                { icon: "phone", text: kitchenData?.owner_phone_number },
              ].map((item, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center gap-2 mb-2"
                  style={{ color: "rgba(255, 255, 255, 0.9)" }}
                >
                  <i
                    className={`mdi mdi-${item.icon}`}
                    style={{ fontSize: "18px" }}
                  ></i>
                  <span style={{ fontSize: "0.95rem" }}>{item.text}</span>
                </div>
              ))}
            </div>
            <div className="d-flex gap-2">
              {[status ? "Active" : "Inactive", "Organic", "Veg"].map(
                (badge, index) => (
                  <Badge
                    key={index}
                    className="rounded-pill px-2 py-1"
                    style={{
                      backgroundColor:
                        badge === "Inactive"
                          ? "rgba(200, 200, 200, 0.9)"
                          : "rgba(255, 255, 255, 0.9)",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      cursor:
                      user.role === "Admin" &&
                        (badge === "Active" || badge === "Inactive")
                          ? "pointer"
                          : "default",
                    }}
                    onClick={
                      user.role === "Admin" &&
                      (badge === "Active" || badge === "Inactive")
                        ? () => handleStatusToggle()
                        : undefined
                    }
                  >
                    <i
                      className={`mdi mdi-${
                        badge === "Active"
                          ? "check-circle text-success"
                          : badge === "Inactive"
                          ? "close-circle text-secondary"
                          : badge === "Organic"
                          ? "leaf text-success"
                          : "food-apple text-success"
                      } me-1`}
                    ></i>
                    {badge}
                  </Badge>
                )
              )}
            </div>
          </div>
        </Col>

        <Col
          xs={12}
          md={3}
          className="d-flex justify-content-md-end mt-4 mt-md-0"
        >
          {user.role === "Admin" ||
            (context?.contextId === kitchenData?._id ? (
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
                  onClick={onEdit}
                >
                  <i className="mdi mdi-pencil"></i>
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
                  onClick={onDelete}
                >
                  <i className="mdi mdi-delete"></i>
                  Delete
                </Button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Button
                  variant="primary"
                  className="d-flex align-items-center gap-1 px-3 py-1"
                  style={{
                    backgroundColor: "#007bff",
                    border: "none",
                    fontSize: "0.9rem",
                    height: "35px",
                  }}
                >
                  <i className="mdi mdi-handshake"></i>
                  Collab Kitchen
                </Button>
              </div>
            ))}
        </Col>
      </Row>
    </div>
  );
}

export default KitchenOverviewDetails;
