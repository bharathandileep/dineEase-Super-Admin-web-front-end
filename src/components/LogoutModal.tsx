import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function LogoutModal({ showLogoutModal, onHide }: any) {
  const navigate = useNavigate();
  const handleConfirmLogout = () => {
    onHide();
    navigate("/auth/logout");
  };
  return (
    <Modal
      show={showLogoutModal}
      onHide={showLogoutModal}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header className="border-0 pb-0">
        <Modal.Title className="fw-bold text-dark">Confirm Logout</Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2">
        <div className="text-center">
          <div className="mb-3">
            <i
              className="mdi mdi-help-circle-outline text-warning"
              style={{ fontSize: "48px" }}
            ></i>
          </div>
          <h5 className="mb-3">Are you sure you want to logout?</h5>
          <p className="text-muted mb-0">
            You will need to sign in again to access your account.
          </p>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button variant="secondary" onClick={onHide} className="me-2">
          <i className="mdi mdi-close me-1"></i>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirmLogout}>
          <i className="mdi mdi-logout me-1"></i>
          Yes, Logout
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LogoutModal;
