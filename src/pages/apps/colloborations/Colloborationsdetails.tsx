import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { getCollaborationById } from "../../../server/admin/collab"; // Frontend controller
import { MapPin, Building, Calendar } from "lucide-react";
import "./Colloborations.scss";

interface Collaboration {
  _id: string;
  organization: {
    _id: string;
    name: string;
    logo: string | null;
  };
  kitchen: {
    _id: string;
    name: string;
    image: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

const CollaborationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [collaboration, setCollaboration] = useState<Collaboration | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollaboration = async () => {
      try {
        if (id) {
          const data = await getCollaborationById(id);
          setCollaboration(data);
        }
      } catch (error) {
        console.error("Error fetching collaboration details:", error);
        toast.error("An error occurred while fetching collaboration details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCollaboration();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this collaboration?")) {
      try {
        // Placeholder for delete functionality
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
                    <strong>Organization:</strong> {collaboration.organization.name}
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
    </React.Fragment>
  );
};

export default CollaborationDetailsPage;