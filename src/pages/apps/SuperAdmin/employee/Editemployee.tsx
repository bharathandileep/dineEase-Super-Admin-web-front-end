import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import FileUploader from "../../../../components/FileUploader";
import { FormInput } from "../../../../components";
import {
  getEmployeeById,
  updateEmployee,
} from "../../../../server/admin/employeemanagment";
import { getAllDesignations } from "../../../../server/admin/designations";
import {
  getAllCountries,
  getStatesByCountry,
  getCitiesByState,
  getDistrictsByState,
} from "../../../../server/admin/addressDetails";
import { useAuthDetails } from "../../../../hooks/useAuthDetails";
import { getDesignation } from "../../../../server/admin/orgemployeemanagment";

const EditEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { context } = useAuthDetails();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aadharImage, setAadharImage] = useState<File | null>(null);
  const [aadharImagePreview, setAadharImagePreview] = useState<string | null>(
    null
  );
  const [panImage, setPanImage] = useState<File | null>(null);
  const [panImagePreview, setPanImagePreview] = useState<string | null>(null);
  const [designations, setDesignations] = useState<
    { _id: string; roleName: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState<any>(null);
  const [adminEmpLoading, setAdminEmpLoading] = useState(false);

  // Location state management
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    country: "",
    state: "",
    city: "",
    district: "",
  });

  // Validation Schema
  const schema = yup.object().shape({
    fullName: yup.string().required("Employee name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone_number: yup.string().required("Phone number is required"),
    designation: yup.string().required("Designation is required"),
    street_address: yup.string().required("Street address is required"),
    city: yup.string().required("City is required"),
    pincode: yup.string().required("Pincode is required"),
    district: yup.string().required("District is required"),
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

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const response = await getDesignation(
          context?.contextId,
          context?.contextType
        );
        if (response.status) {
          setDesignations(response.data);
        } else {
          toast.error("Failed to load designations.");
        }
        const countryResponse = await getAllCountries();
        if (countryResponse?.success) {
          setCountries(countryResponse.data);
        } else {
          toast.error("Failed to load countries.");
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("An error occurred while loading initial data.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch employee data and populate form
  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!id) {
        toast.error("Invalid employee ID.");
        return;
      }

      setLoading(true);
      try {
        const response = await getEmployeeById(id);
        if (response.status) {
          const empData = response.data;
          setEmployee(empData);

          // Set basic fields
          setValue("fullName", empData.fullName || "");
          setValue("email", empData.email || "");
          setValue("phone_number", empData.phone_number || "");
          setValue("designation", empData.roleName);
          setValue("aadhar_number", empData.aadhar_number || "");
          setValue("pan_number", empData.pan_number || "");
          if (empData.profile_picture) setImagePreview(empData.profile_picture);
          if (empData.aadhar_image) setAadharImagePreview(empData.aadhar_image);
          if (empData.pan_image) setPanImagePreview(empData.pan_image);
          if (empData.address) {
            setValue("street_address", empData.address.street_address || "");
            setValue("pincode", empData.address.pincode || "");
            const countryId = empData.address.country_id || "";
            const stateId = empData.address.state_id || "";
            const cityId = empData.address.city_id || "";
            const districtId = empData.address.district_id || "";

            setFormData({
              country: countryId,
              state: stateId,
              city: cityId,
              district: districtId,
            });

            // Set form values with IDs
            setValue("country", countryId);
            if (countryId) {
              await fetchStates(countryId);
              setValue("state", stateId);
            }
            if (stateId) {
              await fetchCities(stateId);
              await fetchDistricts(stateId);
              setValue("city", cityId);
              setValue("district", districtId);
            }
          }
        } else {
          toast.error("Failed to load employee data.");
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
        toast.error("An error occurred while fetching employee data.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeData();
  }, [id, setValue]);

  // Location data fetching functions
  const fetchStates = async (countryId: string) => {
    try {
      const data = await getStatesByCountry(countryId);
      if (data?.success) {
        setStates(data.data);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchCities = async (stateId: string) => {
    try {
      const data = await getCitiesByState(stateId);
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
    setValue(name, value);

    if (name === "country") {
      setStates([]);
      setCities([]);
      setDistricts([]);
      setFormData((prev) => ({ ...prev, state: "", city: "", district: "" }));
      setValue("state", "");
      setValue("city", "");
      setValue("district", "");
      if (value) await fetchStates(value);
    } else if (name === "state") {
      setCities([]);
      setDistricts([]);
      setFormData((prev) => ({ ...prev, city: "", district: "" }));
      setValue("city", "");
      setValue("district", "");
      if (value) {
        await fetchCities(value);
        await fetchDistricts(value);
      }
    }
  };

  // Handle form submission
  const onSubmit = async (data: any) => {
    try {
      setAdminEmpLoading(true);
      const formDataToSubmit = new FormData();

      formDataToSubmit.append(
        "entity_id",
        (context?.contextId ?? "").toString()
      );
      formDataToSubmit.append(
        "entity_type",
        (context?.contextType ?? "").toString()
      );
      formDataToSubmit.append("designation", data.designation);
      formDataToSubmit.append("fullName", data.fullName);
      formDataToSubmit.append("email", data.email);
      formDataToSubmit.append("phone_number", data.phone_number);
      formDataToSubmit.append("aadhar_number", data.aadhar_number);
      formDataToSubmit.append("pan_number", data.pan_number);
      formDataToSubmit.append("street_address", data.street_address);
      formDataToSubmit.append("city", data.city);
      formDataToSubmit.append("district", data.district);
      formDataToSubmit.append("pincode", data.pincode);
      formDataToSubmit.append("state", data.state);
      formDataToSubmit.append("country", data.country);

      if (profileImage)
        formDataToSubmit.append("profile_picture", profileImage);
      if (aadharImage) formDataToSubmit.append("aadhar_image", aadharImage);
      if (panImage) formDataToSubmit.append("pan_image", panImage);

      if (id) {
        const response = await updateEmployee(id, formDataToSubmit);
        if (response.status) {
          toast.success(response.message);
          console.log(response.data._id);
          navigate(`/apps/admin/employee/${response.data._id}`);
        } else {
          toast.error(response.message || "Failed to update employee.");
        }
      } else {
        toast.error("Invalid employee ID.");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Error updating employee. Please try again.");
    } finally {
      setAdminEmpLoading(false);
    }
  };

  // Handle file uploads
  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAadharFileUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setAadharImage(file);
      setAadharImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePanFileUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setPanImage(file);
      setPanImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="container py-2">
      <Card className="mb-2">
        <Card.Body>
          <h3 className="text-uppercase">Edit Employee</h3>
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
                  name="fullName"
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
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Email cannot be changed"
                  disabled
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
                  {designations.map((designation) => (
                    <option key={designation._id} value={designation.roleName}>
                      {designation.roleName}
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
                          <option key={country._id} value={country.id}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                      {errors.country && (
                        <div className="invalid-feedback">
                          {errors.country.message}
                        </div>
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
                          <option key={state._id} value={state.id}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                      {errors.state && (
                        <div className="invalid-feedback">
                          {errors.state.message}
                        </div>
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
                          <option key={district._id} value={district.id}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                      {errors.district && (
                        <div className="invalid-feedback">
                          {errors.district.message}
                        </div>
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
                          <option key={city._id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                      {errors.city && (
                        <div className="invalid-feedback">
                          {errors.city.message}
                        </div>
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

        {/* Identification Details */}
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
              onClick={() => navigate(`/apps/employee/details/${id}`)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="success" disabled={adminEmpLoading}>
              {adminEmpLoading ? (
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

export default EditEmployee;
