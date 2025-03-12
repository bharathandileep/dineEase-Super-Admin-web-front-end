import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import FileUploader from "../../../components/FileUploader";
import { FormInput } from "../../../components";
import {
  getOrgEmployeeById,
  updateOrgEmployee,
} from "../../../server/admin/orgemployeemanagment";
import { getAllDesignations } from "../../../server/admin/designations";
import { 
  getAllCountries, 
  getStatesByCountry, 
  getCitiesByState, 
  getDistrictsByState 
} from "../../../server/admin/addressDetails";

const OrgEmployeeEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aadharImage, setAadharImage] = useState<File | null>(null);
  const [aadharImagePreview, setAadharImagePreview] = useState<string | null>(null);
  const [panImage, setPanImage] = useState<File | null>(null);
  const [panImagePreview, setPanImagePreview] = useState<string | null>(null);
  const [designations, setDesignations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [orgemployee, setEmployee] = useState<any>(null);
  const [orgnzEmpLoading, setOrgnzEmpLoading] = useState(false);

  // Location state management
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    country: "",
    state: "",
    city: "",
    district: ""
  });
  
  const [addressDataLoaded, setAddressDataLoaded] = useState(false);
  const [orgEmpLoading, setOrgEmpLoading] = useState(false);

  // Validation Schema
  const schema = yup.object().shape({
    username: yup.string().required("Employee name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone_number: yup.string().required("Phone number is required"),
    designation: yup.string().required("Designation is required"),
    street_address: yup.string().required("Street address is required"),
    city: yup.string().required("City is required"),
    pincode: yup.string().required("Pincode is required"),
    district: yup.string().required("district is required"),
    state: yup.string().required("State is required"),
    country: yup.string().required("Country is required"),
    aadhar_number: yup.string().required("Aadhaar number is required"),
    pan_number: yup.string().required("PAN number is required"),
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(schema) });

  // Fetch employee data
  useEffect(() => {
    const fetchEmployeeData = async () => {
      setLoading(true);
      try {
        if (id) {
          const response = await getOrgEmployeeById(id);
          if (response.status) {
            setEmployee(response.data);
            if (response.data.profile_picture) {
              setImagePreview(response.data.profile_picture);
            }
            if (response.data.aadhar_image) {
              setAadharImagePreview(response.data.aadhar_image);
            }
            if (response.data.pan_image) {
              setPanImagePreview(response.data.pan_image);
            }
            if (response.data.address) {
              setFormData({
                country: response.data.address.country || "",
                state: response.data.address.state || "",
                city: response.data.address.city || "",
                district: response.data.address.district || ""
              });
            }
          } else {
            toast.error(response.message);
          }
        } else {
          toast.error("Employee ID not found.");
        }
      } catch (error: any) {
        console.error("Error fetching employee:", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeData();
  }, [id]);

  // Fetch designations and countries on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const response = await getAllDesignations({ page: 1, limit: 100 });
        if (response.status) {
          setDesignations(response.data.designations);
        } else {
          toast.error(response.message);
        }
        await fetchCountries();
      } catch (error: any) {
        console.error("Error fetching initial data:", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Set form values when employee and designations are available
  useEffect(() => {
    if (orgemployee && designations.length > 0) {
      setValue("username", orgemployee.username);
      setValue("email", orgemployee.email);
      setValue("phone_number", orgemployee.phone_number);
      setValue("designation", orgemployee.designation?._id || orgemployee.designation);
      
      if (orgemployee.address) {
        setValue("street_address", orgemployee.address.street_address || "");
        setValue("city", orgemployee.address.city || "");
        setValue("district", orgemployee.address.district || "");
        setValue("pincode", orgemployee.address.pincode || "");
      }
      setValue("aadhar_number", orgemployee.aadhar_number || "");
      setValue("pan_number", orgemployee.pan_number || "");

      // Load address data
      const loadAddressData = async () => {
        if (!addressDataLoaded) {
          setAddressDataLoaded(true);
          try {
            if (orgemployee.address.country) {
              await fetchStates(orgemployee.address.country);
              setValue("country", orgemployee.address.country);
            }
            if (orgemployee.address.state) {
              await fetchCities(orgemployee.address.state);
              await fetchDistricts(orgemployee.address.state);
              setValue("state", orgemployee.address.state);
            }
          } catch (error: any) {
            console.error("Error loading address data:", error);
            toast.error(error.message);
          }
        }
      };
      loadAddressData();
    }
  }, [orgemployee, designations, setValue, addressDataLoaded]);

  // Location data fetching functions
  const fetchCountries = async () => {
    try {
      const data = await getAllCountries(); 
      if (data?.success) {
        setCountries(data.data);
      }
    } catch (error: any) {
      console.error("Error fetching countries:", error);
    }
  };
  
  const fetchStates = async (countryName: string) => {
    try {
      const data = await getStatesByCountry(countryName); 
      if (data?.success) {
        setStates(data.data);
      }
    } catch (error: any) {
      console.error("Error fetching states:", error);
    }
  };
  
  const fetchCities = async (stateName: string) => {
    try {
      const data = await getCitiesByState(stateName);
      if (data?.success) {
        setCities(data.data);
      }
    } catch (error: any) {
      console.error("Error fetching cities:", error);
    }
  };
  
  const fetchDistricts = async (stateId: string) => {
    try {
      const data = await getDistrictsByState(stateId);
      if (data?.success) {
        setDistricts(data.data);
      }
    } catch (error: any) {
      console.error("Error fetching districts:", error);
    }
  };

  // Handle location selection changes
  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValue(name, value);

    if (name === "country") {
      await fetchStates(value);
      setFormData((prev) => ({ ...prev, state: "", city: "", district: "" }));
      setValue("state", "");
      setValue("city", "");
      setValue("district", "");
    } else if (name === "state") {
      await fetchCities(value);
      await fetchDistricts(value);
      setFormData((prev) => ({ ...prev, city: "", district: "" }));
      setValue("city", "");
      setValue("district", "");
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setOrgEmpLoading(true);
      const formData = new FormData();
      formData.append("entity_id", "67aae02e315c11088adaf6b7");
      formData.append("entity_type", "Organization");
      formData.append("designation", data.designation);
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("phone_number", data.phone_number);
      formData.append("role", "Employee");
      formData.append("employee_status", "Active");
      formData.append("aadhar_number", data.aadhar_number);
      formData.append("pan_number", data.pan_number);

      formData.append("street_address", data.street_address);
      formData.append("city", data.city);
      formData.append("district", data.district);
      formData.append("pincode", data.pincode);
      formData.append("state", data.state);
      formData.append("country", data.country);

      if (profileImage) {
        formData.append("profile_picture", profileImage);
      }
      if (aadharImage) {
        formData.append("aadhar_image", aadharImage);
      }
      if (panImage) {
        formData.append("pan_image", panImage);
      }

      if (id) {
        const response = await updateOrgEmployee(id, formData);
        if (response.status) {
          toast.success("Employee updated successfully!");
          navigate("/apps/organizations/employee/list");
        } else {
          toast.error(response.message || "Failed to update employee.");
        }
      } else {
        toast.error("Employee ID not found.");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setOrgEmpLoading(false);
    }
  };

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setProfileImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleAadharFileUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setAadharImage(file);
      const previewUrl = URL.createObjectURL(file);
      setAadharImagePreview(previewUrl);
    }
  };

  const handlePanFileUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setPanImage(file);
      const previewUrl = URL.createObjectURL(file);
      setPanImagePreview(previewUrl);
    }
  };

  return (
    <div className="container py-2">
      <Card className="mb-2">
        <Card.Body>
          <h3 className="text-uppercase">Edit Organisation Employee</h3>
        </Card.Body>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
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
                  errors={errors}
                  control={control}
                />
                <FormInput
                  name="email"
                  label="Email"
                  placeholder="Enter email"
                  containerClass="mb-3"
                  register={register}
                  errors={errors}
                  control={control}
                  type="email"
                />
                <FormInput
                  name="phone_number"
                  label="Phone Number"
                  placeholder="Enter phone number"
                  containerClass="mb-3"
                  register={register}
                  errors={errors}
                  control={control}
                />
                <FormInput
                  name="designation"
                  label="Designation"
                  containerClass="mb-3"
                  register={register}
                  errors={errors}
                  control={control}
                  type="select"
                >
                  <option value="">Select Designation</option>
                  {designations?.map((designation) => (
                    <option
                      key={designation._id}
                      value={designation._id}
                    >
                      {designation.designation_name}
                    </option>
                  ))}
                </FormInput>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card>
              <Card.Body className="text-center">
                <h5 className="text-uppercase mt-0 mb-3">Profile Picture</h5>
                {imagePreview && (
                  <div className="mb-3">
                    <img
                      src={imagePreview}
                      alt="Profile Preview"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "200px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                )}
                <FileUploader
                  onFileUpload={(files) => handleFileUpload(Array.from(files))}
                />
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
                      errors={errors}
                      control={control}
                    />
                  </Col>
                  {/* Country Selection */}
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Country</label>
                      <select
                        {...register("country")}
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.country ? "is-invalid" : ""
                        }`}
                      >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                          <option 
                            key={country._id} 
                            value={country.id}
                          >
                            {country.name}
                          </option>
                        ))}
                      </select>
                      {errors.country && (
                        <div className="invalid-feedback">{errors.country.message}</div>
                      )}
                    </div>
                  </Col>
                  {/* State Selection */}
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">State</label>
                      <select
                        {...register("state")}
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
                          <option 
                            key={state._id} 
                            value={state.id}
                          >
                            {state.name}
                          </option>
                        ))}
                      </select>
                      {errors.state && (
                        <div className="invalid-feedback">{errors.state.message}</div>
                      )}
                    </div>
                  </Col>
                  {/* City Selection */}
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">City</label>
                      <select
                        {...register("city")}
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
                          <option 
                            key={city._id} 
                            value={city.id}
                          >
                            {city.name}
                          </option>
                        ))}
                      </select>
                      {errors.city && (
                        <div className="invalid-feedback">{errors.city.message}</div>
                      )}
                    </div>
                  </Col>
                  {/* District Selection */}
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">District</label>
                      <select
                        {...register("district")}
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
                          <option 
                            key={district._id} 
                            value={district.id}
                          >
                            {district.name}
                          </option>
                        ))}
                      </select>
                      {errors.district && (
                        <div className="invalid-feedback">{errors.district.message}</div>
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
                      errors={errors}
                      control={control}
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
                      errors={errors}
                      control={control}
                    />
                  </Col>
                  <Col md={6}>
                    <FormInput
                      name="pan_number"
                      label="PAN Number"
                      placeholder="Enter PAN number"
                      containerClass="mb-3"
                      register={register}
                      errors={errors}
                      control={control}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <Card>
                      <Card.Body className="text-center">
                        <h5 className="text-uppercase mt-0 mb-3">
                          Aadhaar Card
                        </h5>
                        {aadharImagePreview && (
                          <div className="mb-3">
                            <img
                              src={aadharImagePreview}
                              alt="Aadhaar Preview"
                              style={{
                                maxWidth: "200px",
                                maxHeight: "200px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          </div>
                        )}
                        <FileUploader
                          onFileUpload={(files) =>
                            handleAadharFileUpload(Array.from(files))
                          }
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg={6}>
                    <Card>
                      <Card.Body className="text-center">
                        <h5 className="text-uppercase mt-0 mb-3">PAN Card</h5>
                        {panImagePreview && (
                          <div className="mb-3">
                            <img
                              src={panImagePreview}
                              alt="PAN Preview"
                              style={{
                                maxWidth: "200px",
                                maxHeight: "200px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          </div>
                        )}
                        <FileUploader
                          onFileUpload={(files) =>
                            handlePanFileUpload(Array.from(files))
                          }
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-3 mb-4">
          <Col className="text-end">
            <Button
              variant="danger"
              className="me-2"
              onClick={() => navigate("/apps/organizations/employ/list")}
            >
              Cancel
            </Button>
            <Button type="submit" variant="success" disabled={orgEmpLoading}>
              {orgEmpLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />
                  <span
                    className="spinner-grow spinner-grow-sm"
                    role="status"
                  />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default OrgEmployeeEdit;