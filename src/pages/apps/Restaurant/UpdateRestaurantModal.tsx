import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
// import { updateCustomerApi, Customer } from '../../../../server/allApi';
import { Kitchen, updateKitchenApi } from '../../../server/allApi';

interface UpdateRestaurantModalProps {
  show: boolean;
  onHide: () => void;
  kitchen: Kitchen | null;
  onUpdateKitchen: (updatedKitchen: Kitchen) => void;
}

const UpdateRestaurantModal: React.FC<UpdateRestaurantModalProps> = ({ show, onHide, kitchen, onUpdateKitchen }) => {
  const [formData, setFormData] = useState<Partial<Kitchen>>({});

  useEffect(() => {
    if (kitchen) {
      setFormData(kitchen);
    }
  }, [kitchen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (kitchen && kitchen._id) {
      try {
        const updatedKitchen = await updateKitchenApi(kitchen._id, formData);
        onUpdateKitchen(updatedKitchen);
        onHide();
      } catch (error:any) {
        console.error('Error updating kitchen:', error);
        alert('Error updating kitchen');
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Kitchen</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* <Form.Group controlId="formCustomerName">
            <Form.Label>Kitchen ID</Form.Label>
            <Form.Control
              type="text"
              name="kitchen_id"
              value={formData.kitchen_id || ''}
              onChange={handleChange}
            />
          </Form.Group> */}
          <Form.Group controlId="formCustomerEmail">
            <Form.Label>UserName</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username || ''}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formCustomerAddress">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formCustomerPhone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              name="contact_num"
              value={formData.phone_no || ''}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formCustomerAge">
            <Form.Label>No. Of Employees</Form.Label>
            <Form.Control
              type="number"
              name="employees"
              value={formData.employees || ''}
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

export default UpdateRestaurantModal;
