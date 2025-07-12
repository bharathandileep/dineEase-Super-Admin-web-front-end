import React from "react";
import { MenuItemCard } from "../../../components/menu/MenuItemCard";
import { Button, Container } from "react-bootstrap";
import PageTitle from "../../../components/PageTitle";

function RequestedMenus() {
  const item = {
    id: 1,
    name: "Chicken Tikka Masala",
    category: "Main Course",
    price: 350,
    description:
      "Tender chicken pieces in rich, creamy tomato-based sauce with aromatic spices that will tantalize your taste buds and leave you craving for more. A perfect blend of Indian spices.",
    ingredients: [
      "Chicken",
      "Tomatoes",
      "Cream",
      "Onions",
      "Garam Masala",
      "Ginger-Garlic",
    ],
    tags: ["Non-Veg", "Spicy", "Signature"],
    available: true,
    masterFoodId: 1,
    mealPeriods: ["Lunch", "Dinner"],
  };

  return (
    <div className="min-vh-100 bg-light">
      <PageTitle
        breadCrumbItems={[
          { label: "Kitchens", path: "/apps/kitchen/requested-menus" },
          {
            label: "Our Menu",
            path: "/apps/kitchen/requested-menus",
            active: true,
          },
        ]}
        title={"Customers"}
      />

      <div
        className="mb-3"
        style={{ backgroundColor: "#5bd2bc", padding: "10px" }}
      >
        <div className="d-flex  align-items-center justify-content-between">
          <h3 className="page-title m-0" style={{ color: "#fff" }}>
            Requested Menu
          </h3>
        </div>
      </div>
      <Container fluid className="p-0">
        <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3 g-3">
          <div className="col">
            <MenuItemCard item={item} />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default RequestedMenus;
