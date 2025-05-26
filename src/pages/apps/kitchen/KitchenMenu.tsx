import React, { useEffect, useState } from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";
import { useParams } from "react-router-dom";
import {
  getKitchenMenus,
  removeKitchenMenus,
} from "../../../server/admin/kitchensMenuCreation";
import { toast } from "react-toastify";
import { useAuthDetails } from "../../../hooks/useAuthDetails";

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
  const { context } = useAuthDetails();
  const [kitchenMenuItems, setKitchenMenuItems] = useState<Menu[]>([]);
  const [isRemoved, setIsRemoved] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    const fetchKitchenMenu = async () => {
      try {
        const kitchenId = (context?.contextId ?? "").toString();
        const response = await getKitchenMenus(kitchenId);
        setKitchenMenuItems(response.data);
        setLoader(false);
      } catch (error: any) {
        setLoader(false);
        console.error("Error fetching kitchen details:", error);
      } finally {
        setLoader(false);
      }
    };
    fetchKitchenMenu();
  }, [isRemoved]);

  const handleEdit = (itemId: string) => {};

  const handleDelete = async (itemId: string) => {
    try {
      const kitchenId = (context?.contextId ?? "").toString();
      const response = await removeKitchenMenus(itemId, kitchenId);
      if (response.status) {
        toast.success(response.message);
        setIsRemoved(true);
      }
    } catch (error: any) {
      console.error("Error fetching kitchen details:", error);
    }
  };

  if (loader) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading kitchens...</p>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
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
          <Link
            to={`/apps/kitchen/${context?.contextId}/our-menu`}
            className="btn btn-danger"
          >
            <i className="mdi mdi-plus me-1"></i> Add Food Item
          </Link>
        </div>
      </div>
      <Row>
        {kitchenMenuItems && kitchenMenuItems.length > 0 ? (
          kitchenMenuItems.map((menu) =>
            menu?.items_id.map((item, index) => (
              <Col
                key={`${menu._id}-${item._id}-${index}`}
                md={6}
                xl={3}
                className="mb-4"
              >
                <Link
                  to={`/apps/kitchen/${context?.contextId}/item-details/${item?.item_id._id}`}
                  className="text-decoration-none"
                >
                  <Card className="h-100 shadow-sm">
                    <div className="position-relative">
                      <img
                        src={item.custom_image || item.item_id.item_image}
                        alt={item.item_id.item_name}
                        className="card-img-top"
                        style={{
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="position-absolute top-0 end-0 m-2">
                        <div className="d-flex gap-1">
                          <Link
                            to="#"
                            className="btn btn-success btn-sm rounded-circle p-2"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleEdit(item.item_id._id);
                            }}
                            style={{ width: "32px", height: "32px" }}
                          >
                            <i className="mdi mdi-pencil"></i>
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-danger btn-sm rounded-circle p-2"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDelete(item?.item_id._id);
                            }}
                            style={{ width: "32px", height: "32px" }}
                          >
                            <i className="mdi mdi-close"></i>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <Card.Body className="d-flex flex-column">
                      <div className="text-center mb-3">
                        <h5 className="card-title mb-2 text-dark">
                          {item.item_id.item_name}
                        </h5>

                        <div className="text-warning mb-2">
                          <i className="fa fa-star"></i>
                          <i className="fa fa-star"></i>
                          <i className="fa fa-star"></i>
                          <i className="fa fa-star"></i>
                          <i className="fa fa-star"></i>
                        </div>

                        <div className="d-flex align-items-center justify-content-center mb-2">
                          <i className="mdi mdi-tag-outline me-1 text-muted"></i>
                          <span className="text-muted small">
                            {item?.item_id?.category?.category}
                          </span>
                        </div>
                      </div>

                      <p className="text-muted small text-center mb-3 flex-grow-1">
                        {item.item_id.item_description}
                      </p>

                      <div className="mt-auto">
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="fw-bold">Status:</span>
                          <div className="d-flex gap-1">
                            {item.isAvailable ? (
                              <span className="badge bg-success">
                                <i className="mdi mdi-check me-1"></i>
                                Available
                              </span>
                            ) : (
                              <span className="badge bg-danger">
                                <i className="mdi mdi-close me-1"></i>
                                Not Available
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))
          )
        ) : (
          <Col className="text-center mt-5">
            <h4>No menu items are selected.</h4>
          </Col>
        )}
      </Row>
    </div>
  );
}

export default OurMenu;
