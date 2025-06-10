import React, { useState, useRef, useEffect } from "react";
import { X, Plus, Trash2, ChevronDown } from "lucide-react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Nav,
  Row,
  Dropdown,
  InputGroup,
  Modal,
  ListGroup,
} from "react-bootstrap";
import { AddOnGroup, AddOnItem } from "../../types/menu";
import { addOnCategories } from "../../helpers/api/mockData";

interface AddOnsModalProps {
  show: boolean;
  onHide: () => void;
  addOns: AddOnGroup[];
  onChange: (addOns: AddOnGroup[]) => void;
  suggestions: string[];
}

export const AddOnsModal: React.FC<AddOnsModalProps> = ({
  show,
  onHide,
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

    const filtered = value
      ? suggestions.filter((suggestion) =>
          suggestion.toLowerCase().includes(value.toLowerCase())
        )
      : suggestions;

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
    const filtered = currentValue
      ? suggestions.filter((suggestion) =>
          suggestion.toLowerCase().includes(currentValue.toLowerCase())
        )
      : suggestions;

    setFilteredSuggestions((prev) => ({ ...prev, [itemId]: filtered }));
    setOpenDropdowns((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const getActiveGroup = () => addOns.find((group) => group.id === activeGroup);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      scrollable
      className="add-ons-modal"
    >
      <Modal.Header closeButton className="border-bottom">
        <Modal.Title className="h4 fw-bold">Configure Add-ons</Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0">
        <Nav
          variant="tabs"
          activeKey={activeGroup}
          className="border-bottom px-3"
        >
          {addOnCategories.map((category: any) => (
            <Nav.Item key={category.id}>
              <Nav.Link
                eventKey={category.id}
                onClick={() => setActiveGroup(category.id)}
                className={
                  activeGroup === category.id
                    ? "text-primary fw-medium"
                    : "text-secondary"
                }
              >
                {category.title}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        <div className="p-4">
          {getActiveGroup() && (
            <div>
              <Form className="mb-4">
                <Row className="g-3">
                  <Col xs="auto">
                    <Form.Check
                      type="checkbox"
                      label="Required"
                      checked={getActiveGroup()?.required || false}
                      onChange={(e) =>
                        updateGroup(activeGroup, { required: e.target.checked })
                      }
                    />
                  </Col>
                  <Col xs="auto">
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
              </Form>

              <div>
                <Row className="align-items-center mb-3">
                  <Col>
                    <h3 className="h5 fw-medium">Items</h3>
                  </Col>
                  <Col xs="auto">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => addItem(activeGroup)}
                      className="d-flex align-items-center gap-1"
                    >
                      <Plus size={16} />
                      Add Item
                    </Button>
                  </Col>
                </Row>

                {getActiveGroup()?.items.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <p>No items added yet</p>
                    <p className="small">Click "Add Item" to get started</p>
                  </div>
                ) : (
                  <ListGroup variant="flush" className="mb-3">
                    {getActiveGroup()?.items.map((item: any) => (
                      <ListGroup.Item
                        key={item.id}
                        className="p-3 border-bottom"
                      >
                        <Row className="align-items-center">
                          <Col>
                            <InputGroup>
                              <Form.Control
                                ref={(el: any) => {
                                  inputRefs.current[item.id] = el;
                                }}
                                type="text"
                                value={item.name}
                                onChange={(e) =>
                                  handleInputChange(item.id, e.target.value)
                                }
                                onFocus={() => {
                                  const filtered = item.name
                                    ? suggestions.filter((suggestion) =>
                                        suggestion
                                          .toLowerCase()
                                          .includes(item.name.toLowerCase())
                                      )
                                    : suggestions;
                                  setFilteredSuggestions((prev) => ({
                                    ...prev,
                                    [item.id]: filtered,
                                  }));
                                  setOpenDropdowns((prev) => ({
                                    ...prev,
                                    [item.id]: true,
                                  }));
                                }}
                                placeholder="Item name"
                              />
                              <Button
                                variant="outline-secondary"
                                onClick={() => toggleDropdown(item.id)}
                              >
                                <ChevronDown
                                  size={16}
                                  className={
                                    openDropdowns[item.id] ? "rotate-180" : ""
                                  }
                                />
                              </Button>
                            </InputGroup>
                            {openDropdowns[item.id] &&
                              filteredSuggestions[item.id]?.length > 0 && (
                                <div
                                  ref={(el) => {
                                    dropdownRefs.current[item.id] = el;
                                  }}
                                  className="position-absolute bg-white border rounded shadow-sm mt-1 w-100"
                                  style={{
                                    maxHeight: "12rem",
                                    overflowY: "auto",
                                    zIndex: 1050,
                                  }}
                                >
                                  {filteredSuggestions[item.id].map(
                                    (suggestion, index) => (
                                      <Button
                                        key={index}
                                        variant="link"
                                        className="w-100 text-start text-decoration-none"
                                        onClick={() =>
                                          handleSuggestionClick(
                                            item.id,
                                            suggestion
                                          )
                                        }
                                      >
                                        {suggestion}
                                      </Button>
                                    )
                                  )}
                                </div>
                              )}
                          </Col>
                          <Col xs="auto">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => removeItem(activeGroup, item.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </Col>
                        </Row>
                        <Row className="mt-3 align-items-center">
                          <Col>
                            <Form.Label className="small text-muted">
                              Price
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
                            />
                          </Col>
                          <Col
                            xs="auto"
                            className="d-flex align-items-center gap-2"
                          >
                            <Form.Label className="small text-muted mb-0">
                              Active
                            </Form.Label>
                            <Form.Check
                              type="switch"
                              checked={item.active}
                              onChange={() =>
                                updateItem(activeGroup, item.id, {
                                  active: !item.active,
                                })
                              }
                            />
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </div>
            </div>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer className="border-top">
        <Button variant="primary" onClick={onHide}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
