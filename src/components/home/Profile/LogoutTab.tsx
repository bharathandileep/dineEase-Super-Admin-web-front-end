import React from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { LogOut, Shield, Save } from 'lucide-react';

const LogoutTab: React.FC = () => {
  const handleLogout = () => {
    // Handle logout logic
    console.log('Logging out...');
    // In a real app, you would clear session/tokens and redirect
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white border-bottom">
        <h4 className="mb-0">Logout</h4>
      </Card.Header>
      <Card.Body className="p-4">
        <div className="text-center py-5">
          <LogOut size={48} className="text-muted mb-3" />
          <h5 className="mb-3">Are you sure you want to logout?</h5>
          <p className="text-muted mb-4">
            You will be signed out of your account and redirected to the login page.
          </p>
          
          <Alert variant="warning" className="mb-4">
            <Shield className="me-2" size={16} />
            <strong>Before you go:</strong> Make sure you've saved any unsaved changes to your profile or listings.
          </Alert>
          
          <div className="d-flex justify-content-center gap-3">
            <Button variant="outline-secondary" size="lg">
              <Save size={16} className="me-2" />
              Save Changes First
            </Button>
            <Button variant="primary" size="lg" onClick={handleLogout}>
              <LogOut size={16} className="me-2" />
              Logout Now
            </Button>
          </div>
          
          <p className="text-muted mt-4 small">
            Your session will be securely terminated and all temporary data will be cleared.
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LogoutTab;