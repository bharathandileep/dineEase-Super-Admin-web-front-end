import React, { useState, useEffect } from 'react';
import { Button, Table as BootstrapTable, Pagination, Modal } from 'react-bootstrap';
import { Order, OrderResponse, getOrders, addOrder, updateOrder, deleteOrder } from '../../../server/allApi'; // Adjust the import path as needed
// import AddOrderModal from './addOrder'; // Adjust the import path as needed
// import UpdateOrderModal from './updateOrder'; // Adjust the import path as needed
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";
import LoaderModal from '../../../server/LoaderModal'; // Adjust the path as needed
import AddOrderModal from './AddOrderModule';
import UpdateOrderModal from './UpdateOrderModal';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState<number>(1);

  const [showLoader, setShowLoader] = useState(false);

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  // const paginationItems = [];
  // for (let i = 1; i <= totalPages; i++) {
  //   paginationItems.push(
  //     <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
  //       {i}
  //     </Pagination.Item>
  //   );
  // }

  // Generate pagination items
  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => handlePageClick(i)}
        className="rounded-circle"
      >
        {i}
      </Pagination.Item>
    );
  }
  // Pagination states
  // const [ordersPerPage] = useState(4); // Number of orders per page

  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);
  const onCloseAddModal = () => setShowAddModal(false);
  const onOpenAddModal = () => setShowAddModal(true);

  const onCloseEditModal = () => {
    setShowEditModal(false);
    setCurrentOrder(null); // Reset currentOrder when closing the modal
  };



  const [ordersPerPage] = useState(3); 
  const fetchOrders = async (page: number, limit: number) => {
    try {
      const response = await getOrders(page, limit);

  
      if (response && response.data && response.pagination) {
        const { data, pagination } = response;
        setOrders(data || []);
        setTotalPages(pagination.totalPages || 0);
      } else {
        console.error('Unexpected API Response Structure:', response);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  
  useEffect(() => {
    fetchOrders(currentPage, ordersPerPage);
  }, [currentPage, ordersPerPage]);  

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder,indexOfLastOrder);


  // useEffect(() => {
  //   fetchOrders();
  // }, []);


  // const fetchOrders = async () => {
  //   try {
  //     const response: OrderResponse = await getOrders();
  //     setOrders(response.data);
  //     setFilteredOrders(response.data || []); // Initialize filteredOrders with all data
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       console.error('Error fetching orders:', error.message);
  //       setError(error.message);
  //     } else {
  //       console.error('Unknown error fetching orders:', error);
  //       setError('An unknown error occurred. Please try again.');
  //     }
  //   }
  // };

  const handleAddOrder = async (newOrder: Omit<Order, '_id'>) => {
    try {
      await addOrder(newOrder);
      fetchOrders(currentPage, ordersPerPage);

      setShowAddModal(false);
      toast.success('Order added successfully');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error adding order', error.message);
        toast.error('Error adding order');
        setError(error.message);
      } else {
        console.error('Unknown error adding order:', error);
        toast.error('An unknown error occurred. Please try again.');
        setError('An unknown error occurred. Please try again.');
      }
    }
  };

  const handleUpdateOrder = async (id: string, updatedOrder: Partial<Order>) => {
    try {
      await updateOrder(id, updatedOrder);
      // fetchOrders();
      fetchOrders(currentPage, ordersPerPage);

      setShowEditModal(false);
      setCurrentOrder(null);
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Error updating order');
        console.error('Error updating order:', error.message);
        setError(error.message);
      } else {
        toast.error('Unknown error updating order');
        console.error('Unknown error updating order:', error);
        setError('An unknown error occurred. Please try again.');
      }
    }
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    try {
      await deleteOrder(orderToDelete._id);
      // fetchOrders();
      fetchOrders(currentPage, ordersPerPage);

      toast.success(` deleted successfully`);
      setShowConfirmDelete(false);
      setOrderToDelete(null);
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Error deleting order');
        console.error('Error deleting order:', error.message);
        setError(error.message);
      } else {
        toast.error('Unknown error deleting order');
        console.error('Unknown error deleting order:', error);
        setError('An unknown error occurred. Please try again.');
      }
    }
  };

  const onHandleAddSubmit = async (data: Omit<Order, '_id'>) => {
    setShowLoader(true); // Show loader modal

    try {
      await addOrder(data);
      // fetchOrders();
      fetchOrders(currentPage, ordersPerPage);

      onCloseAddModal();
      setError(null);
      toast.success('Order added successfully');
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Error adding order');
        console.error('Error adding order:', error.message);
        setError(error.message);
      } else {
        console.error('Unknown error adding order:', error);
        setError('An unknown error occurred. Please try again.');
        toast.error('An unknown error occurred. Please try again.');
      }
      
    }
    finally {
      // Hide the loader modal after 10 seconds
      setTimeout(() => {
        setShowLoader(false);
      }, 1000);
    }
  };


  const confirmEdit = () => {
    if (orderToEdit) {
      setCurrentOrder(orderToEdit);
      setShowEditModal(true);
    }
    setShowConfirmEdit(false)

  }


  // // Pagination logic
  // const indexOfLastOrder = currentPage * ordersPerPage;
  // const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  // const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  // const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };


  return (

    <div className="container mt-4">
          <LoaderModal show={showLoader} />

      {/* Add Order Button */}
      {/* <div className="text-end mb-3">
        <Button onClick={() => setShowAddModal(true)}>Add New Order</Button>
      </div> */}

      {error && <div className="alert alert-danger">{error}</div>}

      <BootstrapTable striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Quantity</th>
            <th>Order Date</th>
            <th>Status</th>
            <th>Supply Date Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.order_id}</td>
              <td>{order.quantity}</td>
              <td>{new Date(order.order_date).toLocaleDateString()}</td>
              <td>{order.order_status}</td>
              <td>{new Date(order.supply_date_time).toLocaleDateString()}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => {
                    setOrderToEdit(order);
                    setShowConfirmEdit(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setOrderToDelete(order);
                    setShowConfirmDelete(true);
                  }}
                  className="ms-2"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </BootstrapTable>

      {/* Pagination */}
      
      {/* <div className="d-flex justify-content-end mt-3">
        <div className="pagination pagination-rounded-end mb-0">
          <Pagination>{paginationItems}</Pagination>
        </div>
      </div>
       */}
      {/* <Row>
        <Col>
          <ul className="pagination pagination-rounded justify-content-end mb-3">
            

           
            <div className="d-flex justify-content-end mt-3">
        <div className="pagination pagination-rounded-end mb-0">
        <li className="page-item">
              <Link className="page-link" to="#" aria-label="Previous">
                <span aria-hidden="true">«</span>
                <span className="visually-hidden">Previous</span>
              </Link>

            </li>
          <Pagination>{paginationItems}</Pagination>

          <li className="page-item">
              <Link className="page-link" to="#" aria-label="Next">
                <span aria-hidden="true">»</span>
                <span className="visually-hidden">Next</span>
              </Link>
            </li>
        </div>
      </div>
      

         
           
          </ul>
        </Col>
      </Row> */}

      {/* pagination */}
 <Row>
      <Col>
        <ul className="pagination pagination-rounded justify-content-end mb-3">
          <div className="d-flex justify-content-end mt-3">
            <div className="pagination pagination-rounded-end mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={handlePreviousClick} aria-label="Previous">
                  <span aria-hidden="true">«</span>
                  <span className="visually-hidden">Previous</span>
                </button>
              </li>

              <Pagination>{paginationItems}</Pagination>

              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={handleNextClick} aria-label="Next">
                  <span aria-hidden="true">»</span>
                  <span className="visually-hidden">Next</span>
                </button>
              </li>
            </div>
          </div>
        </ul>
      </Col>
    </Row>

      {/* Add Order Modal */}
       <AddOrderModal
        show={showAddModal}
        onHide={onCloseAddModal}
        onSubmit={onHandleAddSubmit}
      /> 

      {/* Edit Order Modal */}
       {currentOrder && (
        <UpdateOrderModal
          show={showEditModal}
          onHide={onCloseEditModal}
          order={currentOrder}
          onSubmit={async (updatedOrder: Order) => {

            try {
              setShowLoader(true); // Show loader modal

              await updateOrder(updatedOrder._id, updatedOrder);
              // fetchOrders();
              fetchOrders(currentPage, ordersPerPage);

              onCloseEditModal();
              setError(null);
              toast.success('Order updated successfully');
            } catch (error) {
              if (error instanceof Error) {
                toast.error('Error updating order');
                console.error('Error updating order:', error.message);
                setError(error.message);
              } else {
                toast.error('Unknown error updating order');
                console.error('Unknown error updating order:', error);
                setError('An unknown error occurred. Please try again.');
              }
            }
            finally {
             setTimeout(() => {
                setShowLoader(false);
              }, 1000);
            }
          }
        }
        />
      )}
 
      {/* Confirm Delete Modal */}
      <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this order?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteOrder}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Edit Modal */}
      <Modal show={showConfirmEdit} onHide={() => setShowConfirmEdit(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to edit this order?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmEdit(false)}>
            Cancel
          </Button>
          <Button
            variant="warning"
            onClick={confirmEdit}
          >
            Edit
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default OrdersPage;