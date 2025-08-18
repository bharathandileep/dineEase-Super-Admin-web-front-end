import React, { useState, useEffect } from "react";
import { Row, Col, Button, Card, Spinner } from "react-bootstrap";
import { Plus } from "lucide-react";
import KitchenCard from "./KitchenCard";
import { Kitchen } from "../../../types/profile";
import { getUserApprovedKitchens } from "../../../services/admin/kitchens";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { getUserInfo } from "../../../services/admin/auth";
import { setContext } from "../../../helpers/api/utils";

const YourKitchensTab: React.FC = () => {
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.Auth);

  useEffect(() => {
    const fetchUserKitchens = async () => {
      try {
        const response = await getUserApprovedKitchens();
        setKitchens(response.data.kitchens);
      } catch (error: any) {
        console.error("Error fetching kitchens:", error);
        toast.error("Failed to load kitchens");
      } finally {
        setLoading(false);
      }
    };

    fetchUserKitchens();
  }, []);

  const handleNavigateKitchen = async (kitchen: Kitchen) => {
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

      if (kitchen.isapproved === "Approved") {
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

  const handleCreateKitchen = () => {
    navigate("/request/kitchen");
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading your kitchens...</p>
      </div>
    );
  }

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Your Kitchens</h4>
          <Button
            variant="primary"
            className="p-2"
            size="sm"
            onClick={handleCreateKitchen}
          >
            <Plus size={16} className="me-1" />
            Create New Kitchen
          </Button>
        </div>
      </Card.Header>
      <Card.Body className="p-4">
        {kitchens.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted mb-3">
              You haven't created any kitchens yet.
            </p>
            <Button variant="primary" onClick={handleCreateKitchen}>
              <Plus size={16} className="me-1" />
              Create Your First Kitchen
            </Button>
          </div>
        ) : (
          <Row>
            {kitchens.map((kitchen) => (
              <Col key={kitchen.id} md={6} lg={4} className="mb-4">
                <KitchenCard kitchen={kitchen} />
              </Col>
            ))}
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default YourKitchensTab;
