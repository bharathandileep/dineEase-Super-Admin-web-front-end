import React, { useState, useRef, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Row,
  Col,
  Badge,
  InputGroup,
} from "react-bootstrap";
import { X, Plus, Trash2, ChevronDown } from "lucide-react";
import { AddOnGroup, AddOnItem } from "../../types/menu";
import { addOnCategories, mockSuggestions } from "../../helpers/api/mockData";
import "../../assets/scss/custom/pages/_menu.scss";

interface AddOnsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  addOns: AddOnGroup[];
  onChange: (addOns: AddOnGroup[]) => void;
  suggestions: string[];
}

export const AddOnsDrawer: React.FC<AddOnsDrawerProps> = ({
  isOpen,
  onClose,
  addOns,
  onChange,
  suggestions,
}) => {
  const [activeGroup, setActiveGroup] = useState<string>("quantity");
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {}
  );
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    Record<string, string[]>
  >({});
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(openDropdowns).forEach((itemId) => {
        if (
          openDropdowns[itemId] &&
          dropdownRefs.current[itemId] &&
          !dropdownRefs.current[itemId]?.contains(event.target as Node) &&
          !inputRefs.current[itemId]?.contains(event.target as Node)
        ) {
          setOpenDropdowns((prev) => ({ ...prev, [itemId]: false }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdowns]);

  const updateGroup = (groupId: string, updates: Partial<AddOnGroup>) => {
    const updatedAddOns = addOns.map((group) =>
      group.id === groupId ? { ...group, ...updates } : group
    );
    onChange(updatedAddOns);
  };

  const addItem = (groupId: string) => {
    const newItem: AddOnItem = {
      id: Date.now().toString(),
      name: "",
      price: 0,
      active: true,
      gst: 0,
      discount: 0,
      description: "",
    };

    const updatedAddOns = addOns.map((group) =>
      group.id === groupId
        ? { ...group, items: [...group.items, newItem] }
        : group
    );
    onChange(updatedAddOns);
  };

  const updateItem = (
    groupId: string,
    itemId: string,
    updates: Partial<AddOnItem>
  ) => {
    const updatedAddOns = addOns.map((group) =>
      group.id === groupId
        ? {
            ...group,
            items: group.items.map((item: any) =>
              item.id === itemId ? { ...item, ...updates } : item
            ),
          }
        : group
    );
    onChange(updatedAddOns);
  };

  const removeItem = (groupId: string, itemId: string) => {
    const updatedAddOns = addOns.map((group) =>
      group.id === groupId
        ? {
            ...group,
            items: group.items.filter((item: any) => item.id !== itemId),
          }
        : group
    );
    onChange(updatedAddOns);
  };

  const handleInputChange = (itemId: string, value: string) => {
    updateItem(activeGroup, itemId, { name: value });

    const suggestionList =
      activeGroup === "quantity" ? mockSuggestions.quantityTypes : suggestions;

    const filtered = value
      ? suggestionList.filter((suggestion: any) =>
          suggestion.toLowerCase().includes(value.toLowerCase())
        )
      : suggestionList;

    setFilteredSuggestions((prev) => ({ ...prev, [itemId]: filtered }));
    setOpenDropdowns((prev) => ({ ...prev, [itemId]: true }));
  };

  const handleSuggestionClick = (itemId: string, suggestion: string) => {
    updateItem(activeGroup, itemId, { name: suggestion });
    setOpenDropdowns((prev) => ({ ...prev, [itemId]: false }));
  };

  const toggleDropdown = (itemId: string) => {
    const currentValue =
      getActiveGroup()?.items.find((item: any) => item.id === itemId)?.name ||
      "";
    const suggestionList =
      activeGroup === "quantity" ? mockSuggestions.quantityTypes : suggestions;

    const filtered = currentValue
      ? suggestionList.filter((suggestion: any) =>
          suggestion.toLowerCase().includes(currentValue.toLowerCase())
        )
      : suggestionList;

    setFilteredSuggestions((prev) => ({ ...prev, [itemId]: filtered }));
    setOpenDropdowns((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const getActiveGroup = () => addOns.find((group) => group.id === activeGroup);

  const renderQuantityItem = (item: AddOnItem) => (
    <Card key={item.id} className="quantity-item-card mb-3 p-0">
      <Card.Body className="p-0">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Quantity Option</h5>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => removeItem(activeGroup, item.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
        <Form.Group className="mb-3 position-relative">
          <Form.Label>
            Quantity Type <span className="text-danger">*</span>
          </Form.Label>
          <div className="position-relative">
            <Form.Control
              ref={(el: any) => {
                inputRefs.current[item.id] = el;
              }}
              type="text"
              value={item.name}
              onChange={(e) => handleInputChange(item.id, e.target.value)}
              onFocus={() => {
                const filtered = item.name
                  ? mockSuggestions.quantityTypes.filter((suggestion: any) =>
                      suggestion.toLowerCase().includes(item.name.toLowerCase())
                    )
                  : mockSuggestions.quantityTypes;
                setFilteredSuggestions((prev) => ({
                  ...prev,
                  [item.id]: filtered,
                }));
                setOpenDropdowns((prev) => ({ ...prev, [item.id]: true }));
              }}
              placeholder="e.g., Full, Half, Large, Medium"
              style={{ paddingRight: "40px" }}
            />
            <button
              type="button"
              onClick={() => toggleDropdown(item.id)}
              className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted"
              style={{
                border: "none",
                background: "none",
                zIndex: 3,
                right: "10px",
              }}
            >
              <ChevronDown
                size={20}
                style={{
                  transform: openDropdowns[item.id]
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </button>
          </div>

          {openDropdowns[item.id] &&
            filteredSuggestions[item.id]?.length > 0 && (
              <div
                ref={(el) => {
                  dropdownRefs.current[item.id] = el;
                }}
                className="position-absolute w-100 mt-1 bg-white border rounded shadow-lg"
                style={{
                  zIndex: 1000,
                  maxHeight: "200px",
                  overflowY: "auto",
                  top: "100%",
                }}
              >
                {filteredSuggestions[item.id].map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(item.id, suggestion)}
                    className="w-100 px-3 py-2 text-start border-0 bg-white"
                    style={{
                      transition: "background-color 0.2s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f8f9fa")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "white")
                    }
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
        </Form.Group>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>
                Price (₹) <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                value={item.price}
                onChange={(e) =>
                  updateItem(activeGroup, item.id, {
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>GST (%)</Form.Label>
              <Form.Control
                type="number"
                value={item.gst || 0}
                onChange={(e) =>
                  updateItem(activeGroup, item.id, {
                    gst: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0"
                step="0.1"
                min="0"
                max="100"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Discount (%)</Form.Label>
              <Form.Control
                type="number"
                value={item.discount || 0}
                onChange={(e) =>
                  updateItem(activeGroup, item.id, {
                    discount: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0"
                step="0.1"
                min="0"
                max="100"
              />
            </Form.Group>
          </Col>
          <Col md={6} className="d-flex align-items-end">
            <Form.Group className="d-flex align-items-center">
              <Form.Label className="me-3 mb-0">Active</Form.Label>
              <label className="custom-switch">
                <input
                  type="checkbox"
                  checked={item.active}
                  onChange={() =>
                    updateItem(activeGroup, item.id, { active: !item.active })
                  }
                />
                <span className="slider"></span>
              </label>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Description (Optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={item.description || ""}
            onChange={(e) =>
              updateItem(activeGroup, item.id, { description: e.target.value })
            }
            placeholder="Additional details about this quantity option..."
            style={{ resize: "none" }}
          />
        </Form.Group>
        {item.price > 0 && (
          <div className="price-summary">
            <div className="small">
              <div className="d-flex justify-content-between">
                <span>Base Price:</span>
                <span>₹{item.price.toFixed(2)}</span>
              </div>
              {(item.gst ?? 0) > 0 && (
                <div className="d-flex justify-content-between">
                  <span>GST ({item.gst}%):</span>
                  <span>
                    ₹{((item.price * (item.gst ?? 0)) / 100).toFixed(2)}
                  </span>
                </div>
              )}
              {(item.discount ?? 0) > 0 && (
                <div className="d-flex justify-content-between text-success">
                  <span>Discount ({item.discount}%):</span>
                  <span>
                    -₹{((item.price * (item.discount ?? 0)) / 100).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="d-flex justify-content-between fw-bold text-dark border-top pt-2 mt-2">
                <span>Final Price:</span>
                <span>
                  ₹
                  {(
                    item.price +
                    (item.price * (item.gst || 0)) / 100 -
                    (item.price * (item.discount || 0)) / 100
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  const renderRegularItem = (item: AddOnItem) => (
    <Card key={item.id} className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1 me-3 position-relative">
            <Form.Control
              ref={(el: any) => {
                inputRefs.current[item.id] = el;
              }}
              type="text"
              value={item.name}
              onChange={(e) => handleInputChange(item.id, e.target.value)}
              onFocus={() => {
                const filtered = item.name
                  ? suggestions.filter((suggestion) =>
                      suggestion.toLowerCase().includes(item.name.toLowerCase())
                    )
                  : suggestions;
                setFilteredSuggestions((prev) => ({
                  ...prev,
                  [item.id]: filtered,
                }));
                setOpenDropdowns((prev) => ({ ...prev, [item.id]: true }));
              }}
              placeholder="Item name"
              style={{ paddingRight: "40px" }}
            />
            <button
              type="button"
              onClick={() => toggleDropdown(item.id)}
              className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted"
              style={{
                border: "none",
                background: "none",
                zIndex: 3,
                right: "10px",
              }}
            >
              <ChevronDown
                size={16}
                style={{
                  transform: openDropdowns[item.id]
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </button>
            {openDropdowns[item.id] &&
              filteredSuggestions[item.id]?.length > 0 && (
                <div
                  ref={(el) => {
                    dropdownRefs.current[item.id] = el;
                  }}
                  className="position-absolute w-100 mt-1 bg-white border rounded shadow-lg"
                  style={{
                    zIndex: 1000,
                    maxHeight: "200px",
                    overflowY: "auto",
                    top: "100%",
                  }}
                >
                  {filteredSuggestions[item.id].map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(item.id, suggestion)}
                      className="w-100 px-3 py-2 text-start border-0 bg-white small"
                      style={{
                        transition: "background-color 0.2s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f8f9fa")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "white")
                      }
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
          </div>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => removeItem(activeGroup, item.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>

        <Row className="align-items-end">
          <Col md={8}>
            <Form.Group>
              <Form.Label className="small text-muted">Price</Form.Label>
              <Form.Control
                type="number"
                value={item.price}
                onChange={(e) =>
                  updateItem(activeGroup, item.id, {
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.00"
                step="0.01"
                size="sm"
              />
            </Form.Group>
          </Col>
          <Col md={4} className="d-flex align-items-center justify-content-end">
            <Form.Group className="d-flex align-items-center mb-0">
              <Form.Label className="small text-muted me-2 mb-0">
                Active
              </Form.Label>
              <label className="custom-switch">
                <input
                  type="checkbox"
                  checked={item.active}
                  onChange={() =>
                    updateItem(activeGroup, item.id, { active: !item.active })
                  }
                />
                <span className="slider"></span>
              </label>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer scroll-bar">
        <div className="drawer-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Configure Add-ons</h4>
          <Button variant="link" onClick={onClose} className="p-0">
            <X size={24} />
          </Button>
        </div>

        <div className="drawer-tabs">
          {addOnCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveGroup(category.id)}
              className={`drawer-tab ${
                activeGroup === category.id ? "active" : ""
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>
        <div className="drawer-content">
          {getActiveGroup() && (
            <>
              <div className="mb-4">
                <Row>
                  <Col>
                    <Form.Check
                      type="checkbox"
                      label="Required"
                      checked={getActiveGroup()?.required || false}
                      onChange={(e) =>
                        updateGroup(activeGroup, { required: e.target.checked })
                      }
                    />
                  </Col>
                  <Col>
                    <Form.Check
                      type="checkbox"
                      label="Multi-select"
                      checked={getActiveGroup()?.multiSelect || false}
                      onChange={(e) =>
                        updateGroup(activeGroup, {
                          multiSelect: e.target.checked,
                        })
                      }
                    />
                  </Col>
                </Row>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                  {activeGroup === "quantity" ? "Quantity Options" : "Items"}
                </h5>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => addItem(activeGroup)}
                  className="d-flex align-items-center gap-1"
                >
                  <Plus size={16} />
                  {activeGroup === "quantity" ? "Add Quantity" : "Add Item"}
                </Button>
              </div>

              {getActiveGroup()?.items.map((item) =>
                activeGroup === "quantity"
                  ? renderQuantityItem(item)
                  : renderRegularItem(item)
              )}

              {getActiveGroup()?.items.length === 0 && (
                <div className="text-center py-5 text-muted">
                  <p>
                    No{" "}
                    {activeGroup === "quantity" ? "quantity options" : "items"}{" "}
                    added yet
                  </p>
                  <p className="small">
                    Click "Add{" "}
                    {activeGroup === "quantity" ? "Quantity" : "Item"}" to get
                    started
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
