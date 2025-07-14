import React, { useState } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import {
  Edit3,
  Save,
  X,
  Globe,
  Facebook,
  Mail,
  User,
  MapPin,
  Phone,
} from "lucide-react";
import { User as UserType } from "../../../types/profile";

interface AccountDetailsTabProps {
  user: UserType;
  onUserUpdate: (updatedUser: UserType) => void;
}

const AccountDetailsTab: React.FC<AccountDetailsTabProps> = ({
  user,
  onUserUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    website: user.website,
    facebook: user.facebook,
    phone: user.phone || "",
    address: user.address || "",
    city: user.city || "",
    state: user.state || "",
    zipCode: user.zipCode || "",
    country: user.country || "",
  });

  const handleSave = () => {
    onUserUpdate({
      ...user,
      ...formData,
      fullName: `${formData.firstName} ${formData.lastName}`,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      website: user.website,
      facebook: user.facebook,
      phone: user.phone || "",
      address: user.address || "",
      city: user.city || "",
      state: user.state || "",
      zipCode: user.zipCode || "",
      country: user.country || "",
    });
    setIsEditing(false);
  };

  const InfoField = ({
    icon: Icon,
    label,
    value,
    isLink = false,
    href = "",
    placeholder = "Not provided",
  }: {
    icon: any;
    label: string;
    value: string;
    isLink?: boolean;
    href?: string;
    placeholder?: string;
  }) => (
    <div className="mb-4">
      <div className="d-flex align-items-center mb-2">
        <Icon size={16} className="text-primary me-2" />
        <span className="text-muted small font-weight-medium">{label}</span>
      </div>
      <div className="ms-4">
        {value ? (
          isLink ? (
            <a
              href={href || value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none text-primary"
            >
              {value}
            </a>
          ) : (
            <span>{value}</span>
          )
        ) : (
          <span className="text-muted font-italic">{placeholder}</span>
        )}
      </div>
    </div>
  );

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-1">Account Settings</h4>
            <small className="text-muted">
              Manage your personal information
            </small>
          </div>
          {!isEditing ? (
            <Button
              variant="primary"
              className="p-2"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 size={16} className="me-1" />
              Edit
            </Button>
          ) : (
            <div>
              <Button
                variant="success"
                size="sm"
                onClick={handleSave}
                className="me-2"
              >
                <Save size={16} className="me-1" />
                Save
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleCancel}
              >
                <X size={16} className="me-1" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Card.Header>

      <Card.Body className="p-4">
        {!isEditing ? (
          <>
            {/* Personal Information */}
            <div className="mb-5">
              <h6 className="text-primary font-weight-semibold mb-4 d-flex align-items-center">
                <User size={18} className="me-2" />
                Personal Information
              </h6>
              <Row>
                <Col lg={6}>
                  <InfoField icon={Mail} label="Email" value={user.email} />
                  <InfoField
                    icon={User}
                    label="First Name"
                    value={user.firstName}
                  />
                  <InfoField
                    icon={Phone}
                    label="Phone"
                    value={user.phone || ""}
                  />
                </Col>
                <Col lg={6}>
                  <InfoField
                    icon={User}
                    label="Last Name"
                    value={user.lastName}
                  />
                  <InfoField
                    icon={Globe}
                    label="Website"
                    value={user.website}
                    isLink={true}
                  />
                  <InfoField
                    icon={Facebook}
                    label="Facebook"
                    value={user.facebook}
                    isLink={true}
                  />
                </Col>
              </Row>
            </div>

            {/* Address Information */}
            <div>
              <h6 className="text-primary font-weight-semibold mb-4 d-flex align-items-center">
                <MapPin size={18} className="me-2" />
                Address Information
              </h6>
              <Row>
                <Col lg={12}>
                  <InfoField
                    icon={MapPin}
                    label="Address"
                    value={user.address || ""}
                  />
                </Col>
                <Col lg={6}>
                  <InfoField
                    icon={MapPin}
                    label="City"
                    value={user.city || ""}
                  />
                  <InfoField
                    icon={MapPin}
                    label="ZIP Code"
                    value={user.zipCode || ""}
                  />
                </Col>
                <Col lg={6}>
                  <InfoField
                    icon={MapPin}
                    label="State"
                    value={user.state || ""}
                  />
                  <InfoField
                    icon={MapPin}
                    label="Country"
                    value={user.country || ""}
                  />
                </Col>
              </Row>
            </div>
          </>
        ) : (
          <>
            {/* Edit Mode */}
            <div>
              <h6 className="text-primary font-weight-semibold mb-4">
                Personal Information
              </h6>

              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={user.email}
                      disabled
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="Enter phone number"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      placeholder="Enter first name"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      placeholder="Enter last name"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                      type="url"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      placeholder="https://yourwebsite.com"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Facebook</Form.Label>
                    <Form.Control
                      type="url"
                      value={formData.facebook}
                      onChange={(e) =>
                        setFormData({ ...formData, facebook: e.target.value })
                      }
                      placeholder="https://facebook.com/profile"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <h6 className="text-primary font-weight-semibold mb-3 mt-4">
                Address Information
              </h6>

              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="Enter address"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="Enter city"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      placeholder="Enter state"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>ZIP Code</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) =>
                        setFormData({ ...formData, zipCode: e.target.value })
                      }
                      placeholder="Enter ZIP code"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      placeholder="Enter country"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default AccountDetailsTab;
