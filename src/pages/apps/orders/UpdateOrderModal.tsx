import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Customer, FoodMenu, Order } from "../../../server/allApi";

interface UpdateOrderModalProps {
  show: boolean;
  onHide: () => void;
  order: Order | null;
  onSubmit: (updatedOrder: Order) => Promise<void>;
}

const UpdateOrderModal: React.FC<UpdateOrderModalProps> = ({
  show,
  onHide,
  order,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Partial<Order> | null>(null);
  const [employees, setEmployees] = useState<Customer[]>([]);
  const [foodProducts, setFoodProducts] = useState<FoodMenu[]>([]);
  const [employeeMap, setEmployeeMap] = useState<Map<string, string>>(new Map()); // Initialize map
  const [foodProductMap, setFoodProductMap] = useState<Map<string, string>>(new Map()); // Initialize map
  const API_URL = 'http://localhost:5000/api'; // Update with your actual API URL

  const getEmployees = async (): Promise<Customer[]> => {
    try {
      const response = await fetch(`${API_URL}/customer`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch employees");
      const data = await response.json();
      return data.data || []; // Ensure default to empty array
    } catch (error:any) {
      console.error("Error fetching employees from API:", error);
      return []; // Return empty array in case of error
    }
  };

  const getFoodProducts = async (): Promise<FoodMenu[]> => {
    try {
      const response = await fetch(`${API_URL}/foodproducts`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch food products");
      const data = await response.json();
      return data.data || []; // Ensure default to empty array
    } catch (error:any) {
      console.error("Error fetching food products from API:", error);
      return []; // Return empty array in case of error
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      const employeeList = await getEmployees();
      setEmployees(employeeList);
      setEmployeeMap(new Map(employeeList.map((emp) => [emp._id, emp.cust_name]))); // Correct mapping
    };

    const fetchFoodProducts = async () => {
      const foodProductList = await getFoodProducts();
      setFoodProducts(foodProductList);
      setFoodProductMap(new Map(foodProductList.map((food) => [food._id, food.food_name]))); // Correct mapping
    };

    fetchEmployees();
    fetchFoodProducts();
  }, []);

  useEffect(() => {
    setFormData(order);
  }, [order]);

  if (!formData) {
    return null; // Prevent rendering if formData is not set
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) =>
      prevState ? { ...prevState, [name]: value } : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert selected names to ids
    const updatedOrderData: Partial<Order> = { ...formData };

    if (employeeMap && foodProductMap) {
      const employeeId = formData.employee_id as string;
      const foodId = formData.food_id as string;

      if (employeeId) updatedOrderData.employee_id = employeeId;
      if (foodId) updatedOrderData.food_id = foodId;
    }

    if (updatedOrderData) {
      await onSubmit(updatedOrderData as Order);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formOrder_id">
            <Form.Label>Order Id</Form.Label>
            <Form.Control
              type="text"
              name="order_id"
              value={formData.order_id || ""}
              onChange={handleChange}
              required
              style={{ marginBottom: "1rem" }} // Inline style for spacing
            />
          </Form.Group>

          <Form.Group controlId="employee_id">
            <Form.Label>Employee Name</Form.Label>
            <Form.Control
              as="select"
              name="employee_id"
              value={formData.employee_id || ""}
              onChange={handleChange}
              required
              style={{ marginBottom: "1rem" }}
            >
              <option value="">Select Employee</option>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.cust_name}
                  </option>
                ))
              ) : (
                <option value="">No Employees Available</option>
              )}
            </Form.Control>
          </Form.Group>

          {/* <Form.Group controlId="food_id">
            <Form.Label>Food Name</Form.Label>
            <Form.Control
              as="select"
              name="food_id"
              value={formData.food_id || ""}
              onChange={handleChange}
              required
              style={{ marginBottom: "1rem" }}
            >
              <option value="">Select Food</option>
              {foodProducts.length > 0 ? (
                foodProducts.map((food) => (
                  <option key={food._id} value={food._id}>
                    {food.food_name}
                  </option>
                ))
              ) : (
                <option value="">No Food Products Available</option>
              )}
            </Form.Control>
          </Form.Group> */}

          <Form.Group controlId="quantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={formData.quantity || ""}
              onChange={handleChange}
              required
              style={{ marginBottom: "1rem" }}
            />
          </Form.Group>

          <Form.Group controlId="order_date">
            <Form.Label>Order Date</Form.Label>
            <Form.Control
              type="date"
              name="order_date"
              value={
                formData.order_date instanceof Date
                  ? formData.order_date.toISOString().split("T")[0]
                  : formData.order_date || ""
              }
              onChange={handleChange}
              style={{ marginBottom: "1rem" }}
            />
          </Form.Group> 

          <Form.Group controlId="order_status">
            <Form.Label>Order Status</Form.Label>
            <Form.Control
              type="text"
              name="order_status"
              value={formData.order_status || ""}
              onChange={handleChange}
              style={{ marginBottom: "1rem" }}
            />
          </Form.Group>

          <Form.Group controlId="supply_date_time">
            <Form.Label>Supply Date & Time</Form.Label>
            <Form.Control
              type="date"
              name="supply_date_time"
              value={
                formData.supply_date_time instanceof Date
                  ? formData.supply_date_time.toISOString().split("T")[0]
                  : formData.supply_date_time || ""
              }
              onChange={handleChange}
              style={{ marginBottom: "1rem" }}
            />
          </Form.Group>

          <div className="text-center mt-4">
            <Button
              variant="primary"
              type="submit"
              style={{
                backgroundColor: "#007bff",
                borderColor: "#007bff",
                padding: "0.3rem 1rem",
                borderRadius: "0.25rem",
                fontWeight: "bold",
                transition: "background-color 0.2s ease-in-out",
                fontSize: "0.875rem",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#0056b3")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#007bff")
              }
            >
              Update Order
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateOrderModal;