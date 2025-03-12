import React, { useState, useEffect } from "react";
import { Accordion, Button, Tabs, Tab, Card, Row, Col } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { listItems } from "../../../server/admin/items";
import { createNewkitchenMenu } from "../../../server/admin/kitchensMenuCreation";
import { toast } from "react-toastify";
import PageTitle from "../../../components/PageTitle";

interface FoodItem {
  name: string;
  description: string;
  image: string;
  status: boolean;
  itemId?: string | undefined;
  quantity?: number;
}

type TransformedData = Record<string, Record<string, FoodItem[]>>;

const KitchenMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [groupedItems, setGroupedItems] = useState<TransformedData>({});
  const [cartItems, setCartItems] = useState<FoodItem[]>([]);
  const [activeKey, setActiveKey] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const transformFoodData = (items: any[]): TransformedData => {
    const transformed = items.reduce((acc: TransformedData, item) => {
      const categoryName = item.category?.category;
      const subcategoryName = item.subcategory?.subcategoryName;

      if (!categoryName || !subcategoryName) {
        console.warn("Skipping item due to missing category/subcategory:", item);
        return acc;
      }

      if (!acc[categoryName]) {
        acc[categoryName] = {};
      }

      if (!acc[categoryName][subcategoryName]) {
        acc[categoryName][subcategoryName] = [];
      }

      acc[categoryName][subcategoryName].push({
        name: item.item_name,
        description: item.item_description,
        image: item.item_image,
        status: item.status,
        itemId: item._id,
      });

      return acc;
    }, {} as TransformedData);

    return transformed;
  };

  const fetchItemDetails = async () => {
    setLoading(true);
    try {
      const response = await listItems( { page: 1, limit: 1000 } );
      const transformedData = transformFoodData(response.data);
      setGroupedItems(transformedData);

      const firstCategory = Object.keys(transformedData)[0];
      if (firstCategory) {
        setActiveKey(firstCategory);
      }
    } catch (error:any) {
      console.error("Error fetching items:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemDetails();
  }, []);

  const handleAddToCart = (item: FoodItem) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.name === item.name);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.name === item.name
            ? { ...cartItem, quantity: (cartItem.quantity || 0) + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (item: { name: string }) => {
    setCartItems((prevCart) =>
      prevCart.filter((cartItem) => cartItem.name !== item.name)
    );
  };

  const handleProceedToCheckout = async () => {
    if (cartItems.length === 0) {
      toast.warning("Please add at least one item to the menu");
      return;
    }

    setLoading(true);
    try {
      const hardcodedKitchenId = "67c1372e962df283dc2b80eb"; // Hardcoded kitchen ID
      const response = await createNewkitchenMenu(hardcodedKitchenId, cartItems);
      if (response && response.status) {
        toast.success(response.message);
        setCartItems([]);
        navigate("/apps/kitchen/kitchen-menu");
      } else {
        toast.error(response?.message || "An unexpected error occurred");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const CheckoutBar = ({ cartItems, onProceed }: any) => {
    if (cartItems?.length === 0) return null;

    return (
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "white",
          padding: "1rem",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
          zIndex: 1000,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <span className="fw-bold">
            {cartItems.reduce((sum: any, item: any) => sum + (item.quantity || 0), 0)} items
          </span>
        </div>
        <Button variant="primary" onClick={onProceed} disabled={loading}>
          {loading ? "Processing..." : "Add to Kitchen Menu"}
        </Button>
      </div>
    );
  };

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Kitchens", path: "/apps/kitchen/list" },
          { label: "Kitchen Details", path: `/apps/kitchen/details/${id}` },
          { label: "Add Menu Items", path: `/apps/kitchen/${id}/menu`, active: true },
        ]}
        title={"Add Menu Items"}
      />

      {/* Head Bar */}
      <div className="container-fluid px-4">
        <div
          className="mb-3"
          style={{ backgroundColor: "#5bd2bc", padding: "10px" }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="page-title m-0" style={{ color: "#fff" }}>
              Add items to kitchen Menu
            </h3>
            <Button 
              variant="danger"
              onClick={() => navigate(`/apps/kitchen/kitchen-menu`)}
            >
              View Current Menu
            </Button>
          </div>
        </div>

        {/* Card Below Head Bar */}
        <Card className="shadow-sm">
          <Card.Body>
            {loading && !Object.keys(groupedItems).length ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading menu items...</p>
              </div>
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="mb-0">Choose Menu Items</h4>
                </div>
                {Object.keys(groupedItems).length > 0 ? (
                  <Tabs activeKey={activeKey} onSelect={(k: any) => setActiveKey(k)}>
                    {Object.entries(groupedItems).map(([category, subcategories]) => (
                      <Tab eventKey={category} title={category} key={category}>
                        <Accordion>
                          {Object.entries(subcategories).map(([subcategory, items]) => (
                            <Accordion.Item key={subcategory} eventKey={subcategory}>
                              <Accordion.Header>{subcategory}</Accordion.Header>
                              <Accordion.Body>
                                {items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="d-flex align-items-center mb-3 p-2 border-bottom"
                                    style={{ gap: "15px" }}
                                  >
                                    <div
                                      className="flex-shrink-0"
                                      style={{ width: "80px", height: "80px" }}
                                    >
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="rounded"
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "cover",
                                        }}
                                      />
                                    </div>
                                    <div className="flex-grow-1">
                                      <h6 className="mb-1">{item.name}</h6>
                                      <small className="text-muted">
                                        {item.description}
                                      </small>
                                    </div>
                                    <div className="text-end">
                                      {cartItems.some(
                                        (cartItem) => cartItem.name === item.name
                                      ) ? (
                                        <Button
                                          variant="outline-danger"
                                          size="sm"
                                          onClick={() => handleRemoveFromCart(item)}
                                        >
                                          Remove
                                        </Button>
                                      ) : (
                                        <Button
                                          variant="outline-primary"
                                          size="sm"
                                          onClick={() => handleAddToCart(item)}
                                        >
                                          Add
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </Accordion.Body>
                            </Accordion.Item>
                          ))}
                        </Accordion>
                      </Tab>
                    ))}
                  </Tabs>
                ) : (
                  <div className="text-center py-4">
                    <p>No menu items found. Please add items first.</p>
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Selected Items Summary */}
      {cartItems.length > 0 && (
        <div className="container-fluid px-4 mt-3">
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Selected Items ({cartItems.length})</h5>
              <Row className="g-3">
                {cartItems.map((item, idx) => (
                  <Col md={4} key={idx}>
                    <div className="d-flex align-items-center p-2 border rounded">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        style={{width: "40px", height: "40px", objectFit: "cover"}}
                        className="me-3 rounded"
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-0">{item.name}</h6>
                        <small className="text-muted">Qty: {item.quantity}</small>
                      </div>
                      <Button 
                        variant="link" 
                        className="text-danger p-0"
                        onClick={() => handleRemoveFromCart(item)}
                      >
                        <i className="mdi mdi-close"></i>
                      </Button>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </div>
      )}

      <CheckoutBar cartItems={cartItems} onProceed={handleProceedToCheckout} />
    </>
  );
};

export default KitchenMenu;