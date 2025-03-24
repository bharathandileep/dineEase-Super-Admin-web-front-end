import React, { useEffect, useState } from "react";
import { getAllCollaborations } from "../../../server/admin/collab";
import PageTitle from "../../../components/PageTitle";
import "./Colloborations.scss";
import { Card, Row, Col, Spinner, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LucideHandshake } from "lucide-react";

interface Collaboration {
  _id: string;
  organization: {
    _id: string;
    name: string;
    logo: string | null;
  };
  kitchen: {
    _id: string;
    name: string;
    image: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

const CollaborationsPage: React.FC = () => {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        const data = await getAllCollaborations();
        setCollaborations(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCollaborations();
  }, []);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center text-danger">
        Error: {error}
      </div>
    );
  }

  const filteredCollaborations = collaborations.filter(
    (collab) =>
      collab.organization.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collab.kitchen.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <React.Fragment>
      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb m-2">
          <li className="breadcrumb-item">
            <Link to="/apps/colloborated">Colloboration</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Colloboration List
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div
        className="mb-3"
        style={{ backgroundColor: "#5bd2bc", padding: "10px" }}
      >
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="page-title m-0" style={{ color: "#fff" }}>
          Colloboration List
          </h3>
          {/* Optional right-aligned content (e.g., a button like EmployeeList) */}
          {/* Uncomment and adjust if needed */}
          {/* <Link
            to="/apps/kitchen/add"
            className="btn btn-danger waves-effect waves-light"
          >
            <i className="mdi mdi-plus-circle me-1"></i> Add New Kitchen
          </Link> */}
        </div>
      </div>

      {/* Search Component */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Row className="justify-content-between">
                <Col className="col-auto">
                  <form className="d-flex align-items-center">
                    <label htmlFor="searchInput" className="visually-hidden">
                      Search
                    </label>
                    <div>
                      <input
                        type="search"
                        className="form-control my-1 my-lg-0"
                        id="searchInput"
                        placeholder="Search ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ minWidth: "200px" }}
                      />
                    </div>
                  </form>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Collaborations Grid */}
      <Row className="mt-3">
        {filteredCollaborations.length > 0 ? (
          filteredCollaborations.map((collab) => (
            <Col key={collab._id} md={6} lg={4} className="mb-3">
              <Link
                to={`/apps/colloborated/details/${collab._id}`}
                style={{ textDecoration: "none" }}
              >
                <div className="card h-100 shadow-sm collaboration-card border-0">
                  <div className="card-body text-center position-relative">
                    <div className="d-flex justify-content-center mb-4">
                      <div className="profile-container">
                        {/* Decorative rings */}
                        <div className="profile-ring"></div>
                        <div className="profile-ring"></div>
                        <div className="profile-ring"></div>

                        {/* Organization Logo */}
                        {collab.organization.logo && (
                          <div className="profile-image left">
                            <img
                              src={collab.organization.logo}
                              alt={`${collab.organization.name} Logo`}
                            />
                          </div>
                        )}

                        {/* Kitchen Image */}
                        {collab.kitchen.image && (
                          <div className="profile-image right">
                            <img
                              src={collab.kitchen.image}
                              alt={`${collab.kitchen.name} Image`}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                        <span className="h3 mb-0 text-black">{collab.kitchen.name}</span>
                        <span className="text-success"><LucideHandshake /></span>
                        <span className="h3 mb-0 text-black">{collab.organization.name}</span>
                      </div>
                      <p className="text-muted small mb-0">
                        Established: {new Date(collab.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="card-progress"></div>
                  </div>
                </div>
              </Link>
            </Col>
          ))
        ) : (
          <Col>
            <Card>
              <Card.Body className="text-center">
                <i
                  className="mdi mdi-account-off text-muted"
                  style={{ fontSize: "48px" }}
                ></i>
                <h4 className="mt-3">No Collaborations Found</h4>
                <p className="text-muted">
                  {searchQuery
                    ? `No collaborations match your search criteria "${searchQuery}".`
                    : "There are no collaborations in the system yet."}
                </p>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </React.Fragment>
  );
};

export default CollaborationsPage;