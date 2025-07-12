import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { Edit, Clock, Eye } from "lucide-react";

import { Link } from "react-router-dom";
import { MenuItem } from "../../types/menu";

interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const getTagVariant = (tag: string) => {
    const variants: Record<string, string> = {
      Veg: "success",
      "Non-Veg": "danger",
      Spicy: "warning",
      "Gluten-Free": "info",
      "Dairy-Free": "primary",
      Signature: "warning",
    };
    return variants[tag] || "secondary";
  };

  const defaultImage =
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop";

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card className="hover-shadow h-100">
      <Card.Img
        variant="top"
        src={item.image || defaultImage}
        alt={item.name}
        style={{ height: "192px", objectFit: "cover" }}
      />

      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="flex-grow-1">
            <Card.Title className="mb-1">{item.name}</Card.Title>
          </div>
          <div className="d-flex gap-2 ">
            <Link to={`/apps/kitchen/item-details/${item.id}`}>
              <Button variant="outline-secondary" size="sm">
                <Eye size={16} />
              </Button>
            </Link>
            <Button variant="outline-secondary" size="sm">
              <Edit size={16} />
            </Button>
          </div>
        </div>
        <Card.Text className=" d-flex w-100 justify-content-between text-success fs-4 fw-bold">
          ₹{item.price}
          <Badge
            bg={item.available ? "success" : "danger"}
            className=" px-1 py-10 align-items-center d-flex"
          >
            {item.available ? "Available" : "Unavailable"}
          </Badge>
        </Card.Text>
        <Card.Text className="text-muted small m-0 p-0">
          {truncateDescription(item.description)}
        </Card.Text>

        <div className="my-1 py-0">
          {item.mealPeriods && item.mealPeriods.length > 0 && (
            <div className="mb-2">
              <div className="d-flex align-items-center gap-1 mb-1">
                <Clock size={12} className="text-muted" />
                <small className="fw-medium text-muted">Served during:</small>
              </div>
              <div className="d-flex flex-wrap gap-1">
                {item.mealPeriods.map((period: any) => (
                  <Badge
                    key={period}
                    bg="info"
                    className="text-white"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {period}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {item.tags.length > 0 && (
            <div className="mb-2">
              <small className="fw-medium text-muted d-block mb-1">Tags:</small>
              <div className="d-flex flex-wrap gap-1">
                {item.tags.map((tag: any) => (
                  <Badge
                    key={tag}
                    bg={getTagVariant(tag)}
                    style={{ fontSize: "0.75rem" }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {item.masterFoodId && (
            <div>
              <small className="fw-medium text-muted">
                Linked to master catalog:{" "}
                <span className="text-primary">#{item.masterFoodId}</span>
              </small>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};
