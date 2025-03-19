import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deletekitchenDetails,
  getkitchenDetails,
  toggleKitchenStatus,
} from "../../../server/admin/kitchens";
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
import { toast } from "react-toastify";
import { listItems } from "../../../server/admin/items";
import { createNewkitchenMenu } from "../../../server/admin/kitchensMenuCreation";
import { getMenuItemsByKitchen } from "../../../server/admin/menu";
import { collaborateKitchen } from "../../../server/admin/collab";
import { getAccessDetailsFromLocalStorage } from "../../../helpers/api/utils";

// Define interface for menu items
interface MenuItem {
  _id: string;
  item_id: {
    _id: string;
    item_name: string;
    item_price: number;
    description: string;
    ingredients: string[];
    isAvailable: boolean;
    custom_image: string;
    reviews_id: any[];
  };
}

interface CartItem extends MenuItem {
  quantity: number;
}

type FoodItem = {
  item_name: string;
  description: string;
  custom_image: string;
  item_price: number;
  ingredients: string[];
  reviews_id: { comment: string; rating: number }[];
};

type TransformedData = Record<string, Record<string, FoodItem[]>>;

export interface IKitchenDetails {
  _id: string;
  kitchen_name: string;
  kitchen_status: string;
  kitchen_owner_name: string;
  owner_email: string;
  owner_phone_number: string;
  restaurant_type: string;
  kitchen_type: string;
  kitchen_image: string;
  status: boolean;
  isapproved: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  addresses: Array<{
    _id: string;
    street_address: string;
    city_name: string;
    state_name: string;
    district_name: string;
    pincode: string;
    country_name: string;
  }>;
  fssaiDetails: Array<{
    _id: string;
    ffsai_certificate_number: string;
    expiry_date: string;
    is_verified: boolean;
    ffsai_certificate_image: string;
    ffsai_card_owner_name: string;
  }>;
  panDetails: Array<{
    pan_card_image: string | undefined;
    _id: string;
    pan_card_number: string;
    pan_card_user_name: string;
    is_verified: boolean;
  }>;
  gstDetails: Array<{
    gst_certificate_image: string | undefined;
    _id: string;
    gst_number: string;
    expiry_date: string;
    is_verified: boolean;
  }>;
}

function KitchensDetailss() {
  const { id: kitchen_id } = useParams();
  const [kitchenData, setKitchenData] = useState<IKitchenDetails | null>(null);
  const [groupedItems, setGroupedItems] = useState<TransformedData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(true);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [collabError, setCollabError] = useState<string | null>(null);
  const [collabSuccess, setCollabSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [activeKey, setActiveKey] = useState<string>("");

  const handleStatusToggle = async () => {
    setLoading(true);
    try {
      const response = await toggleKitchenStatus(kitchen_id);
      if (response?.status) {
        setStatus(!status);
        toast.success(response.message);
      } else {
        toast.error(response?.message || "Failed to toggle kitchen status.");
      }
    } catch (error) {
      toast.error("An error occurred while toggling kitchen status.");
    } finally {
      setLoading(false);
    }
  };

  // Enhanced collaboration function
  const handleSelectKitchen = async () => {
    // Reset any previous collab states
    setCollabError(null);
    setCollabSuccess(false);
    
    const accessDetails = getAccessDetailsFromLocalStorage();
    const organization_id = accessDetails?.orgId;
    
    // Validate required data
    if (!kitchen_id) {
      setCollabError("Kitchen ID is missing.");
      toast.error("Kitchen ID is missing.");
      return;
    }
    
    if (!organization_id) {
      setCollabError("Organization ID is missing. Please make sure you're logged in.");
      toast.error("Organization ID is missing. Please make sure you're logged in.");
      return;
    }

    // Set loading state
    setIsSelecting(true);
    
    try {
      // Call the API to create collaboration
      const response = await collaborateKitchen(organization_id, kitchen_id);
      
      if (response) {
        if (response.collaboration) {
          setCollabSuccess(true);
          toast.success(response.message || "Kitchen selected successfully!");
          
          // Ask user if they want to navigate to selected kitchens page
          const viewNow = window.confirm(
            "Kitchen selected successfully! Do you want to view your selected kitchens now?"
          );
          
          if (viewNow) {
            navigate("/apps/organizations/selected-kitchens");
          }
        } else {
          // Handle case where response exists but collaboration wasn't created
          setCollabError(response.message || "Failed to select kitchen.");
          toast.error(response.message || "Failed to select kitchen.");
        }
      } else {
        // Handle case where response is empty or undefined
        setCollabError("Received an invalid response from the server.");
        toast.error("Received an invalid response from the server.");
      }
    } catch (error: any) {
      // Handle errors from API call
      console.error("Error selecting kitchen:", error);
      
      // Extract error message if available, otherwise use generic message
      const errorMessage = error.message || "An error occurred while selecting the kitchen.";
      setCollabError(errorMessage);
      toast.error(errorMessage);
      
      // If the error is about existing collaboration, we can handle it specially
      if (errorMessage.includes("already exists")) {
        toast.info("This kitchen is already in your selected kitchens list.");
      }
    } finally {
      // Reset loading state
      setIsSelecting(false);
    }
  };
   const onEdit = () => {
    navigate(`/apps/kitchen/edit/${kitchen_id}`);
  };

  const onDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this kitchen?"
    );

    if (!confirmDelete) return;

    setLoading(true);
    try {
      const response = await deletekitchenDetails(kitchen_id);

      if (response?.status) {
        toast.success(response.message);
        navigate("/apps/kitchen/list");
      } else {
        toast.error(response?.message || "Failed to delete kitchen.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting kitchen details.");
    } finally {
      setLoading(false);
    }
  };

  const transformFoodData = (items: any[]): TransformedData => {
    const transformed = items.reduce((acc: TransformedData, item) => {
      const categoryName = item.category?.category || "Allitems";
      const subcategoryName = item.subcategory?.subcategoryName || "Allitems";

      if (!acc[categoryName]) {
        acc[categoryName] = {};
      }

      if (!acc[categoryName][subcategoryName]) {
        acc[categoryName][subcategoryName] = [];
      }

      acc[categoryName][subcategoryName].push({
        item_name: item.item_name,
        description: item.description,
        custom_image: item.custom_image,
        item_price: item.item_price || 0,
        ingredients: item.ingredients || [],
        reviews_id: item.reviews_id || [],
      });

      return acc;
    }, {} as TransformedData);

    return transformed;
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const response = await getMenuItemsByKitchen(kitchen_id);
        if (response.data && response.data.items_id) {
          const items = response.data.items_id;
          const transformedData = transformFoodData(items);
          setGroupedItems(transformedData);

          const firstCategory = Object.keys(transformedData)[0];
          if (firstCategory) {
            setActiveKey(firstCategory);
          }
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
        toast.error("Failed to load menu items");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [kitchen_id]);

  useEffect(() => {
    const fetchKitchenDetails = async () => {
      setLoading(true);
      try {
        const response = await getkitchenDetails(kitchen_id);
        setKitchenData(response.data);
        setStatus(response.data.status);
      } catch (error) {
        console.error("Error fetching kitchen details:", error);
        toast.error("Failed to load kitchen details");
      } finally {
        setLoading(false);
      }
    };
    fetchKitchenDetails();
  }, [kitchen_id]);

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

  if (!kitchenData) {
    return <div className="alert alert-warning">No kitchen data found</div>;
  }

  return (
    <div className="container-fluid px-4 py-3">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb m-0">
          <li className="breadcrumb-item">
            <Link to="/products">Products</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {kitchenData?.kitchen_name}
          </li>
        </ol>
      </nav>
      
      {/* Show collaboration success/error messages if any */}
      {collabSuccess && (
        <div className="alert alert-success alert-dismissible fade show mb-3" role="alert">
          Kitchen collaboration request sent successfully!
          <button type="button" className="btn-close" 
            onClick={() => setCollabSuccess(false)} 
            aria-label="Close"></button>
        </div>
      )}
      
      {collabError && (
        <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
          {collabError}
          <button type="button" className="btn-close" 
            onClick={() => setCollabError(null)} 
            aria-label="Close"></button>
        </div>
      )}
      
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
                          badge === "Active" || badge === "Inactive"
                            ? "pointer"
                            : "default",
                      }}
                      onClick={
                        badge === "Active" || badge === "Inactive"
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
            <div className="d-flex gap-2">
              {/* Collab Kitchen Button */}
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
                disabled={isSelecting || collabSuccess}
              >
                {isSelecting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span className="ms-1">Processing...</span>
                  </>
                ) : collabSuccess ? (
                  <>
                    <i className="mdi mdi-check-circle"></i>
                    Collaboration Sent
                  </>
                ) : (
                  <>
                    <i className="mdi mdi-handshake"></i>
                    Collab Kitchen
                  </>
                )}
              </Button>
            </div>
          </Col>
        </Row>
      </div>
      
      {/* Rest of your component */}
      <Row className="mb-4 g-3">
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="card-title text-bold text-black">
                  FSSAI License
                </h5>
              </div>
              {kitchenData?.fssaiDetails?.[0]?.ffsai_certificate_image && (
                <img
                  src={kitchenData.fssaiDetails[0].ffsai_certificate_image}
                  alt="FSSAI Certificate"
                  className="img-fluid rounded"
                  style={{
                    maxHeight: "150px",
                    objectFit: "cover",
                    width: "100%",
                  }}
                />
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="card-title text-bold text-black">PAN Details</h5>
              </div>
              {kitchenData?.panDetails?.[0]?.pan_card_image && (
                <img
                  src={kitchenData.panDetails[0].pan_card_image}
                  alt="PAN Card"
                  className="img-fluid rounded"
                  style={{ maxHeight: "150px", objectFit: "cover" }}
                />
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="card-title text-bold text-black">
                  GST Registration
                </h5>
              </div>
              {kitchenData?.gstDetails?.[0]?.gst_certificate_image && (
                <img
                  src={kitchenData.gstDetails[0].gst_certificate_image}
                  alt="GST Certificate"
                  className="img-fluid rounded"
                  style={{
                    maxHeight: "150px",
                    objectFit: "cover",
                    width: "100%",
                  }}
                />
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h5 className="card-title text-bold text-black mb-3">
                Location Details
              </h5>
              <p className="card-text mb-4">
                {[
                  kitchenData?.addresses?.[0]?.street_address,
                  kitchenData?.addresses?.[0]?.city_name,
                  kitchenData?.addresses?.[0]?.district_name,
                  kitchenData?.addresses?.[0]?.state_name,
                  kitchenData?.addresses?.[0]?.pincode,
                  kitchenData?.addresses?.[0]?.country_name,
                ]
                  .filter(Boolean)
                  .join(", ") || "No address available"}
              </p>
              <div
                className="map-container"
                style={{ height: "200px", width: "100%" }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.769314809927!2d76.32868731479452!3d10.031941892830645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080c31865e74c1%3A0x4742c12c4f2a903f!2sCochin%20University%20of%20Science%20and%20Technology!5e0!3m2!1sen!2sin!4v1645446314016!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: "8px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {Object.keys(groupedItems).length !== 0 ? (
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0">Choose Menu</h4>
              <Button
                variant="light"
                className="d-flex align-items-center gap-1 px-3 py-1"
                style={{
                  backgroundColor: "bg-success",
                  border: "none",
                  fontSize: "0.9rem",
                  height: "35px",
                }}
                onClick={() => navigate(`/apps/kitchen/kitchen-menu`)}
              >
                Our menu
              </Button>
            </div>

            {loading ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100px" }}
              >
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <Tabs
                activeKey={activeKey}
                onSelect={(k: any) => setActiveKey(k)}
              >
                {Object.keys(groupedItems).length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      fontSize: "18px",
                      color: "#666",
                    }}
                  >
                    No menus are chosen.
                  </div>
                ) : (
                  Object.entries(groupedItems).map(
                    ([category, subcategories]) => (
                      <Tab eventKey={category} title={category} key={category}>
                        <Accordion>
                          {Object.entries(subcategories).map(
                            ([subcategory, items]) => (
                              <Accordion.Item
                                key={subcategory}
                                eventKey={subcategory}
                              >
                                <Accordion.Header>
                                  {subcategory}
                                </Accordion.Header>
                                <Accordion.Body>
                                  {items.length === 0 ? (
                                    <div
                                      style={{
                                        textAlign: "center",
                                        fontSize: "16px",
                                        color: "#888",
                                      }}
                                    >
                                      No menus are chosen.
                                    </div>
                                  ) : (
                                    <div
                                      style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "15px",
                                      }}
                                    >
                                      {items.map((item, idx) => (
                                        <div
                                          key={idx}
                                          style={{
                                            flex: "1 1 300px",
                                            maxWidth: "300px",
                                            border: "1px solid #ddd",
                                            borderRadius: "8px",
                                            padding: "15px",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            textAlign: "center",
                                            boxShadow:
                                              "0 4px 8px rgba(0, 0, 0, 0.1)",
                                            backgroundColor: "#fff",
                                          }}
                                        >
                                          <div
                                            style={{
                                              width: "150px",
                                              height: "150px",
                                              marginBottom: "10px",
                                            }}
                                          >
                                            <img
                                              src={
                                                item.custom_image ||
                                                "https://via.placeholder.com/150"
                                              }
                                              alt={item.item_name}
                                              style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                              }}
                                            />
                                          </div>
                                          <h6
                                            style={{
                                              marginBottom: "5px",
                                              fontSize: "18px",
                                            }}
                                          >
                                            {item.item_name}
                                          </h6>
                                          <small
                                            style={{
                                              color: "#666",
                                              marginBottom: "10px",
                                            }}
                                          >
                                            {item.description}
                                          </small>
                                          <div style={{ marginBottom: "10px" }}>
                                            <strong>Price:</strong> $
                                            {item.item_price?.toFixed(2) ||
                                              "N/A"}
                                          </div>
                                          <div
                                            style={{
                                              marginBottom: "10px",
                                              width: "100%",
                                            }}
                                          >
                                            <strong>Ingredients:</strong>
                                            {item.ingredients &&
                                            item.ingredients.length > 0 ? (
                                              <span
                                                style={{ textAlign: "center" }}
                                              >
                                                {item.ingredients.join(", ")}
                                              </span>
                                            ) : (
                                              <span className="text-muted">
                                                No ingredients available
                                              </span>
                                            )}
                                          </div>

                                          <div
                                            style={{
                                              marginBottom: "10px",
                                              width: "100%",
                                            }}
                                          >
                                            <strong>Reviews:</strong>
                                            {item.reviews_id &&
                                            item.reviews_id.length > 0 ? (
                                              <span
                                                style={{
                                                  textAlign: "center",
                                                  fontSize: "0.85rem",
                                                }}
                                              >
                                                {item.reviews_id
                                                  .map(
                                                    (review) =>
                                                      `"${
                                                        review.comment
                                                      }" (${Array(review.rating)
                                                        .fill("★")
                                                        .join("")}${Array(
                                                        5 - review.rating
                                                      )
                                                        .fill("☆")
                                                        .join("")})`
                                                  )
                                                  .join(", ")}
                                              </span>
                                            ) : (
                                              <span className="text-muted">
                                                No reviews yet.
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </Accordion.Body>
                              </Accordion.Item>
                            )
                          )}
                        </Accordion>
                      </Tab>
                    )
                  )
                )}
              </Tabs>
            )}
          </Card.Body>
        </Card>
      ) : (
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0">Choose Menu</h4>
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                fontSize: "18px",
                color: "#666",
              }}
            >
              No items found
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default KitchensDetailss;