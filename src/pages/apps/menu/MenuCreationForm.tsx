import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Badge,
} from "react-bootstrap";
import { Send, CheckCircle, Plus } from "lucide-react";
import { MenuItems } from "../../../types/menu";
import {
  addOnCategories,
  mockSuggestions,
} from "../../../helpers/api/mockData";
import { AutoSuggestInput } from "../../../components/menu/AutoSuggestInput";
import { ToggleGroup } from "../../../components/menu/ToggleGroup";
import { ImageUpload } from "../../../components/menu/ImageUpload";
import { IngredientsInput } from "../../../components/menu/IngredientsInput";
import { AddOnsDrawer } from "../../../components/menu/AddOnsDrawer";
import PageTitle from "../../../components/PageTitle";
import { appendToFormData } from "../../../helpers/formdataAppend";
import { createNewMenu } from "../../../server/admin/items";
import { useAuthDetails } from "../../../hooks/useAuthDetails";
import { toast } from "react-toastify";

const mealTypeOptions = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "tea", label: "Tea" },
  { value: "dinner", label: "Dinner" },
];

const foodTypeOptions = [
  { value: "veg", label: "Vegetarian" },
  { value: "non-veg", label: "Non-Vegetarian" },
  { value: "egg", label: "Egg" },
  { value: "vegan", label: "Vegan" },
];

export const MenuCreationForm: React.FC = () => {
  const { context } = useAuthDetails();
  const initialFormData: MenuItems = {
    kitchenId: String(context?.contextId),
    category: "",
    name: "",
    mealTypes: [],
    foodType: "",
    image: "",
    description: "",
    ingredients: [],
    basicprice: "",
    orgPirce: "",
    tags: [],
    addOns: addOnCategories.map((cat) => ({
      id: cat.id,
      title: cat.title,
      items: [],
      required: false,
      multiSelect: false,
    })),
  };
  const [formData, setFormData] = useState<MenuItems>(initialFormData);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [showBasic, setShowBasic] = useState(true);
  const [showOrg, setShowOrg] = useState(true);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.name.trim()) newErrors.name = "Item name is required";
    if (formData.mealTypes.length === 0)
      newErrors.mealTypes = "At least one meal type is required";
    if (!formData.foodType) newErrors.foodType = "Food type is required";
    if (!formData.orgPirce && showBasic)
      newErrors.orgPirce = "Organisation type is required";
    if (!formData.basicprice && showOrg)
      newErrors.basicprice = "Basic Price is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePublish = async () => {
    const menuFormData = appendToFormData(formData);
    setIsSubmitted(true);
    try {
      const response = await createNewMenu(menuFormData);
      response.status
        ? toast.success(response.message)
        : toast.error(response.error);
      setFormData({
        ...initialFormData,
        kitchenId: String(context?.contextId),
        addOns: addOnCategories.map((cat) => ({
          id: cat.id,
          title: cat.title,
          items: [],
          required: false,
          multiSelect: false,
        })),
      });
      setIsSubmitted(false);
      setIsApproved(true);
      setTimeout(() => {
        setIsApproved(false);
      }, 2000);
    } catch (error: any) {
      setIsSubmitted(false);
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to publish menu item."
      );
    }
  };

  const updateFormData = (field: keyof MenuItems, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Menu", path: "/apps/menu/category" },
          { label: "Category", path: "/apps/menu/category", active: true },
        ]}
        title={"Menu Categories"}
      />
      <div
        className="mb-3"
        style={{ backgroundColor: "#5bd2bc", padding: "10px" }}
      >
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="page-title m-0" style={{ color: "#fff" }}>
            Create New Menu
          </h3>
        </div>
      </div>
      <div className="bg-gradient-custom min-vh-100 p-0">
        <Container className="p-0">
          <Form>
            <Card className="form-section">
              <h2 className="section-header">Basic Information</h2>
              <Row>
                <Col md={6}>
                  <AutoSuggestInput
                    label="Category"
                    value={formData.category}
                    onChange={(value) => updateFormData("category", value)}
                    suggestions={mockSuggestions.categories}
                    placeholder="e.g., Main Course, Appetizers"
                    required
                    error={errors.category}
                  />
                </Col>
                <Col md={6}>
                  <AutoSuggestInput
                    label="Item Name"
                    value={formData.name}
                    onChange={(value) => updateFormData("name", value)}
                    suggestions={mockSuggestions.items}
                    placeholder="e.g., Margherita Pizza"
                    required
                    error={errors.name}
                  />
                </Col>
              </Row>
            </Card>

            <Card className="form-section">
              <h2 className="section-header">Meal Configuration</h2>
              <div>
                <ToggleGroup
                  label="Meal Types"
                  options={mealTypeOptions}
                  selectedValues={formData.mealTypes}
                  onChange={(values) => updateFormData("mealTypes", values)}
                  multiSelect={true}
                  required
                  error={errors.mealTypes}
                />
              </div>
              <ToggleGroup
                label="Food Type"
                options={foodTypeOptions}
                selectedValues={formData.foodType ? [formData.foodType] : []}
                onChange={(values) =>
                  updateFormData("foodType", values[0] || "")
                }
                multiSelect={false}
                required
                error={errors.foodType}
              />
              <div className="">
                <div className="d-flex gap-4 mb-2">
                  <div className="d-flex gap-4 mb-2">
                    <Form.Check
                      type="checkbox"
                      label="Basic Price"
                      checked={showBasic}
                      onChange={() => setShowBasic(!showBasic)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Organisation Price"
                      checked={showOrg}
                      onChange={() => setShowOrg(!showOrg)}
                    />
                  </div>
                </div>
                <div className="d-flex gap-4">
                  {showBasic && (
                    <Form.Group>
                      <Form.Label>
                        Basic Price (₹) <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={formData.basicprice}
                        onChange={(e) =>
                          updateFormData("basicprice", e.target.value)
                        }
                      />
                      {errors.basicprice && (
                        <Form.Text className="text-danger">
                          {errors?.basicprice}
                        </Form.Text>
                      )}
                    </Form.Group>
                  )}

                  {showOrg && (
                    <Form.Group>
                      <Form.Label>
                        Organisation Price (₹){" "}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={formData.orgPirce}
                        onChange={(e) =>
                          updateFormData("orgPirce", e.target.value)
                        }
                      />
                      {errors.orgPirce && (
                        <Form.Text className="text-danger">
                          {errors?.orgPirce}
                        </Form.Text>
                      )}
                    </Form.Group>
                  )}
                </div>
              </div>
            </Card>
            <Card className="form-section">
              <h2 className="section-header">Visual & Description</h2>
              <div>
                <ImageUpload
                  label="Dish Image"
                  value={formData.image}
                  onChange={(value) => updateFormData("image", value)}
                />
              </div>
              <Form.Group>
                <Form.Label>
                  Description <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    updateFormData("description", e.target.value)
                  }
                  placeholder="Describe your dish in detail..."
                  style={{ resize: "none" }}
                />
              </Form.Group>
            </Card>
            <Card className="form-section">
              <h2 className="section-header">Ingredients & Tags</h2>
              <div>
                <IngredientsInput
                  label="Ingredients"
                  value={formData.ingredients}
                  onChange={(value) => updateFormData("ingredients", value)}
                  suggestions={mockSuggestions.ingredients}
                  placeholder="Select ingredients..."
                />
              </div>
              <IngredientsInput
                label="Tags"
                value={formData.tags}
                onChange={(value) => updateFormData("tags", value)}
                suggestions={mockSuggestions.tags}
                placeholder="Select tags"
              />
            </Card>
            <Card className="form-section">
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h2 className="section-header m-0 p-0 border-0">
                  Add-ons Configuration
                </h2>
                <Button
                  variant="primary"
                  onClick={() => setIsDrawerOpen(true)}
                  className="d-flex align-items-center gap-2"
                >
                  <Plus size={20} />
                  Add Add-ons
                </Button>
              </div>
              <Row>
                {formData.addOns.map((group) => (
                  <Col key={group.id} md={6} lg={3} className="mb-3">
                    <Card className="addon-summary-card shadow-lg h-100">
                      <Card.Body className="p-0">
                        <Card.Title className="h6">{group.title}</Card.Title>
                        <Card.Text className="text-muted small">
                          {group.items.length} item
                          {group.items.length !== 1 ? "s" : ""}
                        </Card.Text>
                        {group.required && (
                          <Badge bg="danger" className="mt-2">
                            Required
                          </Badge>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
            <Card className="form-section">
              <div className="d-flex justify-content-end gap-3">
                {!isSubmitted ? (
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="d-flex align-items-center gap-2 px-4"
                    onClick={handlePublish}
                  >
                    Send Request
                  </Button>
                ) : !isApproved ? (
                  <Button
                    variant="warning"
                    size="lg"
                    disabled
                    className="d-flex align-items-center gap-2 px-4"
                  >
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Awaiting Approval...
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    size="lg"
                    className="d-flex align-items-center gap-2 px-4"
                  >
                    <CheckCircle size={20} />
                    Waiting Approval
                  </Button>
                )}
              </div>
            </Card>
          </Form>
          <AddOnsDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            addOns={formData.addOns}
            onChange={(addOns) => updateFormData("addOns", addOns)}
            suggestions={mockSuggestions.addOnItems}
          />
        </Container>
      </div>
    </>
  );
};
