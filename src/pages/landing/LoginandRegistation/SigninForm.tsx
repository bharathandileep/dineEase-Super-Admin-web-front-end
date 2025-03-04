import React, { useState } from "react";
import "./SigninForm.css";
import google from "../../../assets/images/brands/g-suite.png";

function SigninForm() {
  const [isActive, setIsActive] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  const handleLoginSubmit = (e:any) => {
    e.preventDefault();
    setShowOTP(true);
  };

  const handleOTPSubmit = (e:any) => {
    e.preventDefault();
    // Handle OTP verification here
    console.log("OTP Submitted:", otp);
    setShowOTP(false);
    // Proceed with login after OTP verification
  };

  const handleBackToLogin = () => {
    setShowOTP(false);
  };

  return (
    <div className="signin-container">
      <div className={`container ${isActive ? "active" : ""}`}>
        <div className="form-box login">
          {!showOTP ? (
            <form onSubmit={handleLoginSubmit}>
              <h1 className="mb-4">Login</h1>
              <div className="input-box">
                <input type="text" placeholder="Email/Phone Number" required />
                <i className="bx bxs-user"></i>
              </div>
              <button type="submit" className="btn">
                Login
              </button>
              <p className="mt-3">Or login with Social platforms </p>
              <div className="social-icons">
                <button className="btn bg-white text-black btn-outline-danger justify-content-center d-flex align-items-center gap-2">
                  <img src={google} alt="Google Logo" width="25" height="20" />
                  Login with Google
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleOTPSubmit} className="otp-form">
              <h1 className="mb-4">Enter OTP</h1>
              <p>Please enter the OTP sent to your phone/email</p>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                  required
                />
                <i className="bx bxs-key"></i>
              </div>
              <button type="submit" className="btn">
                Verify OTP
              </button>
              <button
                type="button"
                className="btn btn-secondary mt-3"
                onClick={handleBackToLogin}
              >
                Back to Login
              </button>
            </form>
          )}
        </div>

        <div className="form-box register">
          <form action="">
            <h1 className="mb-4">Registeration</h1>
            <div className="input-box">
              <input type="text" placeholder="Username" required />
              <i className="bx bxs-user"></i>
            </div>
            <div className="input-box">
              <input type="email" placeholder="Email" required />
              <i className="bx bxs-envelope"></i>
            </div>
            <button type="submit" className="btn">
              Register
            </button>
            <p className="mt-3">Or login with Social platforms </p>
            <div className="social-icons">
              <button className="btn bg-white text-black btn-outline-danger justify-content-center d-flex align-items-center gap-2">
                <img src={google} alt="Google Logo" width="25" height="20" />
                Login with Google
              </button>
            </div>
          </form>
        </div>

        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Welcome!</h1>
            <p>Don't have an account?</p>
            <button className="btn login-btn" onClick={handleRegisterClick}>
              Register
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button className="btn register-btn" onClick={handleLoginClick}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SigninForm;
