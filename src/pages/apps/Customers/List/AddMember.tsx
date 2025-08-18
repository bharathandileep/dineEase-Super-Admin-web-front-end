// import React, { useState } from "react";
// import { Modal, Button, Form, Spinner } from "react-bootstrap";
//   import { Customer, postCustomerApi } from "../../../../server/allApi";

// interface AddMemberProps {
//   show: boolean;
//   onHide: () => void;
//   onAddMember: (customer: Customer) => void;
//   isLoading: boolean;
// }

// const AddMember: React.FC<AddMemberProps> = ({ show, onHide, onAddMember, isLoading }) => {
//   const [formData, setFormData] = useState<Omit<Customer, '_id'>>({
//     // cust_id: '',
//     cust_name: '',
//     email: '',
//     age: '',
//     contact_num: '',
//     address: '',
//     password: '',
//     created_by: '66af9daba4daf40b3ac66091',
//     created_at: new Date().toISOString(),
//     updated_by: '66af9daba4daf40b3ac66091',
//     updated_at: new Date().toISOString(),
//   });

//   const [errorMember, setErrorMember] = useState<string | null>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (isLoading) return; // Prevent submission if already loading
//     setErrorMember(null);
//     try {
//       const newCustomer = await postCustomerApi(formData);
//       onAddMember(newCustomer);
//       onHide();
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         console.error('Error adding customer:', error);
//         setErrorMember(error.message);
//       } else {
//         console.error('Unexpected error:', error);
//         setErrorMember('Unexpected error occurred.');
//       }
//     }
//   };

//   return (
//     <Modal show={show} onHide={onHide} aria-labelledby="contained-modal-title-vcenter" centered>
//       <Modal.Header className="bg-light" closeButton>
//         <Modal.Title className="m-0">Add New Member</Modal.Title>
//       </Modal.Header>
//       <Modal.Body className="p-4">
//         {errorMember && <div className="alert alert-danger">{errorMember}</div>}
//         <form onSubmit={handleSubmit}>
//           {/* <Form.Group controlId="formCustomerId">
//             <Form.Label>Customer ID</Form.Label>
//             <Form.Control
//               type="text"
//               name="cust_id"
//               value={formData.cust_id}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group> */}
//           <Form.Group controlId="formCustomerName">
//             <Form.Label>Customer Name</Form.Label>
//             <Form.Control
//               type="text"
//               name="cust_name"
//               value={formData.cust_name}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group>
//           <Form.Group controlId="formEmail">
//             <Form.Label>Email Address</Form.Label>
//             <Form.Control
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group>
//           <Form.Group controlId="formAge">
//             <Form.Label>Customer Age</Form.Label>
//             <Form.Control
//               type="number"
//               name="age"
//               value={formData.age}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group>
//           <Form.Group controlId="formNumber">
//             <Form.Label>Customer Number</Form.Label>
//             <Form.Control
//               type="text"
//               name="contact_num"
//               value={formData.contact_num}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group>
//           <Form.Group controlId="formAddress">
//             <Form.Label>Customer Address</Form.Label>
//             <Form.Control
//               type="text"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group>
//           <Form.Group controlId="formPassword">
//             <Form.Label>Password</Form.Label>
//             <Form.Control
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group>
//           {/* <Form.Group controlId="formCreatedBy">
//             <Form.Label>Created By</Form.Label>
//             <Form.Control
//               type="text"
//               name="created_by"
//               value={formData.created_by}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group>
//           <Form.Group controlId="formCreatedAt">
//             <Form.Label>Created At</Form.Label>
//             <Form.Control
//               type="datetime-local"
//               name="created_at"
//               value={formData.created_at.slice(0, 16)}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group>
//           <Form.Group controlId="formUpdatedBy">
//             <Form.Label>Updated By</Form.Label>
//             <Form.Control
//               type="text"
//               name="updated_by"
//               value={formData.updated_by}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group>
//           <Form.Group controlId="formUpdatedAt">
//             <Form.Label>Updated At</Form.Label>
//             <Form.Control
//               type="datetime-local"
//               name="updated_at"
//               value={formData.updated_at.slice(0, 16)}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group> */}

//           <div className="text-end">
//             <Button 
//               variant="success" 
//               type="submit" 
//               className="waves-effect waves-light me-1"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <>
//                   <Spinner animation="border" size="sm" className="me-2" /> Saving...
//                 </>
//               ) : (
//                 'Save'
//               )}
//             </Button>
//             <Button variant="danger" className="waves-effect waves-light" onClick={onHide}>
//               Cancel
//             </Button>
//           </div>
//         </form>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default AddMember;
export {}