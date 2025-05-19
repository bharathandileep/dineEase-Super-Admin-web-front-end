import React, { useState } from "react";
import { Row, Col, Card, Button, Badge } from "react-bootstrap";
import { verifyDocument } from "../server/admin/admin";
import { toast } from "react-toastify";
import PANDetailsModal from "./PANDetailsModal";
import { useAuthDetails } from "../hooks/useAuthDetails";
interface IPANPreview {
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
}

interface VerifyDocument {
  isVerified: boolean | undefined;
  documentId: string | undefined;
  documentType: string;
}

const VerificationButton = ({
  isVerified,
  documentId,
  documentType,
}: VerifyDocument) => {
  const [verified, setVerified] = useState(isVerified);

  const handleVerifyClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setVerified(true);
    if (!isVerified) {
      try {
        const response = await verifyDocument(documentId, documentType);
        setVerified(true);
        toast.success(response.message || "Document verified successfully");
        console.log(response);
      } catch (error: any) {
        toast.error(
          error.message || "Something went wrong during verification"
        );
      }
    }
  };

  return (
    <Button
      variant={verified ? "success" : "danger"}
      className="d-flex align-items-center gap-2 px-3 py-2"
      onClick={handleVerifyClick}
    >
      <i
        className={`mdi ${
          verified ? "mdi-check-circle-outline" : "mdi-close-circle-outline"
        }`}
      ></i>
      {verified ? "Verified" : "Not Verified"}
    </Button>
  );
};
function PANPreview({ panDetails }: { panDetails: IPANPreview | undefined }) {
  const [showPanModal, setShowPanModal] = useState(false);
  const { user } = useAuthDetails();
  return (
    <>
      <Col md={6}>
        <Card
          className="h-100 shadow-sm"
          style={{ cursor: "pointer" }}
          onClick={() => setShowPanModal(true)}
        >
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h5 className="card-title text-bold text-black">PAN Details</h5>
              {user?.role === "Admin" && (
                <VerificationButton
                  documentId={panDetails?._id}
                  documentType="PAN"
                  isVerified={panDetails?.is_verified}
                />
              )}
            </div>
            <div className="mb-3">
              <p className="mb-2">
                <strong>PAN Number:</strong> {panDetails?.pan_card_number}
              </p>
              <p className="mb-2">
                <strong>Card Holder:</strong> {panDetails?.pan_card_user_name}
              </p>
            </div>
            <img
              src={panDetails?.pan_card_image}
              alt="PAN Card"
              className="img-fluid rounded"
              style={{ maxHeight: "150px", objectFit: "cover" }}
            />
          </Card.Body>
        </Card>
      </Col>
      <PANDetailsModal
        show={showPanModal}
        onHide={() => setShowPanModal(false)}
        panDetails={panDetails}
      />
    </>
  );
}

export default PANPreview;
