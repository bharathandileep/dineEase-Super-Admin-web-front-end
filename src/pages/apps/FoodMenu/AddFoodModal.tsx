import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FoodMenu, postFoodMenuApi, fetchCompanyApi, fetchrestaurantApi } from "../../../server/allApi";

interface AddFoodModalProps {
  show: boolean;
  onHide: () => void;
  onAddFood: (foodMenu: FoodMenu) => void;
}

const AddFoodModal: React.FC<AddFoodModalProps> = ({ show, onHide, onAddFood }) => {
  const [formData, setFormData] = useState<Omit<FoodMenu, '_id'>>({
    food_name: '',
    organization_id: '',
    food_price: '',
    food_description: '',
    image_url: '',
    kitchen_id: '',
    created_by: '66a79aacd02d4640444ccf0c', // Replace with actual value or fetch dynamically
    created_at: new Date().toISOString(),
    updated_by: '66a79aacd02d4640444ccf0c', // Replace with actual value or fetch dynamically
    updated_at: new Date().toISOString(),
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [organizations, setOrganizations] = useState<{ _id: string, name: string }[]>([]);
  const [kitchens, setKitchens] = useState<{ _id: string, name: string }[]>([]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newFood = await postFoodMenuApi(formData);
      onAddFood(newFood);
      onHide();
    } catch (error:any) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header className="bg-light" closeButton>
        <Modal.Title className="m-0">Add New Food</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
        {!loading && !error && (
          <form onSubmit={handleSubmit}>
            <Form.Group controlId="formFoodName">
              <Form.Label>Food Name</Form.Label>
              <Form.Control
                type="text"
                name="food_name"
                value={formData.food_name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formOrganizationId">
              <Form.Label>Organization</Form.Label>
              <Form.Control
                as="select"
                name="organization_id"
                value={formData.organization_id}
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
            <Form.Group controlId="formFoodPrice">
              <Form.Label>Food Price</Form.Label>
              <Form.Control
                type="number"
                name="food_price"
                value={formData.food_price}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formFoodDescription">
              <Form.Label>Food Description</Form.Label>
              <Form.Control
                type="text"
                name="food_description"
                value={formData.food_description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formKitchenId">
              <Form.Label>Kitchen</Form.Label>
              <Form.Control
                as="select"
                name="kitchen_id"
                value={formData.kitchen_id}
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
            {/* <Form.Group controlId="formCreatedBy">
              <Form.Label>Created By</Form.Label>
              <Form.Control
                type="text"
                name="created_by"
                value={formData.created_by}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCreatedAt">
              <Form.Label>Created At</Form.Label>
              <Form.Control
                type="datetime-local"
                name="created_at"
                value={new Date(formData.created_at).toISOString().slice(0, 16)}
                onChange={handleChange}
                required
              />
            </Form.Group> */}
            {/* <Form.Group controlId="formUpdatedBy">
              <Form.Label>Updated By</Form.Label>
              <Form.Control
                type="text"
                name="updated_by"
                value={formData.updated_by}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUpdatedAt">
              <Form.Label>Updated At</Form.Label>
              <Form.Control
                type="datetime-local"
                name="updated_at"
                value={new Date(formData.updated_at).toISOString().slice(0, 16)}
                onChange={handleChange}
                required
              />
            </Form.Group> */}
            <div className="text-end">
              <Button variant="success" type="submit" className="waves-effect waves-light me-1">
                Save
              </Button>
              <Button variant="danger" className="waves-effect waves-light" onClick={onHide}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AddFoodModal;
