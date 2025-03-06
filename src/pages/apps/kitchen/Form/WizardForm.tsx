
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FileUpload } from "../../../../components/FileUpload";
import {
  createNewkitchen,
  getkitchenDetails,
  kitchensGetAllCategories,
  kitchensGetSubcategoriesByCategory,
  updatekitchenDetails,
} from "../../../../server/admin/kitchens";
import { toast } from "react-toastify";
import { appendToFormData } from "../../../../helpers/formdataAppend";
import { useNavigate, useParams } from "react-router-dom";
import { IKitchenDetails } from "../KitchensDetails";
import { Stepper } from "../../../../components/Stepper";
import {
  getAllCountries,
  getCitiesByState,
  getDistrictsByState,
  getStatesByCountry,
} from "../../../../server/admin/addressDetails";

interface WizardFormProps {
  initialData?: any;
}

interface FormData {
  kitchen_name: string;
  user_id: string;
  kitchen_status: string;
  kitchen_owner_name: string;
  owner_email: string;
  owner_phone_number: string;
  restaurant_type: string;
  kitchen_type: string;
  kitchen_phone_number: string;
  kitchen_image?: any;
  address_type: "Home" | "Office" | "Other";
  street_address: string;
  district: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  pan_card_number: string;
  pan_card_user_name: string;
  pan_card_image?: any;
  gst_number: string;
  gst_certificate_image?: any;
  gst_expiry_date: string;
  ffsai_certificate_number: string;
  ffsai_card_owner_name: string;
  ffsai_certificate_image?: any;
  ffsai_expiry_date: string;
  category: string;
  subcategoryName: string;
}

const initialFormData: FormData = {
  kitchen_name: "",
  user_id: "67a1fe128d946316957c42d8",
  kitchen_status: "Active",
  kitchen_owner_name: "",
  owner_email: "",
  owner_phone_number: "",
  restaurant_type: "",
  kitchen_type: "",
  kitchen_phone_number: "",
  address_type: "Home",
  street_address: "",
  district: "",
  city: "",
  state: "",
  pincode: "",
  country: "",
  pan_card_number: "",
  pan_card_user_name: "",
  gst_number: "",
  gst_expiry_date: "",
  ffsai_certificate_number: "",
  ffsai_card_owner_name: "",
  ffsai_expiry_date: "",
  kitchen_image: "",
  pan_card_image: "",
  gst_certificate_image: "",
  ffsai_certificate_image: "",
  category: "",
  subcategoryName: "",
};

export function WizardForm({ initialData }: WizardFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
const [kitchenData, setKitchenData] = useState<IKitchenDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [CategoryId, setCategoryId] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  const steps = [
    { number: 1, title: "Personal Info" },
    { number: 2, title: "Documents" },
  ];

  const validateStep1 = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.kitchen_name) newErrors.kitchen_name = "Required";
    if (!formData.kitchen_owner_name) newErrors.kitchen_owner_name = "Required";
    if (!formData.owner_email) {
      newErrors.owner_email = "Required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.owner_email)) {
      newErrors.owner_email = "Invalid email";
    }
    if (!formData.owner_phone_number) {
      newErrors.owner_phone_number = "Required";
    } else if (!/^\d{10}$/.test(formData.owner_phone_number)) {
      newErrors.owner_phone_number = "Invalid phone number";
    }
    if (!formData.restaurant_type) newErrors.restaurant_type = "Required";
    if (!formData.kitchen_type) newErrors.kitchen_type = "Required";
    if (!formData.kitchen_phone_number) {
      newErrors.kitchen_phone_number = "Required";
    } else if (!/^\d{10}$/.test(formData.kitchen_phone_number)) {
      newErrors.kitchen_phone_number = "Invalid kitchen phone number";
    }
    if (!formData.kitchen_image) newErrors.kitchen_image = "Required";
    if (!formData.street_address) newErrors.street_address = "Required";
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

    if (!formData.pan_card_number) {
      newErrors.pan_card_number = "Invalid PAN number(must be 10 elements)";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_card_number)) {
      newErrors.pan_card_number = "Invalid PAN number(must be 10 elements)";
    }

    if (!formData.pan_card_user_name) newErrors.pan_card_user_name = "Required";

    if (!formData.gst_number) {
      newErrors.gst_number = "Invalid GST number(must be 15 elements)";
    } else if (
      !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/.test(
        formData.gst_number
      )
    ) {
      newErrors.gst_number = "Invalid GST number(must be 15 elements)";
    }

    if (!formData.gst_certificate_image)
      newErrors.gst_certificate_image = "Required";

    if (!formData.gst_expiry_date) newErrors.gst_expiry_date = "Required";

    if (!formData.ffsai_certificate_number) {
      newErrors.ffsai_certificate_number =
        "Invalid FSSAI number (must be 14 digits and start with '1')";
    } else if (!/^1\d{13}$/.test(formData.ffsai_certificate_number)) {
      newErrors.ffsai_certificate_number =
        "Invalid FSSAI number (must be 14 digits and start with '1')";
    }

    if (!formData.ffsai_card_owner_name) {
      newErrors.ffsai_card_owner_name = "Required";
    }

    if (!formData.ffsai_certificate_image) {
      newErrors.ffsai_certificate_image = "Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
      const kitchesFormData = appendToFormData(formData);
      const response = await updatekitchenDetails(id, kitchesFormData);

      if (response.status) {
        toast.success(response.message);
        navigate("/apps/kitchen/list");
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
      const kitchesFormData = appendToFormData(formData);
      const response = await createNewkitchen(kitchesFormData);

      if (response.status) {
        toast.success(response.message);
        navigate("/apps/kitchen/list");
      } else {
        toast.error(response.message || "Creation failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await kitchensGetAllCategories({
          page: 1,
          limit: 100,
        });
        if (response.status) {
          setCategories(response.data.categories);
        } else {
          toast.error("Failed to load categories.");
        }
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
    if (CategoryId) {
      const fetchSubcategories = async () => {
        try {
          const response = await kitchensGetSubcategoriesByCategory(CategoryId);
          if (response.status) {
            setSubcategories(response.data);
          } else {
            toast.error("Failed to load subcategories.");
          }
        } catch (error) {
          console.error("Error fetching subcategories:", error);
          toast.error("An error occurred while fetching subcategories.");
        }
      };
      fetchSubcategories();
    } else {
      setSubcategories([]);
    }
  }, [CategoryId]);

  useEffect(() => {
    if (!id) return;
    const fetchKitchenDetails = async () => {
      try {
        const response = await getkitchenDetails(id);
        setKitchenData(response.data);
        setFormData((prevFormData) => ({
          ...prevFormData,
          kitchen_name: response.data.kitchen_name || "",
          kitchen_status: response.data.kitchen_status || "Active",
          kitchen_owner_name: response.data.kitchen_owner_name || "",
          owner_email: response.data.owner_email || "",
          owner_phone_number: response.data.owner_phone_number || "",
          restaurant_type: response.data.restaurant_type || "",
          kitchen_type: response.data.kitchen_type || "",
          kitchen_phone_number: response.data.kitchen_phone_number || "",
          category: response.data.category || "",
          subcategoryName: response.data.subcategoryName || "",
          address_type: response.data.addresses?.[0]?.address_type || "Home",
          street_address: response.data.addresses?.[0]?.street_address || "",
          district: response.data.addresses?.[0]?.district_id || "",
          city: response.data.addresses?.[0]?.city_id || "",
          state: response.data.addresses?.[0]?.state_id || "",
          pincode: response.data.addresses?.[0]?.pincode || "",
          country: response.data.addresses?.[0]?.country_id || "",
          pan_card_number: response.data.panDetails?.[0]?.pan_card_number || "",
          pan_card_user_name:
            response.data.panDetails?.[0]?.pan_card_user_name || "",
          pan_card_image: response.data.panDetails?.[0]?.pan_card_image || "",
          gst_number: response.data.gstDetails?.[0]?.gst_number || "",
          gst_expiry_date: response.data.gstDetails?.[0]?.expiry_date
            ? new Date(response.data.gstDetails[0].expiry_date)
                .toISOString()
                .split("T")[0]
            : "",
          gst_certificate_image:
            response.data.gstDetails?.[0]?.gst_certificate_image || "",
          ffsai_certificate_number:
            response.data.fssaiDetails?.[0]?.ffsai_certificate_number || "",
          ffsai_card_owner_name:
            response.data.fssaiDetails?.[0]?.ffsai_card_owner_name || "",
          ffsai_expiry_date: response.data.fssaiDetails?.[0]?.expiry_date
            ? new Date(response.data.fssaiDetails[0].expiry_date)
                .toISOString()
                .split("T")[0]
            : "",
          ffsai_certificate_image:
            response.data.fssaiDetails?.[0]?.ffsai_certificate_image || "",
          kitchen_image: response.data.kitchen_image || "",
        }));

        // Fetch states, cities, and districts based on the fetched country, state, and district IDs
        if (response.data.addresses?.[0]?.country_id) {
          await fetchStates(response.data.addresses[0].country_id);
        }
        if (response.data.addresses?.[0]?.state_id) {
          await fetchCities(response.data.addresses[0].state_id);
          await fetchDistricts(response.data.addresses[0].state_id);
        }
      } catch (error) {
        console.error("Error fetching kitchen details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchKitchenDetails();
  }, [id]);

  return (
    <div className="container py-2">
      <div className="row justify-content-center">
        <div className="d-flex flex-column align-items-center">
          <div className="card d-flex flex-column align-items-center">
            <div className="col-lg-8 justify-content-center">
              <Stepper steps={steps} currentStep={currentStep} />
            </div>
            <div className="card-body px-4 pt-1 pb-4">
              <form onSubmit={(e) => e.preventDefault()}>
                {currentStep === 1 && (
                  <div>
                    <h2 className="card-title mb-4">Kitchen Details</h2>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Kitchen Name</label>
                          <input
                            type="text"
                            name="kitchen_name"
                            value={formData.kitchen_name}
                            onChange={handleChange}
                            className={`form-control ${
                              errors.kitchen_name ? "is-invalid" : ""
                            }`}
                          />
                          {errors.kitchen_name && (
                            <div className="invalid-feedback">
                              {errors.kitchen_name}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">
                            Kitchen Owner Name
                          </label>
                          <input
                            type="text"
                            name="kitchen_owner_name"
                            value={formData.kitchen_owner_name}
                            onChange={handleChange}
                            className={`form-control ${
                              errors.kitchen_owner_name ? "is-invalid" : ""
                            }`}
                          />
                          {errors.kitchen_owner_name && (
                            <div className="invalid-feedback">
                              {errors.kitchen_owner_name}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Owner Email</label>
                          <input
                            type="email"
                            name="owner_email"
                            value={formData.owner_email}
                            onChange={handleChange}
                            className={`form-control ${
                              errors.owner_email ? "is-invalid" : ""
                            }`}
                          />
                          {errors.owner_email && (
                            <div className="invalid-feedback">
                              {errors.owner_email}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">
                            Owner Phone Number
                          </label>
                          <input
                            type="tel"
                            name="owner_phone_number"
                            value={formData.owner_phone_number}
                            onChange={handleChange}
                            className={`form-control ${
                              errors.owner_phone_number ? "is-invalid" : ""
                            }`}
                          />
                          {errors.owner_phone_number && (
                            <div className="invalid-feedback">
                              {errors.owner_phone_number}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Restaurant Type</label>
                          <input
                            type="text"
                            name="restaurant_type"
                            value={formData.restaurant_type}
                            onChange={handleChange}
                            className={`form-control ${
                              errors.restaurant_type ? "is-invalid" : ""
                            }`}
                          />
                          {errors.restaurant_type && (
                            <div className="invalid-feedback">
                              {errors.restaurant_type}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Kitchen Type</label>
                          <select
                            name="kitchen_type"
                            value={formData.kitchen_type}
                            onChange={handleChange}
                            className="form-select"
                          >
                            <option value="Veg">Veg</option>
                            <option value="Non-Veg">Non-Veg</option>
                            <option value="Both">Both</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">
                            Kitchen Phone Number
                          </label>
                          <input
                            type="tel"
                            name="kitchen_phone_number"
                            value={formData.kitchen_phone_number}
                            onChange={handleChange}
                            className={`form-control ${
                              errors.kitchen_phone_number ? "is-invalid" : ""
                            }`}
                          />
                          {errors.kitchen_phone_number && (
                            <div className="invalid-feedback">
                              {errors.kitchen_phone_number}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Kitchen Logo</label>
                          <FileUpload
                            onFileSelect={(file) =>
                              setFormData((prev) => ({
                                ...prev,
                                kitchen_image: file,
                              }))
                            }
                            value={formData.kitchen_image}
                            error={errors.kitchen_image}
                          />
                          {errors.kitchen_image && (
                            <div className="invalid-feedback">
                              {errors.kitchen_image}
                            </div>
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
                                setCategoryId(selectedCategory);
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
                              <div className="text-muted mt-1">
                                Loading categories...
                              </div>
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

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Street Address</label>
                          <input
                            type="text"
                            name="street_address"
                            value={formData.street_address}
                            onChange={handleChange}
                            className={`form-control ${
                              errors.street_address ? "is-invalid" : ""
                            }`}
                          />
                          {errors.street_address && (
                            <div className="invalid-feedback">
                              {errors.street_address}
                            </div>
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
                              {errors.country}
                            </div>
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
                              {errors.state}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">City</label>
                          <select
                            name="city"
                            value={formData.city || ""}
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
                              {errors.city}
                            </div>
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
                              {errors.district}
                            </div>
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
                            className={`form-control ${
                              errors.pincode ? "is-invalid" : ""
                            }`}
                          />
                          {errors.pincode && (
                            <div className="invalid-feedback">
                              {errors.pincode}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 2 && (
                  <div>
                    <h2 className="card-title mb-4">Documents</h2>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">PAN Card Number</label>
                          <input
                            type="text"
                            name="pan_card_number"
                            value={formData.pan_card_number}
                            onChange={handleChange}
                            className={`form-control ${
                              errors.pan_card_number ? "is-invalid" : ""
                            }`}
                          />
                          {errors.pan_card_number && (
                            <div className="invalid-feedback">
                              {errors.pan_card_number}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">
                            PAN Card User Name
                          </label>
                          <input
                            type="text"
                            name="pan_card_user_name"
                            value={formData.pan_card_user_name}
                            onChange={handleChange}
                            className={`form-control ${
                              errors.pan_card_user_name ? "is-invalid" : ""
                            }`}
                          />
                          {errors.pan_card_user_name && (
                            <div className="invalid-feedback">
                              {errors.pan_card_user_name}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="form-label">PAN Card Image</label>
                          <FileUpload
                            onFileSelect={(file) =>
                              setFormData((prev) => ({
                                ...prev,
                                pan_card_image: file,
                              }))
                            }
                            value={formData.pan_card_image}
                            error={errors.pan_card_image}
                          />
                          {errors.pan_card_user_name && (
                            <div className="invalid-feedback">
                              {errors.pan_card_user_name}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">GST Number</label>
                          <input
                            type="text"
                            name="gst_number"
                            value={formData.gst_number}
                            onChange={handleChange}
                            className={`form-control ${
                              errors.gst_number ? "is-invalid" : ""
                            }`}
                          />
                          {errors.gst_number && (
                            <div className="invalid-feedback">
                              {errors.gst_number}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Expiry Date</label>
                          <input
                            type="date"
                            name="gst_expiry_date"
                            value={formData.gst_expiry_date}
                            onChange={handleChange}
                            className={`form-control ${
                              errors.gst_expiry_date ? "is-invalid" : ""
                            }`}
                          />
                          {errors.gst_expiry_date && (
                            <div className="invalid-feedback">
                              {errors.gst_expiry_date}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="form-label">
                            GST Certificate Image
                          </label>
                          <FileUpload
                            onFileSelect={(file) =>
                              setFormData((prev) => ({
                                ...prev,
                                gst_certificate_image: file,
                              }))
                            }
                            value={formData.gst_certificate_image}
                            error={errors.gst_certificate_image}
                          />
                          {errors.gst_certificate_image && (
                            <div className="invalid-feedback">
                              {errors.gst_certificate_image}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">
                            FSSAI Certificate Number
                          </label>
                          <input
                            type="text"
                            name="ffsai_certificate_number"
                            value={formData.ffsai_certificate_number}
                            onChange={handleChange}
                            className={`form-control ${
                              errors.ffsai_certificate_number
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          {errors.ffsai_certificate_number && (
                            <div className="invalid-feedback">
                              {errors.ffsai_certificate_number}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">
                            FSSAI Card Owner Name
                          </label>
                          <input
                            type="text"
                            name="ffsai_card_owner_name"
                            value={formData.ffsai_card_owner_name}
                            onChange={handleChange}
                            className={`form-control ${
                              errors.ffsai_card_owner_name ? "is-invalid" : ""
                            }`}
                          />
                          {errors.ffsai_card_owner_name && (
                            <div className="invalid-feedback">
                              {errors.ffsai_card_owner_name}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Expiry Date</label>
                          <input
                            type="date"
                            name="ffsai_expiry_date"
                            value={formData.ffsai_expiry_date}
                            onChange={handleChange}
                            className={`form-control ${
                              errors.ffsai_expiry_date ? "is-invalid" : ""
                            }`}
                          />
                          {errors.ffsai_expiry_date && (
                            <div className="invalid-feedback">
                              {errors.ffsai_expiry_date}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="form-label">
                            FSSAI Certificate Image
                          </label>
                          <FileUpload
                            onFileSelect={(file) =>
                              setFormData((prev) => ({
                                ...prev,
                                ffsai_certificate_image: file,
                              }))
                            }
                            value={formData.ffsai_certificate_image}
                            error={errors.ffsai_certificate_image}
                          />
                          {errors.ffsai_certificate_image && (
                            <div className="invalid-feedback">
                              {errors.ffsai_certificate_image}
                            </div>
                          )}
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
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />
                        <span
                          className="spinner-grow spinner-grow-sm"
                          role="status"
                        />
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