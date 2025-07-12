import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert, InputGroup } from 'react-bootstrap';
import { Users, Copy, Share2, Gift, Check } from 'lucide-react';

const ReferralTab: React.FC = () => {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  
  const referralCode = 'JOHN-DOE-2024';
  const referralLink = `https://example.com/invite/${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle invite sending
    setInviteSent(true);
    setEmail('');
    setTimeout(() => setInviteSent(false), 3000);
  };

  const referralStats = {
    totalInvites: 12,
    pendingInvites: 3,
    successfulReferrals: 9,
    totalRewards: 450
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white border-bottom">
        <h4 className="mb-0">Referral & Invite</h4>
      </Card.Header>
      <Card.Body className="p-4">
        <Row>
          <Col lg={8}>
            {/* Referral Program Info */}
            <Alert variant="primary" className="mb-4">
              <Gift className="me-2" size={20} />
              <strong>Earn $50 for each successful referral!</strong>
              <p className="mb-0 mt-2">
                Invite friends and colleagues to join our platform. You'll earn $50 for each person who creates an account and completes their first restaurant or kitchen setup.
              </p>
            </Alert>

            {/* Share Referral Link */}
            <Card className="mb-4 border-0 bg-light">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <Share2 className="text-primary me-2" size={20} />
                  <h5 className="mb-0">Share Your Referral Link</h5>
                </div>
                <Form.Group className="mb-3">
                  <Form.Label>Your Referral Code</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      value={referralCode}
                      readOnly
                      className="bg-white"
                    />
                    <Button variant="outline-primary" onClick={handleCopyLink}>
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Your Referral Link</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      value={referralLink}
                      readOnly
                      className="bg-white"
                    />
                    <Button variant="outline-primary" onClick={handleCopyLink}>
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Send Invitation */}
            <Card className="border-0 bg-light">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <Users className="text-primary me-2" size={20} />
                  <h5 className="mb-0">Send Invitation</h5>
                </div>
                {inviteSent && (
                  <Alert variant="success" className="mb-3">
                    Invitation sent successfully!
                  </Alert>
                )}
                <Form onSubmit={handleSendInvite}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter friend's email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Send Invitation
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            {/* Referral Stats */}
            <Card className="border-0 bg-light">
              <Card.Body>
                <h6 className="mb-3">Your Referral Stats</h6>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted">Total Invites Sent</span>
                  <span className="fw-bold">{referralStats.totalInvites}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted">Pending Invites</span>
                  <span className="fw-bold text-warning">{referralStats.pendingInvites}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted">Successful Referrals</span>
                  <span className="fw-bold text-success">{referralStats.successfulReferrals}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Total Rewards Earned</span>
                  <span className="fw-bold text-primary">${referralStats.totalRewards}</span>
                </div>
              </Card.Body>
            </Card>

            <Alert variant="info" className="mt-4">
              <Alert.Heading className="h6">How It Works</Alert.Heading>
              <ol className="mb-0 ps-3">
                <li>Share your referral link</li>
                <li>Friend signs up using your link</li>
                <li>They create their first listing</li>
                <li>You earn $50 reward!</li>
              </ol>
            </Alert>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ReferralTab;