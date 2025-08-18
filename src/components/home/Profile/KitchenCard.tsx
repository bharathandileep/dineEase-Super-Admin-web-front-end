import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import {
  Eye,
  Clock,
  XCircle,
  CheckCircle,
  MapPin,
  Award,
  Utensils,
  Star,
} from "lucide-react";
import { Kitchen } from "../../../types/profile";
import { getUserInfo } from "../../../services/admin/auth";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { toast } from "react-toastify";
import { setContext } from "../../../helpers/api/utils";
import { useNavigate } from "react-router-dom";

interface KitchenCardProps {
  kitchen: Kitchen;
  onClick?: () => void;
}

const KitchenCard: React.FC<KitchenCardProps> = ({ kitchen, onClick }) => {
  const { user } = useSelector((state: RootState) => state.Auth);
  const navigate = useNavigate();

  const handleNavigateKitchen = async () => {
    try {
      const response = await getUserInfo(user.id);
      if (!response.status) {
        toast.error("Something went wrong");
        return;
      }
      const kitchenViewDetails = {
        role: "Kitchen",
        kitchenName: kitchen.name,
        kitchenId: kitchen.id,
        slug: kitchen.slug,
      };
      if (kitchen.isapproved === "approved") {
        localStorage.setItem(
          "accessDetails",
          JSON.stringify(kitchenViewDetails)
        );
        setContext({
          contextId: kitchen.id,
          contextType: "Kitchen",
          slug: kitchen.slug,
          role: response.data?.role_id || "",
        });

        navigate(`/apps/${kitchen.slug}`);
      }
    } catch (error) {
      console.error("Error navigating to kitchen:", error);
      toast.error("Failed to navigate to kitchen");
    }
  };

  const getStatusVariant = (status: Kitchen["isapproved"]) => {
    switch (status) {
      case "approved":
        return "success";
      case "processing":
        return "warning";
      case "rejected":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: Kitchen["isapproved"]) => {
    switch (status) {
      case "Approved":
        return <CheckCircle size={16} className="me-1" />;
      case "Pending":
        return <Clock size={16} className="me-1" />;
      case "Rejected":
        return <XCircle size={16} className="me-1" />;
      default:
        return null;
    }
  };

  return (
    <Card className="h-100 shadow-lg border-0 overflow-hidden hover-card">
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={kitchen.profilePic || "https://via.placeholder.com/300"}
          alt={kitchen.name}
          style={{ height: "200px", objectFit: "cover" }}
        />
        <Badge
          bg={getStatusVariant(kitchen.isapproved)}
          className="position-absolute top-0 end-0 m-2"
        >
          {getStatusIcon(kitchen.isapproved)}
          {kitchen.isapproved}
        </Badge>
      </div>

      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="fw-bold mb-0">{kitchen.name}</Card.Title>
          {kitchen.rating && (
            <Badge bg="light" text="dark" className="d-flex align-items-center">
              <Star size={14} className="me-1 text-warning" fill="#ffc107" />
              {kitchen.rating.toFixed(1)}
            </Badge>
          )}
        </div>

        <div className="mb-2">
          <p className="text-muted small mb-1">
            <MapPin size={14} className="me-1 text-primary" />
            {kitchen.address}
          </p>
        </div>

        {kitchen.cuisine && kitchen.cuisine.length > 0 && (
          <div className="mb-2">
            <div className="d-flex flex-wrap gap-1">
              {kitchen.cuisine.map((type, index) => (
                <Badge key={index} bg="light" text="dark" className="me-1">
                  <Utensils size={12} className="me-1" />
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {kitchen.specialty && (
          <div className="mb-3">
            <p className="small text-muted mb-0">
              <Award size={14} className="me-1 text-success" />
              Specialty: {kitchen.specialty}
            </p>
          </div>
        )}

        <div className="mt-auto">
          {kitchen.isapproved === "approved" ? (
            <Button
              variant="primary"
              size="sm"
              className="w-100 p-2"
              onClick={handleNavigateKitchen}
            >
              <Eye size={16} className="me-1 " />
              View Dashboard
            </Button>
          ) : kitchen.isapproved === "processing" ? (
            <Button
              variant="outline-secondary"
              size="sm"
              className="w-100 p-2"
              disabled
            >
              <Clock size={16} className="me-1" />
              Under Review
            </Button>
          ) : (
            <Button
              variant="outline-danger"
              size="sm"
              className="w-100 p-2"
              disabled
            >
              <XCircle size={16} className="me-1" />
              Rejected
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default KitchenCard;
