


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Image } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import FileUploader from "../../../components/FileUploader";
import { FormInput } from "../../../components";
import { createOrgEmployee } from "../../../server/admin/orgemployeemanagment";
import { getAllDesignations } from "../../../server/admin/designations";
import { 
  getAllCountries, 
  getStatesByCountry, 
  getCitiesByState, 
  getDistrictsByState 
} from "../../../server/admin/addressDetails"; // Assuming this is the path to your location API functions

const OrgEmployeeManagement = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [aadharImage, setAadharImage] = useState<File | null>(null);
  const [panImage, setPanImage] = useState<File | null>(null);
  const [designations, setDesignations] = useState<{ _id: string; designation_name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // Location state management
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  
  // Form data state for custom fields not handled by react-hook-form
  const [formData, setFormData] = useState({
    country: "",
    state: "",
    city: "",
    district: ""
  });
  
  // Custom errors state
  const [errors, setErrors] = useState<{[key: string]: string | undefined}>({});

  // Fetch designations and countries on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const response = await getAllDesignations( {page:1,limit:10});
        if (response.status) {
          setDesignations(response.data.designations);
        } else {
          toast.error("Failed to load designations.");
        }
        
        // Fetch countries
        await fetchCountries();
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("An error occurred while loading initial data.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  // Location data fetching functions
  const fetchCountries = async () => {
    try {
      const data = await getAllCountries(); 
      if (data?.success) {
        setCountries(data.data);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };
  
  const fetchStates = async (countryName: string) => {
    try {
      const data = await getStatesByCountry(countryName); 
      if (data?.success) {
        setStates(data.data);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };
  
  const fetchCities = async (stateName: string) => {
    try {
      const data = await getCitiesByState(stateName);
      if (data?.success) {
        setCities(data.data);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };
  
  const fetchDistricts = async (stateId: string) => {
    try {
      const data = await getDistrictsByState(stateId);
      if (data?.success) {
        setDistricts(data.data);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  // Handle location selection changes
  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "country") {
      await fetchStates(value);
      setFormData((prev) => ({ ...prev, state: "", city: "", district: "" }));
    } else if (name === "state") {
      await fetchCities(value);
      await fetchDistricts(value);
      setFormData((prev) => ({ ...prev, city: "", district: "" }));
    }

    if (errors[name as keyof typeof formData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // React Hook Form setup
  const {
    handleSubmit,
    register,
    formState: { errors: formErrors },
  } = useForm();

  const onSubmit = async (data: any) => {
    // Validate location fields
    const locationErrors: {[key: string]: string} = {};
    if (!formData.country) locationErrors.country = "Country is required";
    if (!formData.state) locationErrors.state = "State is required";
    if (!formData.city) locationErrors.city = "City is required";
    if (!formData.district) locationErrors.district = "District is required";
    
    if (Object.keys(locationErrors).length > 0) {
      setErrors(locationErrors);
      return;
    }
    
    try {
      const formDataObj = new FormData();

      formDataObj.append("entity_id", "67aad807dcbe481e9d130696");
      formDataObj.append("entity_type", "Organization");
      formDataObj.append("designation", data.designation);
      formDataObj.append("username", data.username);
      formDataObj.append("email", data.email);
      formDataObj.append("phone_number", data.phone_number);
      formDataObj.append("role", "Employee");
      formDataObj.append("employee_status", "Active");
      formDataObj.append("aadhar_number", data.aadhar_number);
      formDataObj.append("pan_number", data.pan_number);

      // Address Fields
      formDataObj.append("street_address", data.street_address);
      formDataObj.append("city", formData.city);
      formDataObj.append("district", formData.district);
      formDataObj.append("pincode", data.pincode);
      formDataObj.append("state", formData.state);
      formDataObj.append("country", formData.country);

      // Profile Picture Upload
      if (profileImage) {
        formDataObj.append("profile_picture", profileImage);
      }
      // Aadhaar Card Upload
      if (aadharImage) {
        formDataObj.append("aadhar_image", aadharImage);
      }
      // PAN Card Upload
      if (panImage) {
        formDataObj.append("pan_image", panImage);
      }

      const response = await createOrgEmployee(formDataObj);

      if (response.status) {
        toast.success("Employee added successfully!");
        navigate("/apps/organizations/employee/list");
      } else {
        toast.error(response.message || "Failed to add employee.");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Error adding employee. Please try again.");
    }
  };
  const handleFileUpload = (
    files: File[],
    setImage: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (files.length > 0) {
      setImage(files[0]);
    }
  };

  return (
    <div className="container py-2">
      <Card className="mb-2">
        <Card.Body>
          <h3 className="text-uppercase">Add Organisation Employee</h3>
        </Card.Body>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          {/* Left Column - Employee Details */}
          <Col lg={6}>
            <Card>
              <Card.Body>
                <h5 className="text-uppercase mt-0 mb-3">
                  General Information
                </h5>
                <FormInput
                  name="username"
                  label="Employee Name"
                  placeholder="Enter full name"
                  containerClass="mb-3"
                  register={register}
                  errors={formErrors}
                  validation={{ required: "Employee name is required" }}
                />
                <FormInput
                  name="email"
                  label="Email"
                  placeholder="Enter email"
                  containerClass="mb-3"
                  register={register}
                  errors={formErrors}
                  validation={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                />
                <FormInput
                  name="phone_number"
                  label="Phone Number"
                  placeholder="Enter phone number"
                  containerClass="mb-3"
                  register={register}
                  errors={formErrors}
                  validation={{ required: "Phone number is required" }}
                />
                <FormInput
                  name="designation"
                  label="Designation"
                  containerClass="mb-3"
                  register={register}
                  errors={formErrors}
                  type="select"
                  defaultValue=""
                  validation={{ required: "Designation is required" }}
                >
                  <option value="">Select Designation</option>
                  {designations.map((designation) => (
                    <option key={designation._id} value={designation._id}>
                      {designation.designation_name}
                    </option>
                  ))}
                </FormInput>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column - Profile Picture Upload */}
          <Col lg={6}>
            <Card>
              <Card.Body className="text-center">
                <h5 className="text-uppercase mt-0 mb-3">Profile Picture</h5>
                <FileUploader
                  onFileUpload={(files) =>
                    handleFileUpload(Array.from(files), setProfileImage)
                  }
                />
                {profileImage && (
                  <Image
                    src={URL.createObjectURL(profileImage)}
                    alt="Profile Preview"
                    className="mt-3"
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                  />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Address Information */}
        <Row>
          <Col lg={12}>
            <Card className="mt-3">
              <Card.Body>
                <h5 className="text-uppercase mt-0 mb-3">
                  Address Information
                </h5>
                <Row>
                  <Col md={6}>
                    <FormInput
                      name="street_address"
                      label="Street Address"
                      placeholder="Enter street address"
                      containerClass="mb-3"
                      register={register}
                      errors={formErrors}
                      validation={{ required: "Street address is required" }}
                    />
                  </Col>
                  
                  {/* Country Selection */}
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Country</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.country ? "is-invalid" : ""
                        }`}
                      >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                          <option key={country._id} value={country.id}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                      {errors.country && (
                        <div className="invalid-feedback">{errors.country}</div>
                      )}
                     
                    </div>
                  </Col>
                  
                  {/* State Selection */}
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">State</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.state ? "is-invalid" : ""
                        }`}
                        disabled={!formData.country}
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state._id} value={state.id}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                      {errors.state && (
                        <div className="invalid-feedback">{errors.state}</div>
                      )}
                    </div>
                  </Col>
                  
                  {/* City Selection */}
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">City</label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.city ? "is-invalid" : ""
                        }`}
                        disabled={!formData.state}
                      >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                          <option key={city._id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                      {errors.city && (
                        <div className="invalid-feedback">{errors.city}</div>
                      )}
                    </div>
                  </Col>
                  
                  {/* District Selection */}
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">District</label>
                      <select
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.district ? "is-invalid" : ""
                        }`}
                        disabled={!formData.state}
                      >
                        <option value="">Select District</option>
                        {districts.map((district) => (
                          <option key={district._id} value={district.district_name}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                      {errors.district && (
                        <div className="invalid-feedback">{errors.district}</div>
                      )}
                    </div>
                  </Col>
                  
                  <Col md={6}>
                    <FormInput
                      name="pincode"
                      label="Pincode"
                      placeholder="Enter pincode"
                      containerClass="mb-3"
                      register={register}
                      errors={formErrors}
                      validation={{ required: "Pincode is required" }}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Aadhaar & PAN Details */}
        <Row>
          <Col lg={12}>
            <Card className="mt-3">
              <Card.Body>
                <h5 className="text-uppercase mt-0 mb-3">
                  Identification Details
                </h5>
                <Row>
                  <Col md={6}>
                    <FormInput
                      name="aadhar_number"
                      label="Aadhaar Number"
                      placeholder="Enter Aadhaar number"
                      containerClass="mb-3"
                      register={register}
                      errors={formErrors}
                      validation={{ required: "Aadhaar number is required" }}
                    />
                    <div className="mb-3">
                      <label className="form-label">Aadhaar Card Image</label>
                      <FileUploader
                        onFileUpload={(files) =>
                          handleFileUpload(Array.from(files), setAadharImage)
                        }
                      />
                      {aadharImage && (
                        <Image
                          src={URL.createObjectURL(aadharImage)}
                          alt="Aadhaar Preview"
                          className="mt-3"
                          style={{ maxWidth: "100%", maxHeight: "200px" }}
                        />
                      )}
                    </div>
                  </Col>
                  <Col md={6}>
                    <FormInput
                      name="pan_number"
                      label="PAN Number"
                      placeholder="Enter PAN number"
                      containerClass="mb-3"
                      register={register}
                      errors={formErrors}
                      validation={{ required: "PAN number is required" }}
                    />
                    <div className="mb-3">
                      <label className="form-label">PAN Card Image</label>
                      <FileUploader
                        onFileUpload={(files) =>
                          handleFileUpload(Array.from(files), setPanImage)
                        }
                      />
                      {panImage && (
                        <Image
                          src={URL.createObjectURL(panImage)}
                          alt="PAN Preview"
                          className="mt-3"
                          style={{ maxWidth: "100%", maxHeight: "200px" }}
                        />
                      )}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Submit Button */}
        <Row className="mt-3 mb-4">
          <Col className="text-center">
            <Button variant="danger" className="me-2" onClick={() => navigate("/apps/organizations/employ/list")}>
              Cancel
            </Button>
            <Button type="submit" variant="success">
              Save
            </Button>
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default OrgEmployeeManagement;
