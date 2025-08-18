import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteOrgDetails,
  getOrgDetails,
  toggleOrganizationStatus,
} from "../../../services/admin/organization";
import { Link } from "react-router-dom";
import { Row, Col, Card, Button, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import { formatDateToDDMMYY } from "../../../helpers/api/utils";
import PANDetailsModal from "../../../components/PANDetailsModal";
import GSTDetailsModal from "../../../components/GSTDetailsModal";
import { useAuthDetails } from "../../../hooks/useAuthDetails";
import { verifyDocument } from "../../../services/admin/admin";
import GSTPreview from "../../../components/GSTPreview";
import PANPreview from "../../../components/PANPreview";

export interface IOrganizationDetails {
  _id: string | number;
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
function OrganizationDetails() {
  const { user, context, isContext, isSuperAdmin } = useAuthDetails();
  const { id } = useParams();
  const [organization, setOrgData] = useState<IOrganizationDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [status, setStatus] = useState<boolean>(true);
  const [showPanModal, setShowPanModal] = useState(false);
  const [showGSTModal, setShowGSTModal] = useState(false);
  const panDetails = organization?.panDetails[0];
  const gstDetails = organization?.gstDetails[0];

  useEffect(() => {
    const fetchOrgDetails = async () => {
      try {
        const response = await getOrgDetails(id);
        setOrgData(response.data);
        setStatus(response.data.status);
      } catch (error: any) {
        console.error("Error fetching organization details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrgDetails();
  }, [id]);

  const onEdit = () => navigate(`/apps/organizations/edit/${id}`);
  const onDelete = async () => {
    window.confirm("Are your sure delete this organisation");
    setLoading(true);
    try {
      const response = await deleteOrgDetails(id);
      if (response.status) {
        toast.success(response.message);
        navigate("/apps/organizations/list");
      }
    } catch (error: any) {
      console.error("Error deleting  details:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    try {
      const response = await toggleOrganizationStatus(id);
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

  if (loading || !organization) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container-fluid px-4 py-3">
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
                {organization?.organizationName}
              </h2>
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
              <div className="d-flex gap-2">
                <Badge
                  className="rounded-pill px-2 py-1"
                  style={{
                    backgroundColor: status
                      ? "rgba(255, 255, 255, 0.9)"
                      : "rgba(200, 200, 200, 0.9)",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                    cursor: user?.role === "Admin" ? "pointer" : "default",
                  }}
                  onClick={
                    user?.role === "Admin" ? handleStatusToggle : undefined
                  }
                >
                  <i
                    className={`mdi mdi-${
                      status
                        ? "check-circle text-success"
                        : "close-circle text-secondary"
                    } me-1`}
                  ></i>
                  {status ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </Col>
          <Col
            xs={12}
            md={3}
            className="d-flex justify-content-md-end mt-4 mt-md-0"
          >
            {(user?.role === "Admin" ||
              context?.contextId === organization?._id) && (
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
            )}
          </Col>
        </Row>
      </div>
      <Row className="mb-4 g-3">
        {(user?.role === "Admin" ||
          context?.contextId === organization._id) && (
          <>
            <PANPreview panDetails={panDetails} />
            <GSTPreview gstDetails={gstDetails} />
          </>
        )}

        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-3 text-bold text-black">
                Location Details
              </h5>
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
      <PANDetailsModal
        show={showPanModal}
        onHide={() => setShowPanModal(false)}
        panDetails={panDetails}
      />
      <GSTDetailsModal
        show={showGSTModal}
        onHide={() => setShowGSTModal(false)}
        gstDetails={gstDetails}
        formatDateToDDMMYY={formatDateToDDMMYY}
      />
    </div>
  );
}

export default OrganizationDetails;
