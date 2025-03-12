import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Check, CheckCircle } from "lucide-react";
import { FileUpload } from "../../../../components/FileUpload";
import {
  createNewOrg,
  getOrgDetails,
  orgGetAllCategories,
  orgGetSubcategoriesByCategory,
  updateOrgDetails,
} from "../../../../server/admin/organization";
import { toast } from "react-toastify";
import { appendToFormData } from "../../../../helpers/formdataAppend";
import { useNavigate, useParams } from "react-router-dom";
import { Col, ProgressBar, Row } from "react-bootstrap";
import "./FormWizard.scss";
import { Stepper } from "../../../../components/Stepper";
import { getAllCountries, getCitiesByState, getDistrictsByState, getStatesByCountry } from "../../../../server/admin/addressDetails";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

interface WizardFormProps {
  initialData?: any;
}

interface FormData {
  // Step 1
  organizationName: string;
  role: string;
  managerName: string;
  registerNumber: string;
  contactNumber: string;
  email: string;
  numberOfEmployees: string;
  organizationLogo?: any;
  addressType: "Home" | "Office" | "Other";
  streetAddress: string;
  district: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  // Step 2
  panNumber: string;
  panCardUserName: string;
  panCardImage?: any;
  gstNumber: string;
  gstCertificateImage?: any;
  expiryDate: string;
  category: string;
  subcategoryName: string;
  isapproved?: boolean; // Added isapproved to FormData
}

const initialFormData: FormData = {
  organizationLogo: "",
  role: "User",
  organizationName: "",
  managerName: "",
  registerNumber: "",
  contactNumber: "",
  email: "",
  numberOfEmployees: "",
  addressType: "Office",
  streetAddress: "",
  district: "",
  city: "",
  state: "",
  pincode: "",
  country: "",
  panNumber: "",
  panCardUserName: "",
  gstNumber: "",
  expiryDate: "",
  gstCertificateImage: "",
  panCardImage: "",
  category: "",
  subcategoryName: "",
  isapproved: false, 
};

export function WizardForm({ initialData }: WizardFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const { userLoggedIn, user,  } = useSelector(
    (state: RootState) => state.Auth
  )

  const navigate = useNavigate();
  const { id } = useParams();

  const steps = [
    { number: 1, title: "Personal Info" },
    { number: 2, title: "Documents" },
  ];

  const validateStep1 = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.organizationName) newErrors.organizationName = "Required";
    if (!formData.managerName) newErrors.managerName = "Required";
    if (!formData.registerNumber) newErrors.registerNumber = "Required";
    if (!formData.contactNumber) {
      newErrors.contactNumber = "Required";
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Invalid phone number";
    }
    if (!formData.email) {
      newErrors.email = "Required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }
    if (!formData.numberOfEmployees) newErrors.numberOfEmployees = "Required";
    if (!formData.organizationLogo) newErrors.organizationLogo = "Required";
    if (!formData.streetAddress) newErrors.streetAddress = "Required";
    if (!formData.district) newErrors.district = "Required";
    if (!formData.city) newErrors.city = "Required";
    if (!formData.state) newErrors.state = "Required";
    if (!formData.pincode) newErrors.pincode = "Required";
    if (!formData.country) newErrors.country = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.panNumber) {
      newErrors.panNumber = "Invalid PAN number (must be 10 elements)";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
      newErrors.panNumber = "Invalid PAN number (must be 10 elements)";
    }
    if (!formData.panCardUserName) newErrors.panCardUserName = "Required";
    if (!formData.panCardImage) newErrors.panCardImage = "Required";
    if (!formData.gstNumber) {
      newErrors.gstNumber = "Invalid GST number (must be 15 elements)";
    } else if (
      !/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/.test(
        formData.gstNumber
      )
    ) {
      newErrors.gstNumber = "Invalid GST number (must be 15 elements)";
    }
    if (!formData.gstCertificateImage) newErrors.gstCertificateImage = "Required";
    if (!formData.expiryDate) newErrors.expiryDate = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchCountries = async () => {
    try {
      const data = await getAllCountries();
      if (data?.success) setCountries(data.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchStates = async (countryName: string) => {
    try {
      const data = await getStatesByCountry(countryName);
      if (data?.success) setStates(data.data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchCities = async (stateName: string) => {
    try {
      const data = await getCitiesByState(stateName);
      if (data?.success) setCities(data.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchDistricts = async (stateId: string) => {
    try {
      const data = await getDistrictsByState(stateId);
      if (data?.success) setDistricts(data.data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      initialData ? handleEdit() : handleSubmit();
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      const OrgFormData = appendToFormData(formData);
      const response = await updateOrgDetails(id, OrgFormData);
      if (response.status) {
        toast.success(response.message);
        navigate("/apps/organizations/list");
      } else {
        toast.error(response.message || "Update failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const orgFormData = appendToFormData(formData);
      const response = await createNewOrg(orgFormData);
      if (response.status) {
        toast.success(response.message);
        user?navigate("/apps/organizations/list"):navigate("dashboard/organization-list")
        navigate("/apps/organizations/list");
      } else {
        toast.error(response.message || "Creation failed. Please try again.");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await orgGetAllCategories({ page: 1, limit: 100 });
        if (response.status) setCategories(response.data.categories);
        else toast.error("Failed to load categories.");
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("An error occurred while fetching categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      const fetchSubcategories = async () => {
        try {
          const response = await orgGetSubcategoriesByCategory(selectedCategoryId);
          if (response.status) setSubcategories(response.data);
          else toast.error("Failed to load subcategories.");
        } catch (error) {
          console.error("Error fetching subcategories:", error);
          toast.error("An error occurred while fetching subcategories.");
        }
      };
      fetchSubcategories();
    } else {
      setSubcategories([]);
    }
  }, [selectedCategoryId]);

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

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchOrgDetails = async () => {
      try {
        const response = await getOrgDetails(id);
        const orgData = response.data;

        setFormData((prevFormData) => ({
          ...prevFormData,
          organizationName: orgData?.organizationName || "",
          organizationLogo: orgData?.organizationLogo,
          managerName: orgData?.managerName || "",
          registerNumber: orgData?.register_number || "",
          contactNumber: orgData?.contact_number || "",
          category: orgData?.category || "",
          subcategoryName: orgData?.subcategoryName || "",
          email: orgData?.email || "",
          numberOfEmployees: orgData?.no_of_employees.toString() || "",
          addressType: orgData?.addresses[0]?.address_type || "Office",
          streetAddress: orgData?.addresses[0]?.street_address || "",
          district: orgData?.addresses[0]?.district_id || "",
          city: orgData?.addresses[0]?.city_id || "",
          state: orgData?.addresses[0]?.state_id || "",
          pincode: orgData?.addresses[0]?.pincode || "",
          country: orgData?.addresses[0]?.country_id || "",
          panNumber: orgData?.panDetails[0]?.pan_card_number || "",
          panCardUserName: orgData?.panDetails[0]?.pan_card_user_name || "",
          gstNumber: orgData?.gstDetails[0]?.gst_number || "",
          expiryDate: orgData?.gstDetails[0]?.expiry_date || "",
          gstCertificateImage: orgData?.gstDetails[0]?.gst_certificate_image || "",
          panCardImage: orgData?.panDetails[0]?.pan_card_image || "",
          isapproved: orgData?.isapproved || false, // Fetch isapproved status
        }));

        if (response.data.addresses?.[0]?.country_id) {
          await fetchStates(orgData?.addresses[0]?.country_id);
        }
        if (orgData?.addresses[0]?.state_id) {
          await fetchCities(orgData?.addresses[0]?.state_id);
          await fetchDistricts(orgData?.addresses[0]?.state_id);
        }
      } catch (error) {
        console.error("Error fetching organization details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrgDetails();
  }, [id]);

  return (
    <div className="container py-2">
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <div className="card d-flex flex-column align-items-center">
            <div className="col-lg-8 justify-content-center">
              <Stepper steps={steps} currentStep={currentStep} />
            </div>
            <div className="card-body p-4">
              <form onSubmit={(e) => e.preventDefault()}>
                {currentStep === 1 && (
                  <div>
                    <h2 className="card-title mb-4">Basic Details</h2>
                    <div className="row g-3">
                      {/* Approval Status Display */}
                      {id && (
                        <div className="col-12 mb-3">
                          <div className="form-group">
                            <label className="form-label">Approval Status</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.isapproved ? "Approved" : "Pending Approval"}
                              readOnly
                            />
                          </div>
                        </div>
                      )}

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Organization Name</label>
                          <input
                            type="text"
                            name="organizationName"
                            value={formData.organizationName}
                            onChange={handleChange}
                            className={`form-control ${errors.organizationName ? "is-invalid" : ""}`}
                          />
                          {errors.organizationName && (
                            <div className="invalid-feedback">{errors.organizationName}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Manager Name</label>
                          <input
                            type="text"
                            name="managerName"
                            value={formData.managerName}
                            onChange={handleChange}
                            className={`form-control ${errors.managerName ? "is-invalid" : ""}`}
                          />
                          {errors.managerName && (
                            <div className="invalid-feedback">{errors.managerName}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Register Number</label>
                          <input
                            type="text"
                            name="registerNumber"
                            value={formData.registerNumber}
                            onChange={handleChange}
                            className={`form-control ${errors.registerNumber ? "is-invalid" : ""}`}
                          />
                          {errors.registerNumber && (
                            <div className="invalid-feedback">{errors.registerNumber}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Contact Number</label>
                          <input
                            type="tel"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            className={`form-control ${errors.contactNumber ? "is-invalid" : ""}`}
                          />
                          {errors.contactNumber && (
                            <div className="invalid-feedback">{errors.contactNumber}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                          />
                          {errors.email && (
                            <div className="invalid-feedback">{errors.email}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Number of Employees</label>
                          <input
                            type="number"
                            name="numberOfEmployees"
                            value={formData.numberOfEmployees}
                            onChange={handleChange}
                            className={`form-control ${errors.numberOfEmployees ? "is-invalid" : ""}`}
                          />
                          {errors.numberOfEmployees && (
                            <div className="invalid-feedback">{errors.numberOfEmployees}</div>
                          )}
                        </div>
                      </div>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label">Category</label>
                            <select
                              name="category"
                              value={formData.category}
                              onChange={(e) => {
                                const selectedCategory = e.target.value;
                                setFormData((prev) => ({
                                  ...prev,
                                  category: selectedCategory,
                                  subcategoryName: "",
                                }));
                                setSelectedCategoryId(selectedCategory);
                              }}
                              className="form-select form-control"
                            >
                              <option value="">Select Category</option>
                              {categories?.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                  {cat?.category}
                                </option>
                              ))}
                            </select>
                            {!categories.length && (
                              <div className="text-muted mt-1">Loading categories...</div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label">Subcategory</label>
                            <select
                              name="subcategoryName"
                              value={formData.subcategoryName}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  subcategoryName: e.target.value,
                                }))
                              }
                              className="form-select"
                              disabled={!formData.category}
                            >
                              <option value="">Select Subcategory</option>
                              {subcategories.map((sub) => (
                                <option key={sub._id} value={sub._id}>
                                  {sub?.subcategoryName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group">
                          <label className="form-label">Organization Logo</label>
                          <FileUpload
                            onFileSelect={(file) =>
                              setFormData((prev) => ({ ...prev, organizationLogo: file }))
                            }
                            value={formData.organizationLogo}
                            error={errors.organizationLogo}
                          />
                        </div>
                      </div>

                      <div className="col-12 mt-4">
                        <h3 className="h5 mb-3">Address Details</h3>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label className="form-label">Address Type</label>
                              <select
                                name="addressType"
                                value={formData.addressType}
                                onChange={handleChange}
                                className="form-select"
                              >
                                <option value="Home">Home</option>
                                <option value="Office">Office</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="form-group">
                              <label className="form-label">Street Address</label>
                              <input
                                type="text"
                                name="streetAddress"
                                value={formData.streetAddress}
                                onChange={handleChange}
                                className={`form-control ${errors.streetAddress ? "is-invalid" : ""}`}
                              />
                              {errors.streetAddress && (
                                <div className="invalid-feedback">{errors.streetAddress}</div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-group">
                              <label className="form-label">Country</label>
                              <select
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className={`form-control ${errors.country ? "is-invalid" : ""}`}
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
                          </div>

                          <div className="col-md-6">
                            <div className="form-group">
                              <label className="form-label">State</label>
                              <select
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className={`form-control ${errors.state ? "is-invalid" : ""}`}
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
                          </div>

                          <div className="col-md-6">
                            <div className="form-group">
                              <label className="form-label">City</label>
                              <select
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={`form-control ${errors.city ? "is-invalid" : ""}`}
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
                          </div>

                          <div className="col-md-6">
                            <div className="form-group">
                              <label className="form-label">District</label>
                              <select
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                className={`form-control ${errors.district ? "is-invalid" : ""}`}
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
                                <div className="invalid-feedback">{errors.district}</div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-group">
                              <label className="form-label">Pincode</label>
                              <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                className={`form-control ${errors.pincode ? "is-invalid" : ""}`}
                              />
                              {errors.pincode && (
                                <div className="invalid-feedback">{errors.pincode}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div>
                    <h2 className="card-title mb-4">PAN & GST Details</h2>
                    <div className="mb-4">
                      <h3 className="h5 mb-3">PAN Details</h3>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label">PAN Card Number</label>
                            <input
                              type="text"
                              name="panNumber"
                              value={formData.panNumber}
                              onChange={handleChange}
                              className={`form-control ${errors.panNumber ? "is-invalid" : ""}`}
                            />
                            {errors.panNumber && (
                              <div className="invalid-feedback">{errors.panNumber}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label">PAN Card User Name</label>
                            <input
                              type="text"
                              name="panCardUserName"
                              value={formData.panCardUserName}
                              onChange={handleChange}
                              className={`form-control ${errors.panCardUserName ? "is-invalid" : ""}`}
                            />
                            {errors.panCardUserName && (
                              <div className="invalid-feedback">{errors.panCardUserName}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="form-group">
                            <label className="form-label">PAN Card Image</label>
                            <FileUpload
                              onFileSelect={(file) =>
                                setFormData((prev) => ({ ...prev, panCardImage: file }))
                              }
                              value={formData.panCardImage}
                              error={errors.panCardImage}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="h5 mb-3">GST Details</h3>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label">GST Number</label>
                            <input
                              type="text"
                              name="gstNumber"
                              value={formData.gstNumber}
                              onChange={handleChange}
                              className={`form-control ${errors.gstNumber ? "is-invalid" : ""}`}
                            />
                            {errors.gstNumber && (
                              <div className="invalid-feedback">{errors.gstNumber}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label">Expiry Date</label>
                            <input
                              type="date"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleChange}
                              className={`form-control ${errors.expiryDate ? "is-invalid" : ""}`}
                            />
                            {errors.expiryDate && (
                              <div className="invalid-feedback">{errors.expiryDate}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="form-group">
                            <label className="form-label">GST Certificate Image</label>
                            <FileUpload
                              onFileSelect={(file) =>
                                setFormData((prev) => ({ ...prev, gstCertificateImage: file }))
                              }
                              value={formData.gstCertificateImage}
                              error={errors.gstCertificateImage}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="d-flex justify-content-between mt-4">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="btn btn-outline-secondary d-flex align-items-center"
                    >
                      <ChevronLeft className="me-2" />
                      Back
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn btn-primary d-flex align-items-center ms-auto"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                        <span className="spinner-grow spinner-grow-sm" role="status" />
                      </>
                    ) : (
                      <>
                        {currentStep === 2 ? "Submit" : "Next"}
                        {currentStep === 1 && <ChevronRight className="ms-2" />}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}