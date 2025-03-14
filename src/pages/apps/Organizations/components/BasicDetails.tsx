import React, { useState } from "react";
import { X } from "lucide-react"; // Ensure lucide-react is installed

type BasicDetailsProps = {
  formData: any;
  updateFormData: (data: any) => void;
};

const BasicDetails: React.FC<BasicDetailsProps> = ({
  formData,
  updateFormData,
}) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Handle text input and file changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
  
    if (type === "file" && files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
  
      reader.onloadend = () => {
        const base64String = reader.result as string;
  
        // Store base64 string in formData
        updateFormData({ [name]: base64String });
  
        // Set preview for the uploaded image
        setLogoPreview(base64String);
      };
  
      reader.readAsDataURL(file);
    } else {
      updateFormData({ [name]: value });
    }
  };
  
  // Remove selected logo
  const removeImage = () => {
    updateFormData({ logo: null });
    setLogoPreview(null);
  };
  
  return (
    <div className="container">
      <h2 className="h2 mb-4 fw-semibold">Basic Details</h2>

      <div className="row g-4">
        {/* Other input fields */}
        <div className="col-12 col-md-6">
          <label htmlFor="name" className="form-label small mb-1">
            Company Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-control shadow-sm"
          />
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="register_number" className="form-label small mb-1">
            Registration Number
          </label>
          <input
            type="text"
            id="register_number"
            name="register_number"
            value={formData.register_number}
            onChange={handleChange}
            required
            className="form-control shadow-sm"
          />
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="contact_number" className="form-label small mb-1">
            Contact Number
          </label>
          <input
            type="tel"
            id="contact_number"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleChange}
            required
            className="form-control shadow-sm"
          />
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="email" className="form-label small mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-control shadow-sm"
          />
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="no_of_employees" className="form-label small mb-1">
            Number of Employees
          </label>
          <input
            type="number"
            id="no_of_employees"
            name="no_of_employees"
            value={formData.no_of_employees}
            onChange={handleChange}
            required
            min="1"
            className="form-control shadow-sm"
          />
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="owner_name" className="form-label small mb-1">
            Owner Name
          </label>
          <input
            type="text"
            id="owner_name"
            name="owner_name"
            value={formData.owner_name}
            onChange={handleChange}
            required
            className="form-control shadow-sm"
          />
        </div>

        {/* Logo Upload */}
        <div className="col-md-12">
          <label htmlFor="logo" className="form-label">Logo</label>
          <input
            type="file"
            id="logo"
            name="logo"
            onChange={handleChange}
            accept="image/*"
            className="form-control"
          />

          {logoPreview && (
            <div className="mt-3 position-relative">
              <img
                src={logoPreview}
                alt="Logo Preview"
                className="img-fluid rounded"
              />
              <button
                onClick={removeImage}
                className="btn-close position-absolute top-0 end-0 m-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicDetails;
