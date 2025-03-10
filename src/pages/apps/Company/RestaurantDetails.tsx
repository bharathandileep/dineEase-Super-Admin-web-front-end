import React, { useState } from "react";
import { Row, Col, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Restaurant } from "../Restaurant/data"; // Assuming the data structure is imported from here
import AddRestaurantModal from "../Restaurant/AddRestaurantModal";
import { Details } from "../Restaurant/Staffdata"; // Assuming this is the correct import for Details
import { useNavigate } from "react-router-dom";

interface RestaurantDetailsProps {
  restaurantInfo: Restaurant[];
}


const RestaurantDetails = (props: RestaurantDetailsProps) => {
  const [restaurantInfo, setRestaurantInfo] = useState<Restaurant[]>(props.restaurantInfo);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const onSearchData = (value: string) => {
    if (value === "") {
      setRestaurantInfo(props.restaurantInfo);
    } else {  
      const modifiedRestaurants = props.restaurantInfo.filter(
        (item) =>
          item.name.toLowerCase().includes(value.toLowerCase()) ||
          item.location.toLowerCase().includes(value.toLowerCase())
      );
      setRestaurantInfo(modifiedRestaurants);
    }
  };

  const handleHide = () => setShowAddModal(false);
  const handleShow = () => setShowAddModal(true);

  const handleSubmit = (formData: Details) => {
    setShowAddModal(false);
  };

  const handleViewMoreInfo = (id: number) => {
    navigate(`/restaurant/details/${id}`);
  };


  const onSubmit = (formData: Restaurant) => {
    const newRestaurant: Restaurant = {
      id: restaurantInfo.length + 1,
      name: formData.name,
      location: formData.location,
      logo: formData.logo,
      revenue: formData.revenue,
      description: formData.description,
      noOfEmployees: formData.noOfEmployees,
    };
    setRestaurantInfo([...restaurantInfo, newRestaurant]);
    handleHide();
  };

  return (
    <>
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="me-3">
              <input
                type="search"
                className="form-control"
                placeholder="Search..."
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchData(e.target.value)}
              />
            </div>
            <div>
              <Button variant="success" className="me-1">
                <i className="mdi mdi-cog"></i>
              </Button>
              <Button variant="danger" onClick={handleShow}>
                <i className="mdi mdi-plus-circle me-1"></i> Add New
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {restaurantInfo.map((restaurant) => (
                <tr key={restaurant.id}>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.location}</td>
                  <td>{restaurant.description}</td>
                  <td>
                  <Link to="/apps/restaurants/details" >View more info</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Add Restaurant Modal */}
      {/* <AddRestaurantModal show={showAddModal} onHide={handleHide} onSubmit={onSubmit} /> */}
    </>
  );
};

export default RestaurantDetails;
