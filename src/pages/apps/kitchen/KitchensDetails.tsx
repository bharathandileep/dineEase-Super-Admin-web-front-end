import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deletekitchenDetails,
  getCollaborationStatus,
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
  Modal,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { createNewkitchenMenu } from "../../../server/admin/kitchensMenuCreation";
import { getMenuItemsByKitchen } from "../../../server/admin/menu";
import { formatDateToDDMMYY } from "../../../helpers/api/utils";
import PANDetailsModal from "../../../components/PANDetailsModal";
import GSTDetailsModal from "../../../components/GSTDetailsModal";
import FSSAILicenseModal from "../../../components/FSSAILicenseModal";
import { useAuthDetails } from "../../../hooks/useAuthDetails";
import PANPreview from "../../../components/PANPreview";
import GSTPreview from "../../../components/GSTPreview";
import FSSAIPreview from "../../../components/FSSAIPreview";
import { collaborateKitchen } from "../../../server/admin/collab";
import KitchenOverviewDetails from "../../../components/KitchenOverviewDetails";

// Define interfaces
type FoodItem = {
  quantity: number;
  item_name: string;
  description: string;
  custom_image: string;
  item_price: number | { organization: number; user: number };
  ingredients: string[];
  reviews_id: { comment: string; rating: number }[];
};

export type TransformedData = Record<string, Record<string, FoodItem[]>>;

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
  category: {
    category_name: string;
  };

  addresses: {
    _id: string;
    street_address: string;
    city_name: string;
    state_name: string;
    district_name: string;
    pincode: string;
    country_name: string;
  };
  fssaiDetails: Array<{
    _id: string;
    ffsai_certificate_number: string;
    expiry_date: string;
    is_verified: boolean;
    ffsai_certificate_image: string;
    ffsai_card_owner_name: string;
  }>;
  panDetails: Array<{
    _id: string;
    prepared_by_id: string;
    entity_type: string;
    pan_card_number: string;
    pan_card_user_name: string;
    pan_card_image: string;
    is_verified: boolean;
    is_deleted: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
  gstDetails: Array<{
    _id: string;
    prepared_by_id: string;
    entity_type: string;
    gst_number: string;
    gst_certificate_image: string;
    expiry_date: string;
    is_verified: boolean;
    is_deleted: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
}

const VerificationButton = () => (
  <Button
    variant="danger"
    className="d-flex align-items-center gap-2 px-3 py-2"
  >
    <i className="mdi mdi-close-circle-outline"></i>
    Not Verified
  </Button>
);

function KitchensDetails() {
  const { id } = useParams();
  const { context, user } = useAuthDetails();
  const [kitchenData, setKitchenData] = useState<IKitchenDetails | null>(null);
  const [groupedItems, setGroupedItems] = useState<TransformedData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(true);
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState<string>("");
  const fssaiDetails = kitchenData?.fssaiDetails?.[0];
  const panDetails = kitchenData?.panDetails[0];
  const gstDetails = kitchenData?.gstDetails[0];
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const onEdit = () => navigate(`/apps/kitchen/edit/${id}`);
  const [isCollabed, setIsCollabed] = useState<boolean>();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const onDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this kitchen?"
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const response = await deletekitchenDetails(id);
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
  useEffect(() => {
    const fetchKitchenDetails = async () => {
      setLoading(true);
      try {
        const response = await getkitchenDetails(id);
        setKitchenData(response.data);
        setStatus(response.data.status);
        if (context?.contextType === "Organization") {
          await fetchCollaborationStatus(response.data._id);
        }
      } catch (error: any) {
        console.error("Error fetching kitchen details:", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCollaborationStatus = async (kitchenId: string) => {
      try {
        const response = await getCollaborationStatus(
          kitchenId,
          context?.contextId
        );
        setIsCollabed(response.data.exists);
      } catch (error: any) {
        console.error("Error fetching collaboration status:", error);
        toast.error("Failed to fetch collaboration status");
      }
    };

    fetchKitchenDetails();
  }, [id, context?.contextType, context?.contextId]);

  useEffect(() => {
    const fetchKitchenDetails = async () => {
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

    fetchKitchenDetails();
  }, [id]);

  useEffect(() => {
    const fetchCollaborationStatus = async () => {
      try {
        const response = await getCollaborationStatus(
          kitchenData?._id,
          context?.contextId
        );
        console.log("Collaboration status:", response.data);
      } catch (error: any) {
        console.error("Error fetching collaboration status:", error);
        toast.error("Failed to fetch collaboration status");
      }
    };

    // Only run when kitchenData is available and context is Organization
    if (kitchenData?._id && context?.contextType === "Organization") {
      fetchCollaborationStatus();
    }
  }, [kitchenData?._id, context?.contextType, context?.contextId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const kitchenResponse = await getkitchenDetails(id);
        setKitchenData(kitchenResponse.data);
        setStatus(kitchenResponse.data.status);
        if (context?.contextType === "Organization") {
          const collaborationResponse = await getCollaborationStatus(
            kitchenResponse.data._id, 
            context?.contextId
          );
          console.log("Collaboration status:", collaborationResponse.data);
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, context?.contextType, context?.contextId]);

  useEffect(() => {
    const fetchMenuItems = async () => {
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

    fetchMenuItems();
  }, [id]);
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

    if (!id) {
      toast.error("Kitchen ID is missing.");
      return;
    }

    if (!organization_id) {
      toast.error(
        "Organization ID is missing. Please make sure you're logged in."
      );
      return;
    }
    if (isCollabed) {
      setShowConfirmModal(true);
      return;
    }
    await executeKitchenAction(organization_id, id);
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
    executeKitchenAction(organization_id, id ?? "");
  };

  if (!kitchenData) {
    return <div className="alert alert-warning">No kitchen data found</div>;
  }

  return (
    <>
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
       <KitchenOverviewDetails kitchenData={kitchenData} />
        <Row className="mb-4 g-3">
          <FSSAIPreview fssaiDetails={fssaiDetails} />

          {(user?.role === "Admin" ||
            context?.contextId === kitchenData._id) && (
            <>
              <PANPreview panDetails={panDetails} />
              <GSTPreview gstDetails={gstDetails} />
            </>
          )}

          <Col md={6}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <h5 className="card-title text-bold text-black mb-3">
                  Location Details
                </h5>
                <p className="card-text mb-4">
                  {[
                    kitchenData?.addresses?.street_address,
                    kitchenData?.addresses?.city_name,
                    kitchenData?.addresses?.district_name,
                    kitchenData?.addresses?.state_name,
                    kitchenData?.addresses?.pincode,
                    kitchenData?.addresses?.country_name,
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
              ) : Object.keys(groupedItems).length === 0 ? (
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
      
    </>
  );
}

export default KitchensDetails;
