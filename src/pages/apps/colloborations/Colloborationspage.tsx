import React, { useEffect, useState } from "react";
import { getAllCollaborations } from "../../../server/admin/collab";
import { Link } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";

// Define the structure of a collaboration
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
  //   status: string;
  createdAt: string;
  updatedAt: string;
}

const CollaborationsPage: React.FC = () => {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch collaborations on component mount
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
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-danger">Error: {error}</div>;
  }

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Kitchens", path: "/apps/kitchen/our-menu" },
          {
            label: "Our Menu",
            path: "/apps/kitchen/OurMenu",
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
            Collaborated Kitchens
          </h3>
        </div>
      </div>
      <div className="container-fluid bg-light min-vh-100">
        <div className="row">
          {collaborations.length > 0 ? (
            collaborations.map((collab) => (
              <div key={collab._id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      {collab.organization.logo && (
                        <img
                          src={collab.organization.logo}
                          alt={`${collab.organization.name} Logo`}
                          className="img-fluid rounded-circle me-3"
                          style={{ width: "50px", height: "50px" }}
                        />
                      )}
                      <div>
                        <h2 className="h5 mb-0">{collab.organization.name}</h2>
                        <p className="text-muted small mb-0">Organization</p>
                      </div>
                    </div>
                    <hr />
                    <h3 className="h6 mb-2">{collab.kitchen.name}</h3>
                    <p className="text-muted small mb-2">Kitchen</p>
                    <p className="small mb-0">
                      <span className="fw-bold">Created At:</span>{" "}
                      {new Date(collab.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No collaborations found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CollaborationsPage;
