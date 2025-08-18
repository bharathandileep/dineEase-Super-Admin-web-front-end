// import React, { useState } from "react";
// import { Modal, Button, Form , Spinner } from "react-bootstrap";
// // import { Company, postCompanyApi } from "../../../server/allApi";

// interface AddCompanyModalProps {
//   show: boolean;
//   onHide: () => void;
//   onSubmit: (company: Company) => void;
// }

// const AddCompanyModal: React.FC<AddCompanyModalProps> = ({ show, onHide, onSubmit }) => {
//   const [formData, setFormData] = useState<Omit<Company, '_id'>>({
//     // company_id: '',
//     logo: '',
//     company_name: '',
//     company_location: '',
//     company_contact: '',
//     created_by: '66a79aacd02d4640444ccf0c',
//     created_at: new Date().toISOString(),
//     updated_by: '66a79aacd02d4640444ccf0c',
//     updated_at: new Date().toISOString(),
//   });

//   const [loadingCompany, setLoadingCompany] = useState<boolean>(false);
//   const [errorCompany, setErrorCompany] = useState<string | null>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoadingCompany(true);
//     setErrorCompany(null);
//     try {
//       const newCompany = await postCompanyApi(formData);
//       onSubmit(newCompany);
//       onHide();
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         console.error('Error adding company:', error);
//         setErrorCompany(error.message);
//       } else {
//         console.error('Unexpected error:', error);
//         setErrorCompany('Unexpected error occurred.');
//       }
//     } finally {
//       setLoadingCompany(false);
//     }
//   };

//   return (
//     <Modal show={show} onHide={onHide} aria-labelledby="contained-modal-title-vcenter" centered>
//       <Modal.Header className="bg-light" closeButton>
//         <Modal.Title className="m-0">Add New Company</Modal.Title>
//       </Modal.Header>
//       <Modal.Body className="p-4">
//         {errorCompany && <div className="alert alert-danger">{errorCompany}</div>}
//         <form onSubmit={handleSubmit}>
//           {/* <Form.Group controlId="formCompanyId">
//             <Form.Label>Company ID</Form.Label>
//             <Form.Control
//               type="text"
//               name="company_id"
//               value={formData.company_id}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group> */}
//           <Form.Group controlId="formCompanyName">
//             <Form.Label>Company Name</Form.Label>
//             <Form.Control
//               type="text"
//               name="company_name"
//               value={formData.company_name}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group>
//           <Form.Group controlId="formCompanyContact">
//             <Form.Label>Company Contacts</Form.Label>
//             <Form.Control
//               type="text"
//               name="company_contact"
//               value={formData.company_contact}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group>
//           <Form.Group controlId="formCompanyLocation">
//             <Form.Label>Company Location</Form.Label>
//             <Form.Control
//               type="text"
//               name="company_location"
//               value={formData.company_location}
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
//             <Button variant="success" type="submit" className="waves-effect waves-light me-1" disabled={loadingCompany}>
//               {loadingCompany ? <Spinner animation="border" size="sm" /> : "Add Company"}
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

// export default AddCompanyModal;

export {}