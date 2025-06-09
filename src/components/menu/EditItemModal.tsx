import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, FloatingLabel, Badge, Alert, Col, Row } from 'react-bootstrap';
import { Category, MenuItem } from '../../types/menu';
import { ImageUpload } from './ImageUpload';
import { MealPeriodSelector } from './MealPeriodSelector';


interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: MenuItem) => void;
  item: MenuItem;
  categories: Category[];
}

const availableTags = ['Veg', 'Non-Veg', 'Spicy', 'Gluten-Free', 'Dairy-Free', 'Signature'];

export const EditItemModal: React.FC<EditItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  item,
  categories,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    ingredients: '',
    tags: [] as string[],
    available: true,
    image: undefined as string | undefined,
    mealPeriods: [] as string[],
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        category: item.category,
        price: item.price.toString(),
        description: item.description,
        ingredients: item.ingredients.join(', '),
        tags: item.tags,
        available: item.available,
        image: item.image,
        mealPeriods: item.mealPeriods || [],
      });
    }
  }, [item]);

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.mealPeriods.length === 0) {
      alert('Please select at least one meal period');
      return;
    }
    
    onSubmit({
      ...item,
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      description: formData.description,
      ingredients: formData.ingredients.split(',').map(i => i.trim()),
      tags: formData.tags,
      available: formData.available,
      image: formData.image,
      mealPeriods: formData.mealPeriods,
    });
  };

  return (
    <Modal show={isOpen} onHide={onClose} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Edit Menu Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <ImageUpload
            image={formData.image}
            onImageChange={(image:any) => setFormData(prev => ({ ...prev, image }))}
            className="mb-4"
          />

          <Row className="mb-4">
            <Col md={6} className="mb-3 mb-md-0">
              <Form.Group controlId="edit-name">
                <Form.Label>Item Name *</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="edit-category">
                <Form.Label>Category *</Form.Label>
                <Form.Select
                  value={formData.category}
                  onChange={(e:any) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6} className="mb-3 mb-md-0">
              <Form.Group controlId="edit-price">
                <Form.Label>Price (₹) *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="edit-availability">
                <Form.Label>Availability</Form.Label>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label={formData.available ? 'Available' : 'Not Available'}
                  checked={formData.available}
                  onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4" controlId="edit-description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="edit-ingredients">
            <Form.Label>Ingredients (comma-separated)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={formData.ingredients}
              onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
              placeholder="e.g. Rice, Chicken, Spices, Onions"
            />
          </Form.Group>
          <MealPeriodSelector
            selectedPeriods={formData.mealPeriods}
            onPeriodsChange={(periods:any) => setFormData(prev => ({ ...prev, mealPeriods: periods }))}
            className="mb-4"
          />

          <Form.Group className="mb-4">
            <Form.Label>Tags</Form.Label>
            <div className="d-flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  pill
                  bg={formData.tags.includes(tag) ? "success" : "outline-primary"}
                  className={`cursor-pointer ${formData.tags.includes(tag) ? '' : 'hover-bg-light'}`}
                  onClick={() => handleTagToggle(tag)}
                  style={{ cursor: 'pointer' }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </Form.Group>

          {item.masterFoodId && (
            <Alert variant="info" className="mb-4">
              <strong>Linked to master catalog:</strong> #{item.masterFoodId}
            </Alert>
          )}

          <Modal.Footer>
            <Button variant="outline-secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="success" type="submit">
              Update Menu Item
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};