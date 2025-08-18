import React, { useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import FSSAILicenseModal from "./FSSAILicenseModal";
import { verifyDocument } from "../services/admin/admin";
import { toast } from "react-toastify";
import { useAuthDetails } from "../hooks/useAuthDetails";

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
        response.status
          ? toast.success(response.message || "Document verified successfully")
          : toast.error(response.message || "Internal server error!");
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
function FSSAIPreview({ fssaiDetails }: any) {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuthDetails();
  return (
    <>
      <Col md={6}>
        <Card
          className="h-100 shadow-sm"
          style={{
            cursor: fssaiDetails?.ffsai_certificate_image
              ? "pointer"
              : "default",
          }}
          onClick={() => {
            if (fssaiDetails?.ffsai_certificate_image) setShowModal(true);
          }}
        >
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h5 className="card-title text-bold text-black">FSSAI License</h5>
              {user?.role === "Admin" && (
                <VerificationButton
                  documentId={fssaiDetails?._id}
                  documentType="FSSAI"
                  isVerified={fssaiDetails?.is_verified}
                />
              )}
            </div>
            {fssaiDetails?.ffsai_certificate_image && (
              <img
                src={fssaiDetails.ffsai_certificate_image}
                alt="FSSAI Certificate"
                className="img-fluid rounded"
                style={{
                  maxHeight: "250px",
                  objectFit: "cover",
                  width: "100%",
                }}
              />
            )}
          </Card.Body>
        </Card>
      </Col>
      <FSSAILicenseModal
        show={showModal}
        onHide={() => setShowModal(false)}
        fssaiDetails={fssaiDetails}
      />
    </>
  );
}
export default FSSAIPreview;
