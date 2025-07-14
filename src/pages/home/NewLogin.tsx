import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import "./Auth.scss";
import logo from "../../assets/images/logo-light.png";
import CircularImageCarousel from "../../components/home/CircularImageCarousel";
import googleIcon from "../../assets/images/companies/google-icon.svg";
import {
  ActionButtonProps,
  AuthLinkProps,
  FormHeaderProps,
  FormInputProps,
} from "../../types/auth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { googleLoginUser } from "../../redux/actions";
import { useNavigate } from "react-router-dom";
interface GoogleSignInButtonProps {
  loading: boolean;
  onClick: () => void;
}

const FORM_CONFIG = {
  login: {
    title: "Sign In",
    subtitle: "Please fill your detail to access your account.",
    submitText: "Sign In",
    linkText: "Don't have an account? ",
    linkAction: "Sign up",
  },
  register: {
    title: "Sign Up",
    subtitle: "Please fill your details to create an account.",
    submitText: "Sign Up",
    linkText: "Already have an account? ",
    linkAction: "Sign in",
  },
  otp: {
    title: "Verify OTP",
    subtitle: "Enter the OTP sent to your ",
    submitText: "Verify OTP",
  },
};

const FormHeader: React.FC<FormHeaderProps> = ({ title, subtitle }) => (
  <div className="header-container">
    <h3 className="app-title">{title}</h3>
    <p className="app-subtitle">{subtitle}</p>
  </div>
);

const FormInput: React.FC<FormInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
  maxLength,
  className = "mb-3",
}) => (
  <Form.Group className={className}>
    <Form.Label className="form-label">{label}</Form.Label>
    <div className="input-container">
      <Form.Control
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-input"
        size="sm"
        required={required}
        maxLength={maxLength}
      />
    </div>
  </Form.Group>
);

const ActionButton: React.FC<ActionButtonProps> = ({
  variant,
  type = "button",
  className,
  onClick,
  disabled = false,
  loading = false,
  children,
}) => (
  <Button
    variant={variant}
    type={type}
    className={className}
    onClick={onClick}
    disabled={disabled || loading}
  >
    {loading ? <Spinner size="sm" /> : children}
  </Button>
);

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  loading,
  onClick,
}) => (
  <ActionButton
    variant="outline-secondary"
    className="google-signin"
    loading={loading}
    onClick={onClick}
  >
    <img src={googleIcon} alt="Google" width="16" height="16" />
    <span>Sign in with Google</span>
  </ActionButton>
);

const AuthLink: React.FC<AuthLinkProps> = ({ text, linkText, onClick }) => (
  <div className="signup-container">
    <span>{text} </span>
    <Button variant="link" className="signup-link" onClick={onClick}>
      {linkText}
    </Button>
  </div>
);

const NewLogin = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [otpTimer, setOTPTimer] = useState(60);
  const otpTimerRef = useRef<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { userLoggedIn, user, loading } = useSelector(
    (state: RootState) => state.Auth
  );
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    registerEmail: "",
  });
  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleGoogleSignIn = async () => {
    dispatch(googleLoginUser());
  };

  useEffect(() => {
    if (userLoggedIn && user) {
      navigate("/");
    }
  }, [userLoggedIn, user, navigate]);
  const makeAPICall = async (type: string) => {
    setShowLoader(true);
    try {
      // Replace with actual API calls
      const response = { status: true, message: "OTP sent to your email" };
      if (response.status) {
        setShowOTP(true);
        startOTPTimer();
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || `${type} failed`);
    } finally {
      setShowLoader(false);
    }
  };

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showOTP && otpTimer > 0) {
      timer = setInterval(() => {
        setOTPTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
      otpTimerRef.current = timer;
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showOTP]);

  const startOTPTimer = () => {
    setOTPTimer(60);
  };

  // Event handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    await makeAPICall("Login");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    await makeAPICall("Registration");
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setShowLoader(true);
    try {
      const response = { status: true, message: "Verification successful" };
      if (response.status) {
        toast.success(response.message);
        // Redirect or handle successful verification
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "OTP verification failed");
    } finally {
      setShowLoader(false);
    }
  };

  const handleResendOTP = async () => {
    setShowLoader(true);
    try {
      const response = { status: true, message: "OTP resent successfully" };
      if (response.status) {
        startOTPTimer();
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP");
    } finally {
      setShowLoader(false);
    }
  };

  const handleBackToAuth = () => {
    setShowOTP(false);
    if (otpTimerRef.current) {
      clearInterval(otpTimerRef.current);
    }
  };

  const renderLoginForm = () => {
    const config = FORM_CONFIG.login;
    return (
      <Form onSubmit={handleLogin}>
        <FormHeader title={config.title} subtitle={config.subtitle} />
        <Form.Group className="mb-3">
          <Form.Label className="form-label">Email or Phone number</Form.Label>
          <div className="input-container">
            <Form.Control
              type="text"
              placeholder="email or phone number"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              className="form-input"
              size="sm"
            />
          </div>
        </Form.Group>

        <ActionButton
          variant="primary"
          type="submit"
          className="signin-button"
          loading={showLoader}
        >
          {config.submitText}
        </ActionButton>

        <GoogleSignInButton loading={showLoader} onClick={handleGoogleSignIn} />

        <AuthLink
          text={config.linkText}
          linkText={config.linkAction}
          onClick={() => setIsActive(true)}
        />
      </Form>
    );
  };

  const renderRegisterForm = () => {
    const config = FORM_CONFIG.register;
    return (
      <Form onSubmit={handleRegister}>
        <FormHeader title={config.title} subtitle={config.subtitle} />

        <FormInput
          label="Full Name"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={(value) => updateFormData("fullName", value)}
          required
          className="mb-2"
        />

        <FormInput
          label="Email"
          placeholder="email or phone number"
          value={formData.registerEmail}
          onChange={(value) => updateFormData("registerEmail", value)}
          required
        />

        <ActionButton
          variant="primary"
          type="submit"
          className="signin-button"
          loading={showLoader}
        >
          {config.submitText}
        </ActionButton>

        <GoogleSignInButton loading={showLoader} onClick={handleGoogleSignIn} />

        <AuthLink
          text={config.linkText}
          linkText={config.linkAction}
          onClick={() => setIsActive(false)}
        />
      </Form>
    );
  };

  const renderOTPForm = () => {
    const config = FORM_CONFIG.otp;
    const currentEmail = isActive ? formData.registerEmail : formData.email;

    return (
      <Form onSubmit={handleOTPVerification}>
        <FormHeader
          title={config.title}
          subtitle={`${config.subtitle}${currentEmail}`}
        />

        <FormInput
          label="OTP"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={setOTP}
          required
          maxLength={6}
        />

        <div className="options-container">
          {otpTimer > 0 ? (
            <span className="text-muted">Resend OTP in {otpTimer} seconds</span>
          ) : (
            <ActionButton
              variant="link"
              className="forgot-password"
              onClick={handleResendOTP}
              loading={showLoader}
            >
              Resend OTP
            </ActionButton>
          )}
        </div>

        <ActionButton
          variant="primary"
          type="submit"
          className="signin-button"
          loading={showLoader}
        >
          {config.submitText}
        </ActionButton>

        <ActionButton
          variant="secondary"
          className="signin-button mt-2"
          onClick={handleBackToAuth}
        >
          Back to {isActive ? "Sign Up" : "Sign In"}
        </ActionButton>
      </Form>
    );
  };

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
            {!showOTP
              ? isActive
                ? renderRegisterForm()
                : renderLoginForm()
              : renderOTPForm()}
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
