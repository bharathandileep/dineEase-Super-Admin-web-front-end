import React, { useState } from "react";
import { Search, Filter, X, Check } from "lucide-react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import "bootstrap/dist/css/bootstrap.min.css";
import PageTitle from "../../../components/PageTitle";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  isFree: boolean;
  image: string;
  ingredients: string[];
  calories: number;
  preparationTime: string;
}

function OrgMenuSelect() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null
  );
  const [editPrice, setEditPrice] = useState<number>(0);
  const [isFree, setIsFree] = useState(false);

  const categories = ["all", "main course", "appetizer", "dessert", "beverage"];

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: 1,
      name: "Grilled Salmon",
      description: "Fresh Atlantic salmon with herbs and lemon",
      category: "main course",
      price: 19.99,
      originalPrice: 24.99,
      isFree: false,
      image:
        "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=500",
      ingredients: ["Salmon", "Herbs", "Lemon", "Olive Oil"],
      calories: 420,
      preparationTime: "20 mins",
    },
    {
      id: 2,
      name: "Caesar Salad",
      description: "Classic Caesar salad with homemade dressing",
      category: "appetizer",
      price: 0,
      originalPrice: 12.99,
      isFree: true,
      image:
        "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=500",
      ingredients: [
        "Romaine Lettuce",
        "Croutons",
        "Parmesan",
        "Caesar Dressing",
      ],
      calories: 320,
      preparationTime: "10 mins",
    },
    {
      id: 3,
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with molten center",
      category: "dessert",
      price: 6.99,
      originalPrice: 8.99,
      isFree: false,
      image:
        "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=500",
      ingredients: ["Chocolate", "Butter", "Flour", "Sugar"],
      calories: 550,
      preparationTime: "15 mins",
    },
    {
      id: 4,
      name: "Caesar Salad",
      description: "Classic Caesar salad with homemade dressing",
      category: "appetizer",
      price: 0,
      originalPrice: 12.99,
      isFree: true,
      image:
        "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=500",
      ingredients: [
        "Romaine Lettuce",
        "Croutons",
        "Parmesan",
        "Caesar Dressing",
      ],
      calories: 320,
      preparationTime: "10 mins",
    },
  ]);

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map((item) => item.id));
    }
  };

  const handleItemClick = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const openItemModal = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setEditPrice(item.price);
    setIsFree(item.isFree);
    setIsModalOpen(true);
  };

  const handlePriceUpdate = () => {
    if (selectedMenuItem) {
      const updatedItems = menuItems.map((item) =>
        item.id === selectedMenuItem.id
          ? {
              ...item,
              price: isFree ? 0 : editPrice,
              isFree,
              originalPrice: isFree
                ? item.price
                : editPrice < item.price
                ? item.price
                : undefined,
            }
          : item
      );
      setMenuItems(updatedItems);
      setIsModalOpen(false);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-vh-100 bg-light">
      <PageTitle
        breadCrumbItems={[
          { label: "Kitchens", path: "/apps/kitchen/list" },
          { label: "List", path: "/apps/kitchen/list", active: true },
        ]}
        title={"Kitchens"}
      />

      <div
        className="mb-3"
        style={{ backgroundColor: "#5bd2bc", padding: "10px" }}
      >
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="page-title m-0" style={{ color: "#fff" }}>
            Menus
          </h3>
        </div>
      </div>
      <div className="bg-white shadow-sm">
        <Container className="py-3">
          <Row className="justify-content-between align-items-center">
            <Col className="col-auto">
              <Form className="d-flex align-items-center gap-2">
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Search menu items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Col>
            <Col className="col-auto d-flex gap-2">
              <Form.Group>
                <Form.Select
                  value={selectedCategory}
                  onChange={(e) =>
                    setSelectedCategory((e.target as HTMLSelectElement).value)
                  }
                  className="text-capitalize"
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                      className="text-capitalize"
                    >
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Button onClick={handleSelectAll} variant="primary">
                {selectedItems.length === filteredItems.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
      <Container className="py-4">
        <Row xs={1} sm={2} lg={4} className="g-4">
          {filteredItems.map((item) => (
            <Col key={item.id}>
              <Card
                className={`h-100 cursor-pointer overflow-hidden ${
                  selectedItems.includes(item.id) ? "border-primary" : ""
                }`}
                onClick={() => openItemModal(item)}
              >
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={item.image}
                    alt={item.name}
                    style={{ height: "12rem", objectFit: "cover" }}
                  />
                  {item.isFree && (
                    <Badge
                      bg="success"
                      className="position-absolute top-0 end-0 m-2"
                    >
                      Free
                    </Badge>
                  )}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(item.id);
                    }}
                    className={`position-absolute top-0 start-0 m-2 rounded-circle d-flex align-items-center justify-content-center ${
                      selectedItems.includes(item.id)
                        ? "bg-primary text-white"
                        : "bg-white text-secondary border"
                    }`}
                    style={{ width: "24px", height: "24px" }}
                  >
                    {selectedItems.includes(item.id) && <Check size={16} />}
                  </div>
                </div>
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text className="text-secondary small text-truncate">
                    {item.description}
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="d-flex align-items-center gap-2">
                      {item.isFree ? (
                        <span className="fw-medium text-success">Free</span>
                      ) : (
                        <>
                          <span className="fw-medium">
                            ₹{item.price.toFixed(2)}
                          </span>
                          {item.originalPrice &&
                            item.originalPrice > item.price && (
                              <span className="small text-secondary text-decoration-line-through">
                                ₹{item.originalPrice.toFixed(2)}
                              </span>
                            )}
                        </>
                      )}
                    </div>
                    <span className="small text-secondary text-capitalize">
                      {item.category}
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      {selectedMenuItem && (
        <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedMenuItem.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img
              src={selectedMenuItem.image}
              alt={selectedMenuItem.name}
              className="w-100 rounded"
              style={{ height: "9rem", objectFit: "cover" }}
            />

            <p className="mt-3 text-secondary small">
              {selectedMenuItem.description}
            </p>

            <div className="mt-3">
              <h5 className="fs-6 fw-medium">Ingredients:</h5>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {selectedMenuItem.ingredients.map((ingredient, index) => (
                  <Badge key={index} bg="light" text="dark" className="py-2">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
            <Form.Group className="mt-4">
              <Form.Label>Price</Form.Label>
              <div className="d-flex align-items-center gap-3">
                <Form.Control
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  disabled={isFree}
                />
                <Form.Check
                  type="checkbox"
                  id="free-item-checkbox"
                  label="Free item"
                  checked={isFree}
                  onChange={(e) => setIsFree(e.target.checked)}
                />
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handlePriceUpdate}>
              Update Price
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default OrgMenuSelect;
