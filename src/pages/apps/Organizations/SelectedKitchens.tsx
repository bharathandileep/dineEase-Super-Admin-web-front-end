import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Col, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { listCollaboratedKitchens } from "../../../server/admin/collab";
import PageTitle from "../../../components/PageTitle";
import { useAuthDetails } from "../../../hooks/useAuthDetails";

function SelectedKitchensList() {
  const { user, context, isContext, isSuperAdmin } = useAuthDetails();
  const [selectedKitchens, setSelectedKitchens] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSelectedKitchens = async () => {
      setLoading(true);
      try {
        const response = await listCollaboratedKitchens(
          (context?.contextId ?? "").toString()
        );
        if (response?.status) {
          setSelectedKitchens(response.data);
        } else {
          toast.error(response?.message || "Failed to fetch kitchens.");
        }
      } catch (error: any) {
        console.error("Error fetching kitchens:", error);
        toast.error(error.message || "Failed to fetch kitchens.");
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedKitchens();
  }, [context?.contextId]);

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Kitchens", path: "/products" },
          { label: "Selected Collaboration Kitchens", path: "", active: true },
        ]}
        title={"Collaboration Kitchens"}
      />

      <div
        className="mb-3"
        style={{ backgroundColor: "#5bd2bc", padding: "10px" }}
      >
        <h3 className="page-title m-0" style={{ color: "#fff" }}>
          Selected Collaboration Kitchens
        </h3>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading kitchens...</p>
        </div>
      ) : selectedKitchens?.length > 0 ? (
        <Row>
          {selectedKitchens.map((kitchen) => (
            <Col key={kitchen._id} md={6} xl={3} className="mb-3">
              <Link to={`/apps/selected-kitchen/${kitchen.slug}/collab`}>
                <Card className="product-box h-100 shadow-sm">
                  <Card.Body className="d-flex flex-column">
                    <div className="bg-light mb-1">
                      <img
                        src={kitchen.kitchen_image}
                        alt={kitchen.kitchen_name}
                        className="img-fluid"
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                    <div className="product-info mt-auto">
                      <h5 className="font-24 mt-0 sp-line-1 bold">
                        {kitchen.kitchen_name}
                      </h5>
                      <div className="text-muted font-14">
                        <div className="d-flex align-items-center mb-1 text-black">
                          <i className="mdi mdi-phone-classic me-1"></i>
                          <span>{kitchen.owner_phone_number}</span>
                        </div>
                        <div className="d-flex align-items-center text-black">
                          <i className="mdi mdi-email me-1"></i>
                          <span>{kitchen.owner_email}</span>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      ) : (
        <Col>
          <Card>
            <Card.Body className="text-center">
              <i
                className="mdi mdi-alert-circle-outline text-muted"
                style={{ fontSize: "48px" }}
              ></i>
              <h4 className="mt-3">No Kitchens Found</h4>
              <p className="text-muted">
                There are no collaboration kitchens selected yet.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate("/apps/kitchen/new")}
              >
                Add New Kitchen
              </Button>
            </Card.Body>
          </Card>
        </Col>
      )}
    </>
  );
}

export default SelectedKitchensList;
