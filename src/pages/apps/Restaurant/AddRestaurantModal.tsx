// import React, { useState } from "react";
// import { Modal, Button, Form } from "react-bootstrap";
// import { Kitchen, postRestaurantApi } from "../../../server/allApi";

// interface AddRestaurantModalProps {
//   show: boolean;
//   onHide: () => void;
//   onAddMember: (kitchen: Kitchen) => void;
// }

// const AddRestaurantModal: React.FC<AddRestaurantModalProps> = ({ show, onHide, onAddMember }) => {
//   const [formData, setFormData] = useState<Omit<Kitchen, '_id'>>({
//     // kitchen_id: '',
//     f_name: '',
//     l_name: '',
//     description: '',
//     image_url: '',
//     employees: 0,
//     username: '',
//     revenue: 0,
//     password: '',
//     phone_no: '',
//     image_id: '',
//     location: '',
//     created_by: '66af9daba4daf40b3ac66091',
//     created_at: new Date().toISOString(),
//     updated_by: '66af9daba4daf40b3ac66091',
//     updated_at: new Date().toISOString(),
//   });

//   const [loadingKitchen, setLoadingKitchen] = useState<boolean>(false);
//   const [errorKitchen, setErrorKitchen] = useState<string | null>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoadingKitchen(true);
//     setErrorKitchen(null);
//     try {
//       const newKitchen = await postRestaurantApi(formData);
//       onAddMember(newKitchen);
//       onHide();
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         console.error('Error adding kitchen:', error);
//         setErrorKitchen(error.message);
//       } else {
//         console.error('Unexpected error:', error);
//         setErrorKitchen('Unexpected error occurred.');
//       }
//     } finally {
//       setLoadingKitchen(false);
//     }
//   };

//   return (
//     <Modal show={show} onHide={onHide} aria-labelledby="contained-modal-title-vcenter" centered>
//       <Modal.Header className="bg-light" closeButton>
//         <Modal.Title className="m-0">Add New Kitchen</Modal.Title>
//       </Modal.Header>
//       <Modal.Body className="p-4">
//         {errorKitchen && <div className="alert alert-danger">{errorKitchen}</div>}
//         <form onSubmit={handleSubmit}>
//           {/* <Form.Group controlId="formKitchenId">
//             <Form.Label>Kitchen ID</Form.Label>
//             <Form.Control
//               type="text"
//               name="kitchen_id"
//               value={formData.kitchen_id}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group> */}
//           <Form.Group controlId="formFirstName">
//             <Form.Label>First Name</Form.Label>
//             <Form.Control
//               type="text"
//               name="f_name"
//               value={formData.f_name}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group>
//           <Form.Group controlId="formLastName">
//             <Form.Label>Last Name</Form.Label>
//             <Form.Control
//               type="text"
//               name="l_name"
//               value={formData.l_name}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group>
//           <Form.Group controlId="formDescription">
//             <Form.Label>Description</Form.Label>
//             <Form.Control
//               type="text"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group>
//           <Form.Group controlId="formImageURL">
//             <Form.Label>Image URL</Form.Label>
//             <Form.Control
//               type="text"
//               name="image_url"
//               value={formData.image_url}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group>
//           <Form.Group controlId="formEmployees">
//             <Form.Label>Employees</Form.Label>
//             <Form.Control
//               type="number"
//               name="employees"
//               value={formData.employees}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group>
//           <Form.Group controlId="formUsername">
//             <Form.Label>Username</Form.Label>
//             <Form.Control
//               type="text"
//               name="username"
//               value={formData.username}
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
//           <Form.Group controlId="formPhoneNo">
//             <Form.Label>Phone Number</Form.Label>
//             <Form.Control
//               type="text"
//               name="phone_no"
//               value={formData.phone_no}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group>
//           <Form.Group controlId="formLocation">
//             <Form.Label>Location</Form.Label>
//             <Form.Control
//               type="text"
//               name="location"
//               value={formData.location}
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
//             <Button variant="success" type="submit" className="waves-effect waves-light me-1" disabled={loadingKitchen}>
//               {loadingKitchen ? 'Saving...' : 'Save'}
//             </Button>
//             <Button variant="secondary" onClick={onHide}>
//               Cancel
//             </Button>
//           </div>
//         </form>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default AddRestaurantModal;
export {}
