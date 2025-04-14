import React from "react";
import { Modal, Button } from "react-bootstrap";
interface IGSTPopupModal {
    show: boolean;
    onHide: () => void;
    gstDetails: any;
    formatDateToDDMMYY: (date: string) => string;
  }
  

const GSTDetailsModal = ({
  show,
  onHide,
  gstDetails,
  formatDateToDDMMYY,
}: IGSTPopupModal) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>GST Registration</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>GST Number:</strong> {gstDetails?.gst_number}
        </p>
        <p>
          <strong>Expiry Date:</strong>{" "}
          {formatDateToDDMMYY(gstDetails?.expiry_date)}
        </p>
        <img
          src={gstDetails?.gst_certificate_image}
          alt="GST Certificate"
          className="img-fluid rounded"
          style={{ maxHeight: "500px", objectFit: "contain", width: "100%" }}
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

export default GSTDetailsModal;
