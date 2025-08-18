
// import React, { useEffect, useState } from "react";
// import { Modal, Button, Form } from "react-bootstrap";
// import { Order ,fetchCustomerApi , fetchFoodMenuApi ,Customer ,FoodMenu  } from "../../../server/allApi";

// interface AddOrderModalProps {
//   show: boolean;
//   onHide: () => void;
//   onSubmit: (order: Order) => Promise<void>;
// }

// const AddOrderModal: React.FC<AddOrderModalProps> = ({
//   show,
//   onHide,
//   onSubmit,
// }) => {
//   const [formData, setFormData] = useState<Partial<Order>>({});
//   const [employees, setEmployees] = useState<Customer[]>([]);
//   const [foodProducts, setFoodProducts] = useState<FoodMenu[]>([]);
//   const [employeeMap, setEmployeeMap] = useState<Map<string, string>>(); // employee name to id mapping
//   const [foodProductMap, setFoodProductMap] = useState<Map<string, string>>(); // food name to id mapping

//   const API_URL = "http://localhost:5000/api"; // Update with your actual API URL

//   const getEmployees = async (): Promise<Customer[]> => {
//     try {
//       const response = await fetch(`${API_URL}/customer`, {
//         // Adjust URL to match your route
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch employees");
//       }

//       const data = await response.json();
//       return data.data; // Adjust based on your backend response structure
//     } catch (error:any) {
//       console.error("Error fetching employees from API:", error);
//       return []; // Return an empty array in case of error to prevent map issues
//     }
//   };

//   // const getFoodProducts = async (): Promise<FoodMenu[]> => {
//   //   try {
//   //     const response = await fetch(`${API_URL}/foodproducts`, {
//   //       // Adjust URL to match your route
//   //       method: "GET",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //     });

//   //     if (!response.ok) {
//   //       throw new Error("Failed to fetch food products");
//   //     }

//   //     const data = await response.json();
//   //     return data.data; // Ensure this matches the actual structure of your API response
//   //   } catch (error:any) {
//   //     console.error("Error fetching food products from API:", error);
//   //     return []; // Return an empty array in case of error to prevent map issues
//   //   }
//   // };

//   const getFoodProducts = async (): Promise<FoodMenu[]> => {
//     try {
//       const response = await fetch(`${API_URL}/foodproducts`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
  
//       if (!response.ok) {
//         throw new Error("Failed to fetch food products");
//       }
  
//       const data = await response.json();
//       if (!data || !Array.isArray(data.data)) {
//         throw new Error("Unexpected API response format");
//       }
  
//       return data.data; 
//     } catch (error:any) {
//       console.error("Error fetching food products from API:", error);
//       return []; // Prevents the map error by ensuring we return an array
//     }
//   };
  

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       const employeeList = await getEmployees();
//       setEmployees(employeeList);
//       setEmployeeMap(new Map(employeeList.map((emp) => [emp.cust_name, emp._id])));
//     };
  
//     const fetchFoodProducts = async () => {
//       const foodProductList = await getFoodProducts();
//       setFoodProducts(foodProductList);
//       setFoodProductMap(new Map(foodProductList.map((food) => [food.food_name, food._id])));
//     };

//     fetchEmployees();
//     fetchFoodProducts();
//   }, []);
  

//   const handleInputChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Convert selected names to ids
//     const orderData: Partial<Order> = { ...formData };

//     if (employeeMap && foodProductMap) {
//       const employeeName = formData.employee_id;
//       const foodName = formData.food_id ;

//       // Find corresponding ids
//       // const employeeId = employeeMap.get(employeeName);
//       // const foodId = foodProductMap.get(foodName);

//       // if (employeeId) orderData.employee_id = employeeId;
//       // if (foodId) orderData.food_id = foodId;
//     }

//     // Call onSubmit with the updated data
//     await onSubmit(orderData as Order);
//     setFormData({});
//     onHide();
//   };

//   return (
//     <Modal show={show} onHide={onHide} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Add New Order</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form onSubmit={handleSubmit}>
//           <Form.Group controlId="formOrder_id">
//             <Form.Label>Order Id</Form.Label>
//             <Form.Control
//               type="text"
//               name="order_id"
//               value={formData.order_id || ""}
//               onChange={handleInputChange}
//               required
//               style={{ marginBottom: "1rem" }}
//             />
//           </Form.Group>

//           <Form.Group controlId="employee_id">
//             <Form.Label>Employee Name</Form.Label>
//             <Form.Control
//               as="select"
//               name="employee_id"
//               value={formData.employee_id || ""}
//               onChange={handleInputChange}
//               required
//               style={{ marginBottom: "1rem" }}
//             >
//               <option value="">Select Employee</option>
//               {employees.map((employee) => (
//                 <option key={employee._id} value={employee._id}>
//                   {employee.cust_name}
//                 </option>
//               ))}
//             </Form.Control>
//           </Form.Group>

//           <Form.Group controlId="food_id">
//             <Form.Label>Food Name</Form.Label>
//             <Form.Control
//               as="select"
//               name="food_id"
//               value={formData.food_id || ""}
//               onChange={handleInputChange}
//               required
//               style={{ marginBottom: "1rem" }}
//             >
//               <option value="">Select fOOD ITEM</option>
//               {foodProducts.map((foodItem) => (
//                 <option key={foodItem._id} value={foodItem._id}>
//                   {foodItem.food_name}
//                 </option>
//               ))}
//             </Form.Control>

//           </Form.Group>

//           <Form.Group controlId="quantity">
//             <Form.Label>Quantity</Form.Label>
//             <Form.Control
//               type="number"
//               name="quantity"
//               value={formData.quantity || ""}
//               onChange={handleInputChange}
//               required
//               style={{ marginBottom: "1rem" }}
//             />
//           </Form.Group>

//           <Form.Group controlId="order_date">
//             <Form.Label>Order Date</Form.Label>
//             <Form.Control
//               type="date"
//               name="order_date"
//               value={
//                 formData.order_date instanceof Date
//                   ? formData.order_date.toISOString().split("T")[0]
//                   : formData.order_date || ""
//               }
//               onChange={handleInputChange}
//               style={{ marginBottom: "1rem" }}
//             />
//           </Form.Group>

//           <Form.Group controlId="order_status">
//             <Form.Label>Order Status</Form.Label>
//             <Form.Control
//               type="text"
//               name="order_status"
//               value={formData.order_status || ""}
//               onChange={handleInputChange}
//               style={{ marginBottom: "1rem" }}
//             />
//           </Form.Group>
//           <Form.Group controlId="supply_date">
//             <Form.Label>Supply Date</Form.Label>
//             <Form.Control
//               type="date"
//               name="supply_date_time"
//               value={
//                 formData.supply_date_time instanceof Date
//                   ? formData.supply_date_time.toISOString().split("T")[0]
//                   : formData.supply_date_time || ""
//               }
//               onChange={handleInputChange}
//               style={{ marginBottom: "1rem" }}
//             />
//           </Form.Group>

//           <div className="text-center mt-4">
//             <Button
//               variant="primary"
//               type="submit"
//               style={{
//                 backgroundColor: "#007bff",
//                 borderColor: "#007bff",
//                 padding: "0.3rem 1rem",
//                 borderRadius: "0.25rem",
//                 fontWeight: "bold",
//                 transition: "background-color 0.2s ease-in-out",
//                 fontSize: "0.875rem",
//               }}
//               onMouseOver={(e) =>
//                 (e.currentTarget.style.backgroundColor = "#0056b3")
//               }
//               onMouseOut={(e) =>
//                 (e.currentTarget.style.backgroundColor = "#007bff")
//               }
//             >
//               Add Order
//             </Button>
//           </div>
//         </Form>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default AddOrderModal;

export {}