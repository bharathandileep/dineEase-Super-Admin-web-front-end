import React, { useState, useRef, useEffect } from "react";
import {
  Navbar,
  Container,
  Nav,
  Button,
  Modal,
  Form,
  Tabs,
  Tab,
} from "react-bootstrap";
import { UtensilsCrossed } from "lucide-react";
import { toast } from "react-toastify";
import {
  authUserWithCredentials,
  authvaliadateOTP,
  googleAuth,
  loginOTPVerify,
  loginUserWithMail,
} from "../../server/admin/auth";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const NavigationBar = () => {
  const [showModal, setShowModal] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("signin-email");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loader, setShowLoader] = useState(false);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  
  const navigate = useNavigate();
  const { userLoggedIn, user, loading } = useSelector(
    (state: RootState) => state.Auth
  );
  useEffect(() => {
    // if (userLoggedIn && user) {
    if (user) {
      // navigate("/");
      setIsLoggedIn(true)

    }
    setIsLoggedIn(false)
  }, [userLoggedIn, user, navigate]);

  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];



  useEffect(() => {
    let interval: any | undefined;
    if (showOTP && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showOTP, timer]);

  const handleClose = () => {
    setShowModal(false);
    setShowOTP(false);
    setTimer(30);
    setCanResend(false);
  };

  const handleVerifyOTP = async () => {
    setShowLoader(true);
    try {
      const enteredOTP = otpRefs.map((ref) => ref.current?.value).join("");
      const userCredentials = {
        email,
        otp: enteredOTP,
      };
      if (enteredOTP.length === 6) {
        let response;

        if (activeTab.includes("signin")) {
          response = await loginOTPVerify(userCredentials);
        } else {
          response = await authvaliadateOTP(userCredentials);
        }

        if (response.status) {
          setIsLoggedIn(true);
          handleClose();
          toast.success("OTP Verified successfully!");
        } else {
          toast.error(response.message || "OTP verification failed.");
        }
      } else {
        toast.error("Please enter a valid 6-digit OTP.");
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      toast.error(
        "An error occurred while verifying the OTP. Please try again."
      );
    } finally {
      setShowLoader(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setShowLoader(true);
    try {
      const response = await googleAuth();
      if (response.status) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setShowLoader(false);
      setIsLoggedIn(true);
      handleClose();
    }
  };

  const handleSiginWithEmail = async () => {
    setShowLoader(true);
    try {
      const response = await loginUserWithMail({ email });
      if (response.status) {
        setShowLoader(false);
        setShowOTP(true);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      setShowLoader(false);
      console.error("Sign-in Error:", error);
      toast.error("An error occurred during sign-in. Please try again.");
    }
  };

  const handleloginwithPhone = async () => {
    console.log("Phone Number: ", phoneNumber);
  };

  const handleSignUpEmail = async () => {
    setShowLoader(true);
    try {
      setShowLoader(false);
      const response = await authUserWithCredentials({ email, fullName });
      if (response.status) {
        toast.success(response.message);
        setShowOTP(true);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      setShowLoader(false);
      console.error("Sign-up Error:", error);
      toast.error("An error occurred during sign-up. Please try again.");
    }
  };

  const handleSignUpphone = async () => {
    console.log("Full Name: ", fullName);
    console.log("Phone Number: ", phoneNumber);
  };

  const switchForm = (tab: string) => {
    setActiveTab(tab);
  };

  const handleResendOTP = () => {
    setTimer(30);
    setCanResend(false);
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length <= 1) {
      if (value && index < 5) {
        otpRefs[index + 1].current?.focus();
      }
      if (!value && index > 0) {
        otpRefs[index - 1].current?.focus();
      }
    }
  };

  return (
    <>
      <Navbar bg="white" expand="lg" className="py-3 shadow-sm fixed-top">
        <Container>
          <Navbar.Brand href="#home" className="d-flex align-items-center">
            <span className="fw-bold fs-4">DINEEAS</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {!isLoggedIn ? (
                <>
                  <Button
                    variant="outline-primary"
                    className="me-3 px-4 py-2 rounded-pill"
                    onClick={() => {
                      setShowModal(true);
                      setActiveTab("signin-email");
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="primary"
                    className="px-4 py-2 rounded-pill"
                    onClick={() => {
                      setShowModal(true);
                      setActiveTab("signup-email");
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <Nav.Link href="/apps/kitchen/new" className="me-3 text-dark">
                    Add Kitchen
                  </Nav.Link>
                  <Nav.Link href="/apps/organizations/new" className="text-dark">
                    Add Organization
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {activeTab.includes("signin") ? (
        <Modal show={showModal && !showOTP} onHide={handleClose} centered>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="w-100 text-center fs-4">
              {activeTab.includes("signin")
                ? "Welcome Back!"
                : "Create Account"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-4 pt-2">
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => k && setActiveTab(k)}
              className="mb-2 justify-content-center"
            >
              <Tab eventKey="signin-email" title="Email">
                <Form className="py-3">
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-medium">Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      className="py-2"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    className="w-100 py-2 rounded-pill mb-2"
                    onClick={handleSiginWithEmail}
                  >
                    Continue
                  </Button>
                  <Button
                    variant="outline-dark"
                    className="w-100 py-2 rounded-pill d-flex align-items-center justify-content-center gap-2"
                    onClick={handleGoogleSignIn}
                  >
                    <img
                      src="https://www.google.com/favicon.ico"
                      alt="Google"
                      style={{ width: "20px", height: "20px" }}
                    />
                    Continue with Google
                  </Button>
                  <div className="position-relative">
                    <hr className="" />
                    <div className="position-absolute top-50 start-50 translate-middle bg-white px-3">
                      <span className="text-muted">or</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-muted">Don't have an account? </span>
                    <a
                      href="#"
                      className="text-decoration-none"
                      onClick={(e) => {
                        e.preventDefault();
                        switchForm("signup-email");
                      }}
                    >
                      Sign Up
                    </a>
                  </div>
                  <div className="text-center ">
                    <span className="text-muted">Login With user name password? </span>
                    <a
                      href="#"
                      className="text-decoration-none"
                      onClick={(e) => {
                        navigate("/auth/access/login")
                      }}
                    >
                      Access
                    </a>
                  </div>
                </Form>
              </Tab>
              <Tab eventKey="signin-phone" title="Phone">
                <Form className="py-3">
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-medium">Phone number</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="Enter your phone number"
                      className="py-2"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    className="w-100 py-2 rounded-pill mb-3"
                    onClick={handleloginwithPhone}
                  >
                    Continue
                  </Button>
                  <Button
                    variant="outline-dark"
                    className="w-100 py-2 rounded-pill d-flex align-items-center justify-content-center gap-2"
                    onClick={handleGoogleSignIn}
                  >
                    <img
                      src="https://www.google.com/favicon.ico"
                      alt="Google"
                      style={{ width: "20px", height: "20px" }}
                    />
                    Continue with Google
                  </Button>
                  <div className="position-relative mb-4">
                    <hr className="my-4" />
                    <div className="position-absolute top-50 start-50 translate-middle bg-white px-3">
                      <span className="text-muted">or</span>
                    </div>
                  </div>
                  <div className="text-center mb-4">
                    <span className="text-muted">Don't have an account? </span>
                    <a
                      href="#"
                      className="text-decoration-none"
                      onClick={(e) => {
                        e.preventDefault();
                        switchForm("signup-email");
                      }}
                    >
                      Sign Up
                    </a>
                  </div>
                </Form>
              </Tab>
            </Tabs>
          </Modal.Body>
        </Modal>
      ) : (
        <Modal show={showModal && !showOTP} onHide={handleClose} centered>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="w-100 text-center fs-4">
              {activeTab.includes("signin")
                ? "Welcome Back!"
                : "Create Account"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-4 pt-2">
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => k && setActiveTab(k)}
              className="mb-4 justify-content-center"
            >
              <Tab eventKey="signup-email" title="Email">
                <Form className="py-3">
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your full name"
                      className="py-2"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-medium">Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      className="py-2"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    className="w-100 py-2 rounded-pill mb-3"
                    onClick={handleSignUpEmail}
                  >
                    Continue
                  </Button>
                  <div className="text-center mb-4">
                    <span className="text-muted">
                      Already have an account?{" "}
                    </span>
                    <a
                      href="#"
                      className="text-decoration-none"
                      onClick={(e) => {
                        e.preventDefault();
                        switchForm("signin-email");
                      }}
                    >
                      Sign In
                    </a>
                  </div>
                  <div className="position-relative mb-4">
                    <hr className="my-4" />
                    <div className="position-absolute top-50 start-50 translate-middle bg-white px-3">
                      <span className="text-muted">or</span>
                    </div>
                  </div>
                  <Button
                    variant="outline-dark"
                    className="w-100 py-2 rounded-pill d-flex align-items-center justify-content-center gap-2"
                    onClick={handleGoogleSignIn}
                  >
                    <img
                      src="https://www.google.com/favicon.ico"
                      alt="Google"
                      style={{ width: "20px", height: "20px" }}
                    />
                    Continue with Google
                  </Button>
                </Form>
              </Tab>
              <Tab eventKey="signup-phone" title="Phone">
                <Form className="py-3">
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your full name"
                      className="py-2"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-medium">Phone number</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="Enter your phone number"
                      className="py-2"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    className="w-100 py-2 rounded-pill mb-3"
                    onClick={handleSignUpphone}
                  >
                    Continue
                  </Button>
                  <div className="text-center mb-4">
                    <span className="text-muted">
                      Already have an account?{" "}
                    </span>
                    <a
                      href="#"
                      className="text-decoration-none"
                      onClick={(e) => {
                        e.preventDefault();
                        switchForm("signin-phone");
                      }}
                    >
                      Sign In
                    </a>
                  </div>
                  <div className="position-relative mb-4">
                    <hr className="my-4" />
                    <div className="position-absolute top-50 start-50 translate-middle bg-white px-3">
                      <span className="text-muted">or</span>
                    </div>
                  </div>
                  <Button
                    variant="outline-dark"
                    className="w-100 py-2 rounded-pill d-flex align-items-center justify-content-center gap-2"
                    onClick={handleGoogleSignIn}
                  >
                    <img
                      src="https://www.google.com/favicon.ico"
                      alt="Google"
                      style={{ width: "20px", height: "20px" }}
                    />
                    Continue with Google
                  </Button>
                </Form>
              </Tab>
            </Tabs>
          </Modal.Body>
        </Modal>
      )}
      <Modal show={showOTP} onHide={handleClose} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="w-100 text-center fs-4">
            Verify OTP
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pt-2">
          <p className="text-center text-muted mb-4">
            We've sent a verification code to your{" "}
            {activeTab.includes("phone") ? "phone number" : "email"}
          </p>
          <Form>
            <Form.Group className="mb-4">
              <div className="d-flex justify-content-center gap-2">
                {[...Array(6)].map((_, index) => (
                  <Form.Control
                    key={index}
                    type="text"
                    maxLength={1}
                    className="text-center"
                    style={{ width: "45px", height: "45px" }}
                    ref={otpRefs[index]}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Backspace" &&
                        !e.currentTarget.value &&
                        index > 0
                      ) {
                        otpRefs[index - 1].current?.focus();
                      }
                    }}
                  />
                ))}
              </div>
            </Form.Group>
            <Button
              variant="primary"
              className="w-100 py-2 rounded-pill mb-3"
              onClick={handleVerifyOTP}
            >
              Verify OTP
            </Button>
            <div className="text-center mb-0">
              <p className="text-muted mb-2">Resend code in {timer}s</p>
              <Button
                variant="link"
                className="text-decoration-none p-0"
                onClick={handleResendOTP}
                disabled={!canResend}
              >
                Resend OTP
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
