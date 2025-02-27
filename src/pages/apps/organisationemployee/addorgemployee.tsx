import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Button,Image } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import FileUploader from "../../../components/FileUploader";
import { FormInput } from "../../../components";
import { createOrgEmployee } from "../../../server/admin/orgEmployeeManagment";
import { getAllDesignations } from "../../../server/admin/designations";

const OrgEmployeeManagement = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<File | null>(null);
    const [aadharImage, setAadharImage] = useState<File | null>(null);
    const [panImage, setPanImage] = useState<File | null>(null);
  const [designations, setDesignations] = useState<{ _id: string; designation_name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch designations on component mount
  useEffect(() => {
    const fetchDesignations = async () => {
      setLoading(true);
      try {
        const response = await getAllDesignations( {page:1,limit:10});
        if (response.status) {
          setDesignations(response.data.designations);
        } else {
          toast.error("Failed to load designations.");
        }
      } catch (error) {
        console.error("Error fetching designations:", error);
        toast.error("An error occurred while fetching designations.");
      } finally {
        setLoading(false);
      }
    };
    fetchDesignations();
  }, []);

  // React Hook Form setup
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  // Handle Form Submission
  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();

      formData.append("entity_id", "67aad807dcbe481e9d130696");
      formData.append("entity_type", "Organization");
      formData.append("designation", data.designation);
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("phone_number", data.phone_number);
      formData.append("role", "Employee");
      formData.append("employee_status", "Active");
      formData.append("aadhar_number", data.aadhar_number);
      formData.append("pan_number", data.pan_number);

      // Address Fields
      formData.append("street_address", data.street_address);
      formData.append("city", data.city);
      formData.append("district", data.district);
      formData.append("pincode", data.pincode);
      formData.append("state", data.state);
      formData.append("country", data.country);

      // Profile Picture Upload
      if (profileImage) {
        formData.append("profile_picture", profileImage);
      }
        // Aadhaar Card Upload
        if (aadharImage) {
          formData.append("aadhar_image", aadharImage);
        }
  
        // PAN Card Upload
        if (panImage) {
          formData.append("pan_image", panImage);
        }

      const response = await createOrgEmployee(formData);

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

  // Handle File Upload
  const handleFileUpload = (files: File[], setImage: React.Dispatch<React.SetStateAction<File | null>>) => {
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
                <h5 className="text-uppercase mt-0 mb-3">General Information</h5>
                <FormInput
                  name="username"
                  label="Employee Name"
                  placeholder="Enter full name"
                  containerClass="mb-3"
                  register={register}
                  errors={errors}
                  validation={{ required: "Employee name is required" }}
                />
                <FormInput
                  name="email"
                  label="Email"
                  placeholder="Enter email"
                  containerClass="mb-3"
                  register={register}
                  errors={errors}
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
                  errors={errors}
                  validation={{ required: "Phone number is required" }}
                />
                <FormInput
                  name="designation"
                  label="Designation"
                  containerClass="mb-3"
                  register={register}
                  errors={errors}
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
                <FileUploader onFileUpload={(files) => handleFileUpload(Array.from(files), setProfileImage)} />
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
                <h5 className="text-uppercase mt-0 mb-3">Address Information</h5>
                <Row>
                  <Col md={6}>
                    <FormInput
                      name="street_address"
                      label="Street Address"
                      placeholder="Enter street address"
                      containerClass="mb-3"
                      register={register}
                      errors={errors}
                      validation={{ required: "Street address is required" }}
                    />
                  </Col>
                  <Col md={6}>
                    <FormInput
                      name="city"
                      label="City"
                      placeholder="Enter city"
                      containerClass="mb-3"
                      register={register}
                      errors={errors}
                      validation={{ required: "City is required" }}
                    />
                  </Col>
                  <Col md={6}>
                    <FormInput
                      name="pincode"
                      label="Pincode"
                      placeholder="Enter pincode"
                      containerClass="mb-3"
                      register={register}
                      errors={errors}
                      validation={{ required: "Pincode is required" }}
                    />
                  </Col>
                  <Col md={6}>
                    <FormInput
                      name="district"
                      label="District"
                      placeholder="Enter district"
                      containerClass="mb-3"
                      register={register}
                      errors={errors}
                      validation={{ required: "District is required" }}
                    />
                  </Col>
                  <Col md={6}>
                    <FormInput
                      name="state"
                      label="State"
                      placeholder="Enter state"
                      containerClass="mb-3"
                      register={register}
                      errors={errors}
                      validation={{ required: "State is required" }}
                    />
                  </Col>
                  <Col md={6}>
                    <FormInput
                      name="country"
                      label="Country"
                      placeholder="Enter country"
                      containerClass="mb-3"
                      register={register}
                      errors={errors}
                      validation={{ required: "Country is required" }}
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
                <h5 className="text-uppercase mt-0 mb-3">Identification Details</h5>
                <Row>
                  <Col md={6}>
                    <FormInput
                      name="aadhar_number"
                      label="Aadhaar Number"
                      placeholder="Enter Aadhaar number"
                      containerClass="mb-3"
                      register={register}
                      errors={errors}
                      validation={{ required: "Aadhaar number is required" }}
                    />
                    <div className="mb-3">
                      <label className="form-label">Aadhaar Card Image</label>
                      <FileUploader onFileUpload={(files) => handleFileUpload(Array.from(files), setAadharImage)} />
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
                      errors={errors}
                      validation={{ required: "PAN number is required" }}
                    />
                    <div className="mb-3">
                      <label className="form-label">PAN Card Image</label>
                      <FileUploader onFileUpload={(files) => handleFileUpload(Array.from(files), setPanImage)} />
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
        <Row>
          <Col className="text-center">
            <Button variant="light" className="me-2" onClick={() => navigate("/apps/organizations/employee/list")}>
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