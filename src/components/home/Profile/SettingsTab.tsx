import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Bell, Shield, Globe, Eye, EyeOff } from 'lucide-react';

const SettingsTab: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true
  });

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white border-bottom">
        <h4 className="mb-0">Settings</h4>
      </Card.Header>
      <Card.Body className="p-4">
        <Row>
          <Col lg={8}>
            {/* Security Settings */}
            <Card className="mb-4 border-0 bg-light">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <Shield className="text-primary me-2" size={20} />
                  <h5 className="mb-0">Security</h5>
                </div>
                <Form>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Current Password</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter current password"
                          />
                          <Button
                            variant="link"
                            className="position-absolute top-50 end-0 translate-middle-y border-0"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Enter new password"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button variant="primary" size="sm">Update Password</Button>
                </Form>
              </Card.Body>
            </Card>

            {/* Notification Settings */}
            <Card className="mb-4 border-0 bg-light">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <Bell className="text-primary me-2" size={20} />
                  <h5 className="mb-0">Notifications</h5>
                </div>
                <Form>
                  <Form.Check
                    type="switch"
                    id="email-notifications"
                    label="Email Notifications"
                    checked={notifications.email}
                    onChange={() => handleNotificationChange('email')}
                    className="mb-2"
                  />
                  <Form.Check
                    type="switch"
                    id="push-notifications"
                    label="Push Notifications"
                    checked={notifications.push}
                    onChange={() => handleNotificationChange('push')}
                    className="mb-2"
                  />
                  <Form.Check
                    type="switch"
                    id="sms-notifications"
                    label="SMS Notifications"
                    checked={notifications.sms}
                    onChange={() => handleNotificationChange('sms')}
                    className="mb-3"
                  />
                  <Button variant="primary" size="sm">Save Preferences</Button>
                </Form>
              </Card.Body>
            </Card>

            {/* Privacy Settings */}
            <Card className="border-0 bg-light">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <Globe className="text-primary me-2" size={20} />
                  <h5 className="mb-0">Privacy</h5>
                </div>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Profile Visibility</Form.Label>
                    <Form.Select>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="friends">Friends Only</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Check
                    type="switch"
                    id="show-activity"
                    label="Show Activity Status"
                    defaultChecked
                    className="mb-2"
                  />
                  <Form.Check
                    type="switch"
                    id="allow-messages"
                    label="Allow Direct Messages"
                    defaultChecked
                    className="mb-3"
                  />
                  <Button variant="primary" size="sm">Update Privacy</Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Alert variant="info" className="mb-4">
              <Alert.Heading className="h6">Account Status</Alert.Heading>
              <p className="mb-0">Your account is verified and active.</p>
            </Alert>
            
            <Alert variant="warning">
              <Alert.Heading className="h6">Data Export</Alert.Heading>
              <p className="mb-2">Download your account data and information.</p>
              <Button variant="outline-warning" size="sm">Request Export</Button>
            </Alert>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default SettingsTab;