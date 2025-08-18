import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Accordion,
  Tab,
  Tabs,
  Badge,
  Modal,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import {
  deletekitchenDetails,
  getCollaborationStatus,
  toggleKitchenStatus,
} from "../services/admin/kitchens";
import { toast } from "react-toastify";
import { useAuthDetails } from "../hooks/useAuthDetails";
import { collaborateKitchen } from "../services/admin/collab";

function KitchenOverviewDetails({ kitchenData }: any) {
  const { user, context, isContext, isSuperAdmin } = useAuthDetails();
  const { kitchen } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(true);
  const { id } = useParams();
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [isCollabed, setIsCollabed] = useState<boolean>();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const onEdit = () => navigate(`/apps/kitchen/edit/${kitchen}`);
  useEffect(() => {
    const fetchCollaborationStatus = async () => {
      if (!kitchenData?._id || !context?.contextId) {
        setIsCollabed(false);
        return;
      }

      try {
        const response = await getCollaborationStatus(
          kitchenData?._id,
          context.contextId
        );
        setIsCollabed(response.data.exists);
      } catch (error: any) {
        console.error("Error fetching collaboration status:", error);
        if (error.status !== 404) {
          toast.error("Failed to fetch collaboration status");
        }
        setIsCollabed(false);
      }
    };

    fetchCollaborationStatus();
  }, [kitchenData?._id, context?.contextId]);

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
      const response = await toggleKitchenStatus(id);
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
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  const handleSelectKitchen = async () => {
    const organization_id = (context?.contextId ?? "").toString();
    if (isCollabed) {
      setShowConfirmModal(true);
      return;
    }
    await executeKitchenAction(organization_id, kitchenData._id);
  };

  const executeKitchenAction = async (
    organization_id: string,
    kitchenId: string
  ) => {
    setIsSelecting(true);

    try {
      const response = await collaborateKitchen(organization_id, kitchenId);
      if (response.status) {
        toast.success(response.message);
        setIsCollabed(!isCollabed);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.message ||
        "An error occurred while processing the kitchen selection.";
      toast.error(errorMessage);
    } finally {
      setIsSelecting(false);
      setShowConfirmModal(false);
    }
  };
  const handleConfirmRemoval = () => {
    const organization_id = (context?.contextId ?? "").toString();
    executeKitchenAction(organization_id, kitchenData._id);
  };

  return (
    <>
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
          <Col
            xs={12}
            md={6}
            className="text-center text-md-start mt-4 mt-md-0"
          >
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
                {[status ? "Active" : "Inactive"].map((badge, index) => (
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
                        user?.role === "Admin" &&
                        (badge === "Active" || badge === "Inactive")
                          ? "pointer"
                          : "default",
                    }}
                    onClick={
                      user?.role === "Admin" &&
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
                ))}
                <Badge
                  className="rounded-pill px-2 py-1"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                  }}
                >
                  <i
                    className={`mdi mdi-leaf text-success
                        me-1`}
                  ></i>
                  {kitchenData?.category?.category_name}
                </Badge>

                <Badge
                  className="rounded-pill px-2 py-1 d-inline-flex align-items-center"
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "500",
                    color:
                      kitchenData?.kitchen_type === "Veg"
                        ? "white"
                        : kitchenData?.kitchen_type === "Non-Veg"
                        ? "white"
                        : "#000",
                  }}
                >
                  <i
                    className={`mdi  ${
                      kitchenData?.kitchen_type === "Veg"
                        ? "mdi-food-apple"
                        : kitchenData?.kitchen_type === "Non-Veg"
                        ? "mdi-food-drumstick"
                        : "mdi-food"
                    } me-1`}
                    style={{
                      color:
                        kitchenData?.kitchen_type === "Veg"
                          ? "white"
                          : kitchenData?.kitchen_type === "Non-Veg"
                          ? "white"
                          : "orange",
                    }}
                  ></i>
                  {kitchenData?.kitchen_type}
                </Badge>
              </div>
            </div>
          </Col>
          {user?.role === "Admin" || context?.contextId === kitchenData?._id ? (
            <Col
              xs={12}
              md={3}
              className="d-flex justify-content-md-end mt-4 mt-md-0"
            >
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
            </Col>
          ) : (
            <>
              <Col
                xs={12}
                md={3}
                className="d-flex justify-content-md-end mt-4 mt-md-0"
              >
                <div className="d-flex gap-2">
                  {isCollabed ? (
                    <Button
                      variant="danger"
                      className="d-flex align-items-center gap-1 px-3 py-1"
                      onClick={handleSelectKitchen}
                      disabled={isSelecting}
                    >
                      {isSelecting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          <span className="ms-1">Processing...</span>
                        </>
                      ) : (
                        <>
                          <i className="mdi mdi-logout"></i>
                          Remove Kitchen
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      className="d-flex align-items-center gap-1 px-3 py-1"
                      style={{
                        backgroundColor: "#007bff",
                        border: "none",
                        fontSize: "0.9rem",
                        height: "35px",
                      }}
                      onClick={handleSelectKitchen}
                      disabled={isSelecting}
                    >
                      {isSelecting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          <span className="ms-1">Processing...</span>
                        </>
                      ) : (
                        <>
                          <i className="mdi mdi-handshake"></i>
                          Select Kitchen
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </Col>
            </>
          )}
        </Row>
      </div>
      {showConfirmModal && (
        <Modal
          show={showConfirmModal}
          onHide={() => setShowConfirmModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Removal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Are you sure you want to remove this kitchen from your
              organization?
            </p>
            <p className="text-muted small">This action cannot be undone.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
              disabled={isSelecting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmRemoval}
              disabled={isSelecting}
            >
              {isSelecting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Removing...
                </>
              ) : (
                "Remove Kitchen"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default KitchenOverviewDetails;
