import React from "react";
import { Modal, Button } from "react-bootstrap";
interface IPANPopupModal {
  show: boolean;
  onHide: () => void;
  panDetails: any;
}

const PANDetailsModal = ({ show, onHide, panDetails }: IPANPopupModal) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>PAN Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>PAN Number:</strong> {panDetails?.pan_card_number}
        </p>
        <p>
          <strong>Card Holder:</strong> {panDetails?.pan_card_user_name}
        </p>
        <img
          src={panDetails?.pan_card_image}
          alt="PAN Card"
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

export default PANDetailsModal;
