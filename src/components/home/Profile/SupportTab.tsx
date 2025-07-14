import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert, Accordion } from 'react-bootstrap';
import { MessageSquare, Mail, Phone, HelpCircle } from 'lucide-react';

const SupportTab: React.FC = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Support ticket submitted:', formData);
  };

  const faqs = [
    {
      question: 'How do I create a new restaurant?',
      answer: 'Navigate to the "Your Restaurants" tab and click the "Create New Restaurant" button. Fill out the required information and submit for approval.'
    },
    {
      question: 'What are the approval requirements?',
      answer: 'Your restaurant must have valid business licenses, proper food safety certifications, and meet our quality standards. The review process typically takes 3-5 business days.'
    },
    {
      question: 'How do I manage my kitchen space?',
      answer: 'Go to the "Your Kitchens" tab to view and manage your kitchen spaces. You can update availability, pricing, and equipment details.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers. Payment processing is secure and encrypted.'
    }
  ];

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white border-bottom">
        <h4 className="mb-0">Support & Help</h4>
      </Card.Header>
      <Card.Body className="p-4">
        <Row>
          <Col lg={8}>
            {/* Contact Form */}
            <Card className="mb-4 border-0 bg-light">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <MessageSquare className="text-primary me-2" size={20} />
                  <h5 className="mb-0">Contact Support</h5>
                </div>
                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Subject</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Brief description of your issue"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Priority</Form.Label>
                        <Form.Select
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      placeholder="Please describe your issue in detail..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Submit Support Request
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            {/* FAQ Section */}
            <Card className="border-0 bg-light">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <HelpCircle className="text-primary me-2" size={20} />
                  <h5 className="mb-0">Frequently Asked Questions</h5>
                </div>
                <Accordion>
                  {faqs.map((faq, index) => (
                    <Accordion.Item key={index} eventKey={index.toString()}>
                      <Accordion.Header>{faq.question}</Accordion.Header>
                      <Accordion.Body>{faq.answer}</Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Alert variant="info" className="mb-4">
              <Alert.Heading className="h6">Response Time</Alert.Heading>
              <p className="mb-0">We typically respond to support requests within 24 hours.</p>
            </Alert>
            
            <Card className="border-0 bg-light">
              <Card.Body>
                <h6 className="mb-3">Other Ways to Reach Us</h6>
                <div className="d-flex align-items-center mb-2">
                  <Mail className="text-primary me-2" size={16} />
                  <span>support@example.com</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <Phone className="text-primary me-2" size={16} />
                  <span>+1 (555) 123-4567</span>
                </div>
                <hr />
                <small className="text-muted">
                  Support hours: Monday - Friday, 9 AM - 6 PM EST
                </small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default SupportTab;