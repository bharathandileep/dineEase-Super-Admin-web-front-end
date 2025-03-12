import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Company, updateCompanyApi } from '../../../server/allApi';

interface UpdateCompanyModalProps {
  show: boolean;
  onHide: () => void;
  company: Company | null;
  onUpdateCompany: (updatedCompany: Company) => void;
}

const UpdateCompanyModal: React.FC<UpdateCompanyModalProps> = ({ show, onHide, company, onUpdateCompany }) => {
  const [formData, setFormData] = useState<Partial<Company>>({});

  useEffect(() => {
    if (company) {
      setFormData(company);
    }
  }, [company]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    update();
  };

  const update = async ()=>{
    if (company && company._id) {
      try {
        const updatedCompany = await updateCompanyApi(company._id, formData);
        onUpdateCompany(updatedCompany);
        onHide();
      } catch (error:any) {
        console.error('Error updating company:', error);
        alert('Error updating company');
      }
    }
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Company</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* <Form.Group controlId="formCompanyId">
            <Form.Label>Company ID</Form.Label>
            <Form.Control
              type="text"
              name="company_id"
              value={formData.company_id || ''}
              onChange={handleChange}
            />
          </Form.Group> */}
          <Form.Group controlId="formCompanyName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="company_name"
              value={formData.company_name || ''}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formCompanyContact">
            <Form.Label>Contact</Form.Label>
            <Form.Control
              type="text"
              name="company_contact"
              value={formData.company_contact || ''}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formCompanyLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="company_location"
              value={formData.company_location || ''}
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

export default UpdateCompanyModal;
