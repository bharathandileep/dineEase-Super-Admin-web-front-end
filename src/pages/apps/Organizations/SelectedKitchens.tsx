import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { getSelectedKitchen } from "../../../server/admin/organization";
import PageTitle from "../../../components/PageTitle";

interface IKitchen {
  _id: string;
  kitchen_name: string;
  kitchen_image: string;
  kitchen_owner_name: string;
  owner_email: string;
  owner_phone_number: string;
  status: boolean;
}

function SelectedKitchensList() {
  const [selectedKitchen, setSelectedKitchen] = useState<IKitchen | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const orgId = localStorage.getItem("organizationId") || "";

    // useEffect(() => {
    //   const fetchSelectedKitchen = async () => {
    //     setLoading(true);
    //     try {
    //       const response = await getSelectedKitchen(orgId);
    //       if (response?.status) {
    //         // Store the single kitchen from the response
    //         setSelectedKitchen(response.data.kitchen);
    //       } else {
    //         toast.error(response?.message || "Failed to fetch selected kitchen.");
    //       }
    //     } catch (error) {
    //       console.error("Error fetching selected kitchen:", error);
    //       toast.error("An error occurred while fetching selected kitchen.");
    //     } finally {
    //       setLoading(false);
    //     }
    //   };

    //   fetchSelectedKitchen();
    // }, [orgId]);

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

  return (
    <div className="container-fluid px-4 py-3">
      <PageTitle
        breadCrumbItems={[
          { label: "Organizations", path: "/apps/organizations/list" },
          { label: "List", path: "/apps/organizations/list", active: true },
        ]}
        title={"Organizations"}
      />

      <div
        className="mb-3"
        style={{ backgroundColor: "#5bd2bc", padding: "10px" }}
      >
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="page-title m-0" style={{ color: "#fff" }}>
             Selected Kitchens 
          </h3>
        </div>
      </div>

      <Row className="g-3">
        {selectedKitchen ? (
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={selectedKitchen.kitchen_image}
                alt={selectedKitchen.kitchen_name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{selectedKitchen.kitchen_name}</Card.Title>
                <Card.Text>
                  <strong>Owner:</strong> {selectedKitchen.kitchen_owner_name}
                  <br />
                  <strong>Email:</strong> {selectedKitchen.owner_email}
                  <br />
                  <strong>Phone:</strong> {selectedKitchen.owner_phone_number}
                  <br />
                  <strong>Status:</strong>{" "}
                  <span
                    className={`text-${
                      selectedKitchen.status ? "success" : "danger"
                    }`}
                  >
                    {selectedKitchen.status ? "Active" : "Inactive"}
                  </span>
                </Card.Text>
                <div className="d-flex gap-2">
                  <Button
                    variant="primary"
                    onClick={() =>
                      navigate(`/apps/kitchen/details/${selectedKitchen._id}`)
                    }
                  >
                    View Details
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          <Col>
            <div className="alert alert-info">
              <i className="mdi mdi-information-outline me-2"></i>
              No collaboration kitchen is currently selected.
              <br />
              <Link to="/apps/kitchen/list" className="alert-link">
                Browse available kitchens
              </Link>{" "}
              to select a collaboration partner.
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
}

export default SelectedKitchensList;
