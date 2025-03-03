// import React, { useState, useEffect } from "react";
// import { Accordion, Button, Tabs, Tab, Card, Row, Col } from "react-bootstrap";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { listItems } from "../../../server/admin/items";
// import { createNewkitchenMenu } from "../../../server/admin/kitchensMenuCreation";
// import { toast } from "react-toastify";
// import PageTitle from "../../../components/PageTitle";

// interface FoodItem {
//   name: string;
//   description: string;
//   image: string;
//   status: boolean;
//   itemId?: string | undefined;
//   quantity?: number;
// }

// type TransformedData = Record<string, Record<string, FoodItem[]>>;

// const KitchenMenu = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [groupedItems, setGroupedItems] = useState<TransformedData>({});
//   const [cartItems, setCartItems] = useState<FoodItem[]>([]);
//   const [activeKey, setActiveKey] = useState<string>("");
//   const [loading, setLoading] = useState(false);

//   const transformFoodData = (items: any[]): TransformedData => {
//     const transformed = items.reduce((acc: TransformedData, item) => {
//       const categoryName = item.category?.category;
//       const subcategoryName = item.subcategory?.subcategoryName;

//       if (!categoryName || !subcategoryName) {
//         console.warn("Skipping item due to missing category/subcategory:", item);
//         return acc;
//       }

//       if (!acc[categoryName]) {
//         acc[categoryName] = {};
//       }

//       if (!acc[categoryName][subcategoryName]) {
//         acc[categoryName][subcategoryName] = [];
//       }

//       acc[categoryName][subcategoryName].push({
//         name: item.item_name,
//         description: item.item_description,
//         image: item.item_image,
//         status: item.status,
//         itemId: item._id,
//       });

//       return acc;
//     }, {} as TransformedData);

//     return transformed;
//   };

//   const fetchItemDetails = async () => {
//     setLoading(true);
//     try {
//       const response = await listItems();
//       const transformedData = transformFoodData(response.data);
//       setGroupedItems(transformedData);

//       const firstCategory = Object.keys(transformedData)[0];
//       if (firstCategory) {
//         setActiveKey(firstCategory);
//       }
//     } catch (error) {
//       console.error("Error fetching items:", error);
//       toast.error("Failed to load menu items");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchItemDetails();
//   }, []);

//   const handleAddToCart = (item: FoodItem) => {
//     setCartItems((prevCart) => {
//       const existingItem = prevCart.find((cartItem) => cartItem.name === item.name);
//       if (existingItem) {
//         return prevCart.map((cartItem) =>
//           cartItem.name === item.name
//             ? { ...cartItem, quantity: (cartItem.quantity || 0) + 1 }
//             : cartItem
//         );
//       } else {
//         return [...prevCart, { ...item, quantity: 1 }];
//       }
//     });
//   };

//   const handleRemoveFromCart = (item: { name: string }) => {
//     setCartItems((prevCart) =>
//       prevCart.filter((cartItem) => cartItem.name !== item.name)
//     );
//   };

//   const handleProceedToCheckout = async () => {
//     if (cartItems.length === 0) {
//       toast.warning("Please add at least one item to the menu");
//       return;
//     }

//     setLoading(true);
//     try {
//       const hardcodedKitchenId = "67c1372e962df283dc2b80eb"; // Hardcoded kitchen ID
//       const response = await createNewkitchenMenu(hardcodedKitchenId, cartItems);
//       if (response && response.status) {
//         toast.success(response.message);
//         // Clear the cart after successful checkout
//         setCartItems([]);
//         // Navigate to the our-menu page to see the updated menu
//         navigate(`/apps/kitchen/${hardcodedKitchenId}/our-menu`);
//       } else {
//         toast.error(response?.message || "An unexpected error occurred");
//       }
//     } catch (error: any) {
//       toast.error(error.message || "An unexpected error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const CheckoutBar = ({ cartItems, onProceed }: any) => {
//     if (cartItems?.length === 0) return null;

//     return (
//       <div
//         style={{
//           position: "fixed",
//           bottom: 0,
//           left: 0,
//           right: 0,
//           backgroundColor: "white",
//           padding: "1rem",
//           boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
//           zIndex: 1000,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <div>
//           <span className="fw-bold">
//             {cartItems.reduce((sum: any, item: any) => sum + (item.quantity || 0), 0)} items
//           </span>
//         </div>
//         <Button variant="primary" onClick={onProceed} disabled={loading}>
//           {loading ? "Processing..." : "Add to Kitchen Menu"}
//         </Button>
//       </div>
//     );
//   };

//   return (
//     <>
//       <PageTitle
//         breadCrumbItems={[
//           { label: "Kitchens", path: "/apps/kitchen/list" },
//           { label: "Kitchen Details", path: `/apps/kitchen/details/${id}` },
//           { label: "Add Menu Items", path: `/apps/kitchen/${id}/menu`, active: true },
//         ]}
//         title={"Add Menu Items"}
//       />

//       <div className="container-fluid px-4 py-3">
//         <Row className="mb-3">
//           <Col xs={12}>
//             <Card className="bg-light">
//               <Card.Body>
//                 <div className="d-flex justify-content-between align-items-center">
//                   <h4 className="m-0 text-primary">Add Items to Kitchen Menu</h4>
//                   <Button 
//                     variant="outline-secondary"
//                     onClick={() => navigate(`/apps/kitchen/${id}/our-menu`)}
//                   >
//                     View Current Menu
//                   </Button>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         <Card className="shadow-sm mb-4">
//           <Card.Body>
//             {loading && !Object.keys(groupedItems).length ? (
//               <div className="text-center py-5">
//                 <div className="spinner-border text-primary" role="status">
//                   <span className="visually-hidden">Loading...</span>
//                 </div>
//                 <p className="mt-3">Loading menu items...</p>
//               </div>
//             ) : (
//               <>
//                 <div className="d-flex justify-content-between align-items-center mb-4">
//                   <h4 className="mb-0">Choose Menu Items</h4>
//                 </div>
//                 {Object.keys(groupedItems).length > 0 ? (
//                   <Tabs activeKey={activeKey} onSelect={(k: any) => setActiveKey(k)}>
//                     {Object.entries(groupedItems).map(([category, subcategories]) => (
//                       <Tab eventKey={category} title={category} key={category}>
//                         <Accordion>
//                           {Object.entries(subcategories).map(([subcategory, items]) => (
//                             <Accordion.Item key={subcategory} eventKey={subcategory}>
//                               <Accordion.Header>{subcategory}</Accordion.Header>
//                               <Accordion.Body>
//                                 {items.map((item, idx) => (
//                                   <div
//                                     key={idx}
//                                     className="d-flex align-items-center mb-3 p-2 border-bottom"
//                                     style={{ gap: "15px" }}
//                                   >
//                                     <div
//                                       className="flex-shrink-0"
//                                       style={{ width: "80px", height: "80px" }}
//                                     >
//                                       <img
//                                         src={item.image}
//                                         alt={item.name}
//                                         className="rounded"
//                                         style={{
//                                           width: "100%",
//                                           height: "100%",
//                                           objectFit: "cover",
//                                         }}
//                                       />
//                                     </div>
//                                     <div className="flex-grow-1">
//                                       <h6 className="mb-1">{item.name}</h6>
//                                       <small className="text-muted">
//                                         {item.description}
//                                       </small>
//                                     </div>
//                                     <div className="text-end">
//                                       {cartItems.some(
//                                         (cartItem) => cartItem.name === item.name
//                                       ) ? (
//                                         <Button
//                                           variant="outline-danger"
//                                           size="sm"
//                                           onClick={() => handleRemoveFromCart(item)}
//                                         >
//                                           Remove
//                                         </Button>
//                                       ) : (
//                                         <Button
//                                           variant="outline-primary"
//                                           size="sm"
//                                           onClick={() => handleAddToCart(item)}
//                                         >
//                                           Add
//                                         </Button>
//                                       )}
//                                     </div>
//                                   </div>
//                                 ))}
//                               </Accordion.Body>
//                             </Accordion.Item>
//                           ))}
//                         </Accordion>
//                       </Tab>
//                     ))}
//                   </Tabs>
//                 ) : (
//                   <div className="text-center py-4">
//                     <p>No menu items found. Please add items first.</p>
//                   </div>
//                 )}
//               </>
//             )}
//           </Card.Body>
//         </Card>
        
//         {/* Display selected items summary */}
//         {cartItems.length > 0 && (
//           <Card className="shadow-sm mb-4">
//             <Card.Body>
//               <h5 className="mb-3">Selected Items ({cartItems.length})</h5>
//               <Row className="g-3">
//                 {cartItems.map((item, idx) => (
//                   <Col md={4} key={idx}>
//                     <div className="d-flex align-items-center p-2 border rounded">
//                       <img 
//                         src={item.image} 
//                         alt={item.name} 
//                         style={{width: "40px", height: "40px", objectFit: "cover"}}
//                         className="me-3 rounded"
//                       />
//                       <div className="flex-grow-1">
//                         <h6 className="mb-0">{item.name}</h6>
//                         <small className="text-muted">Qty: {item.quantity}</small>
//                       </div>
//                       <Button 
//                         variant="link" 
//                         className="text-danger p-0"
//                         onClick={() => handleRemoveFromCart(item)}
//                       >
//                         <i className="mdi mdi-close"></i>
//                       </Button>
//                     </div>
//                   </Col>
//                 ))}
//               </Row>
//             </Card.Body>
//           </Card>
//         )}
//       </div>
//       <CheckoutBar cartItems={cartItems} onProceed={handleProceedToCheckout} />
//     </>
//   );
// };

// export default KitchenMenu;


import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";
import { useParams } from "react-router-dom";
import {
  getKitchenMenus,
  removeKitchenMenus,
} from "../../../server/admin/kitchensMenuCreation";
import { toast } from "react-toastify";

// TypeScript interfaces
interface MenuItem {
  _id: string;
  item_name: string;
  category: {
    _id: string;
    category: string;
  };
  subcategory: {
    _id: string;
  };
  status: boolean;
  item_image: string;
  item_description: string;
}

interface MenuItemEntry {
  item_id: MenuItem;
  isAvailable: boolean;
  custom_image: string;
  reviews_id: any[];
  _id: string;
}

interface Menu {
  _id: string;
  kitchen_id: {
    _id: string;
  };
  items_id: MenuItemEntry[];
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

function OurMenu() {
  const { id } = useParams();
  const [kitchenMenuItems, setKitchenMenuItems] = useState<Menu[]>([]);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    const fetchKitchenMenu = async () => {
      try {
        const hardcodedKitchenId = "67c1372e962df283dc2b80eb"; // Hardcoded kitchen ID
        const response = await getKitchenMenus(hardcodedKitchenId);
        setKitchenMenuItems(response.data);
      } catch (error) {
        console.error("Error fetching kitchen details:", error);
      }
    };
    fetchKitchenMenu();
  }, [isRemoved]);

  const handleEdit = (itemId: string) => {
    console.log("Edit item:", itemId);
  };

  const handleDelete = async (itemId: string) => {
    try {
      const hardcodedKitchenId = "67c1372e962df283dc2b80eb"; // Hardcoded kitchen ID
      const response = await removeKitchenMenus(itemId, hardcodedKitchenId);
      if (response.status) {
        toast.success(response.message);
        setIsRemoved(true);
      }
    } catch (error) {
      console.error("Error fetching kitchen details:", error);
    }
  };

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Kitchens", path: "/apps/kitchen/our-menu" },
          {
            label: "Our Menu",
            path: "/apps/kitchen/OurMenu",
            active: true,
          },
        ]}
        title={"Customers"}
      />

      <div
        className="mb-3"
        style={{ backgroundColor: "#5bd2bc", padding: "10px" }}
      >
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="page-title m-0" style={{ color: "#fff" }}>
            Our Menu
          </h3>

          {/* Add Food Item Button */}
          <Link
            to="/apps/kitchen/67c1372e962df283dc2b80eb/our-menu"
            className="btn btn-light"
          >
            <i className="mdi mdi-plus me-1"></i> Add Food Item
          </Link>
        </div>
      </div>

      <Row>
        {kitchenMenuItems?.map((menu) =>
          menu?.items_id.map((item, index) => (
            <Col
              key={`${menu._id}-${item._id}-${index}`}
              md={6}
              xl={3}
              className="mb-3"
            >
              <Link
                to={`/apps/kitchen/${id}/item-details/${item?.item_id._id}`}
              > 
                <Card className="product-box h-100">
                  <Card.Body className="d-flex flex-column position-relative">
                    <div className="product-action position-absolute top-0 end-0 m-2">
                      <Link
                        to="#"
                        className="btn btn-success btn-xs waves-effect waves-light me-1"
                        onClick={() => handleEdit(item.item_id._id)}
                      >
                        <i className="mdi mdi-pencil"></i>
                      </Link>
                      <Link
                        to="#"
                        className="btn btn-danger btn-xs waves-effect waves-light"
                        onClick={() => handleDelete(item?.item_id._id)}
                      >
                        <i className="mdi mdi-close"></i>
                      </Link>
                    </div>
                    <div className="bg-light mb-3">
                      <img
                        src={item.custom_image || item.item_id.item_image}
                        alt={item.item_id.item_name}
                        className="img-fluid"
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="product-info mt-auto">
                      <div className="row align-items-center">
                        <div className="col">
                          <h5 className="font-16 mt-0 sp-line-1">
                            <Link to="#" className="text-dark">
                              {item.item_id.item_name}
                            </Link>
                          </h5>
                          <div className="text-warning mb-2 font-13">
                            <i className="fa fa-star me-1"></i>
                            <i className="fa fa-star me-1"></i>
                            <i className="fa fa-star me-1"></i>
                            <i className="fa fa-star me-1"></i>
                            <i className="fa fa-star"></i>
                          </div>

                          <div className="d-flex align-items-center mb-1">
                            <i className="mdi mdi-tag-outline me-1"></i>
                            <span className="text-muted">
                              {item?.item_id?.category?.category}
                            </span>
                          </div>
                          <h5 className="m-0">
                            <span className="text-muted">
                              Status:{" "}
                              {item.isAvailable ? "Available" : "Not Available"}
                            </span>
                          </h5>
                        </div>

                        <div className="col-12 mt-2">
                          <p className="text-muted mb-0 font-13 text-truncate">
                            {item.item_id.item_description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))
        )}
      </Row>

      <style>
        {`
          .product-box {
            position: relative;
            transition: all 0.3s ease;
          }
          
          .product-box:hover {
            box-shadow: 0 0 24px 0 rgba(0, 0, 0, 0.1);
          }

          .product-action {
            opacity: 0;
            transition: all 0.3s ease;
          }

          .product-box:hover .product-action {
            opacity: 1;
          }

          .btn-xs {
            padding: 0.2rem 0.6rem;
            font-size: 0.75rem;
          }

          .sp-line-1 {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .text-truncate {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 100%;
          }
        `}
      </style>
    </>
  );
}

export default OurMenu;