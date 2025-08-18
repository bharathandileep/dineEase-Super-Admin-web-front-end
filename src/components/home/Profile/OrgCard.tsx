import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import {
  Eye,
  Clock,
  XCircle,
  CheckCircle,
  Calendar,
  MapPin,
} from "lucide-react";
import { Organisation } from "../../../types/profile";
import { formatDateToDDMMYY, setContext } from "../../../helpers/api/utils";
import { getUserInfo } from "../../../services/admin/auth";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";

interface orgCardProps {
  org: Organisation;
}

const OrgCard: React.FC<orgCardProps> = ({ org }) => {
  const { user } = useSelector((state: RootState) => state.Auth);
  const navigate = useNavigate();
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Pending":
        return "warning";
      case "Rejected":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={16} className="me-1" />;
      case "processing":
        return <Clock size={16} className="me-1" />;
      case "rejected":
        return <XCircle size={16} className="me-1" />;
      default:
        return null;
    }
  };
  const handleNavigateOrg = async () => {
    try {
      const response = await getUserInfo(user.id);
      if (!response.status) {
        toast.error("Something went wrong");
        return;
      }
      const orgViewDetails = {
        role: user.role === "Employee" ? "Employee" : "Organization",
        organization: org.name,
        orgId: org.id,
        slug: org.slug,
      };
      if (org.isapproved === "approved") {
        localStorage.setItem("accessDetails", JSON.stringify(orgViewDetails));
        setContext({
          contextId: org.id,
          contextType: "Organization",
          slug: org.slug,
          role: response.data?.role_id || "",
        });
        navigate(`/apps/${org.slug}`);
      }
    } catch (error) {
      console.error("Error navigating to organization:", error);
      toast.error("Failed to navigate to organization");
    }
  };

  return (
    <Card className="h-100 shadow-lg border text-black border-0 overflow-hidden">
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={org.profilePic}
          alt={org.name}
          style={{ height: "200px", objectFit: "cover" }}
        />
        <Badge
          bg={getStatusVariant(org.isapproved)}
          className="position-absolute top-0 end-0 m-2"
        >
          {getStatusIcon(org.isapproved)}
          {org.isapproved}
        </Badge>
      </div>

      <Card.Body className="d-flex flex-column shadow">
        <Card.Title className="fw-bold mb-1">{org.name}</Card.Title>
        <div className="text-muted small mb-1">
          <MapPin size={12} className="me-1" />
          {org.address}
        </div>
        <div className="text-muted small mb-2">
          <Calendar size={12} className="me-1" />
          Created: {formatDateToDDMMYY(org.createdAt)}
        </div>
        <div className="mt-auto">
          {org.isapproved === "approved" && (
            <Button
              variant="primary"
              size="sm"
              className="w-100 p-2"
              onClick={handleNavigateOrg}
            >
              <Eye size={16} className="me-1" />
              View Dashboard
            </Button>
          )}
          {org.isapproved === "processing" && (
            <Button
              variant="outline-secondary"
              size="sm"
              className="w-100 p-2"
              disabled
            >
              <Clock size={16} className="me-1" />
              Under Review
            </Button>
          )}
          {org.isapproved === "rejected" && (
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

export default OrgCard;
