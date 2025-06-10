import React, { useState } from "react";
import { Send, CheckCircle, Plus } from "lucide-react";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
  Stack,
} from "react-bootstrap";
import { AddOnsModal } from "../../../components/menu/AddOnsModal";
import {
  addOnCategories,
  mockSuggestions,
} from "../../../helpers/api/mockData";
import { MenuItem, MenuItems } from "../../../types/menu";
import { AutoSuggestInput } from "../../../components/menu/AutoSuggestInput";
import { ToggleGroup } from "../../../components/menu/ToggleGroup";
import { IngredientsInput } from "../../../components/menu/IngredientsInput";
import { ImageUpload } from "../../../components/menu/ImageUpload";
import PageTitle from "../../../components/PageTitle";

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
  const [formData, setFormData] = useState<MenuItems>({
    category: "",
    name: "",
    mealTypes: [],
    foodType: "",
    image: "",
    description: "",
    ingredients: [],
    tags: [],
    addOns: addOnCategories.map((cat) => ({
      id: cat.id,
      title: cat.title,
      items: [],
      required: false,
      multiSelect: false,
    })),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.name.trim()) newErrors.name = "Item name is required";
    if (formData.mealTypes.length === 0)
      newErrors.mealTypes = "At least one meal type is required";
    if (!formData.foodType) newErrors.foodType = "Food type is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.ingredients.length === 0)
      newErrors.ingredients = "At least one ingredient is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsApproved(true);
      }, 2000);
      console.log("Form submitted:", formData);
    }
  };

  const handlePublish = () => {
    console.log("Item published:", formData);
    alert("Menu item published successfully!");
  };

  const updateFormData = (field: keyof MenuItems, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleTagsChange = (value: string) => {
    const tagList = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag && mockSuggestions.tags.includes(tag));
    updateFormData("tags", tagList);
  };

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Menu", path: "/apps/kitchen/create-menu" },
          {
            label: "Category",
            path: "/apps/kitchen/create-menu",
            active: true,
          },
        ]}
        title={"Menu Categories"}
      />
      <div
        className="mb-3"
        style={{ backgroundColor: "#5bd2bc", padding: "10px" }}
      >
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="page-title m-0" style={{ color: "#fff" }}>
            Create Manu
          </h3>
        </div>
      </div>
      <Container fluid className="min-vh-100 bg-light p-0 position-relative">
        <Row className="justify-content-center">
          <Col md={10} lg={8} xl={12} className="">
            <Card className="shadow-sm">
              <Card.Body>
                <Form onSubmit={handleSubmit} className="p-3">
                  <section className="mb-4">
                    <h2 className="h5 fw-semibold text-dark mb-3 pb-2 border-bottom">
                      Basic Information
                    </h2>
                    <Row>
                      <Col md={6} className="mb-3">
                        <AutoSuggestInput
                          label="Category"
                          value={formData.category}
                          onChange={(value) =>
                            updateFormData("category", value)
                          }
                          suggestions={mockSuggestions.categories}
                          placeholder="e.g., Main Course, Appetizers"
                          required
                          error={errors.category}
                        />
                      </Col>
                      <Col md={6} className="mb-3">
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
                  </section>
                  <section className="mb-4">
                    <h2 className="h5 fw-semibold text-dark mb-3 pb-2 border-bottom">
                      Meal Configuration
                    </h2>
                    <div className="mb-3">
                      <ToggleGroup
                        label="Meal Types"
                        options={mealTypeOptions}
                        selectedValues={formData.mealTypes}
                        onChange={(values) =>
                          updateFormData("mealTypes", values)
                        }
                        multiSelect={true}
                        required
                        error={errors.mealTypes}
                      />
                    </div>
                    <div className="mb-3">
                      <ToggleGroup
                        label="Food Type"
                        options={foodTypeOptions}
                        selectedValues={
                          formData.foodType ? [formData.foodType] : []
                        }
                        onChange={(values) =>
                          updateFormData("foodType", values[0] || "")
                        }
                        multiSelect={false}
                        required
                        error={errors.foodType}
                      />
                    </div>
                  </section>
                  <section className="mb-4">
                    <h2 className="h5 fw-semibold text-dark mb-3 pb-2 border-bottom">
                      Visual & Description
                    </h2>
                    <div className="mb-3">
                      <ImageUpload
                        label="Dish Image"
                        value={formData.image}
                        onChange={(value) => updateFormData("image", value)}
                        error={errors.image}
                      />
                    </div>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Description <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        value={formData.description}
                        onChange={(e) =>
                          updateFormData("description", e.target.value)
                        }
                        placeholder="Describe your dish in detail..."
                        rows={4}
                        isInvalid={!!errors.description}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.description}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </section>
                  <section className="mb-4">
                    <h2 className="h5 fw-semibold text-dark mb-3 pb-2 border-bottom">
                      Ingredients & Tags
                    </h2>
                    <div className="mb-3">
                      <IngredientsInput
                        label="Ingredients"
                        value={formData.ingredients}
                        onChange={(value) =>
                          updateFormData("ingredients", value)
                        }
                        suggestions={mockSuggestions.ingredients}
                        required
                        error={errors.ingredients}
                        placeholder="Select ingredients"
                      />
                    </div>
                    <div className="mb-3">
                      <IngredientsInput
                        label="Tags"
                        value={formData.tags}
                        onChange={(value) => updateFormData("tags", value)}
                        suggestions={mockSuggestions.tags}
                        placeholder="Select tags"
                      />
                    </div>
                  </section>
                  <section className="mb-4">
                    <Stack
                      direction="horizontal"
                      className="justify-content-between mb-3 pb-2 border-bottom"
                    >
                      <h2 className="h5 fw-semibold text-dark m-0">
                        Add-ons Configuration
                      </h2>
                      <Button
                        variant="primary"
                        onClick={() => setIsDrawerOpen(true)}
                        className="d-flex align-items-center gap-2"
                      >
                        <Plus size={20} />
                        <span>Add Add-ons</span>
                      </Button>
                    </Stack>
                    <Row>
                      {formData.addOns.map((group) => (
                        <Col
                          key={group.id}
                          sm={6}
                          md={4}
                          lg={3}
                          className="mb-3"
                        >
                          <Card>
                            <Card.Body className="shadow-lg">
                              <Card.Title className="h6 mb-2">
                                {group.title}
                              </Card.Title>
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
                  </section>

                  <div className="d-flex justify-content-end pt-3 border-top">
                    {!isSubmitted ? (
                      <Button
                        type="submit"
                        variant="primary"
                        className="d-flex align-items-center gap-2 px-4 py-2"
                      >
                        <span>Sent Request</span>
                      </Button>
                    ) : !isApproved ? (
                      <Alert
                        variant="warning"
                        className="d-flex align-items-center gap-2 m-0"
                      >
                        <Spinner animation="border" size="sm" />
                        <span>sending...</span>
                      </Alert>
                    ) : (
                      <Button
                        type="button"
                        onClick={handlePublish}
                        variant="success"
                        className="d-flex align-items-center gap-2 px-4 py-2"
                      >
                        <CheckCircle size={20} />
                        <span>Publish</span>
                      </Button>
                    )}
                  </div>
                </Form>
              </Card.Body>
            </Card>
            <AddOnsModal
              show={isDrawerOpen}
              onHide={() => setIsDrawerOpen(false)}
              addOns={formData.addOns}
              onChange={(addOns) => updateFormData("addOns", addOns)}
              suggestions={mockSuggestions.addOnItems}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};
