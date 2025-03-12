import React from "react";

type AddressFormProps = {
  formData: any;
  updateFormData: (data: any) => void;
};

const AddressForm: React.FC<AddressFormProps> = ({
  formData,
  updateFormData,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className='mb-4'>
      <h2 className='h4 mb-4 text-primary'>Address Details</h2>

      <div className='row'>
        <div className='col-md-12'>
          <label
            htmlFor='street_address'
            className='form-label'
          >
            Street Address
          </label>
          <input
            type='text'
            id='street_address'
            name='street_address'
            value={formData.street_address}
            onChange={handleChange}
            required
            className='form-control'
          />
        </div>

        <div className='col-md-6'>
          <label
            htmlFor='city'
            className='form-label'
          >
            City
          </label>
          <input
            type='text'
            id='city'
            name='city'
            value={formData.city}
            onChange={handleChange}
            required
            className='form-control'
          />
        </div>

        <div className='col-md-6'>
          <label
            htmlFor='state'
            className='form-label'
          >
            State
          </label>
          <input
            type='text'
            id='state'
            name='state'
            value={formData.state}
            onChange={handleChange}
            required
            className='form-control'
          />
        </div>

        <div className='col-md-6'>
          <label
            htmlFor='district'
            className='form-label'
          >
            District
          </label>
          <input
            type='text'
            id='district'
            name='district'
            value={formData.district}
            onChange={handleChange}
            required
            className='form-control'
          />
        </div>

        <div className='col-md-6'>
          <label
            htmlFor='pincode'
            className='form-label'
          >
            Pincode
          </label>
          <input
            type='text'
            id='pincode'
            name='pincode'
            value={formData.pincode}
            onChange={handleChange}
            required
            className='form-control'
          />
        </div>

        <div className='col-md-6'>
          <label
            htmlFor='country'
            className='form-label'
          >
            Country
          </label>
          <input
            type='text'
            id='country'
            name='country'
            value={formData.country}
            onChange={handleChange}
            required
            className='form-control'
          />
        </div>

        <div className='col-md-6'>
          <label
            htmlFor='landmark'
            className='form-label'
          >
            Landmark (Optional)
          </label>
          <input
            type='text'
            id='landmark'
            name='landmark'
            value={formData.landmark}
            onChange={handleChange}
            className='form-control'
          />
        </div>

        <div className='col-md-6'>
          <label
            htmlFor='address_type'
            className='form-label'
          >
            Address Type
          </label>
          <select
            id='address_type'
            name='address_type'
            value={formData.address_type}
            onChange={handleChange}
            required
            className='form-select'
          >
            <option value='Work'>Work</option>
            <option value='Home'>Home</option>
          </select>
        </div>

        <div className='col-md-6'>
          <label
            htmlFor='location'
            className='form-label'
          >
            Location
          </label>
          <input
            type='text'
            id='location'
            name='location'
            value={formData.location}
            onChange={handleChange}
            className='form-control'
          />
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
