import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Spinner, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import AddkitchenCategory from "./modal/AddkitchenCategory";
import {
  kitchensDeleteSubcategory,
  kitchensGetSubcategories,
  kitchensToggleSubcategoryStatus,
} from "../../../server/admin/kitchens";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";
import Table from "../../../components/Table";

function KitchensSubCategories() {
  const navigate = useNavigate();
  const isSubCategory = true;
  const [action, setAction] = useState("");
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchAllSubCategories = async () => {
      setLoading(true);
      try {
        const query = {
          page: currentPage,
          limit: pageSize,
          search: searchTerm,
          status: statusFilter,
        };
   
        const response = await kitchensGetSubcategories(query);
        if (response.status) {
          setMenuItems(response.data.categories);
          setTotalPages(response.data.pagination.totalPages);
          setTotalItems(response.data.pagination.totalItems);
        } else {
          toast.error(response.message);
        }
      } catch (error: any) {
        console.error("Fetch Error:", error.response?.data || error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllSubCategories();
  }, [currentPage, pageSize, isDeleted, show, searchTerm, statusFilter]);

  const onSearchData = (searchValue: string) => {
    setSearchTerm(searchValue);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (filterValue: string) => {
    setStatusFilter(filterValue);
    setCurrentPage(1);
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const response = await kitchensToggleSubcategoryStatus(id);
      if (response.status) {
        const item = menuItems.find((d) => d._id === id);
        const newStatus = !item.status;

        toast.success(`Subcategory status changed to ${newStatus ? "Active" : "Inactive"}`);

        if (statusFilter !== "all") {
          if (
            (statusFilter === "active" && !newStatus) ||
            (statusFilter === "inactive" && newStatus)
          ) {
            setMenuItems((prevItems) => prevItems.filter((item) => item._id !== id));
            setTotalItems((prev) => prev - 1);
            const newTotalPages = Math.ceil((totalItems - 1) / pageSize);
            setTotalPages(newTotalPages);

            if (menuItems.length === 1 && currentPage > 1) {
              setCurrentPage(currentPage - 1);
            }
          } else {
            setMenuItems((prevItems) =>
              prevItems.map((item) =>
                item._id === id ? { ...item, status: newStatus } : item
              )
            );
          }
        } else {
          setMenuItems((prevItems) =>
            prevItems.map((item) =>
              item._id === id ? { ...item, status: newStatus } : item
            )
          );
        }
      } else {
        toast.error(response.message || "Failed to toggle status.");
      }
    } catch (error: any) {
      console.error("Toggle Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error toggling status.");
    }
  };

  const handleEdit = (id: string) => {
    const item = menuItems.find((menu) => menu._id === id);
    if (item) {
      setAction("edit");
      setSelectedItem(item);
      setShow(true);
    } else {
      toast.error("Item not found. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this subcategory?")) return;
    try {
      const response = await kitchensDeleteSubcategory(id);
      if (response.status) {
        toast.success(response.message);
        const remainingItems = totalItems - 1;
        const newTotalPages = Math.ceil(remainingItems / pageSize);

        if (menuItems.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          setIsDeleted((prev) => !prev);
        }

        setTotalItems(remainingItems);
        setTotalPages(newTotalPages);
      } else {
        toast.error(response.message || "Delete failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Delete Error:", error.response?.data || error.message);
      toast.error(error.message);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handleSizePerPageChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  /* Column render functions */
  const NumberColumn = ({ row }: { row: any }) => {
    const rowNumber = (currentPage - 1) * pageSize + row.index + 1;
    return <span className="fw-bold">{rowNumber}</span>;
  };

  const SubCategoryColumn = ({ row }: { row: any }) => {
    return <span className="fw-bold">{row?.original?.subcategoryName}</span>;
  };

  const CategoryColumn = ({ row }: { row: any }) => {
    return <span className="fw-bold">{row?.original?.category?.category || "N/A"}</span>;
  };

  const CreatedAtColumn = ({ row }: { row: any }) => {
    return <span>{new Date(row?.original?.createdAt).toLocaleString()}</span>;
  };

  const StatusColumn = ({ row }: { row: any }) => {
    return (
      <button
        className={`badge border-0 text-white ${
          row?.original?.status ? "bg-success" : "bg-secondary"
        }`}
        onClick={() => handleToggleStatus(row?.original?._id)}
      >
        {row.original?.status ? "Active" : "Inactive"}
      </button>
    );
  };

  const ActionColumn = ({ row }: { row: any }) => {
    return (
      <>
        <button
          className="action-icon border-0 bg-transparent"
          onClick={() => handleEdit(row?.original?._id)}
        >
          <i className="mdi mdi-square-edit-outline"></i>
        </button>
        <button
          className="action-icon border-0 bg-transparent"
          onClick={() => handleDelete(row?.original?._id)}
        >
          <i className="mdi mdi-delete text-danger"></i>
        </button>
      </>
    );
  };

  const columns = [
    { Header: "No.", accessor: "number", Cell: NumberColumn },
    { Header: "Sub Category", accessor: "subcategoryName", Cell: SubCategoryColumn },
    { Header: "Category", accessor: "category", Cell: CategoryColumn },
    { Header: "Created At", accessor: "createdAt", Cell: CreatedAtColumn },
    { Header: "Status", accessor: "status", Cell: StatusColumn },
    { Header: "Action", accessor: "action", Cell: ActionColumn },
  ];

  const sizePerPageList = [
    { text: "10", value: 10 },
    { text: "20", value: 20 },
    { text: "50", value: 50 },
  ];

  return (
    <>
      <div className="container py-2">
        <PageTitle
          breadCrumbItems={[
            { label: "Kitchens", path: "/apps/kitchens/subcategory" },
            { label: "Sub Category", path: "/apps/kitchens/subcategory", active: true },
          ]}
          title={"Kitchen Subcategories"}
        />
        <div className="mb-3" style={{ backgroundColor: "#5bd2bc", padding: "10px" }}>
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="page-title m-0" style={{ color: "#fff" }}>
              Kitchen Subcategories
            </h3>
            <Link
              to="#"
              className="btn btn-danger waves-effect waves-light"
              onClick={() => {
                setAction("add");
                setShow(true);
              }}
            >
              <i className="mdi mdi-plus-circle me-1"></i> Add New
            </Link>
          </div>
        </div>
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Row className="justify-content-between">
                  <Col className="col-auto">
                    <form className="d-flex align-items-center">
                      <label htmlFor="inputPassword2" className="visually-hidden">
                        Search
                      </label>
                      <div>
                        <input
                          type="search"
                          className="form-control my-1 my-lg-0"
                          id="inputPassword2"
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={(e) => onSearchData(e.target.value)}
                        />
                      </div>
                    </form>
                  </Col>
                  <Col className="col-auto">
                    <div className="d-flex align-items-center">
                      <label htmlFor="status-select" className="me-2 mb-0">
                        Filter By
                      </label>
                      <div>
                        <Form.Select
                          className="w-auto"
                          value={statusFilter}
                          onChange={(e) => handleStatusFilterChange((e.target as HTMLSelectElement).value)}
                        >
                          <option value="all">All</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </Form.Select>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <div className="card shadow">
          <div className="table-responsive">
            {loading ? (
              <div className="text-center my-4">
                <Spinner animation="border" />
                <p>Loading kitchen subcategories...</p>
              </div>
            ) : menuItems.length === 0 ? (
              <div className="text-center my-4">
                <p>No Kitchen Subcategories Found</p>
              </div>
            ) : (
              <Table
                columns={columns}
                data={menuItems}
                isSearchable={false}
                pageSize={pageSize}
                sizePerPageList={sizePerPageList}
                isSortable={true}
                pagination={true}
                isSelectable={false}
                theadClass="table-light"
                onPageChange={handlePageChange}
                onSizePerPageChange={handleSizePerPageChange}
                totalPages={totalPages}
                currentPage={currentPage}
              />
            )}
          </div>
        </div>
      </div>

      <AddkitchenCategory
        show={show}
        onHide={() => setShow(false)}
        isSubCategory={isSubCategory}
        action={action}
        selectedItem={selectedItem}
      />
    </>
  );
}

export default KitchensSubCategories;