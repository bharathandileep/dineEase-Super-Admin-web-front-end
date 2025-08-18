// import React from "react";
// import { Link } from "react-router-dom";
// import { Card, Row, Col, Button } from "react-bootstrap";
// import { Customer } from "../../../../server/allApi";

// interface ContactDetailsProps {
//   customers: Customer[];
//   onDelete: (id: string) => void;
//   onEdit: (customer: Customer) => void;
// }

// const ContactDetails: React.FC<ContactDetailsProps> = ({ customers, onDelete, onEdit }) => {
//   if (!customers.length) {
//     return <div>No customers found</div>;
//   }

//   return (
//     <Row>
//       {customers.map((cust) => (
//         <Col key={cust._id} lg={4}>
//           <Card className="text-center">
//             <Card.Body>
//               <div className="d-flex justify-content-end mb-2">
//                 <Button
//                   variant="success"
//                   className="me-2"
//                   onClick={() => onEdit(cust)}
//                 >
//                   <i className="mdi mdi-pencil"></i>
//                 </Button>
//                 <Button
//                   variant="danger"
//                   onClick={() => onDelete(cust._id)}
//                 >
//                   &times;
//                 </Button>
//               </div>
//               <div className="pt-2 pb-2">
//                 <img
//                   className="rounded-circle img-thumbnail avatar-xl"
//                   alt=""
//                 />
//                 <h4 className="mt-3">
//                   <Link to="#" className="text-dark">
//                     {cust.cust_name}
//                   </Link>
//                 </h4>
//                 <p className="text-muted">
//                   @{cust.email} <span> | </span>{" "}
//                   <span>
//                     <Link to="#" className="text-pink">
//                       {cust.address}
//                     </Link>
//                   </span>
//                 </p>
//                 <Button
//                   variant="primary"
//                   className="btn-sm waves-effect waves-light me-1"
//                 >
//                   Message
//                 </Button>
//                 <Button variant="light" className="btn-sm waves-effect">
//                   Follow
//                 </Button>
//                 <Row className="mt-4">
//                   <Col xs={4}>
//                     <div className="mt-3">
//                       <h5>{cust.contact_num}</h5>
//                       <p className="mb-0 text-muted text-truncate">Phone Number</p>
//                     </div>
//                   </Col>
//                   <Col xs={8}>
//                     <div className="mt-3">
//                       <p>{cust.email}</p>
//                       <p className="mb-0 text-muted text-truncate">Email</p>
//                     </div>
//                   </Col>
//                 </Row>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       ))}
//     </Row>
//   );
// };

// export default ContactDetails;
export {}