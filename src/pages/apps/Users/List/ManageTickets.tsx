import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Dropdown, Modal, Toast, ToastContainer, Spinner, Row, Col } from 'react-bootstrap';
import classNames from 'classnames';
import Table from '../../../../components/Table';
import { deleteStaffApi, fetchStaffsApi, Staffs, UpdateStaffApi } from '../../../../server/allApi';
import AddStaffModal from './AddUsers';
import UpdateStaffModal from './UpdateStaffModal';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
 
const RequestedBy = ({ row }: { row: any }) => {
  return (
    <Link to="/apps/users/profile" className="text-body">
      <img
        src={row.original.image_id}
        alt=""
        title="contact-img"
        className="rounded-circle avatar-xs"
      />
      <span className="ms-2">{`${row.original.name}`}</span>
    </Link>
  );
};

const StatusColumn = ({ row }: { row: any }) => {
  return (
    <span
      className={classNames("badge", {
        "bg-success": row.original.status === "Active",
        "bg-secondary text-light": row.original.status === "Inactive",
      })}
    >
      {row.original.status}
    </span>
  );
};

const ActionColumn = ({ row, onEdit, onDelete }: { row: any; onEdit: (staff: Staffs) => void, onDelete: (id: string) => void }) => {
  return (
    <Dropdown className="btn-group" align="end">
      <Dropdown.Toggle variant="light" className="table-action-btn btn-sm">
        <i className="mdi mdi-dots-horizontal"></i>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => onEdit(row.original)}>
          <i className="mdi mdi-pencil me-2 text-muted font-18 vertical-middle"></i>
          Edit
        </Dropdown.Item>
        <Dropdown.Item>
          <i className="mdi mdi-check-all me-2 text-muted font-18 vertical-middle"></i>
          Activate
        </Dropdown.Item>
        <Dropdown.Item onClick={() => onDelete(row.original._id)}>
          <i className="mdi mdi-delete me-2 text-muted font-18 vertical-middle"></i>
          Delete
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const columns = (onEdit: (staff: Staffs) => void, onDelete: (id: string) => void) => [
  {
    Header: "User",
    accessor: "requested_by",
    sort: true,
    Cell: RequestedBy,
  },
  {
    Header: "Role",
    accessor: "role",
    sort: true,
  },
  {
    Header: "Username",
    accessor: "name",
    sort: true,
  },
  {
    Header: "Email",
    accessor: "email",
    sort: true,
  },
  {
    Header: "Created Date",
    accessor: "created_at",
    sort: true,
  },
  {
    Header: "Action",
    accessor: "action",
    Cell: ({ row }: { row: any }) => <ActionColumn row={row} onEdit={onEdit} onDelete={onDelete} />,
    sort: false,
  },
];

const sizePerPageList = [
  { text: "4", value: 4 },
  { text: "10", value: 10 },
  { text: "15", value: 15 },
];

const ManageTickets: React.FC = () => {
  const [staffs, setStaffs] = useState<Staffs[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [currentStaff, setCurrentStaff] = useState<Staffs | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null); // For delete confirmation
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // For showing loader during API calls
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const itemsPerPage = 4;

  useEffect(() => {
    const loadStaffs = async () => {
      setLoading(true);
      try {
        const response = await fetchStaffsApi(currentPage, itemsPerPage);
        setStaffs(response.data);
        setTotalPages(response.pagination.totalPages);
      } catch (error:any) {
        console.error('Error fetching staff:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadStaffs();
  }, [currentPage]);

  const onCloseAddModal = () => setShowAddModal(false);
  const onOpenAddModal = () => setShowAddModal(true);

  const onAddStaff = async (newStaff: Staffs) => {
    try {

      setStaffs((prevStaffs) => [...prevStaffs, newStaff]);
      setToastMessage(`${newStaff.name??'Unknown Staff'}  has been added successfully!`);    } catch (error:any) {
      console.error('Error adding staff:', error);
      setToastMessage('Error adding staff');
    } finally {
      setShowToast(true);
      onCloseAddModal();
    }
  };

  const onCloseUpdateModal = () => setShowUpdateModal(false);
  const onOpenUpdateModal = (staff: Staffs) => {
    setCurrentStaff(staff);
    setShowUpdateModal(true);
  };

 
  const handleDelete = (id: string) => {
    setShowConfirmDelete(id); // Show confirmation box
  };
  
  const confirmDelete = async () => {
    if (showConfirmDelete) {
      const staffToDelete = staffs.find(staff => staff._id === showConfirmDelete);
      const staffName = `${staffToDelete?.name}`;
  
      setDeleteLoading(true);
  
      // Simulate a delay before deleting
      setTimeout(async () => {
        try {
          await deleteStaffApi(showConfirmDelete);
          setStaffs(staffs.filter(staff => staff._id !== showConfirmDelete));
          
          setToastMessage(`${staffName} deleted successfully`);
          setShowToast(true);
        } catch (error:any) {
          console.error('Error deleting staff:', error);
          setToastMessage('Error deleting staff');
          setShowToast(true);
        } finally {
          setDeleteLoading(false);
          setShowConfirmDelete(null); // Hide confirmation box
        }
      }, 2000);
    }
  };
  
  const cancelDelete = () => {
    setShowConfirmDelete(null); // Hide confirmation box
  };

  const handleUpdate = async (updatedStaff: Staffs) => {
    if (currentStaff?._id) {
      try {
        await UpdateStaffApi(currentStaff._id, updatedStaff);
        const response = await fetchStaffsApi(currentPage, itemsPerPage);
        setStaffs(response.data);
        setTotalPages(response.pagination.totalPages);
        
        setToastMessage(`Staff updated successfully`);
      } catch (error:any) {
        console.error('Error updating staff:', error);
        setToastMessage('Error updating staff');
      } finally {
        setShowToast(true);
        onCloseUpdateModal();
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Card>
        <Card.Body>
          <Button 
            className="btn-sm btn-blue waves-effect waves-light float-end"
            onClick={onOpenAddModal}
            disabled={isProcessing}
          >
            {isProcessing ? <Spinner animation="border" size="sm" /> : <><i className="mdi mdi-plus-circle"></i> Add Users</>}
          </Button>
          
          <Table
            columns={columns(onOpenUpdateModal, handleDelete)}
            data={staffs}
            pageSize={itemsPerPage}
            sizePerPageList={sizePerPageList}
            isSortable={true}
            pagination={false} // Disable default pagination since we have custom pagination
            isSearchable={true}
            theadClass="table-light"
            searchBoxClass="mt-2 mb-3"
          />
        </Card.Body>
      </Card>
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

      {/* Add Staff Modal */}
      <AddStaffModal
        show={showAddModal}
        onHide={onCloseAddModal}
        onAddMember={onAddStaff}
      />

      {/* Update Staff Modal */}
      <UpdateStaffModal
        show={showUpdateModal}
        onHide={onCloseUpdateModal}
        staff={currentStaff}
        onUpdateStaff={handleUpdate}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        show={!!showConfirmDelete}
        onHide={() => setShowConfirmDelete(null)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this Staff?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDelete(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleteLoading}>
            {deleteLoading ? <Spinner as="span" animation="border" size="sm" /> : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast for Notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default ManageTickets;
 

