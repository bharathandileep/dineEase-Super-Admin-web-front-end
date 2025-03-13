import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { updateCustomerApi, Customer } from '../../../../server/allApi';

interface UpdateCustomerModalProps {
  show: boolean;
  onHide: () => void;
  customer: Customer | null;
  onUpdateCustomer: (updatedCustomer: Customer) => void;
  isLoading: boolean; // Added prop to indicate loading state
}

const UpdateCustomerModal: React.FC<UpdateCustomerModalProps> = ({ show, onHide, customer, onUpdateCustomer, isLoading }) => {
  const [formData, setFormData] = useState<Partial<Customer>>({});
  const [error, setError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState<boolean>(false); // Local loading state

  useEffect(() => {
    if (customer) {
      setFormData(customer);
    }
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (customer && customer._id) {
      setError(null);
      setLocalLoading(true); // Set local loading state to true
      try {
        // Simulate a delay to extend the loading time
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Adjust the delay as needed
        const updatedCustomer = await updateCustomerApi(customer._id, formData);
        onUpdateCustomer(updatedCustomer);
        onHide();
      } catch (error:any) {
        console.error('Error updating customer:', error);
        setError('Error updating customer');
      } finally {
        setLocalLoading(false); // Set local loading state to false
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Customer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formCustomerName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="cust_name"
              value={formData.cust_name || ''}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formCustomerEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formCustomerAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formCustomerPhone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              name="contact_num"
              value={formData.contact_num || ''}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formCustomerAge">
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              name="age"
              value={formData.age || ''}
              onChange={handleChange}
            />
          </Form.Group>
          <div className="text-end">
            <Button 
              variant="primary" 
              type="submit"
              disabled={isLoading || localLoading} // Disable button when loading
            >
              {isLoading || localLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" /> Updating...
                </>
              ) : (
                'Update'
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateCustomerModal;
