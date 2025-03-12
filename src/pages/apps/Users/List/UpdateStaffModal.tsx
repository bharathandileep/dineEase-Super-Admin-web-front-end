import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { UpdateStaffApi, Staffs } from '../../../../server/allApi';

interface UpdateStaffModalProps {
  show: boolean;
  onHide: () => void;
  staff: Staffs | null;
  onUpdateStaff: (updatedStaff: Staffs) => void;
}

const UpdateStaffModal: React.FC<UpdateStaffModalProps> = ({ show, onHide, staff, onUpdateStaff }) => {
  const [formData, setFormData] = useState<Partial<Staffs>>({});

  useEffect(() => {
    if (staff) {
      setFormData(staff);
    }
  }, [staff]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (staff && staff._id) {
      try {
        const updatedStaff = await UpdateStaffApi(staff._id, formData);
        onUpdateStaff(updatedStaff);
        onHide();
      } catch (error:any) {
        console.error('Error updating staff:', error);
        alert('Error updating staff');
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Staff</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formStaffName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formStaffRole">
            <Form.Label>Role</Form.Label>
            <Form.Control
              type="text"
              name="role"
              value={formData.role || ''}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formStaffUsername">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.email || ''}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formStaffPhone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              name="phone_no"
              value={formData.phone_no || ''}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formStaffEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Update
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateStaffModal;
