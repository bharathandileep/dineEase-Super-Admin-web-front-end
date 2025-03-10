import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

interface CompanyDetailsProps {
  companyInfo: any[];
}

const CompanyDetails = (props: CompanyDetailsProps) => {
  const [companyInfo, setCompanyInfo] = useState<any[]>(props.companyInfo);
  const navigate = useNavigate();
  const handleShow = () => {
    navigate("/apps/organizations/new");
  };

  const onSearchData = (value: string) => {
    if (value === "") {
      setCompanyInfo(props.companyInfo);
      return;
    }

    const searchTerm = value.toLowerCase().trim();
    const filteredCompanies = props.companyInfo.filter((item) => {
      const employeeCount = item.no_of_employees.toString();

      return (
        item.contact_number.toLowerCase().includes(searchTerm) ||
        item.email.toLowerCase().includes(searchTerm) ||
        item.managerName.toLowerCase().includes(searchTerm) ||
        employeeCount.includes(searchTerm) ||
        item.organizationName.toLowerCase().includes(searchTerm) ||
        item.register_number.toLowerCase().includes(searchTerm) ||
        item.addresses.some((address: any) =>
          address.street_address.toLowerCase().includes(searchTerm)
        )
      );
    });

    setCompanyInfo(filteredCompanies);
  };
  useEffect(() => {
    setCompanyInfo(props.companyInfo);
  }, [props.companyInfo]);

  return (
    <>  
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Row className="justify-content-between">
                <Col md={8}>
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          onSearchData(e.target.value)
                        }
                      />
                    </div>
                    <label htmlFor="status-select" className="me-2">
                      Sort By
                    </label>
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
                      variant="danger"
                      className="waves-effect waves-light"
                      onClick={handleShow}
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
        {companyInfo?.map((item, index) => (
          <Col key={index} lg={4}>
            <Link to={`/apps/organizations/${item._id}`}>
              <Card className="bg-pattern">
                <Card.Body>
                  <div className="text-center">
                    <img
                      src={item?.organizationLogo}
                      alt=""
                      className="avatar-xl rounded-circle mb-3"
                      style={{
                        objectFit: "cover",
                      }}
                    />
                    <h4 className="mb-1 font-20">{item?.organizationName}</h4>
                    <p className="text-muted font-14">
                      {item?.addresses[0]?.street_address},
                      {item?.addresses[0]?.city},{item?.addresses[0]?.country}
                    </p>
                  </div>

                  <div className="row  mt-4 text-center d-flex flex-column align-center justify-center">
                    <div className=" d-flex flex-row">
                      <i className="mdi mdi-phone-classic me-1"></i>
                      <p>{item?.contact_number}</p>
                    </div>
                    <div className="d-flex flex-row">
                      <i className="mdi mdi-email me-1"></i>
                      <p>{item?.email}</p>
                    </div>
                  </div>
                  <div className="row text-center">
                    <div className="col-6">
                      <h5 className="fw-normal text-muted">Register Number</h5>
                      <h4>{item?.register_number}</h4>
                    </div>
                    <div className="col-6">
                      <h5 className="fw-normal text-muted">
                        Number of employees
                      </h5>
                      <h4>{item?.no_of_employees}</h4>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
      {/* <div className="text-center my-4">
        <Link to="#" className="text-danger">
          <i className="mdi mdi-spin mdi-loading me-1"></i> Load more{" "}
        </Link>
      </div> */}

      {/* pagination */}
      {/* <Row>
        <Col>
          <div className="text-end">
            <ul className="pagination pagination-rounded justify-content-end">
              <li className="page-item">
                <Link className="page-link" to="#" aria-label="Previous">
                  <span aria-hidden="true">«</span>
                  <span className="visually-hidden">Previous</span>
                </Link>
              </li>
              <li className="page-item active">
                <Link className="page-link" to="#">
                  1
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" to="#">
                  2
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" to="#">
                  3
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" to="#">
                  4
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" to="#">
                  5
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" to="#" aria-label="Next">
                  <span aria-hidden="true">»</span>
                  <span className="visually-hidden">Next</span>
                </Link>
              </li>
            </ul>
          </div>
        </Col>
      </Row>
      <AddCompanyModal show={showAddModal} onHide={handleHide} onSubmit={onSubmit}/> */}
    </>
  );
};
export default CompanyDetails;
