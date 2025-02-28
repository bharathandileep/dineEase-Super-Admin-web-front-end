import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteOrgDetails,
  getOrgDetails,
} from "../../../server/admin/organization";
import { Link } from "react-router-dom";
import { Row, Col, Card, Button, Badge } from "react-bootstrap";

// Sample product images (replace with actual images)
// import productImg1 from "../../../assets/images/products/product-1.png";
// import productImg2 from "../../../assets/images/products/product-2.png";
// import productImg3 from "../../../assets/images/products/product-3.png";
// import productImg4 from "../../../assets/images/products/product-4.png";

// Add this import for profile image
import defaultProfile from "../../../assets/images/products/product-10.jpg";

// Add these imports for card images
import dashboardUI from "../../../assets/images/macbook.png";
import cakeImage from "../../../assets/images/products/product-5.png";
import { toast } from "react-toastify";

export interface IOrganizationDetails {
  _id: string;
  user_id: string;
  address_id: string[];
  organizationName: string;
  organizationLogo: string;
  managerName: string;
  register_number: string;
  contact_number: string;
  email: string;
  no_of_employees: number;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
  addresses: Array<{
    _id: string;
    street_address: string;
    city_name: string;
    state_name: string;
    district_name: string;
    pincode: string;
    country_name: string;
    landmark: string | null;
    address_type: string;
    is_deleted: boolean;
    createdAt: string;
    updatedAt: string;
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
  onEdit?: () => void;
  onDelete?: () => void;
}
// Add this verification button component
const VerificationButton = () => (
  <Button
    variant="danger"
    className="d-flex align-items-center gap-2 px-3 py-2"
  >
    <i className="mdi mdi-close-circle-outline"></i>
    Not Verified
  </Button>
);

interface Product {
  name: string;
  brand: string;
  description: string;
  price: number;
  discount: number;
  rating: number;
  status: string;
  features: string[];
}

function OrganizationDetails() {
  const [product] = useState<Product>({
    name: "Smart Wireless Headphones",
    brand: "SoundTech",
    description:
      "Experience high-quality sound with active noise cancellation and long battery life.",
    price: 250,
    discount: 15,
    rating: 4.7,
    status: "In Stock",
    features: [
      "Bluetooth 5.0 Connectivity",
      "Active Noise Cancellation",
      "20 Hours Battery Life",
      "Comfortable Over-Ear Fit",
      "Fast Charging Support",
    ],
  });
  const { id } = useParams();
  const [organization, setOrgData] = useState<IOrganizationDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrgDetails = async () => {
      try {
        const response = await getOrgDetails(id);
        setOrgData(response.data);
      } catch (error) {
        console.error("Error fetching organization details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrgDetails();
  }, [id]);

  const onEdit = () => navigate(`/apps/organizations/edit/${id}`);
  const onDelete = async () => {
    window.confirm("Are your sure delete this organisation")
    setLoading(true);
    try {
      const response = await deleteOrgDetails(id);
      if (response.status) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error deleting  details:", error);
      toast.error("An error occurred while deleting organisation details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !organization) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container-fluid px-4 py-3">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb m-0">
          <li className="breadcrumb-item">
            <Link to="/products">Products</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {organization?.organizationName}
          </li>
        </ol>
      </nav>

      {/* Profile Section */}
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
          {/* Column 1: Profile Image */}
          <Col xs={12} md={3} className="text-center text-md-start">
            <div className="position-relative bg-white rounded-circle d-inline-block">
              <img
                src={organization?.organizationLogo}
                alt="Business Profile"
                className="rounded-circle"
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "contain",
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

          {/* Column 2: Profile Details */}
          <Col
            xs={12}
            md={6}
            className="text-center text-md-start mt-4 mt-md-0"
          >
            <div className="d-flex flex-column h-100">
              {/* Business Name */}
              <h2
                className="text-white mb-3"
                style={{
                  fontSize: "2rem",
                  fontWeight: "600",
                  lineHeight: "1.2",
                }}
              >
                {organization?.organizationName}
              </h2>

              {/* Contact Information */}
              <div
                className="mb-3"
                style={{ display: "flex", flexDirection: "column" }}
              >
                {[
                  { icon: "account", text: organization?.managerName },
                  { icon: "email", text: organization?.email },
                  { icon: "phone", text: organization?.contact_number },
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

              {/* Badges */}
              <div className="d-flex gap-2">
                {["Active"].map((badge, index) => (
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

          {/* Column 3: Action Buttons */}
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

      {/* Information Cards */}
      <Row className="mb-4 g-3">
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
                  {organization?.panDetails[0].pan_card_number}
                </p>
                <p className="mb-2">
                  <strong text-xl>Card Holder:</strong>{" "}
                  {organization?.panDetails[0].pan_card_user_name}
                </p>
              </div>
              <img
                src={organization?.panDetails[0].pan_card_image}
                alt="Cake"
                className="img-fluid rounded"
                style={{ maxHeight: "150px", objectFit: "cover" }}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="card-title text-bold text-black">GST Registration</h5>
                <VerificationButton />
              </div>
              <div className="mb-3">
                <p className="mb-2">
                  <strong text-xl>GST Number:</strong>{" "}
                  {organization?.gstDetails[0].gst_number}
                </p>
                <p className="mb-2">
                  <strong text-xl>Expiry Date:</strong>{" "}
                  {organization?.gstDetails[0].expiry_date}
                </p>
              </div>
              <img
                src={organization?.gstDetails[0].gst_certificate_image}
                alt="GST Dashboard"
                className="img-fluid rounded"
                style={{
                  maxHeight: "150px",
                  objectFit: "cover",
                  width: "100%",
                }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-3 text-bold text-black">Location Details</h5>
              <p className="card-text mb-4">
                {organization?.addresses[0]?.street_address},{" "}
                {organization?.addresses[0]?.city_name},{" "}
                {organization?.addresses[0]?.district_name},{" "}
                {organization?.addresses[0]?.state_name},{" "}
                {organization?.addresses[0]?.pincode},
                {organization?.addresses[0]?.country_name}
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
                ></iframe>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Product Details Card
    <Card className="shadow-sm">
      <Card.Body className="p-4">
        <Row className="g-4">
          <Col
            md={6}
            className="d-flex align-items-center justify-content-center">
            <img
              src={productImg1}
              alt={product.name}
              className="img-fluid rounded"
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
          </Col>

          <Col md={6}>
            <div className="ps-md-4">
              <h2 className="mb-3">{product.name}</h2>
              <h5 className="text-muted mb-3">by {product.brand}</h5>
              <Badge bg="success" className="mb-4 px-3 py-2">
                {product.status}
              </Badge>
              <h3 className="mb-4">
                <del className="text-muted me-3">
                  ${product.price.toFixed(2)}
                </del>
                <span className="text-danger">
                  ${discountedPrice.toFixed(2)}
                </span>
              </h3>

              <p className="mb-4">{product.description}</p>

              <ul className="list-unstyled mb-4">
                {product.features.map((feature, index) => (
                  <li key={index} className="mb-2 d-flex align-items-center">
                    <span className="me-2">✅</span> {feature}
                  </li>
                ))}
              </ul>

              <div className="d-flex gap-3">
                <Button variant="primary" size="lg" className="px-4">
                  Add to Cart
                </Button>
                <Button variant="outline-danger" size="lg" className="px-4">
                  ❤️ Wishlist
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card> */}
    </div>
  );
}

export default OrganizationDetails;
