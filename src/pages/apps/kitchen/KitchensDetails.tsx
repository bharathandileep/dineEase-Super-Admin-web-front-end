import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deletekitchenDetails,
  getkitchenDetails,
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

interface MenuItem {
  name: string;
  price: number;
  description: string;
  image: string;
}
interface CartItem extends MenuItem {
  quantity: number;
}
type FoodItem = {
  name: string;
  description: string;
  image: string;
  status: boolean;
  itemId?: string | undefined;
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
  onEdit?: () => void;
  onDelete?: () => void;
  addresses: Array<{
    _id: string;
    street_address: string;
    city: string;
    state: string;
    district: string;
    pincode: string;
    country: string;
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
  const [kitchenData, setKitchenData] = useState<IKitchenDetails | null>(null);
  const [groupedItems, setGroupedItems] = useState<TransformedData>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [activeKey, setActiveKey] = useState<string>("");

  const onEdit = () => {
    navigate(`/apps/kitchen/edit/${id}`);
  };
  const onDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this kitchen?");
   
   
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
    } catch (error) {
      toast.error("An error occurred while deleting kitchen details.");
    } finally {
      setLoading(false);
    }
  };

  const transformFoodData = (items: any[]): TransformedData => {
    const transformed = items.reduce((acc: TransformedData, item) => {
      const categoryName = item.category?.category;
      const subcategoryName = item.subcategory?.subcategoryName;
  
      if (!categoryName || !subcategoryName) {
        console.warn("Skipping item due to missing category/subcategory:", item);
        return acc;
      }
  
      if (!acc[categoryName]) {
        acc[categoryName] = {};
      }
  
      if (!acc[categoryName][subcategoryName]) {
        acc[categoryName][subcategoryName] = [];
      }
  
      acc[categoryName][subcategoryName].push({
        name: item.item_name,
        description: item.item_description,
        image: item.item_image,
        status: item.status,
        itemId: item._id,
      });
  
      console.log("inside transformFoodData:", acc);
      return acc;
    }, {} as TransformedData);
  
    console.log("Final transformed data before return:", transformed);
    return transformed;
  };
  

  useEffect(() => {
    const fetchKitchenDetails = async () => {
      try {
        const response = await getkitchenDetails(id);
        setKitchenData(response.data);
      } catch (error) {
        console.error("Error fetching kitchen details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchKitchenDetails();
  }, [id]);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await listItems();
        console.log("API Response:", response.data); // Ensure data exists
  
        let transformedData;
        try {
          transformedData = transformFoodData(response.data);
          console.log("Transformed Data inside try:", transformedData);
        } catch (error) {
          console.error("Error transforming data:", error);
          return;
        }
  
        setGroupedItems(transformedData);
        console.log("Transformed Data after setGroupedItems:", transformedData);
  
        const firstCategory = Object.keys(transformedData)[0];
        if (firstCategory) {
          setActiveKey(firstCategory);
        }
      } catch (error) {
        console.error("Error fetching kitchen details:", error);
      }
    };
  
    fetchItemDetails();
  }, [loading]);
  

  const handleAddToCart = (item: FoodItem) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.name === item.name
      );
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (item: { name: string }) => {
    setCartItems((prevCart) =>
      prevCart.filter((cartItem) => cartItem.name !== item.name)
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!kitchenData) {
    return <div>No data found</div>;
  }

  const CheckoutBar = ({ cartItems, onProceed }: any) => {
    if (cartItems?.length === 0) return null;

    return (
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "white",
          padding: "1rem",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
          zIndex: 1000,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <span className="fw-bold">
            {cartItems.reduce((sum: any, item: any) => sum + item.quantity, 0)}{" "}
            items
          </span>
        </div>
        <Button variant="primary" onClick={onProceed}>
          Proceed to Checkout
        </Button>
      </div>
    );
  };
  const handleProceedToCheckout = async () => {
    setLoading(true);
    try {
      const response = await createNewkitchenMenu(id, cartItems);
      if (response && response.status) {
        toast.success(response.message);
      } else {
        toast.error(response?.message || "An unexpected error occurred");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

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
                {["Active", "Organic", "Veg"].map((badge, index) => (
                  <Badge
                    key={index}
                    className="rounded-pill px-2 py-1"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                    }}
                  >
                    <i
                      className={`mdi mdi-${
                        badge === "Active"
                          ? "check-circle"
                          : badge === "Organic"
                          ? "leaf"
                          : "food-apple"
                      } text-success me-1`}
                    ></i>
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </Col>
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
        </Row>
      </div>
      <Row className="mb-4 g-3">
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="card-title text-bold text-black">
                  FSSAI License
                </h5>
                <VerificationButton />
              </div>
              <div className="mb-3">
                <p className="mb-2">
                  <strong text-xl>Certificate Number:</strong>{" "}
                  {kitchenData?.fssaiDetails[0]?.ffsai_certificate_number}
                </p>
                <p className="mb-2">
                  <strong text-xl>Licence owner:</strong>{" "}
                  {kitchenData?.fssaiDetails[0]?.ffsai_card_owner_name}
                </p>
                <p className="mb-2">
                  <strong text-xl>Expiry Date:</strong>{" "}
                  {kitchenData?.fssaiDetails[0]?.expiry_date}
                </p>
              </div>
              {kitchenData?.fssaiDetails?.[0]?.ffsai_certificate_image && (
                <img
                  src={kitchenData.fssaiDetails[0].ffsai_certificate_image}
                  alt="FSSAI Dashboard"
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
                <VerificationButton />
              </div>
              <div className="mb-3">
                <p className="mb-2">
                  <strong text-xl>PAN Number:</strong>{" "}
                  {kitchenData?.panDetails[0]?.pan_card_number}
                </p>
                <p className="mb-2">
                  <strong text-xl>Card Holder:</strong>{" "}
                  {kitchenData?.panDetails[0]?.pan_card_user_name}
                </p>
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
                <VerificationButton />
              </div>
              <div className="mb-3">
                <p className="mb-2">
                  <strong text-xl>GST Number:</strong>{" "}
                  {kitchenData?.gstDetails[0].gst_number}
                </p>
                <p className="mb-2">
                  <strong text-xl>Expiry Date:</strong>{" "}
                  {kitchenData?.gstDetails[0].expiry_date}
                </p>
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
                  kitchenData?.addresses?.[0]?.city,
                  kitchenData?.addresses?.[0]?.district,
                  kitchenData?.addresses?.[0]?.state,
                  kitchenData?.addresses?.[0]?.pincode,
                  kitchenData?.addresses?.[0]?.country,
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
              onClick={() => navigate(`/apps/kitchen/${id}/our-menu`)}
            >
              Our menu
            </Button>
          </div>
          <Tabs activeKey={activeKey} onSelect={(k: any) => setActiveKey(k)}>
            {Object.entries(groupedItems).map(([category, subcategories]) => (
              <Tab eventKey={category} title={category} key={category}>
                <Accordion>
                  {Object.entries(subcategories).map(([subcategory, items]) => (
                    <Accordion.Item key={subcategory} eventKey={subcategory}>
                      <Accordion.Header>{subcategory}</Accordion.Header>
                      <Accordion.Body>
                        {items.map((item, idx) => (
                          <div
                            key={idx}
                            className="d-flex align-items-center mb-3 p-2 border-bottom"
                            style={{ gap: "15px" }}
                          >
                            <div
                              className="flex-shrink-0"
                              style={{ width: "80px", height: "80px" }}
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="rounded"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1">{item.name}</h6>
                              <small className="text-muted">
                                {item.description}
                              </small>
                            </div>
                            <div className="text-end">
                              {cartItems.some(
                                (cartItem) => cartItem.name === item.name
                              ) ? (
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleRemoveFromCart(item)}
                                >
                                  Remove
                                </Button>
                              ) : (
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => handleAddToCart(item)}
                                >
                                  Add
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Tab>
            ))}
          </Tabs>
        </Card.Body>
      </Card>
      <CheckoutBar cartItems={cartItems} onProceed={handleProceedToCheckout} />
    </div>
  );
}
export default KitchensDetails;
