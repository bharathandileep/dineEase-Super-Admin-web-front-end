import {
  ChevronRight,
  ChevronLeft,
  Building2,
  MapPin,
  FileCheck,
  Check,
} from "lucide-react";
import BasicDetails from "./components/BasicDetails";
import AddressForm from "./components/AddressForm";
import Documentation from "./components/Documentation";
import Preview from "./components/Preview";

import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
import { createOrganisation } from "../../../services/api";

type FormData = {
  // Basic Details
  user_id: string;
  name: string;
  register_number: string;
  contact_number: string;
  email: string;
  no_of_employees: number;
  logo: string;
  // Address
  street_address: string;
  city: string;
  state: string;
  district: string;
  pincode: string;
  country: string;
  landmark: string;
  address_type: "Home" | "Work";
  // Documentation
  gst_number: string;
  gst_certificate_image: string;
  expiry_date: string;
  gst_verified: boolean;
  pan_card_number: string;
  pan_card_user_name: string;
  pan_card_image: string;
  pan_verified: boolean;
  location: string;
};

const initialFormData: FormData = {
  user_id: "679310f12982828c00cca1f0",
  name: "",
  register_number: "",
  contact_number: "",
  email: "",
  no_of_employees: 0,
  logo:"",
  street_address: "",
  city: "",
  state: "",
  district: "",
  pincode: "",
  country: "",
  landmark: "",
  address_type: "Work",
  gst_number: "",
  gst_certificate_image: "",
  expiry_date: "",
  gst_verified: false,
  pan_card_number: "",
  pan_card_user_name: "",
  pan_card_image: "",
  pan_verified: false,
  location: "",
};

function NewOrganizations() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const navigate = useNavigate();

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const steps = [
    { number: 1, title: "Basic Details", icon: Building2 },
    { number: 2, title: "Address", icon: MapPin },
    { number: 3, title: "Documentation", icon: FileCheck },
    { number: 4, title: "Preview", icon: Check },
  ];

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <BasicDetails formData={formData} updateFormData={updateFormData} />
        );
      case 2:
        return (
          <AddressForm formData={formData} updateFormData={updateFormData} />
        );
      case 3:
        return (
          <Documentation formData={formData} updateFormData={updateFormData} />
        );
      case 4:
        return <Preview formData={formData} onSubmit={onSubmit} />;
      default:
        return null;
    }
  };

  function convertData(inputData: any) {
    console.log(inputData);
    return {
      name: inputData.name,
      registration_number: inputData.register_number,
      email: inputData.email,
      phone: inputData.contact_number,
      website: "",
      no_of_employees: parseInt(inputData.no_of_employees),
      logo: inputData.logo,
      contact_number: inputData.contact_number,
      location:
        inputData.street_address +
        ", " +
        inputData.city +
        ", " +
        inputData.state +
        ", " +
        inputData.country,
      register_number: inputData.register_number,
      user_id: inputData.user_id,
      addresses: [
        {
          address_type: inputData.address_type,
          street_address: inputData.street_address,
          district: inputData.district,
          city: inputData.city,
          state: inputData.state,
          pincode: inputData.pincode,
          landmark: inputData.landmark,
          country: inputData.country,
        },
      ],
      panDetails: {
        pan_card_number: inputData.pan_card_number,
        pan_card_user_name: inputData.pan_card_user_name,
        pan_card_image: inputData.pan_card_image,
      },
      gstDetails: {
        gst_number: inputData.gst_number,
        gst_certificate_image: inputData.gst_certificate_image,
        expiry_date: inputData.expiry_date,
      },
    };
  }

  const onSubmit = async () => {
    try {
      // Call API to create organization
      const response = await createOrganisation(convertData(formData));

      if (response.status === "success") {
        console.log(response);
        // Show success toast
        toast.success(response.message || "Organization created successfully!");
        navigate(`/apps/organizations/list/`); // Navigate to view-org page
      } else {
        // Show error toast for API errors
        toast.error(response.message || "Failed to create the organization.");
        if (response.errors && response.errors.length > 0) {
          response.errors.forEach((error: string) => toast.error(error));
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    }
  };
  return (
    <div className='min-vh-100 bg-light py-5 px-3'>
      <div className='container'>
        {/* Progress Steps */}
        <div className='mb-4'>
          <div className='d-flex flex-wrap justify-content-between align-items-center'>
            {steps.map((s, i) => (
              <div
                key={s.number}
                className='flex-grow-1 position-relative mb-3 mb-md-0'
              >
                <div
                  className={`d-flex align-items-center ${
                    i !== 0 ? "ms-md-4 ms-2" : ""
                  }`}
                >
                  <div
                    className={`rounded-circle d-flex align-items-center justify-content-center ${
                      step >= s.number
                        ? "bg-primary text-white"
                        : "bg-secondary text-muted"
                    }`}
                    style={{ width: "40px", height: "40px" }}
                  >
                    <s.icon className='w-5 h-5' />
                  </div>
                  <div className='ms-3'>
                    <p className='mb-0 fw-bold'>{s.title}</p>
                    <p className='mb-0 text-muted'>Step {s.number}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`position-absolute top-50 start-50 translate-middle-x w-100 ${
                      step > s.number ? "bg-primary" : "bg-secondary"
                    }`}
                    style={{ height: "2px" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className='bg-white shadow rounded p-4 mb-4'>
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className='d-flex justify-content-between'>
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`btn ${
              step === 1 ? "btn-secondary disabled" : "btn-primary"
            }`}
          >
            <ChevronLeft className='me-2' />
            Previous
          </button>
          {step < 4 && (
            <button onClick={nextStep} className='btn btn-primary'>
              Next
              <ChevronRight className='ms-2' />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewOrganizations;
