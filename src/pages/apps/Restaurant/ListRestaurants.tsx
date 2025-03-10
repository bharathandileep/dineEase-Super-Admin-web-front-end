import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, ToastContainer, Toast, Modal, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import AddRestaurantModal from "./AddRestaurantModal";
import UpdateRestaurantModal from "./UpdateRestaurantModal";
import { deleteRestaurantApi, fetchrestaurantApi, Kitchen } from "../../../server/allApi";

const RestaurantDetails: React.FC = () => {
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [currentKitchen, setCurrentKitchen] = useState<Kitchen | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
 
  const itemsPerPage = 6;

  useEffect(() => {
    const loadKitchens = async () => {
      setLoading(true);
      try {
        const response = await fetchrestaurantApi(currentPage, itemsPerPage);
        setKitchens(response.data);
        setTotalPages(response.pagination.totalPages);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadKitchens();
  }, [currentPage]);

  const onCloseAddModal = () => setShowAddModal(false);
  const onOpenAddModal = () => setShowAddModal(true);

  const onAddKitchen = (newKitchen: Kitchen) => {
    setKitchens((prevKitchens) => [...prevKitchens, newKitchen]);
    setToastMessage(`${newKitchen.f_name??'Unknown Company'}  added successfully`);
    setShowToast(true);
    onCloseAddModal();
  };

  const onCloseUpdateModal = () => setShowUpdateModal(false);
  const onOpenUpdateModal = (kitchen: Kitchen) => {
    setCurrentKitchen(kitchen);
    setShowUpdateModal(true);
  };

  const handleDelete = (id: string) => {
    setShowConfirmDelete(id);
  };

  const confirmDelete = async () => {
    if (showConfirmDelete) {
      setDeleteLoading(true);
         // Simulate a delay before deleting
         setTimeout(async () =>  {
        try {
        await deleteRestaurantApi(showConfirmDelete);
        setKitchens(kitchens.filter(kitchens => kitchens._id !== showConfirmDelete));
        const kitchenToDelete = kitchens.find(kitchens => kitchens._id === showConfirmDelete);
          const kitchenName = `${kitchenToDelete?.f_name}`;
      
          setToastMessage(`${kitchenName} deleted successfully`);
          setShowToast(true);
        // const response = await fetchrestaurantApi(currentPage, itemsPerPage);
        // setKitchens(response.data);
        // setTotalPages(response.pagination.totalPages);
        // setToastMessage("Kitchen deleted successfully");
        // setShowToast(true);
      } catch (error) {
        setToastMessage("Error deleting kitchen");
        setToastMessage("Error deleting company");
        setShowToast(true);
      } finally {
        setDeleteLoading(false);
        setShowConfirmDelete(null);
      }
    },2000);
  }
  };

  const cancelDelete = () => setShowConfirmDelete(null);

  const handleUpdate = (updatedKitchen: Kitchen) => {
    setKitchens(prevKitchens =>
      prevKitchens.map(kitchen => (kitchen._id === updatedKitchen._id ? updatedKitchen : kitchen))
    );
    setToastMessage("Kitchen updated successfully");
    setShowToast(true);
    onCloseUpdateModal();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Row className="justify-content-between">
                <Col md={8}>
                  <form className="d-flex flex-wrap align-items-center">
                    <label htmlFor="inputSearch" className="visually-hidden">Search</label>
                    <div className="me-3">
                      <input
                        type="search"
                        className="form-control my-1 my-lg-0"
                        id="inputSearch"
                        placeholder="Search..."
                        // onChange={(e) => onSearchData(e.target.value)}
                      />
                    </div>
                    <label htmlFor="status-select" className="me-2">Sort By</label>
                    <div className="me-sm-3">
                      <select className="form-select my-1 my-lg-0">
                        <option defaultValue="Select">Select</option>
                        <option value="Date">Date</option>
                        <option value="Name">Name</option>
                        <option value="Revenue">Revenue</option>
                        <option value="Employees">Employees</option>
                      </select>
                    </div>
                  </form>
                </Col>
                <Col md={4}>
                  <div className="text-md-end mt-3 mt-md-0">
                    <Button
                      variant="success"
                      className="waves-effect waves-light me-1"
                      onClick={() => console.log("Settings clicked")}
                    >
                      <i className="mdi mdi-cog"></i>
                    </Button>
                    <Button
                      variant="danger"
                      className="waves-effect waves-light"
                      onClick={onOpenAddModal}
                    >
                      <i className="mdi mdi-plus-circle me-1"></i> Add New
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {kitchens.map(kitchen => (
          <Col key={kitchen._id} lg={4}>
            <Card className="bg-pattern">
              <Card.Body>
                <div className="product-action">
                  <Button
                    className="btn btn-success btn-xs waves-effect waves-light me-1"
                    onClick={() => onOpenUpdateModal(kitchen)}
                  >
                    <i className="mdi mdi-pencil"></i>
                  </Button>
                  <Button
                    className="btn btn-danger btn-xs waves-effect waves-light"
                    onClick={() => handleDelete(kitchen._id)}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? <Spinner as="span" animation="border" size="sm" /> : "×"}
                  </Button>
                </div>
                <div className="text-center">
                  <img
                    src={kitchen.image_url || ""} // Replace with your image property
                    alt={kitchen._id}
                    className="avatar-xl rounded-circle mb-3"
                  />
                  <h4 className="mb-1 font-20">{kitchen.f_name}</h4>
                  <p className="text-muted font-14">{kitchen.username}</p>
                </div>
                <p className="font-14 text-center text-muted">{kitchen.description}</p>
                <div className="text-center">
                  <Link to="/apps/restaurants/lists" className="btn btn-sm btn-light">
                    View more info
                  </Link>
                </div>
                <div className="row mt-4 text-center">
                  <div className="col-6">
                    <h5 className="fw-normal text-muted">Phone Number</h5>
                    <h4>{kitchen.phone_no}</h4>
                  </div>
                  <div className="col-6">
                    <h5 className="fw-normal text-muted">Number of Employees</h5>
                    <h4>{kitchen.employees}</h4>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        <Col>
          <div className="text-end">
            <ul className="pagination pagination-rounded justify-content-end">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <Link className="page-link" to="#" aria-label="Previous" onClick={() => handlePageChange(currentPage - 1)}>
                  <span aria-hidden="true">«</span>
                  <span className="visually-hidden">Previous</span>
                </Link>
              </li>
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
                  <Link className="page-link" to="#" onClick={() => handlePageChange(index + 1)}>
                    {index + 1}
                  </Link>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <Link className="page-link" to="#" aria-label="Next" onClick={() => handlePageChange(currentPage + 1)}>
                  <span aria-hidden="true">»</span>
                  <span className="visually-hidden">Next</span>
                </Link>
              </li>
            </ul>
          </div>
        </Col>
      </Row>

      <AddRestaurantModal show={showAddModal} onHide={onCloseAddModal} onAddMember={onAddKitchen} />
      {currentKitchen && (
        <UpdateRestaurantModal
          show={showUpdateModal}
          onHide={onCloseUpdateModal}
          kitchen={currentKitchen}
          onUpdateKitchen={handleUpdate}
        />
      )}
      
      <Modal show={!!showConfirmDelete} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this kitchen?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete} >Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}disabled={deleteLoading}>       
                 {deleteLoading ? <Spinner as="span" animation="border" size="sm" /> : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
        }}
      >
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          style={{
            backgroundColor: "#28a745",
            color: "#fff",
          }}
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default RestaurantDetails;