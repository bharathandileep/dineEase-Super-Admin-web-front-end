import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

type DocumentationProps = {
  formData: any;
  updateFormData: (data: any) => void;
};

const Documentation: React.FC<DocumentationProps> = ({ formData, updateFormData }) => {
  const [previews, setPreviews] = useState({
    gst_certificate_image: '',
    pan_card_image: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      // Handle file uploads
      const file = files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviews(prev => ({
          ...prev,
          [name]: base64String
        }));
        updateFormData({ [name]: base64String });
      };
      reader.readAsDataURL(file);

    } else {
      updateFormData({ [name]: value });
    }
  };

  const handleVerification = (field: 'gst_verified' | 'pan_verified') => {
    updateFormData({ [field]: true });
  };

  const removeImage = (field: 'gst_certificate_image' | 'pan_card_image') => {
    setPreviews(prev => ({
      ...prev,
      [field]: ''
    }));
    updateFormData({ [field]: null });
  };

  return (
    <div className="mb-4">
      <h2 className="h4 mb-4 text-primary">Documentation</h2>

      {/* GST Section */}
      <div className="p-3 mb-4 bg-light rounded">
        <h3 className="h6 mb-4">GST Details</h3>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="gst_number" className="form-label">GST Number</label>
            <input
              type="text"
              id="gst_number"
              name="gst_number"
              value={formData.gst_number}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="expiry_date" className="form-label">Expiry Date</label>
            <input
              type="date"
              id="expiry_date"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="col-md-12">
            <label htmlFor="gst_certificate_image" className="form-label">GST Certificate</label>
            <input
              type="file"
              id="gst_certificate_image"
              name="gst_certificate_image"
              onChange={handleChange}
              required
              accept="image/*"
              className="form-control"
            />
            {previews.gst_certificate_image && (
              <div className="mt-3 position-relative">
                <img
                  src={previews.gst_certificate_image}
                  alt="GST Certificate Preview"
                  className="img-fluid rounded"
                />
                <button
                  onClick={() => removeImage('gst_certificate_image')}
                  className="btn-close position-absolute top-0 end-0 m-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="col-md-12 mt-3">
            <button
              onClick={() => handleVerification('gst_verified')}
              className={`btn ${
                formData.gst_verified
                  ? 'btn-outline-success'
                  : 'btn-primary'
              }`}
              disabled={formData.gst_verified}
            >
              {formData.gst_verified ? (
                <>
                  <Check className="me-2" />
                  Verified
                </>
              ) : (
                'Verify GST Details'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* PAN Section */}
      <div className="p-3 mb-4 bg-light rounded">
        <h3 className="h6 mb-4">PAN Card Details</h3>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="pan_card_number" className="form-label">PAN Card Number</label>
            <input
              type="text"
              id="pan_card_number"
              name="pan_card_number"
              value={formData.pan_card_number}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="pan_card_user_name" className="form-label">Name on PAN Card</label>
            <input
              type="text"
              id="pan_card_user_name"
              name="pan_card_user_name"
              value={formData.pan_card_user_name}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="col-md-12">
            <label htmlFor="pan_card_image" className="form-label">PAN Card Image</label>
            <input
              type="file"
              id="pan_card_image"
              name="pan_card_image"
              onChange={handleChange}
              required
              accept="image/*"
              className="form-control"
            />
            {previews.pan_card_image && (
              <div className="mt-3 position-relative">
                <img
                  src={previews.pan_card_image}
                  alt="PAN Card Preview"
                  className="img-fluid rounded"
                />
                <button
                  onClick={() => removeImage('pan_card_image')}
                  className="btn-close position-absolute top-0 end-0 m-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="col-md-12 mt-3">
            <button
              onClick={() => handleVerification('pan_verified')}
              className={`btn ${
                formData.pan_verified
                  ? 'btn-outline-success'
                  : 'btn-primary'
              }`}
              disabled={formData.pan_verified}
            >
              {formData.pan_verified ? (
                <>
                  <Check className="me-2" />
                  Verified
                </>
              ) : (
                'Verify PAN Details'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
