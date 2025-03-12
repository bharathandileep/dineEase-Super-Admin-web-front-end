import { Building2, MapPin, FileCheck } from 'lucide-react';
type PreviewProps = {
  formData: any;
  onSubmit: () => void; // Add this prop for handling the submit action
};

const Preview: React.FC<PreviewProps> = ({ formData, onSubmit }) => {
  return (
    <div className="mb-4">
      <h2 className="h4 mb-4 text-primary">Preview Information</h2>

      {/* Basic Details */}
      <div className="p-3 mb-4 bg-light rounded">
        <div className="d-flex align-items-center mb-3">
          <Building2 className="me-2 text-primary" />
          <h3 className="h6 mb-0">Basic Details</h3>
        </div>
        <div className="row">
          <div className="col-md-6">
            <small className="text-muted">Company Name</small>
            <p>{formData.name}</p>
          </div>
          <div className="col-md-6">
            <small className="text-muted">Registration Number</small>
            <p>{formData.register_number}</p>
          </div>
          <div className="col-md-6">
            <small className="text-muted">Contact Number</small>
            <p>{formData.contact_number}</p>
          </div>
          <div className="col-md-6">
            <small className="text-muted">Email Address</small>
            <p>{formData.email}</p>
          </div>
          <div className="col-md-6">
            <small className="text-muted">Number of Employees</small>
            <p>{formData.no_of_employees}</p>
          </div>
        </div>
      </div>

      {/* Address Details */}
      <div className="p-3 mb-4 bg-light rounded">
        <div className="d-flex align-items-center mb-3">
          <MapPin className="me-2 text-primary" />
          <h3 className="h6 mb-0">Address Details</h3>
        </div>
        <div className="row">
          <div className="col-12">
            <small className="text-muted">Street Address</small>
            <p>{formData.street_address}</p>
          </div>
          <div className="col-md-6">
            <small className="text-muted">City</small>
            <p>{formData.city}</p>
          </div>
          <div className="col-md-6">
            <small className="text-muted">State</small>
            <p>{formData.state}</p>
          </div>
          <div className="col-md-6">
            <small className="text-muted">District</small>
            <p>{formData.district}</p>
          </div>
          <div className="col-md-6">
            <small className="text-muted">Pincode</small>
            <p>{formData.pincode}</p>
          </div>
          <div className="col-md-6">
            <small className="text-muted">Country</small>
            <p>{formData.country}</p>
          </div>
          <div className="col-md-6">
            <small className="text-muted">Address Type</small>
            <p>{formData.address_type}</p>
          </div>
          {formData.landmark && (
            <div className="col-md-6">
              <small className="text-muted">Landmark</small>
              <p>{formData.landmark}</p>
            </div>
          )}
        </div>
      </div>

      {/* Documentation Details */}
      <div className="p-3 mb-4 bg-light rounded">
        <div className="d-flex align-items-center mb-3">
          <FileCheck className="me-2 text-primary" />
          <h3 className="h6 mb-0">Documentation</h3>
        </div>
        <div className="row">
          <div className="col-md-6">
            <small className="text-muted">GST Number</small>
            <p>{formData.gst_number}</p>
          </div>
          <div className="col-md-6">
            <small className="text-muted">GST Expiry Date</small>
            <p>{formData.expiry_date}</p>
          </div>
          <div className="col-md-6">
            <small className="text-muted">GST Verification Status</small>
            <p className={`text-${formData.gst_verified ? 'success' : 'danger'}`}>
              {formData.gst_verified ? 'Verified' : 'Not Verified'}
            </p>
          </div>
          <div className="col-md-6">
            <small className="text-muted">PAN Card Number</small>
            <p>{formData.pan_card_number}</p>
          </div>
          <div className="col-md-6">
            <small className="text-muted">PAN Card Holder Name</small>
            <p>{formData.pan_card_user_name}</p>
          </div>
          <div className="col-md-6">
            <small className="text-muted">PAN Verification Status</small>
            <p className={`text-${formData.pan_verified ? 'success' : 'danger'}`}>
              {formData.pan_verified ? 'Verified' : 'Not Verified'}
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-end">
        <button
          onClick={onSubmit}
          className="btn btn-primary"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Preview;
