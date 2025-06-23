import React, { useEffect, useState } from "react";
import { Row, Col, Card, Spinner, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";
import { useParams } from "react-router-dom";
import {
  getKitchenMenus,
  removeKitchenMenus,
} from "../../../server/admin/kitchensMenuCreation";
import { toast } from "react-toastify";
import { useAuthDetails } from "../../../hooks/useAuthDetails";
import { Pencil, Trash } from "lucide-react";

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
  const navigate = useNavigate();

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
                className="mb-3"
              >
                <Card
                  className="product-box h-100"
                  style={{
                    transition: "all 0.3s ease-in-out",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    navigate(
                      `/apps/kitchen/${context?.contextId}/item-details/${item?.item_id._id}`
                    )
                  }
                >
                  <Card.Body className="d-flex flex-column h-100">
                    <div className="product-action">
                      <Button
                        variant="success"
                        size="sm"
                        className="me-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(item.item_id._id);
                        }}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item?.item_id._id);
                        }}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                    <div className="bg-light mb-3 d-flex justify-content-center">
                      <img
                        src={item.custom_image || item.item_id.item_image}
                        alt={item.item_id.item_name}
                        className="img-fluid"
                        style={{
                          width: "100%",
                          height: "180px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div className="d-flex flex-column flex-grow-1">
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

                      <h5 className="m-0">
                        <span className="text-muted">
                          Category: {item?.item_id?.category?.category}
                        </span>
                      </h5>
                      <h5 className="m-0">
                        <span className="text-muted">
                          Status:{" "}
                          {item.isAvailable ? "Available" : "Not Available"}
                        </span>
                      </h5>

                      <div className="mt-auto">
                        <p
                          className="text-muted mb-0 small lh-sm overflow-hidden"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                          title={item.item_id.item_description}
                        >
                          {item.item_id.item_description}
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )
        ) : (
          <Col>
            <Card>
              <Card.Body className="text-center">
                <i
                  className="mdi mdi-food-off text-muted"
                  style={{ fontSize: "48px" }}
                ></i>
                <h4 className="mt-3">No Menu Items Found</h4>
                <p className="text-muted">No menu items are selected.</p>
                <Button
                  variant="primary"
                  onClick={() => navigate("/apps/kitchen/menu/new")}
                >
                  Add New Menu Item
                </Button>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </>
  );
}

export default OurMenu;
