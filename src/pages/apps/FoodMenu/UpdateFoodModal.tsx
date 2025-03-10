import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { updateFoodMenuApi, fetchCompanyApi, fetchrestaurantApi, FoodMenu } from '../../../server/allApi';
import { ToastContainer, Toast } from 'react-bootstrap';

interface UpdateFoodModalProps {
  show: boolean;
  onHide: () => void;
  foodItem: FoodMenu;
  onUpdateFood: (updatedFood: FoodMenu) => void;
}

const UpdateFoodModal: React.FC<UpdateFoodModalProps> = ({ show, onHide, foodItem, onUpdateFood }) => {
  const [formData, setFormData] = useState<Partial<FoodMenu>>(foodItem);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<{ _id: string, name: string }[]>([]);
  const [kitchens, setKitchens] = useState<{ _id: string, name: string }[]>([]);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesData = await fetchCompanyApi(1, 10);
        const kitchensData = await fetchrestaurantApi(1,10);

        const adaptedCompanies = companiesData.data.map((company: any) => ({
          _id: company._id,
          name: company.company_name,
        }));

        const adaptedKitchens = kitchensData.data.map((kitchen: any) => ({
          _id: kitchen._id,
          name: kitchen.f_name,
        }));



        setOrganizations(adaptedCompanies);
        setKitchens(adaptedKitchens);
      } catch (err) {
        setError((err as Error).message);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (foodItem._id) {
      try {
        const updatedFood = await updateFoodMenuApi(foodItem._id, formData);
        onUpdateFood(updatedFood);
        setToastMessage('Food item updated successfully!');
        setShowToast(true);
        onHide();
      } catch (error) {
        console.error('Error updating food item:', error);
        setError('Error updating food item');
        setToastMessage('Error updating food item');
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <React.Fragment>
      <Modal show={show} onHide={onHide} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header className="bg-light" closeButton>
          <Modal.Title className="m-0">Update Food Item</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFoodName">
              <Form.Label>Food Name</Form.Label>
              <Form.Control
                type="text"
                name="food_name"
                value={formData.food_name || ''}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formFoodPrice">
              <Form.Label>Food Price</Form.Label>
              <Form.Control
                type="number"
                name="food_price"
                value={formData.food_price || ''}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formFoodDescription">
              <Form.Label>Food Description</Form.Label>
              <Form.Control
                type="text"
                name="food_description"
                value={formData.food_description || ''}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formOrganizationId">
              <Form.Label>Organization</Form.Label>
              <Form.Control
                as="select"
                name="organization_id"
                value={formData.organization_id || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select Organization</option>
                {organizations.map((org) => (
                  <option key={org._id} value={org._id}>
                    {org.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formKitchenId">
              <Form.Label>Kitchen</Form.Label>
              <Form.Control
                as="select"
                name="kitchen_id"
                value={formData.kitchen_id || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select Kitchen</option>
                {kitchens.map((kitchen) => (
                  <option key={kitchen._id} value={kitchen._id}>
                    {kitchen.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <div className="text-end">
              <Button variant="success" type="submit" className="waves-effect waves-light me-1">
                Save Changes
              </Button>
              <Button variant="danger" className="waves-effect waves-light" onClick={onHide}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

     
    </React.Fragment>
  );
};

export default UpdateFoodModal;