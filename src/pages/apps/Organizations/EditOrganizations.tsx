import React from "react";
import { WizardForm } from "./Form/WizardForm";

function EditOrganizations() {
  const isEditing = true;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Save } from "lucide-react"; // Example icon
import { getOrganizationById, updateOrganization } from "../../../services/api";

function EditOrganization() {
  const [formData, setFormData] = useState<any>({
    name: "",
    location: "",
    contact_number: "",
    email: "",
    no_of_employees: "",
    addressIds: [], // Initialize as an empty array
  });
  const { id } = useParams(); // Get the organization ID from the URL
  const navigate = useNavigate(); // To redirect to the list page after successful update

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        if (id) {
          const orgData = await getOrganizationById(id); 
        // Fetch the organization by ID and include populated address data
          setFormData({
            name: orgData.name,
            location: orgData.location,
            contact_number: orgData.contact_number,
            email: orgData.email,
            no_of_employees: orgData.no_of_employees,
            addressIds: orgData.addressIds?.map((address: any) => ({
              id: address._id,
              street_address: address.street_address || "",
              city: address.city || "",
              state: address.state || "",
              pincode: address.pincode || "",
              country: address.country || "",
              district: address.district || "",
            })) || [],
          });
        }
      } catch (error) {
        console.error("Error fetching organization:", error);
      }
    };

    if (id) {
      fetchOrganization();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, addressIndex?: number) => {
    const { name, value } = e.target;
    if (addressIndex !== undefined) {
      const updatedAddresses = [...formData.addressIds];
      updatedAddresses[addressIndex] = {
        ...updatedAddresses[addressIndex],
        [name]: value, 
      };
      setFormData((prevState: any) => ({
        ...prevState,
        addressIds: updatedAddresses,
      }));
    } else {
      setFormData((prevState: any) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        console.log("Updated Organization:", formData);
        const updatedOrg = await updateOrganization(id, formData);
        // Optionally, navigate to the view page after successful update
        navigate(`/apps/organizations/list/`);
      }
    } catch (error) {
      console.error("Error updating organization:", error);
    }
  };

  if (!id) {
    return <div>Organization ID is missing.</div>;
  }

  return (
    <div>
      <WizardForm initialData={isEditing} />
    <div className="min-vh-100 bg-light py-5 px-3">
    <div className="container">
      <h1 className="display-4 text-dark mb-4">Edit Organization</h1>

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-light border-bottom">
          <h2 className="h5 mb-0">Edit Organization</h2>
        </div>

        <form onSubmit={handleSubmit} className="card-body">
          <div className="row mb-3">
            <div className="col-md-6 mb-3">
              <label htmlFor="name" className="form-label">Organization Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="location" className="form-label">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6 mb-3">
              <label htmlFor="contact_number" className="form-label">Contact Number</label>
              <input
                type="text"
                id="contact_number"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="no_of_employees" className="form-label">Number of Employees</label>
            <input
              type="number"
              id="no_of_employees"
              name="no_of_employees"
              value={formData.no_of_employees}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mt-4">
            <h3 className="h6 mb-3">Edit Addresses</h3>
            {formData.addressIds ? (
              formData.addressIds.map((address:any, index:any) => (
                <div key={address._id} className="card bg-light mb-3">
                  <div className="card-body">
                    <h4 className="h6 mb-3">Address {index + 1}</h4>
                    <div className="row mb-3">
                      <div className="col-md-6 mb-3">
                        <label htmlFor={`street_address_${index}`} className="form-label">Street Address</label>
                        <input
                          type="text"
                          id={`street_address_${index}`}
                          name="street_address"
                          value={address.street_address}
                          onChange={(e) => handleChange(e, index)}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor={`city_${index}`} className="form-label">City</label>
                        <input
                          type="text"
                          id={`city_${index}`}
                          name="city"
                          value={address.city}
                          onChange={(e) => handleChange(e, index)}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6 mb-3">
                        <label htmlFor={`district_${index}`} className="form-label">District</label>
                        <input
                          type="text"
                          id={`district_${index}`}
                          name="district"
                          value={address.district}
                          onChange={(e) => handleChange(e, index)}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor={`state_${index}`} className="form-label">State</label>
                        <input
                          type="text"
                          id={`state_${index}`}
                          name="state"
                          value={address.state}
                          onChange={(e) => handleChange(e, index)}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6 mb-3">
                        <label htmlFor={`pincode_${index}`} className="form-label">Pincode</label>
                        <input
                          type="text"
                          id={`pincode_${index}`}
                          name="pincode"
                          value={address.pincode}
                          onChange={(e) => handleChange(e, index)}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor={`country_${index}`} className="form-label">Country</label>
                        <input
                          type="text"
                          id={`country_${index}`}
                          name="country"
                          value={address.country}
                          onChange={(e) => handleChange(e, index)}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No addresses available.</p>
            )}
          </div>

          <div className="d-flex justify-content-end mt-4">
            <button type="submit" className="btn btn-primary">
              <Save className="me-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  </div>
  );
}

export default EditOrganizations;

export default EditOrganization;
 