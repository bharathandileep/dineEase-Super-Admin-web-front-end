import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import Spinner from "../../../components/Spinner";
import GoogleLogo from "../../../assets/images/brands/g-suite.png";
import "./SigninForm.css";
import {
  authUserWithCredentials,
  googleAuth,
  loginOTPVerify,
  loginUserWithMail,
  loginUserWithPhone,
  verifyPhoneOTP,
} from "../../../server/admin/auth";

interface AuthResponse {
  status: boolean;
  message: string;
}

type AuthMethod = "email" | "phone";

const SigninForm: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [fullName, setFullName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [authMethod, setAuthMethod] = useState<AuthMethod>("email");
  const [otpTimer, setOTPTimer] = useState(30);
  const [canResendOTP, setCanResendOTP] = useState(false);
  const otpTimerRef = useRef<NodeJS.Timeout | null>(null);

  const loginFormRef = useRef<HTMLFormElement>(null);
  const registerFormRef = useRef<HTMLFormElement>(null);
  const otpFormRef = useRef<HTMLFormElement>(null);

  const isEmail = (value: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isPhoneNumber = (value: string): boolean =>
    /^\+?[0-9]{10,15}$/.test(value);
  const isValidOTP = (otpValue: string): boolean => /^[0-9]{6}$/.test(otpValue);

  const validateForm = (form: HTMLFormElement): boolean => {
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return false;
    }
    return true;
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showOTP && otpTimer > 0) {
      timer = setInterval(() => {
        setOTPTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(timer);
            setCanResendOTP(true);
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
    setOTPTimer(30);
    setCanResendOTP(false);
  };

  const handleGoogleSignIn = async () => {
    setShowLoader(true);
    try {
      const response = await googleAuth();
      response.status
        ? toast.success(response.message)
        : toast.error(response.message);
    } catch (error) {
      toast.error("Google authentication failed. Please try again.");
    } finally {
      setShowLoader(false);
    }
  };

  const handleAuthWithIdentifier = async (method: AuthMethod) => {
    if (loginFormRef.current && !validateForm(loginFormRef.current)) return;

    setShowLoader(true);
    const identifier = inputValue;

    try {
      const response: AuthResponse =
        method === "email"
          ? await loginUserWithMail({ email: identifier })
          : await loginUserWithPhone({ phone: identifier });

      if (response.status) {
        setShowOTP(true);
        setAuthMethod(method);
        startOTPTimer();
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(
        `${
          method.charAt(0).toUpperCase() + method.slice(1)
        } authentication failed`
      );
    } finally {
      setShowLoader(false);
    }
  };

  const handleSignUp = async () => {
    if (registerFormRef.current && !validateForm(registerFormRef.current))
      return;

    setShowLoader(true);
    try {
      const response = await authUserWithCredentials({
        email: emailOrPhone,
        fullName,
      });

      if (response.status) {
        setShowOTP(true);
        setAuthMethod("email");
        startOTPTimer(); // Start OTP timer
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Sign-up failed. Please try again.");
    } finally {
      setShowLoader(false);
    }
  };

  const handleOTPVerification = async () => {
    if (otpFormRef.current && !validateForm(otpFormRef.current)) return;

    if (!isValidOTP(otp)) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setShowLoader(true);
    try {
      const verificationMethod =
        authMethod === "email" ? loginOTPVerify : verifyPhoneOTP;

      const response = await verificationMethod({
        [authMethod]: inputValue,
        otp,
      });

      response.status
        ? toast.success(response.message)
        : toast.error(response.message || "OTP verification failed");
    } catch (error) {
      toast.error("OTP verification error. Please try again.");
    } finally {
      setShowLoader(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setShowLoader(true);
      const response: AuthResponse =
        authMethod === "email"
          ? await loginUserWithMail({ email: inputValue })
          : await loginUserWithPhone({ phone: inputValue });

      if (response.status) {
        startOTPTimer();
        toast.success("OTP resent successfully");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setShowLoader(false);
    }
  };

  const renderLoginForm = () => (
    <form
      ref={loginFormRef}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        handleAuthWithIdentifier(isEmail(inputValue) ? "email" : "phone");
      }}
      className="needs-validation"
    >
      <h1 className="mb-4 text-center">Login</h1>
      <div className="mb-3">
        <div className="input-group has-validation">
          <input
            id="loginInput"
            type="text"
            className="input-field"
            placeholder="Email/Phone Number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            pattern={`${
              isEmail(inputValue)
                ? "[^\\s@]+@[^\\s@]+\\.[^\\s@]+"
                : "\\+?[0-9]{10,15}"
            }`}
            required
          />
          <div className="invalid-feedback">
            Please enter a valid email or phone number.
          </div>
        </div>
      </div>
      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          {showLoader ? <Spinner color="light" /> : "Login"}
        </button>
      </div>

      <div className="text-center my-3">
        <p className="text-muted">Or login with</p>
        <button
          type="button"
          className="btn btn-outline-danger d-flex align-items-center justify-content-center w-100"
          onClick={handleGoogleSignIn}
        >
          <img
            src={GoogleLogo}
            className="me-2"
            width="25"
            height="20"
            alt="Google Logo"
          />
          Login with Google
        </button>
      </div>
    </form>
  );

  const renderRegisterForm = () => (
    <form
      ref={registerFormRef}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        handleSignUp();
      }}
      className="needs-validation"
    >
      <h1 className="mb-4 text-center">Registration</h1>
      <div className="mb-3">
        <div className="input-group has-validation">
          <input
            id="fullNameInput"
            type="text"
            className="input-field"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            minLength={2}
            maxLength={50}
            required
          />
          <div className="invalid-feedback">
            Please enter a valid full name (2-50 characters).
          </div>
        </div>
      </div>
      <div className="mb-3">
        <div className="input-group has-validation">
          <input
            id="registerInput"
            type="text"
            className="input-field"
            placeholder="Email / Phone Number"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            pattern={`${
              isEmail(emailOrPhone)
                ? "[^\\s@]+@[^\\s@]+\\.[^\\s@]+"
                : "\\+?[0-9]{10,15}"
            }`}
            required
          />
          <div className="invalid-feedback">
            Please enter a valid email or phone number.
          </div>
        </div>
      </div>
      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          {showLoader ? <Spinner color="light" /> : "Register"}
        </button>
      </div>

      <div className="text-center my-3">
        <p className="text-muted">Or register with</p>
        <button
          type="button"
          className="btn btn-outline-danger d-flex align-items-center justify-content-center w-100"
          onClick={handleGoogleSignIn}
        >
          <img
            src={GoogleLogo}
            className="me-2"
            width="25"
            height="20"
            alt="Google Logo"
          />
          Register with Google
        </button>
      </div>
    </form>
  );

  const renderOTPForm = () => (
    <form
      ref={otpFormRef}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        handleOTPVerification();
      }}
      className="needs-validation"
    >
      <h1 className="mb-4 text-center">Verify OTP</h1>
      <p className="text-center text-muted">
        Enter the OTP sent to your {authMethod}
      </p>
      <div className="mb-3">
        <div className="input-group has-validation">
          <input
            id="otpInput"
            type="text"
            className="input-field"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
            pattern="[0-9]{6}"
            maxLength={6}
            required
            disabled={otpTimer === 0}
          />
          <div className="invalid-feedback">
            Please enter a valid 6-digit OTP.
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        {otpTimer > 0 ? (
          <span className="text-muted">Resend OTP in {otpTimer} seconds</span>
        ) : (
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={handleResendOTP}
            disabled={showLoader}
          >
            {showLoader ? <Spinner color="primary" /> : "Resend OTP"}
          </button>
        )}
      </div>

      <div className="d-grid mb-3">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={otpTimer === 0}
        >
          {showLoader ? <Spinner color="light" /> : "Verify OTP"}
        </button>
      </div>
      <div className="d-grid">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setShowOTP(false);
            if (otpTimerRef.current) {
              clearInterval(otpTimerRef.current);
            }
          }}
        >
          Back to {isActive ? "Register" : "Login"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="signin-container">
      <div className={`container ${isActive ? "active" : ""}`}>
        <div className="form-box login">
          {!showOTP ? renderLoginForm() : renderOTPForm()}
        </div>

        <div className="form-box register">
          {!showOTP ? renderRegisterForm() : renderOTPForm()}
        </div>

        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Welcome!</h1>
            <p>Don't have an account?</p>
            <button
              className="btn btn-outline-light"
              onClick={() => setIsActive(true)}
            >
              Register
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button
              className="btn btn-outline-light"
              onClick={() => setIsActive(false)}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninForm;
