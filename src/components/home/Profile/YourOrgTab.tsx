import React, { useState, useEffect } from "react";
import { Row, Col, Button, Card, Spinner } from "react-bootstrap";
import { Plus } from "lucide-react";
import OrgCard from "./OrgCard";
import { useNavigate } from "react-router-dom";
import { getUserApprovedOrganizations } from "../../../server/admin/organization";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { setContext } from "../../../helpers/api/utils";
import { getUserInfo } from "../../../server/admin/auth";
import { toast } from "react-toastify";
import { getEmployeeOrg } from "../../../server/admin/orgemployeemanagment";
import { Organisation } from "../../../types/profile";

const YourOrgTab: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.Auth);

  useEffect(() => {
    const fetchUserOrganizations = async () => {
      try {
        let response;
        if (user.role === "Employee") {
          response = await getEmployeeOrg(user.email);
        } else {
          response = await getUserApprovedOrganizations();
          console.log(response);
        }
        setOrganizations(response.data.organizations);
      } catch (error: any) {
        console.error("Error fetching organizations:", error);
        toast.error("Failed to load organizations");
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrganizations();
  }, [user]);

  const handleCreateOrganization = () => {
    navigate("/request/organization");
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading your organizations...</p>
      </div>
    );
  }

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Your Organizations</h4>
          <Button
            variant="primary"
            size="sm"
            className="p-2"
            onClick={handleCreateOrganization}
          >
            <Plus size={16} className="me-1" />
            Create New Organization
          </Button>
        </div>
      </Card.Header>
      <Card.Body className="p-4">
        {organizations.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted mb-3">
              You haven't created any organizations yet.
            </p>
            <Button variant="primary" onClick={handleCreateOrganization}>
              <Plus size={16} className="me-1" />
              Create Your First Organization
            </Button>
          </div>
        ) : (
          <Row>
            {organizations.map((org) => (
              <Col key={org.id} md={6} lg={4} className="mb-4">
                <OrgCard org={org} />
              </Col>
            ))}
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default YourOrgTab;
