import React, { useState } from "react";
import { Row, Col, Card, Button, Badge } from "react-bootstrap";
import { verifyDocument } from "../server/admin/admin";
import { toast } from "react-toastify";
import GSTDetailsModal from "./GSTDetailsModal";
import { useAuthDetails } from "../hooks/useAuthDetails";
import { formatDateToDDMMYY } from "../helpers/api/utils";
interface IGSTPreview {
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

function GSTPreview({ gstDetails }: { gstDetails: IGSTPreview | undefined }) {
  const [showGSTModal, setShowGSTModal] = useState(false);
  const { user } = useAuthDetails();
  return (
    <>
      <Col md={6}>
        <Card
          className="h-100 shadow-sm"
          style={{ cursor: "pointer" }}
          onClick={() => setShowGSTModal(true)}
        >
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h5 className="card-title text-bold text-black">
                GST Registration
              </h5>
              {user?.role === "Admin" && (
                <VerificationButton
                  documentId={gstDetails?._id}
                  documentType="GST"
                  isVerified={gstDetails?.is_verified}
                />
              )}
            </div>
            <div className="mb-3">
              <p className="mb-2">
                <strong>GST Number:</strong> {gstDetails?.gst_number}
              </p>
              <p className="mb-2">
                <strong>Expiry Date:</strong>{" "}
                {formatDateToDDMMYY(gstDetails?.expiry_date)}
              </p>
            </div>
            <img
              src={gstDetails?.gst_certificate_image}
              alt="GST Certificate"
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
      <GSTDetailsModal
        show={showGSTModal}
        onHide={() => setShowGSTModal(false)}
        gstDetails={gstDetails}
        formatDateToDDMMYY={formatDateToDDMMYY}
      />
    </>
  );
}

export default GSTPreview;
