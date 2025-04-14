import React from "react";
import { Modal, Button } from "react-bootstrap";

interface IFSSAILicenseModal {
  show: boolean;
  onHide: () => void;
  fssaiDetails: any;
}

const FSSAILicenseModal: React.FC<IFSSAILicenseModal> = ({
  show,
  onHide,
  fssaiDetails,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>FSSAI License</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img
          src={fssaiDetails.ffsai_certificate_image}
          alt="FSSAI Certificate"
          className="img-fluid rounded"
          style={{ maxHeight: "600px", objectFit: "contain", width: "100%" }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FSSAILicenseModal;
