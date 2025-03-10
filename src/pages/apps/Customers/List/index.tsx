import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Spinner, Toast, ToastContainer } from "react-bootstrap";
import PageTitle from "../../../../components/PageTitle";
import AddMember from "./AddMember";
import ContactDetails from "./ContactDetails";
import UpdateCustomerModal from "./UpdateCustomerModal";
import { Customer, fetchCustomerApi, postCustomerApi, deleteCustomerApi, updateCustomerApi } from "../../../../server/allApi";

const List: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false); // Loader state for adding
  const [isUpdating, setIsUpdating] = useState<boolean>(false); // Loader state for updating
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
 
  const itemsPerPage = 6;

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        const response = await fetchCustomerApi(currentPage, itemsPerPage);
        setCustomers(response.data);
        setTotalPages(response.pagination.totalPages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError((error as Error).message);
        setLoading(false);
      }
    };

    loadCustomers();
  }, [currentPage]);

  const onSearchData = (value: string) => {
    if (value === "") {
      fetchCustomerApi(currentPage, itemsPerPage)
        .then(response => setCustomers(response.data))
        .catch(error => console.error(error));
    } else {
      setCustomers(prevCustomers =>
        prevCustomers.filter(customer =>
          customer.cust_name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const onCloseAddModal = () => setShowAddModal(false);
  const onOpenAddModal = () => setShowAddModal(true);

  const onAddMember = async (newCustomer: Customer) => {
    setIsAdding(true);
    try {

      setCustomers((prevCustomer) => [...prevCustomer, newCustomer]);
      setToastMessage(`${newCustomer.cust_name??'Unknown Customer'}  has been added successfully!`);    } catch (error) {
      console.error('Error adding Customer:', error);
      setToastMessage('Error adding Customer');
    } finally {
      setShowToast(true);
      onCloseAddModal();
    }
    // try {
    //   setCustomers((prevCustomer) => [...prevCustomer, newCustomer]);
    //   setToastMessage("Customer added successfully");
    //   setShowToast(true);
    // } catch (error) {
    //   console.error('Error adding customer:', error);
    //   setToastMessage("Error adding customer");
    //   setShowToast(true);
    // } finally {
    //   setIsAdding(false);
    //   onCloseAddModal();
    // }
  };

  const onCloseUpdateModal = () => setShowUpdateModal(false);
  const onOpenUpdateModal = (customer: Customer) => {
    setCurrentCustomer(customer);
    setShowUpdateModal(true);
  };

  const handleDelete = (id: string) => {
    setShowConfirmDelete(id);
  };

  const confirmDelete = async () => {
    if (showConfirmDelete) {
      const customerToDelete = customers.find(customers => customers._id === showConfirmDelete);
      const cust_name = `${customerToDelete?.cust_name}`;
  
      console.log('Deleting Customer with ID:', showConfirmDelete);
      setDeleteLoading(true);

      setTimeout(async () => {
        try {
          await deleteCustomerApi(showConfirmDelete);
          setCustomers(customers.filter(customers => customers._id !== showConfirmDelete));
          
          setToastMessage(`${cust_name} deleted successfully`);
          setShowToast(true);
        } catch (error) {
          console.error('Error deleting Customer:', error);
          setToastMessage('Error deleting Customer');
          setShowToast(true);
        } finally {
          setDeleteLoading(false);
          setShowConfirmDelete(null); // Hide confirmation box
        }
      }, 2000);
    }
    //     try {
    //       await deleteCustomerApi(showConfirmDelete);
    //       const response = await fetchCustomerApi(currentPage, itemsPerPage);
    //       setCustomers(response.data);
    //       setTotalPages(response.pagination.totalPages);
    //       setToastMessage("Customer deleted successfully");
    //       setShowToast(true);
    //     } catch (error) {
    //       console.error('Error deleting customer:', error);
    //       setToastMessage("Error deleting customer");
    //       setShowToast(true);
    //     } finally {
    //       setShowConfirmDelete(null);
    //     }
    //   }, 2000);
    // }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(null);
  };
  const handleUpdate = async (updatedCustomer: Customer) => {
    if (currentCustomer?._id) {
      try {
        await updateCustomerApi(currentCustomer._id, updatedCustomer);
        const response = await fetchCustomerApi(currentPage, itemsPerPage);
        setCustomers(response.data);
        setTotalPages(response.pagination.totalPages);
        setToastMessage('Staff updated successfully');
      } catch (error) {
        console.error('Error updating staff:', error);
        setToastMessage('Error updating staff');
      } finally {
        setShowToast(true);
        onCloseUpdateModal();
      }
    } 
  };

  // const handleUpdate = async (updatedCustomer: Customer) => {
  //   setIsUpdating(true);
  //   try {
  //     await updateCustomerApi(updatedCustomer._id, updatedCustomer);
  //     const response = await fetchCustomerApi(currentPage, itemsPerPage);
  //     setCustomers(response.data);
  //     setTotalPages(response.pagination.totalPages);
  //     setToastMessage("Customer updated successfully");
  //     setShowToast(true);
  //   } catch (error) {
  //     console.error('Error updating customer:', error);
  //     setToastMessage("Error updating customer");
  //     setShowToast(true);
  //   } finally {
  //     setIsUpdating(false);
  //     onCloseUpdateModal();
  //   }
  // };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Contacts", path: "/apps/contacts/list" },
          { label: "List", path: "/apps/contacts/list", active: true },
        ]}
        title={"Customer List"}
      />
      <Row className="mb-2">
        <Col sm={4}>
          <form>
            <div className="mb-3">
              <label htmlFor="search" className="form-label">Search</label>
              <input
                type="search"
                className="form-control"
                id="search"
                placeholder="Search..."
                onChange={e => onSearchData(e.target.value)}
              />
            </div>
          </form>
        </Col>
        <Col sm={8}>
          <div className="text-sm-end mt-sm-0 mt-2">
            <Button variant="danger" className="mb-2 me-1">
              <i className="mdi mdi-cog"></i>
            </Button>
            <Button variant="light" className="mb-2 me-1">
              Import
            </Button>
            <Button variant="light" className="mb-2">
              Export
            </Button>
            <Button
              variant="primary"
              className="mb-2 me-1"
              onClick={onOpenAddModal}
              disabled={isAdding || isUpdating}
            >
              <i className="mdi mdi-plus-circle me-1"></i> Add Member
              {isAdding && <Spinner as="span" animation="border" size="sm" className="ms-2" />}
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <ContactDetails
            customers={customers}
            onDelete={handleDelete}
            onEdit={onOpenUpdateModal}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <ul className="pagination justify-content-center mb-4">
            <li className="page-item">
              <Button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${index + 1 === currentPage ? "active" : ""}`}
              >
                <Button
                  className="page-link"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Button>
              </li>
            ))}
            <li className="page-item">
              <Button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </li>
          </ul>
        </Col>
      </Row>
      <AddMember show={showAddModal} onHide={onCloseAddModal} onAddMember={onAddMember} isLoading={false} />
      {currentCustomer && (
        <UpdateCustomerModal
          show={showUpdateModal}
          onHide={onCloseUpdateModal}
          customer={currentCustomer}
          onUpdateCustomer={handleUpdate}
          isLoading={isUpdating}
        />
      )}
      <Modal show={!!showConfirmDelete} onHide={cancelDelete} centered>
        <Modal.Body>
          <div className="text-center">
            <i className="mdi mdi-alert-circle-outline text-danger" style={{ fontSize: "3rem" }}></i>
            <h4>Are you sure?</h4>
            <p>You won't be able to revert this!</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleteLoading}>
            Delete
            {deleteLoading && <Spinner as="span" animation="border" size="sm" className="ms-2" />}
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer className="p-3" position="top-end">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default List;
