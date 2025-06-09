import React from "react";
import { Form, InputGroup, Row, Col, Badge, Stack } from "react-bootstrap";
import { Search, X } from "lucide-react";
import { Category } from "../../types/menu";

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  availabilityFilter: "all" | "available" | "unavailable";
  onAvailabilityChange: (value: "all" | "available" | "unavailable") => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  categories: Category[];
}

const availableTags = [
  "Veg",
  "Non-Veg",
  "Spicy",
  "Gluten-Free",
  "Dairy-Free",
  "Signature",
];

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  availabilityFilter,
  onAvailabilityChange,
  selectedTags,
  onTagsChange,
  categories,
}) => {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const clearTag = (tag: string) => {
    onTagsChange(selectedTags.filter((t) => t !== tag));
  };

  const handleCategoryChange = (value: string) => {
    onCategoryChange(value === "all" ? "" : value);
  };

  return (
    <div className="bg-white rounded shadow-sm border p-4 mb-4">
      <Row className="mb-4">
        <Col md={4} className="mb-3 mb-md-0">
          <InputGroup>
            <InputGroup.Text>
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </InputGroup>
        </Col>

        <Col md={4} className="mb-3 mb-md-0">
          <Form.Select
            value={selectedCategory || "all"}
            onChange={(e: any) => handleCategoryChange(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col md={4}>
          <Form.Select
            value={availabilityFilter}
            onChange={(e: any) =>
              onAvailabilityChange(
                e.target.value as "all" | "available" | "unavailable"
              )
            }
          >
            <option value="all">All Items</option>
            <option value="available">Available Only</option>
            <option value="unavailable">Unavailable Only</option>
          </Form.Select>
        </Col>
      </Row>

      <Stack gap={3}>
        <div>
          <Form.Label className="fw-medium mb-2">Filter by tags:</Form.Label>
          <div className="d-flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <Badge
                key={tag}
                pill
                bg={
                  selectedTags.includes(tag)
                    ? "success "
                    : "outline-secondary border text-black "
                }
                className={`cursor-pointer fs-6  py-1 px-2 transition-colors ${
                  selectedTags.includes(tag) ? "" : "hover-bg-light border"
                }`}
                onClick={() => toggleTag(tag)}
                style={{ cursor: "pointer" }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {selectedTags.length > 0 && (
          <div>
            <Form.Label className="fw-medium mb-2">Active filters:</Form.Label>
            <div className="d-flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag}
                  pill
                  bg="light"
                  text="success"
                  className="hover-bg-success-subtle fs-6  py-1 px-2 border"
                >
                  {tag}
                  <X
                    size={12}
                    className="ms-1 cursor-pointer"
                    onClick={() => clearTag(tag)}
                    style={{ cursor: "pointer" }}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Stack>
    </div>
  );
};
