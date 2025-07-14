import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { Eye, EyeOff } from "lucide-react";
import "./Auth.scss";
import logo from "../../assets/images/logo-light.png";
import CircularImageCarousel from "../../components/home/CircularImageCarousel";

const NewLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="new-login-container p-4">
      <Row className="h-100 g-0">
        <Col lg={5} className="left-column">
          <div className="logo-container">
            <a href="/">
              <img src={logo} className="logo" alt="Dineas image" />
            </a>
          </div>
          <div className="form-container">
            <div className="header-container">
              <h3 className="app-title">DineEas</h3>
              <p className="app-subtitle">
                Please fill your detail to access your account.
              </p>
            </div>

            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="form-label">Email</Form.Label>
                <div className="input-container">
                  <Form.Control
                    type="email"
                    placeholder="helloworld@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    size="sm"
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="form-label">Password</Form.Label>
                <div className="input-container">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    size="sm"
                  />
                  <div
                    className="input-icon clickable"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={14} className="text-muted" />
                    ) : (
                      <Eye size={14} className="text-muted" />
                    )}
                  </div>
                </div>
              </Form.Group>

              <div className="options-container">
                <Form.Check
                  type="checkbox"
                  label="Remember me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="remember-me"
                />
                <Button variant="link" className="forgot-password">
                  Forgot Password?
                </Button>
              </div>

              <Button variant="primary" className="signin-button">
                Sign In
              </Button>

              <Button variant="outline-secondary" className="google-signin">
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </Button>

              <div className="signup-container">
                <span>Don't have an account? </span>
                <Button variant="link" className="signup-link">
                  Sign up
                </Button>
              </div>
            </Form>
          </div>
        </Col>
        <Col lg={7} className="right-column">
          <div className="right-content">
            <div className="right-header">
              <h2 className="text-white heading-with-offset">
                Pretium id feugiat porttitor arcu
                <br />
                <span>malesuada</span>
              </h2>
            </div>

            <div className="image-container">
              <div className="main-image-wrapper">
                <CircularImageCarousel />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default NewLogin;
