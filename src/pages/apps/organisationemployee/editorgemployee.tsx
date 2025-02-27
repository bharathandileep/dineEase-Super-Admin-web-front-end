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
} from "../../../server/admin/orgEmployeeManagment";
import { getAllDesignations } from "../../../server/admin/designations";

const OrgEmployeeEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profileImage, setProfileImage] = useState<File | null>(null);
   const [imagePreview, setImagePreview] = useState<string | null>(null);
   const [aadharImage, setAadharImage] = useState<File | null>(null);
   const [aadharImagePreview, setAadharImagePreview] = useState<string | null>(null);
   const [panImage, setPanImage] = useState<File | null>(null);
   const [panImagePreview, setPanImagePreview] = useState<string | null>(null);
  const [designations, setDesignations] = useState<
    any[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [orgemployee, setEmployee] = useState<any>(null);

  // Fetch employee data
  useEffect(() => {
    const fetchEmployeeData = async () => {
      setLoading(true);
      try {
        if (id) {
          const response = await getOrgEmployeeById(id);
          if (response.status) {
            setEmployee(response.data);
            // Set image preview if exists
            if (response.data.profile_picture) {
              setImagePreview(response.data.profile_picture);
            }
            if (response.data.aadhar_image) {
              setAadharImagePreview(response.data.aadhar_image);
            }
            if (response.data.pan_image) {
              setPanImagePreview(response.data.pan_image);
            }
          } else {
            toast.error("Failed to load employee data.");
          }
        } else {
          toast.error("Invalid employee ID.");
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
        toast.error("An error occurred while fetching employee data.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeData();
  }, [id]);

  // Fetch designations
  useEffect(() => {
    const fetchDesignations = async () => {
      setLoading(true);
      try {
        const response = await getAllDesignations( {page:1,limit:100});
        
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
  }, [id]);

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

  // Set form values when employee data is loaded
  useEffect(() => {
    if (orgemployee) {
      // Set general information
      setValue("username", orgemployee.username);
      setValue("email", orgemployee.email);
      setValue("phone_number", orgemployee.phone_number);
      setValue("designation", orgemployee.designation?._id || orgemployee.designation); // Ensure designation ID is set
  
      // Ensure address exists before accessing properties
      if (orgemployee.address) {
        setValue("street_address", orgemployee.address.street_address || "");
        setValue("city", orgemployee.address.city || "");
        setValue("district", orgemployee.address.district || "");  // Fix capitalization
        setValue("pincode", orgemployee.address.pincode || "");
        setValue("state", orgemployee.address.state || "");
        setValue("country", orgemployee.address.country || "");
      }
  
      // Set identification details
      setValue("aadhar_number", orgemployee.aadhar_number || "");
      setValue("pan_number", orgemployee.pan_number || "");
    }
  }, [orgemployee, setValue]);
  
  // Handle form submission
  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();

      // Append all form data
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

      // Address Fields
      formData.append("street_address", data.street_address);
      formData.append("city", data.city);
      formData.append("district", data.district);
      formData.append("pincode", data.pincode);
      formData.append("state", data.state);
      formData.append("country", data.country);

      // Append profile picture if updated
      if (profileImage) {
        formData.append("profile_picture", profileImage);
      }
      if (aadharImage) {
        formData.append("aadhar_image", aadharImage);
      }

      // Append PAN image if updated
      if (panImage) {
        formData.append("pan_image", panImage);
      }

      if (id) {
        const response = await updateOrgEmployee(id, formData);
        if (response.status) {
          toast.success("Employee updated successfully!");
          navigate("/apps/organizations/employee/list",);
        } else {
          toast.error(response.message || "Failed to update employee.");
        }
      } else {
        toast.error("Invalid employee ID.");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Error updating employee. Please try again.");
    }
  };

  // Handle file upload
  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setProfileImage(file);

      // Create preview URL for the new image
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
    <div className='container py-2'>
      <Card className='mb-2'>
        <Card.Body>
          <h3 className='text-uppercase'>Edit Organisation Employee</h3>
        </Card.Body>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          {/* Left Column - Employee Details */}
          <Col lg={6}>
            <Card>
              <Card.Body>
                <h5 className='text-uppercase mt-0 mb-3'>
                  General Information
                </h5>
                <FormInput
                  name='username'
                  label='Employee Name'
                  placeholder='Enter full name'
                  containerClass='mb-3'
                  register={register}
                  errors={errors}
                  control={control}
                />
                <FormInput
                  name='email'
                  label='Email'
                  placeholder='Enter email'
                  containerClass='mb-3'
                  register={register}
                  errors={errors}
                  control={control}
                  type='email'
                />
                <FormInput
                  name='phone_number'
                  label='Phone Number'
                  placeholder='Enter phone number'
                  containerClass='mb-3'
                  register={register}
                  errors={errors}
                  control={control}
                />
                <FormInput
                  name='designation'
                  label='Designation'
                  containerClass='mb-3'
                  register={register}
                  errors={errors}
                  control={control}
                  type='select'
                >
                  <option value=''>Select Designation</option>
                  {designations?.map((designation) => (
                    <option
                      key={designation?._id}
                      value={designation?._id}

                      selected={designation?.designation === orgemployee?.designation}
                    >
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
              <Card.Body className='text-center'>
                <h5 className='text-uppercase mt-0 mb-3'>Profile Picture</h5>
                {imagePreview && (
                  <div className='mb-3'>
                    <img
                      src={imagePreview}
                      alt='Profile Preview'
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
            <Card className='mt-3'>
              <Card.Body>
                <h5 className='text-uppercase mt-0 mb-3'>
                  Address Information
                </h5>
                <Row>
                  <Col md={6}>
                    <FormInput
                      name='street_address'
                      label='Street Address'
                      placeholder='Enter street address'
                      containerClass='mb-3'
                      register={register}
                      errors={errors}
                      control={control}
                    />
                  </Col>
                  <Col md={4}>
                    <FormInput
                      name='city'
                      label='City'
                      placeholder='Enter city'
                      containerClass='mb-3'
                      register={register}
                      errors={errors}
                      control={control}
                    />
                  </Col>
                  <Col md={4}>
                    <FormInput
                      name='pincode'
                      label='Pincode'
                      placeholder='Enter pincode'
                      containerClass='mb-3'
                      register={register}
                      errors={errors}
                      control={control}
                    />
                  </Col>
                  <Col md={4}>
                    <FormInput
                      name='district'
                      label='district'
                      placeholder='Enter District'
                      containerClass='mb-3'
                      register={register}
                      errors={errors}
                      control={control}
                    />
                  </Col>
                  <Col md={4}>
                    <FormInput
                      name='state'
                      label='State'
                      placeholder='Enter state'
                      containerClass='mb-3'
                      register={register}
                      errors={errors}
                      control={control}
                    />
                  </Col>
                  <Col md={12}>
                    <FormInput
                      name='country'
                      label='Country'
                      placeholder='Enter country'
                      containerClass='mb-3'
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
                   <Card className='mt-3'>
                     <Card.Body>
                       <h5 className='text-uppercase mt-0 mb-3'>
                         Identification Details
                       </h5>
                       <Row>
                         <Col md={6}>
                           <FormInput
                             name='aadhar_number'
                             label='Aadhaar Number'
                             placeholder='Enter Aadhaar number'
                             containerClass='mb-3'
                             register={register}
                             errors={errors}
                             control={control}
                           />
                         </Col>
                         <Col md={6}>
                           <FormInput
                             name='pan_number'
                             label='PAN Number'
                             placeholder='Enter PAN number'
                             containerClass='mb-3'
                             register={register}
                             errors={errors}
                             control={control}
                           />
                         </Col>
                       </Row>
                       <Row>
                         <Col lg={6}>
                           <Card>
                             <Card.Body className='text-center'>
                               <h5 className='text-uppercase mt-0 mb-3'>Aadhaar Card</h5>
                               {aadharImagePreview && (
                                 <div className='mb-3'>
                                   <img
                                     src={aadharImagePreview}
                                     alt='Aadhaar Preview'
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
                                 onFileUpload={(files) => handleAadharFileUpload(Array.from(files))}
                               />
                             </Card.Body>
                           </Card>
                         </Col>
                         <Col lg={6}>
                           <Card>
                             <Card.Body className='text-center'>
                               <h5 className='text-uppercase mt-0 mb-3'>PAN Card</h5>
                               {panImagePreview && (
                                 <div className='mb-3'>
                                   <img
                                     src={panImagePreview}
                                     alt='PAN Preview'
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
                                 onFileUpload={(files) => handlePanFileUpload(Array.from(files))}
                               />
                             </Card.Body>
                           </Card>
                         </Col>
                       </Row>
                     </Card.Body>
                   </Card>
                 </Col>
               </Row>
        

        {/* Submit Button */}
        <Row>
          <Col className='text-center'>
            <Button
              variant='light'
              className='me-2'
              onClick={() => navigate("/apps/organizations/employee/list")}
            >
              Cancel
            </Button>
            <Button type='submit' variant='success'>
              Update
            </Button>
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default OrgEmployeeEdit;