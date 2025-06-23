import React, { useState } from "react";
import {
  Container,
  Card,
  Button,
  Form,
  InputGroup,
  FormControl,
  Dropdown,
  Badge,
  Alert,
} from "react-bootstrap";
import { Search, X, ArrowLeft } from "lucide-react";

// Type definitions
interface Category {
  id: string;
  name: string;
}

interface MasterFood {
  id: string;
  name: string;
  description: string;
  suggestedPrice: number;
  category: string;
  ingredients: string[];
  tags: string[];
  image: string;
  mealPeriods: string[];
}

interface FormData {
  name: string;
  category: string;
  price: string;
  description: string;
  ingredients: string;
  tags: string[];
  available: boolean;
  image: string | undefined;
  mealPeriods: string[];
  userPrice: string;
  organizationPrice: string;
}

interface PriceType {
  user: boolean;
  organization: boolean;
}

interface MealPeriod {
  id: string;
  label: string;
}

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  userPrice?: number;
  organizationPrice?: number;
  description: string;
  ingredients: string[];
  tags: string[];
  available: boolean;
  masterFoodId?: string;
  image?: string;
  mealPeriods: string[];
}

interface ImageUploadProps {
  image: string | undefined;
  onImageChange: (image: string) => void;
}

interface MealPeriodSelectorProps {
  selectedPeriods: string[];
  onPeriodsChange: (periods: string[]) => void;
}

// Mock data - replace with your actual data source
const categories: Category[] = [
  { id: "1", name: "Appetizers" },
  { id: "2", name: "Main Course" },
  { id: "3", name: "Desserts" },
  { id: "4", name: "Beverages" },
  { id: "5", name: "Snacks" },
];

const masterFoods: MasterFood[] = [
  {
    id: "1",
    name: "Butter Chicken",
    description: "Creamy tomato-based chicken curry",
    suggestedPrice: 250,
    category: "Main Course",
    ingredients: ["Chicken", "Tomato", "Cream", "Spices"],
    tags: ["Non-Veg", "Spicy", "Signature"],
    image: "",
    mealPeriods: ["lunch", "dinner"],
  },
  {
    id: "2",
    name: "Vegetable Biryani",
    description: "Fragrant rice dish with mixed vegetables",
    suggestedPrice: 180,
    category: "Main Course",
    ingredients: ["Rice", "Mixed Vegetables", "Spices", "Saffron"],
    tags: ["Veg", "Signature"],
    image: "",
    mealPeriods: ["lunch", "dinner"],
  },
  {
    id: "3",
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with Caesar dressing",
    suggestedPrice: 120,
    category: "Appetizers",
    ingredients: ["Romaine Lettuce", "Parmesan", "Croutons", "Caesar Dressing"],
    tags: ["Veg", "Gluten-Free"],
    image: "",
    mealPeriods: ["lunch", "dinner"],
  },
];

const availableTags: string[] = [
  "Veg",
  "Non-Veg",
  "Spicy",
  "Gluten-Free",
  "Dairy-Free",
  "Signature",
];

const availableMealPeriods: MealPeriod[] = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "snacks", label: "Snacks" },
];

// ImageUpload component
const ImageUpload: React.FC<ImageUploadProps> = ({ image, onImageChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          onImageChange(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <Form.Label>Item Image</Form.Label>
      <FormControl type="file" accept="image/*" onChange={handleFileChange} />
      {image && (
        <div className="mt-2">
          <img
            src={image}
            alt="Preview"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
            className="rounded"
          />
        </div>
      )}
    </div>
  );
};

// MealPeriodSelector component
const MealPeriodSelector: React.FC<MealPeriodSelectorProps> = ({
  selectedPeriods,
  onPeriodsChange,
}) => {
  const handlePeriodToggle = (periodId: string) => {
    const updatedPeriods = selectedPeriods.includes(periodId)
      ? selectedPeriods.filter((p) => p !== periodId)
      : [...selectedPeriods, periodId];
    onPeriodsChange(updatedPeriods);
  };

  return (
    <div>
      <Form.Label>Meal Periods *</Form.Label>
      <div className="d-flex flex-wrap gap-2">
        {availableMealPeriods.map((period) => (
          <Form.Check
            key={period.id}
            type="checkbox"
            id={period.id}
            label={period.label}
            checked={selectedPeriods.includes(period.id)}
            onChange={() => handlePeriodToggle(period.id)}
          />
        ))}
      </div>
    </div>
  );
};

export const CreateMenu: React.FC = () => {
  const [searchMaster, setSearchMaster] = useState<string>("");
  const [selectedMaster, setSelectedMaster] = useState<MasterFood | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
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
  const [priceType, setPriceType] = useState<PriceType>({
    user: true,
    organization: false,
  });
  const [tagInput, setTagInput] = useState<string>("");
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
      userPrice: master.suggestedPrice.toString(),
      organizationPrice: (master.suggestedPrice * 0.9).toString(), // 10% discount for organizations
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.mealPeriods.length === 0) {
      alert("Please select at least one meal period");
      return;
    }

    if (!priceType.user && !priceType.organization) {
      alert("Please select at least one price type");
      return;
    }

    if (priceType.user && !formData.userPrice) {
      alert("Please enter user price");
      return;
    }

    if (priceType.organization && !formData.organizationPrice) {
      alert("Please enter organization price");
      return;
    }

    // Simulate API call
    const menuItem: MenuItem = {
      id: Date.now().toString(), // Simple ID generation
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price || formData.userPrice),
      userPrice: priceType.user ? parseFloat(formData.userPrice) : undefined,
      organizationPrice: priceType.organization
        ? parseFloat(formData.organizationPrice)
        : undefined,
      description: formData.description,
      ingredients: formData.ingredients.split(",").map((i) => i.trim()),
      tags: formData.tags,
      available: formData.available,
      masterFoodId: selectedMaster?.id,
      image: formData.image,
      mealPeriods: formData.mealPeriods,
    };

    console.log("Creating menu item:", menuItem);

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Reset form
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
    setPriceType({ user: true, organization: false });
  };

  const handleGoBack = () => {
    // Add your navigation logic here
    console.log("Going back to menu list");
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = "#f8f9fa";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = "transparent";
  };

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center mb-4">
        <Button
          variant="outline-secondary"
          onClick={handleGoBack}
          className="me-3"
        >
          <ArrowLeft size={16} className="me-1" />
          Back
        </Button>
        <h2 className="mb-0">Create New Menu Item</h2>
      </div>

      {showSuccess && (
        <Alert variant="success" className="mb-4">
          Menu item created successfully!
        </Alert>
      )}

      <Card>
        <Card.Body>
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchMaster(e.target.value)
                  }
                />
              </InputGroup>
              {searchMaster && filteredMasterFoods.length > 0 && (
                <div
                  className="border rounded mt-2"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {filteredMasterFoods.map((food) => (
                    <div
                      key={food.id}
                      className="p-3 border-bottom"
                      onClick={() => handleMasterSelect(food)}
                      style={{ cursor: "pointer" }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="fw-medium">{food.name}</div>
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
                      <div className="text-success fw-medium">
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                    className="w-100 text-start"
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
            </div>

            {/* Price Type Selection */}
            <Form.Group className="mb-3">
              <Form.Label>Price For</Form.Label>
              <div className="d-flex gap-3">
                <Form.Check
                  type="checkbox"
                  id="userPriceCheck"
                  label="User"
                  checked={priceType.user}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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

            <div className="row">
              <Form.Group className="col-md-6 mb-3">
                <Form.Label>Availability</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Check
                    type="switch"
                    id="availability"
                    checked={formData.available}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
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
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
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
                onPeriodsChange={(periods: string[]) =>
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
                  <div
                    className="position-absolute top-100 start-0 end-0 bg-white border rounded shadow-sm mt-1"
                    style={{ zIndex: 1000 }}
                  >
                    {tagSuggestions.map((tag) => (
                      <div
                        key={tag}
                        className="p-2"
                        onClick={() => handleTagSelect(tag)}
                        style={{ cursor: "pointer" }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
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
              <Button variant="outline-secondary" onClick={resetForm}>
                Reset Form
              </Button>
              <Button variant="success" type="submit">
                Create Menu Item
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};
