import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  getCollaborationById,
  getCollaborationDetails,
} from "../../../services/admin/collab"; // Frontend controller
import { MapPin, Building, Calendar } from "lucide-react";
import "./Colloborations.scss";
import { Tabs, Tab } from "react-bootstrap";
import { getkitchenDetails } from "../../../services/admin/kitchens";
import { IKitchenDetails } from "../Organizations/KitchenView";
import { getOrgDetails } from "../../../services/admin/organization";
import { getMenuItemsByKitchen } from "../../../services/admin/menu";
import {
  formatDateToDDMMYY,
} from "../../../helpers/api/utils";
import { Button, Accordion, Badge } from "react-bootstrap";
import { TransformedData } from "../kitchen/KitchensDetails";
import { useAuthDetails } from "../../../hooks/useAuthDetails";

interface Collaboration {
  _id: string;
  organization: {
    _id: string;
    name: string;
    logo: string | null;
    slug: string;
  };
  kitchen: {
    _id: string;
    name: string;
    image: string | null;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
}

const CollaborationDetailsPage: React.FC = () => {
  const { user, context, isContext, isSuperAdmin } = useAuthDetails();
  const { id } = useParams<{ id: string }>();
  const [collaboration, setCollaboration] = useState<any | null>(null);
  const [organization, setOrgData] = useState<any | null>(null);
  const [groupedItems, setGroupedItems] = useState<TransformedData>({});
  const [activeKey, setActiveKey] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("collabDetails");
  const [status, setStatus] = useState<boolean>(true);
  const [kitchenData, setKitchenData] = useState<any | null>(null);
  const [collaborationData, setCollaborationData] = useState(null);
  // const {
  //   organization,
  //   kitchen,
  //   quotationDetails,
  // } = collaborationData;

  const transformFoodData = (items: any[]): TransformedData => {
    const transformed = items.reduce((acc: TransformedData, item) => {
      const categoryName = item.item_id?.category?.category || "Allitems";
      const subcategoryName =
        item.item_id?.subcategory?.subcategoryName || "Allitems";

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
        item_price:
          item.price_organization && item.price_user
            ? { organization: item.price_organization, user: item.price_user }
            : item.price,
        ingredients: item.ingredients || [],
        reviews_id: item.reviews_id || [],
        quantity: 0,
      });

      return acc;
    }, {} as TransformedData);

    return transformed;
  };
  const fetchMenuItems = async (id: any) => {
    setLoading(true);
    try {
      const response = await getMenuItemsByKitchen(
        id,
        (context?.contextType ?? "").toString()
      );
      if (response.status) {
        const items = response.data.items_id;
        if (items && items.length > 0) {
          const transformedData = transformFoodData(items);
          setGroupedItems(transformedData);
          const firstCategory = Object.keys(transformedData)[0];
          if (firstCategory) {
            setActiveKey(firstCategory);
          }
        }
      }
    } catch (error: any) {
      console.error("Error fetching menu items:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchCollaboration = async () => {
    try {
      if (id) {
        let data = await getCollaborationById(id);
        setCollaboration(data);
      }
    } catch (error) {
      console.error("Error fetching collaboration details:", error);
      toast.error("An error occurred while fetching collaboration details.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCollaboration();
  }, [id]);
  const fetchOrgDetails = async (id: any) => {
    try {
      const response = await getOrgDetails(id);
      setOrgData(response.data);
    } catch (error: any) {
      console.error("Error fetching organization details:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchKitchenDetails = async (id: any) => {
    console.log("haii");
    setLoading(true);
    try {
      const response = await getkitchenDetails(id);
      setKitchenData(response.data);
      setStatus(response.data.status);
    } catch (error: any) {
      console.error("Error fetching kitchen details:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this collaboration?")) {
      try {
        toast.success("Collaboration deleted successfully!");
        navigate("/apps/collaborations/list");
      } catch (error) {
        toast.error("An error occurred while deleting the collaboration.");
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  if (!collaboration) {
    return (
      <div className="not-found-container">
        <h4>Collaboration not found.</h4>
      </div>
    );
  }

  return (
    <React.Fragment>
      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb breadcrumb-custom">
          <li className="breadcrumb-item">
            <Link to="/apps/collaborations/list">Collaborations</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Collaboration Details
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h3 className="page-title">Collaboration Details</h3>
          <div className="header-actions">
            {/* Placeholder for buttons if needed */}
          </div>
        </div>
      </div>

      {/* Single Card with Left Logo */}
      <Card className="collaboration-details-card">
        <Card.Body>
          <Row>
            {/* Left Column: Overlapping Images */}
            <Col md={4} className="image-column">
              <div className="profile-container">
                <div className="profile-ring"></div>
                <div className="profile-ring"></div>
                <div className="profile-ring"></div>

                {collaboration.organization.logo && (
                  <div className="profile-image left">
                    <img
                      src={collaboration.organization.logo}
                      alt={`${collaboration.organization.name} Logo`}
                    />
                  </div>
                )}

                {collaboration.kitchen.image && (
                  <div className="profile-image right">
                    <img
                      src={collaboration.kitchen.image}
                      alt={`${collaboration.kitchen.name} Image`}
                    />
                  </div>
                )}
              </div>
            </Col>

            {/* Right Column: Details */}
            <Col md={8} className="details-column">
              <h5 className="details-title">Collaboration Details</h5>
              <div className="details-content">
                <div className="detail-item">
                  <Building size={16} className="detail-icon" />
                  <p>
                    <strong>Organization:</strong>{" "}
                    {collaboration.organization.name}
                  </p>
                </div>
                <div className="detail-item">
                  <MapPin size={16} className="detail-icon" />
                  <p>
                    <strong>Kitchen:</strong> {collaboration.kitchen.name}
                  </p>
                </div>
                <div className="detail-item">
                  <Calendar size={16} className="detail-icon" />
                  <p>
                    <strong>Collaborated on:</strong>{" "}
                    {new Date(collaboration.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Tabs
        id="collaboration-tabs"
        activeKey={activeTab}
        onSelect={(key: any) => {
          setActiveTab(key);
          if (key === "kitchenDetails") {
            fetchKitchenDetails(collaboration?.kitchen.slug);
          }
          if (key === "orgDetails") {
            fetchOrgDetails(collaboration?.organization.slug);
          }
          if (key === "kitchenMenu") {
            fetchMenuItems(collaboration?.kitchen.slug);
          }
          if (key === "collabDetails") {
            fetchCollaboration();
          }
        }}
        className="mb-3"
      >
        <Tab eventKey="collabDetails" title="Collab Details" />
        <Tab eventKey="kitchenDetails" title="Kitchen Details" />
        <Tab eventKey="orgDetails" title="Organization Details" />
        <Tab eventKey="kitchenMenu" title="Kitchen Menu" />
      </Tabs>

      {/* 👇 Conditional Section Rendering */}
      {activeTab === "collabDetails" && (
        <Card className="shadow-sm">
          <Card.Body>
            <h5 className="mb-4 text-bold text-black">Collaboration Details</h5>

            <h6 className="mt-4 mb-3">Quotation Details</h6>
            <Row className="mb-3">
              <Col md={6}>
                <p>
                  <strong>Date:</strong>{" "}
                  {formatDateToDDMMYY(collaboration?.quotation?.date)}
                </p>
                <p>
                  <strong>Meal Type:</strong>{" "}
                  {collaboration?.quotation?.mealType}
                </p>
                <p>
                  <strong>Meal Count:</strong>{" "}
                  {collaboration?.quotation?.mealCount}
                </p>
                <p>
                  <strong>Rate per Meal:</strong>{" "}
                  {collaboration?.quotation.ratePerMeal}
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <strong>Discount Offer:</strong>{" "}
                  {collaboration?.quotation?.discountOffer}
                </p>
                <p>
                  <strong>Payment Terms:</strong>{" "}
                  {collaboration?.quotation?.paymentTerms}
                </p>
                <p>
                  <strong>Contract Duration:</strong>{" "}
                  {collaboration?.quotation?.contractDuration}
                </p>
              </Col>
            </Row>

            <h6 className="mt-4 mb-3">Terms and Conditions</h6>
            <p>{collaboration?.quotation.termsAndConditions}</p>
          </Card.Body>
        </Card>
      )}

      {activeTab === "kitchenDetails" && (
        <Card className="shadow-sm">
          <Card.Body>
            <h5 className="mb-4 text-bold text-black">Kitchen Details</h5>
            <Row className="mb-3">
              <Col md={6}>
                <p>
                  <strong>Name:</strong> {kitchenData?.kitchen_name}
                </p>
                <p>
                  <strong>Owner Name:</strong> {kitchenData?.kitchen_owner_name}
                </p>
                <p>
                  <strong>Owner Email:</strong> {kitchenData?.owner_email}
                </p>
                <p>
                  <strong>Owner Phone:</strong>{" "}
                  {kitchenData?.owner_phone_number}
                </p>
                <p>
                  <strong>Kitchen Phone:</strong>{" "}
                  {kitchenData?.kitchen_phone_number}
                </p>
                <p>
                  <strong>Kitchen Type:</strong> {kitchenData?.kitchen_type}
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <strong>Restaurant Type:</strong>{" "}
                  {kitchenData?.restaurant_type}
                </p>
                <p>
                  <strong>Category:</strong>{" "}
                  {kitchenData?.category?.category_name}
                </p>
                <p>
                  <strong>Subcategory:</strong>{" "}
                  {kitchenData?.subcategoryName?.subcategory_name}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {kitchenData?.status ? "Active" : "Inactive"}
                </p>
                <p>
                  <strong>Document Verified:</strong>{" "}
                  {kitchenData?.kitchen_document_verification ? "Yes" : "No"}
                </p>
              </Col>
            </Row>

            <h6 className="mt-4 mb-3">Address</h6>
            <p>
              {kitchenData?.addresses?.[0]?.street_address},{" "}
              {kitchenData?.addresses?.[0]?.city_name},{" "}
              {kitchenData?.addresses?.[0]?.district_name},{" "}
              {kitchenData?.addresses?.[0]?.state_name},{" "}
              {kitchenData?.addresses?.[0]?.pincode},{" "}
              {kitchenData?.addresses?.[0]?.country_name}
            </p>

            <h6 className="mt-4 mb-3">Working Days</h6>
            <ul>
              {kitchenData?.working_days?.map((day: any) => (
                <li key={day._id}>
                  <strong>{day.day}:</strong>{" "}
                  {day.is_open
                    ? `${day.open_time} to ${day.close_time}`
                    : "Closed"}
                </li>
              ))}
            </ul>

            <h6 className="mt-4 mb-3">Pre-ordering Options</h6>
            <ul>
              {kitchenData?.pre_ordering_options?.map((option: any) => (
                <li key={option._id}>
                  <strong>
                    {option.day} ({option.meal_type}):
                  </strong>{" "}
                  Pre-order from {option.pre_order_start_time} to{" "}
                  {option.pre_order_close_time}, Delivery at{" "}
                  {option.delivery_time}
                </li>
              ))}
            </ul>
          </Card.Body>
        </Card>
      )}

      {activeTab === "orgDetails" && (
        <Card className="shadow-sm mt-3">
          <Card.Body>
            <h5 className="mb-3 fw-bold text-primary">
              Organization Information
            </h5>
            <Row className="mb-3">
              <Col md={6}>
                <p>
                  <strong>Organization Name:</strong>{" "}
                  {organization?.organizationName}
                </p>
                <p>
                  <strong>Manager:</strong> {organization?.managerName}
                </p>
                <p>
                  <strong>Register Number:</strong>{" "}
                  {organization?.register_number}
                </p>
                <p>
                  <strong>Email:</strong> {organization?.email}
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <strong>Contact Number:</strong>{" "}
                  {organization?.contact_number}
                </p>
                <p>
                  <strong>No. of Employees:</strong>{" "}
                  {organization?.no_of_employees}
                </p>
                <p>
                  <strong>Category:</strong>{" "}
                  {organization?.category?.category_name}
                </p>
                <p>
                  <strong>Subcategory:</strong>{" "}
                  {organization?.subcategoryName?.subcategory_name}
                </p>
              </Col>
            </Row>

            <h5 className="mb-3 fw-bold text-primary">Address</h5>
            <Row>
              <Col md={12}>
                <p className="mb-0">
                  {organization?.addresses?.[0]?.street_address},{" "}
                  {organization?.addresses?.[0]?.city_name},{" "}
                  {organization?.addresses?.[0]?.district_name},{" "}
                  {organization?.addresses?.[0]?.state_name},{" "}
                  {organization?.addresses?.[0]?.pincode},{" "}
                  {organization?.addresses?.[0]?.country_name}
                </p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {activeTab === "kitchenMenu" &&
        (Object.keys(groupedItems).length !== 0 ? (
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Our Menu</h4>
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
                  {Object.entries(groupedItems).map(
                    ([category, subcategories]) => (
                      <Tab eventKey={category} title={category} key={category}>
                        <Accordion defaultActiveKey="0">
                          {Object.entries(subcategories).map(
                            ([subcategory, items], index) => (
                              <Accordion.Item
                                key={subcategory}
                                eventKey={String(index)}
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
                                      No items found in this subcategory
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
                                            {typeof item.item_price ===
                                            "object" ? (
                                              <>
                                                {item.item_price
                                                  .organization && (
                                                  <div>
                                                    <strong>
                                                      Organization Price:
                                                    </strong>{" "}
                                                    $
                                                    {
                                                      item.item_price
                                                        .organization
                                                    }
                                                  </div>
                                                )}
                                                {item.item_price.user && (
                                                  <div>
                                                    <strong>User Price:</strong>{" "}
                                                    ${item.item_price.user}
                                                  </div>
                                                )}
                                              </>
                                            ) : (
                                              <div>
                                                <strong>Price:</strong> $
                                                {item.item_price || "N/A"}
                                              </div>
                                            )}
                                          </div>
                                          <div
                                            style={{
                                              marginBottom: "10px",
                                              width: "100%",
                                            }}
                                          >
                                            <strong>Ingredients:</strong>{" "}
                                            {item.ingredients &&
                                            item.ingredients.length > 0 ? (
                                              <span>
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
                                            <strong>Reviews:</strong>{" "}
                                            {item.reviews_id &&
                                            item.reviews_id.length > 0 ? (
                                              <span
                                                style={{ fontSize: "0.85rem" }}
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
        ))}
    </React.Fragment>
  );
};

export default CollaborationDetailsPage;
