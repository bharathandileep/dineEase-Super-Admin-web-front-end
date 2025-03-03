// import React, { useEffect, useState } from "react";
// import { Row, Col, Card } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import PageTitle from "../../../components/PageTitle";
// import { useParams } from "react-router-dom";
// import {
//   getKitchenMenus,
//   removeKitchenMenus,
// } from "../../../server/admin/kitchensMenuCreation";
// import { toast } from "react-toastify";

// // TypeScript interfaces
// interface MenuItem {
//   _id: string;
//   item_name: string;
//   category: {
//     _id: string;
//     category: string;
//   };
//   subcategory: {
//     _id: string;
//   };
//   status: boolean;
//   item_image: string;
//   item_description: string;
// }

// interface MenuItemEntry {
//   item_id: MenuItem;
//   isAvailable: boolean;
//   custom_image: string;
//   reviews_id: any[];
//   _id: string;
// }

// interface Menu {
//   _id: string;
//   kitchen_id: {
//     _id: string;
//   };
//   items_id: MenuItemEntry[];
//   is_deleted: boolean;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// function OurMenu() {
//   const { id } = useParams();
//   const [kitchenMenuItems, setKitchenMenuItems] = useState<Menu[]>([]);
//   const [isRemoved, setIsRemoved] = useState(false);

//   useEffect(() => {
//     const fetchKitchenMenu = async () => {
//       try {
//         const response = await getKitchenMenus(id);
//         setKitchenMenuItems(response.data);
//       } catch (error) {
//         console.error("Error fetching kitchen details:", error);
//       }
//     };
//     fetchKitchenMenu();
//   }, [id, isRemoved]);

//   const handleEdit = (itemId: string) => {
//     console.log("Edit item:", itemId);
//   };

//   const handleDelete = async (itemId: string) => {
//     try {
//       const response = await removeKitchenMenus(itemId, id);
//       if (response.status) {
//         toast.success(response.message);
//         setIsRemoved(true);
//       }
//     } catch (error) {
//       console.error("Error fetching kitchen details:", error);
//     }
//   };

//   return (
//     <>
//       <PageTitle
//         breadCrumbItems={[
//           { label: "Kitchens", path: "/apps/kitchen/our-menu" },
//           {
//             label: "Our Menu",
//             path: "/apps/kitchen/OurMenu",
//             active: true,
//           },
//         ]}
//         title={"Customers"}
//       />

//       <div
//         className="mb-3"
//         style={{ backgroundColor: "#5bd2bc", padding: "10px" }}
//       >
//         <div className="d-flex align-items-center justify-content-between">
//           <h3 className="page-title m-0" style={{ color: "#fff" }}>
//             Our Menu
//           </h3>
//         </div>
//       </div>

//       <Row>
//         {kitchenMenuItems?.map((menu) =>
//           menu.items_id.map((item, index) => (
//             <Col
//               key={`${menu._id}-${item._id}-${index}`}
//               md={6}
//               xl={3}
//               className="mb-3"
//             >
//               <Link
//                 to={`/apps/kitchen/${id}/item-details/${item?.item_id._id}`}
//               > 
//                 <Card className="product-box h-100">
//                   <Card.Body className="d-flex flex-column position-relative">
//                     <div className="product-action position-absolute top-0 end-0 m-2">
//                       <Link
//                         to="#"
//                         className="btn btn-success btn-xs waves-effect waves-light me-1"
//                         onClick={() => handleEdit(item.item_id._id)}
//                       >
//                         <i className="mdi mdi-pencil"></i>
//                       </Link>
//                       <Link
//                         to="#"
//                         className="btn btn-danger btn-xs waves-effect waves-light"
//                         onClick={() => handleDelete(item?.item_id._id)}
//                       >
//                         <i className="mdi mdi-close"></i>
//                       </Link>
//                     </div>
//                     <div className="bg-light mb-3">
//                       <img
//                         src={item.custom_image || item.item_id.item_image}
//                         alt={item.item_id.item_name}
//                         className="img-fluid"
//                         style={{
//                           width: "100%",
//                           height: "200px",
//                           objectFit: "cover",
//                         }}
//                       />
//                     </div>

//                     {/* Product Info */}
//                     <div className="product-info mt-auto">
//                       <div className="row align-items-center">
//                         <div className="col">
//                           <h5 className="font-16 mt-0 sp-line-1">
//                             <Link to="#" className="text-dark">
//                               {item.item_id.item_name}
//                             </Link>
//                           </h5>
//                           <div className="text-warning mb-2 font-13">
//                             <i className="fa fa-star me-1"></i>
//                             <i className="fa fa-star me-1"></i>
//                             <i className="fa fa-star me-1"></i>
//                             <i className="fa fa-star me-1"></i>
//                             <i className="fa fa-star"></i>
//                           </div>

//                           <div className="d-flex align-items-center mb-1">
//                             <i className="mdi mdi-tag-outline me-1"></i>
//                             <span className="text-muted">
//                               {item.item_id.category.category}
//                             </span>
//                           </div>
//                           <h5 className="m-0">
//                             <span className="text-muted">
//                               Status:{" "}
//                               {item.isAvailable ? "Available" : "Not Available"}
//                             </span>
//                           </h5>
//                         </div>

//                         <div className="col-12 mt-2">
//                           <p className="text-muted mb-0 font-13 text-truncate">
//                             {item.item_id.item_description}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </Card.Body>
//                 </Card>
//               </Link>
//             </Col>
//           ))
//         )}
//       </Row>

//       <style>
//         {`
//           .product-box {
//             position: relative;
//             transition: all 0.3s ease;
//           }
          
//           .product-box:hover {
//             box-shadow: 0 0 24px 0 rgba(0, 0, 0, 0.1);
//           }

//           .product-action {
//             opacity: 0;
//             transition: all 0.3s ease;
//           }

//           .product-box:hover .product-action {
//             opacity: 1;
//           }

//           .btn-xs {
//             padding: 0.2rem 0.6rem;
//             font-size: 0.75rem;
//           }

//           .sp-line-1 {
//             overflow: hidden;
//             text-overflow: ellipsis;
//             white-space: nowrap;
//           }

//           .text-truncate {
//             overflow: hidden;
//             text-overflow: ellipsis;
//             white-space: nowrap;
//             max-width: 100%;
//           }
//         `}
//       </style>
//     </>
//   );
// }

// export default OurMenu;
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