import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  Button,
  Badge,
  Card,
  Row,
  Col,
  Image,
  Container,
} from "react-bootstrap";
import { ArrowLeft, Clock, Star, Users } from "lucide-react";
import { menuItems, Review, reviews } from "../../../helpers/api/data";
import PageTitle from "../../../components/PageTitle";

const MenuItemDetails = () => {
  const { id } = useParams<{ id: string }>();
  const item = menuItems.find((item: any) => item.id === parseInt(id || "0"));
  const itemReviews = reviews.filter(
    (review: any) => review.menuItemId === parseInt(id || "0")
  );

  if (!item) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h2 className="h4 fw-bold text-dark mb-3">Menu Item Not Found</h2>
          <Link to="/">
            <Button variant="primary">Back to Menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  const defaultImage =
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop";

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      Veg: "bg-success text-white",
      "Non-Veg": "bg-danger text-white",
      Spicy: "bg-warning text-dark",
      "Gluten-Free": "bg-primary text-white",
      "Dairy-Free": "bg-purple text-white",
      Signature: "bg-warning text-dark",
    };
    return colors[tag] || "bg-secondary text-white";
  };

  const calculateAverageRating = (reviews: Review[]) => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const averageRating = calculateAverageRating(itemReviews);

  return (
    <div className="min-vh-100 bg-light">
      <PageTitle
        breadCrumbItems={[
          { label: "Kitchen", path: "/apps/kitchen/list" },
          {
            label: "List",
            path: "/apps/kitchen/list",
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
            Kitchens
          </h3>
        </div>
      </div>

      <Container fluid >
        <Row className="g-4">
          <Col lg={12} className="px-1"> 
            <Card className="d-flex flex-column flex-md-row align-items-stretch">
              <div className="flex-shrink-0">
                <Image
                  src={item.image || defaultImage}
                  alt={item.name}
                  fluid
                  className="rounded w-100 w-md-auto"
                  style={{
                    height: "250px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              <Card.Body className="p-2 ps-md-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <Card.Title as="h2" className="h3 mt-0 fw-bold text-dark">
                      {item.name}
                    </Card.Title>
                    <p className="h4 fw-bold text-success">₹{item.price}</p>
                  </div>
                  <Badge
                    bg={item.available ? "success" : "danger"}
                    className="fs-6 px-3 py-2"
                  >
                    {item.available ? "Available" : "Unavailable"}
                  </Badge>
                </div>
                {itemReviews.length > 0 && (
                  <div className="d-flex align-items-center mb-2">
                    <div className="d-flex align-items-center me-3">
                      <Star size={20} className="text-warning fill-warning" />
                      <span className="fs-5 fw-semibold ms-1">
                        {averageRating}
                      </span>
                    </div>
                    <div className="d-flex align-items-center text-muted">
                      <Users size={16} className="me-1" />
                      <span>{itemReviews.length} reviews</span>
                    </div>
                  </div>
                )}
                {item.mealPeriods && item.mealPeriods.length > 0 && (
                  <div className="mb-2">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <Clock size={16} className="text-muted" />
                      <p className="fw-medium text-dark mb-0">Served during:</p>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {item.mealPeriods.map((period: any) => (
                        <Badge bg="primary" key={period}>
                          {period}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {item.tags.length > 0 && (
                  <div className="">
                    <p className="fw-medium text-dark mb-1">Tags:</p>
                    <div className="d-flex flex-wrap gap-2">
                      {item.tags.map((tag: any) => (
                        <Badge key={tag} className={getTagColor(tag)}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col lg={12} className="m-0 px-1">
            <Card>
               <Card.Header className="py-1">
                <h3 className="h5 fw-semibold">Ingredients</h3>
              </Card.Header>
              <Card.Body className="py-0">
                <div className="d-flex flex-wrap gap-2">
                  {item.ingredients.map((ingredient: any, index: any) => (
                    <Badge bg="secondary" key={index}>
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </Card.Body>
              <Card.Header className="py-1">
                <h3 className="h5 fw-semibold">Description</h3>
              </Card.Header>
              <Card.Body className="py-0">
                <p className="text-dark">{item.description}</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header>
                <h3 className="h5 fw-semibold">Customer Reviews</h3>
              </Card.Header>
              <Card.Body className="py-0">
                {itemReviews.length === 0 ? (
                  <p className="text-muted text-center py-4">No reviews yet</p>
                ) : (
                  <div>
                    {itemReviews.map((review: any) => (
                      <div
                        key={review.id}
                        className="border-bottom pb-3 mb-3 last:border-bottom-0 last:mb-0"
                      >
                        <div className="d-flex align-items-start gap-3">
                          <Image
                            src={review.userProfile}
                            alt={review.userName}
                            roundedCircle
                            style={{ width: "40px", height: "40px" }}
                            className="bg-secondary text-white d-flex align-items-center justify-content-center"
                          />
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-center">
                              <h4 className="fw-medium text-dark">
                                {review.userName}
                              </h4>
                              <span className="text-muted small">
                                {formatDate(review.timestamp)}
                              </span>
                            </div>
                            <div className="d-flex align-items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={`${
                                    i < review.rating
                                      ? "text-warning fill-warning"
                                      : "text-muted"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-dark mt-2">{review.review}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MenuItemDetails;
