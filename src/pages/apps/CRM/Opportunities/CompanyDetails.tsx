import React, { useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames";

// components
import AddOpportunities from "./AddOpportunities";

interface CompanyInfo {
  id: number;
  logo: string;
  name: string;
  location: string;
  category: string;
  email: string;
  phone: string;
  status: string;
}

interface CompanyDetailsProps {
  companyInfo: any[];
}

const CompanyDetails = (props: CompanyDetailsProps) => {
  const [companyInfo, setCompanyInfo] = useState<Array<any>>(props.companyInfo);
  const [show, setShow] = useState<boolean>(false);
  const navigate = useNavigate();

  const onSearchData = (value: string) => {
    if (value.trim() === "") {
      setCompanyInfo(props.companyInfo);
      return;
    }

    const searchTerm = value.toLowerCase();

    const filteredResults = props.companyInfo.filter((item) => {
      return (
        item.kitchen_name.toLowerCase().includes(searchTerm) ||
        item.owner_email.toLowerCase().includes(searchTerm) ||
        item.kitchen_phone_number.includes(searchTerm) ||
        item.addresses.some((address: any) =>
          address.street_address.toLowerCase().includes(searchTerm)
        )
      );
    });

    setCompanyInfo(filteredResults);
  };

  /*
   * change order status group
   */
  const changeStatusGroup = (StatusGroup: string) => {
    let updatedData = props.companyInfo;
    //  filter
    updatedData =
      StatusGroup === "All"
        ? props.companyInfo
        : [...props.companyInfo].filter((o) => o.status?.includes(StatusGroup));
    setCompanyInfo(updatedData);
  };

  const onOpenModal = () => navigate("/apps/kitchen/new");

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb m-2">
          <li className="breadcrumb-item">
            <Link to="/apps/ecommerce/products">Ecommerce</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Products
          </li>
        </ol>
      </nav>
      <div
        className="mb-3"
        style={{ backgroundColor: "#5bd2bc", padding: "10px" }}
      >
        <div className="d-flex align-items-center justify-content-between" onClick={onOpenModal}>
          <h3 className="page-title m-0" style={{ color: "#fff" }}>
            Products
          </h3>
          <Link
            to="#"
            className="btn btn-danger waves-effect waves-light"
          >
            <i className="mdi mdi-plus-circle me-1" ></i> Add New
          </Link>
        </div>
      </div>
      <Card className="mb-2">
        <Card.Body>
          <Row className="justify-content-between">
            <Col className="col-auto">
              <form className="d-flex flex-wrap align-items-center">
                <label htmlFor="inputPassword2" className="visually-hidden">
                  Search
                </label>
                <div className="me-3">
                  <input
                    type="search"
                    className="form-control my-1 my-lg-0"
                    id="inputPassword2"
                    placeholder="Search..."
                    onChange={(e: any) => onSearchData(e.target.value)}
                  />
                </div>
                <label htmlFor="status-select" className="me-2">
                  Sort By
                </label>
                <div className="me-sm-3">
                  <select
                    className="form-select my-1 my-lg-0"
                    onChange={(e: any) => changeStatusGroup(e.target.value)}
                  >
                    <option defaultValue="All">All</option>
                    <option value="Hot">Hot</option>
                    <option value="Cold">Cold</option>
                    <option value="In-progress">In Progress</option>
                    <option value="Lost">Lost</option>
                    <option value="Won">Won</option>
                  </select>
                </div>
              </form>
            </Col>
            {/* <Col lg={4}>
              <div className="text-lg-end mt-3 mt-lg-0">
                <Button
                  variant="danger"
                  className="waves-effect waves-light"
                  onClick={onOpenModal}
                >
                  <i className="mdi mdi-plus-circle me-1"></i> Add New
                </Button>
              </div>
            </Col> */}
          </Row>
        </Card.Body>
      </Card>

      {(companyInfo || []).map((item, index) => {
        return (
          <Link to={`/apps/kitchen/${item._id}`}>
            <Card key={index} className="mb-2">
              <Card.Body>
                <Row className="align-items-center justify-content-sm-between">
                  <Col sm={4}>
                    <div className="d-flex align-items-start">
                      <img
                        className="d-flex align-self-center me-3 rounded-circle"
                        src={item.kitchen_image}
                        alt=""
                        style={{
                          objectFit: "cover",
                          width: "100px",
                          height: "100px",
                        }}
                      />
                      <div className="w-100">
                        <h4 className="mt-0 mb-2 font-16">
                          {item?.kitchen_name}
                        </h4>
                        <p className="mb-1">
                          <b>Location:</b>
                          {item?.addresses[0]?.street_address},
                          {item?.addresses[0]?.city},
                          {item?.addresses[0]?.country}
                        </p>
                        <p className="mb-0">
                          <b>Category:</b> {item?.kitchen_type}
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col sm={4}>
                    <p className="mb-1 mt-3 mt-sm-0">
                      <i className="mdi mdi-email me-1"></i> {item?.owner_email}
                    </p>
                    <p className="mb-0">
                      <i className="mdi mdi-phone-classic me-1"></i>{" "}
                      {item?.kitchen_phone_number}
                    </p>
                  </Col>
                  <Col sm={2}>
                    <div className="text-center mt-3 mt-sm-0">
                      <div
                        className={classNames("badge", "font-14", "p-1", {
                          "bg-soft-info text-info":
                            item?.kitchen_status === "Hot",
                          "bg-soft-primary text-primary":
                            item?.kitchen_status === "Cold",
                          "bg-soft-warning text-warning":
                            item.status === "In-progress",
                          "bg-soft-danger text-danger":
                            item?.kitchen_status === "Lost",
                          "bg-soft-success text-success":
                            item?.kitchen_status === "Active",
                        })}
                      >
                        {"Active"}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Link>
        );
      })}

      {/* <div className="text-center my-4">
        <Link to="#" className="text-danger">
          <i className="mdi mdi-spin mdi-loading me-1"></i> Load more{" "}
        </Link>
      </div>   */}
    </>
  );
};

export default CompanyDetails;
