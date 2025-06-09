import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  InputGroup,
  FormControl,
  Dropdown,
  Badge,
} from "react-bootstrap";
import { Search, X } from "lucide-react";
import { Category, MasterFood, MenuItem } from "../../types/menu";
import { ImageUpload } from "./ImageUpload";
import { MealPeriodSelector } from "./MealPeriodSelector";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<MenuItem, "id">) => void;
  categories: Category[];
  masterFoods: MasterFood[];
}

const availableTags = [
  "Veg",
  "Non-Veg",
  "Spicy",
  "Gluten-Free",
  "Dairy-Free",
  "Signature",
];

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  masterFoods,
}) => {
  const [searchMaster, setSearchMaster] = useState("");
  const [selectedMaster, setSelectedMaster] = useState<MasterFood | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    ingredients: "",
    tags: [] as string[],
    available: true,
    image: undefined as string | undefined,
    mealPeriods: [] as string[],
    userPrice: "",
    organizationPrice: "",
  });
  const [priceType, setPriceType] = useState({
    user: true,
    organization: false,
  });
  const [tagInput, setTagInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);

  const filteredMasterFoods = masterFoods.filter((food) =>
    food.name.toLowerCase().includes(searchMaster.toLowerCase())
  );

  const handleMasterSelect = (master: MasterFood) => {
    setSelectedMaster(master);
    setFormData({
      name: master.name,
      category: master.category,
      price: master.suggestedPrice.toString(),
      description: master.description,
      ingredients: master.ingredients.join(", "),
      tags: master.tags,
      available: true,
      image: master.image,
      mealPeriods: master.mealPeriods,
      userPrice: "",
      organizationPrice: "",
    });
    setSearchMaster("");
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);

    if (value) {
      const filtered = availableTags.filter(
        (tag) =>
          tag.toLowerCase().includes(value.toLowerCase()) &&
          !formData.tags.includes(tag)
      );
      setTagSuggestions(filtered);
    } else {
      setTagSuggestions([]);
    }
  };

  const handleTagSelect = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
    setTagInput("");
    setTagSuggestions([]);
  };

  const handleTagRemove = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.mealPeriods.length === 0) {
      alert("Please select at least one meal period");
      return;
    }

    onSubmit({
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      description: formData.description,
      ingredients: formData.ingredients.split(",").map((i) => i.trim()),
      tags: formData.tags,
      available: formData.available,
      masterFoodId: selectedMaster?.id,
      image: formData.image,
      mealPeriods: formData.mealPeriods,
    });

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      description: "",
      ingredients: "",
      tags: [],
      available: true,
      image: undefined,
      mealPeriods: [],
      userPrice: "",
      organizationPrice: "",
    });
    setSelectedMaster(null);
    setSearchMaster("");
    setTagInput("");
    setTagSuggestions([]);
  };

  return (
    <Modal show={isOpen} onHide={onClose} size="lg" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Add New Menu Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Master Food Search */}
          <Form.Group className="mb-3">
            <Form.Label>Search Master Food Catalog (Optional)</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Search size={16} className="text-muted" />
              </InputGroup.Text>
              <FormControl
                placeholder="Search for existing food items..."
                value={searchMaster}
                onChange={(e: any) => setSearchMaster(e.target.value)}
              />
            </InputGroup>
            {searchMaster && filteredMasterFoods.length > 0 && (
              <div
                className="border rounded mt-2"
                style={{ overflowY: "auto", maxHeight: "200px" }}
              >
                {filteredMasterFoods.map((food) => (
                  <div
                    key={food.id}
                    className="p-3 border-bottom cursor-pointer hover-bg-light"
                    onClick={() => handleMasterSelect(food)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="font-weight-medium">{food.name}</div>
                    <div className="text-muted small">{food.description}</div>
                    <div className="text-success small">
                      ₹{food.suggestedPrice}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {selectedMaster && (
              <div className="bg-light border border-success rounded p-3 mt-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="text-success font-weight-medium">
                      Selected: {selectedMaster.name}
                    </div>
                    <div className="text-success small">
                      Auto-filled from master catalog
                    </div>
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => {
                      setSelectedMaster(null);
                      resetForm();
                    }}
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            )}
          </Form.Group>

          {/* Image Upload */}
          <Form.Group className="mb-3">
            <ImageUpload
              image={formData.image}
              onImageChange={(image: any) =>
                setFormData((prev) => ({ ...prev, image }))
              }
            />
          </Form.Group>

          {/* Form Fields */}
          <div className="row">
            <Form.Group className="col-md-6 mb-3">
              <Form.Label htmlFor="name">Item Name *</Form.Label>
              <FormControl
                id="name"
                value={formData.name}
                onChange={(e: any) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </Form.Group>

            <Form.Group className="col-md-6 mb-3">
              <Form.Label htmlFor="category">Category *</Form.Label>
              <Dropdown>
                <Dropdown.Toggle
                  variant="outline-secondary"
                  id="category"
                  className="w-100 text-left"
                >
                  {formData.category || "Select category"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {categories.map((category) => (
                    <Dropdown.Item
                      key={category.id}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          category: category.name,
                        }))
                      }
                    >
                      {category.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>

            {/* Price Type Selection */}
            <Form.Group className="mb-3">
              <Form.Label>Price For</Form.Label>
              <div className="d-flex gap-3">
                <Form.Check
                  type="checkbox"
                  id="userPriceCheck"
                  label="User"
                  checked={priceType.user}
                  onChange={(e) =>
                    setPriceType((prev) => ({
                      ...prev,
                      user: e.target.checked,
                    }))
                  }
                />
                <Form.Check
                  type="checkbox"
                  id="orgPriceCheck"
                  label="Organization"
                  checked={priceType.organization}
                  onChange={(e) =>
                    setPriceType((prev) => ({
                      ...prev,
                      organization: e.target.checked,
                    }))
                  }
                />
              </div>
            </Form.Group>

            {/* Price Fields */}
            <div className="row">
              {priceType.user && (
                <Form.Group className="col-md-6 mb-3">
                  <Form.Label htmlFor="userPrice">User Price (₹) *</Form.Label>
                  <FormControl
                    id="userPrice"
                    type="number"
                    step="0.01"
                    value={formData.userPrice}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        userPrice: e.target.value,
                      }))
                    }
                    required={priceType.user}
                  />
                </Form.Group>
              )}

              {priceType.organization && (
                <Form.Group className="col-md-6 mb-3">
                  <Form.Label htmlFor="organizationPrice">
                    Organization Price (₹) *
                  </Form.Label>
                  <FormControl
                    id="organizationPrice"
                    type="number"
                    step="0.01"
                    value={formData.organizationPrice}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        organizationPrice: e.target.value,
                      }))
                    }
                    required={priceType.organization}
                  />
                </Form.Group>
              )}
            </div>

            <Form.Group className="col-md-6 mb-3">
              <Form.Label>Availability</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Check
                  type="switch"
                  id="availability"
                  checked={formData.available}
                  onChange={(e: any) =>
                    setFormData((prev) => ({
                      ...prev,
                      available: e.target.checked,
                    }))
                  }
                />
                <span className="ms-2 small">
                  {formData.available ? "Available" : "Not Available"}
                </span>
              </div>
            </Form.Group>
          </div>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="description">Description</Form.Label>
            <FormControl
              as="textarea"
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e: any) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="ingredients">
              Ingredients (comma-separated)
            </Form.Label>
            <FormControl
              as="textarea"
              id="ingredients"
              rows={2}
              placeholder="e.g. Rice, Chicken, Spices, Onions"
              value={formData.ingredients}
              onChange={(e: any) =>
                setFormData((prev) => ({
                  ...prev,
                  ingredients: e.target.value,
                }))
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <MealPeriodSelector
              selectedPeriods={formData.mealPeriods}
              onPeriodsChange={(periods: any) =>
                setFormData((prev) => ({ ...prev, mealPeriods: periods }))
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tags</Form.Label>

            {/* Selected Tags */}
            <div className="d-flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <Badge
                  key={tag}
                  bg="success"
                  className="d-flex align-items-center p-2"
                >
                  {tag}
                  <Button
                    variant="link"
                    className="text-white p-0 ms-2"
                    onClick={() => handleTagRemove(tag)}
                    style={{ lineHeight: 1 }}
                  >
                    <X size={14} />
                  </Button>
                </Badge>
              ))}
            </div>

            {/* Tag Input with Suggestions */}
            <div className="position-relative">
              <FormControl
                placeholder="Add tags..."
                value={tagInput}
                onChange={handleTagInputChange}
              />

              {tagSuggestions.length > 0 && (
                <div className="position-absolute top-100 start-0 end-0 bg-white border rounded shadow-sm mt-1 z-3">
                  {tagSuggestions.map((tag) => (
                    <div
                      key={tag}
                      className="p-2 cursor-pointer hover-bg-light"
                      onClick={() => handleTagSelect(tag)}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-muted small mt-1">
              Available tags: {availableTags.join(", ")}
            </div>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="outline-secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="success" type="submit">
              Add Menu Item
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
