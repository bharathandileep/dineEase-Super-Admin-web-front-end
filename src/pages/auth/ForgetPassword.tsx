import React, { useEffect, useState } from "react";
import { Button, Alert, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

// actions
import { resetAuth } from "../../redux/actions";
import { RootState, AppDispatch } from "../../redux/store";

// components
import { VerticalForm, FormInput } from "../../components/";
import AuthLayout from "./AuthLayout";

// API
import { 
  generateForgotPasswordOtp, 
  verifyForgotPasswordOtp, 
  updateAdminPassword 
} from "../../server/admin/auth";

interface FormData {
  email?: string;
  otp?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const BottomLink = () => {
  const { t } = useTranslation();
  return (
    <Row className="mt-3">
      <Col className="text-center">
        <p className="text-white-50">
          {t("Back to")}{" "}
          <Link to={"/auth/login"} className="text-white ms-1">
            <b>{t("Log in")}</b>
          </Link>
        </p>
      </Col>
    </Row>
  );
};

const ForgetPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [userEmail, setUserEmail] = useState<string>('');
  const [isResending, setIsResending] = useState<boolean>(false);
  const [isToken, setIsToken] = useState<string>('');

  useEffect(() => {
    dispatch(resetAuth());
  }, [dispatch]);

  const { loading } = useSelector((state: RootState) => ({
    loading: state.Auth.loading,
  }));

  // Reset form and error states when step changes
  useEffect(() => {
    reset();
    setApiError(null);
    setApiSuccess(null);
  }, [step]);

  const schemas = {
    email: yup.object().shape({
      email: yup
        .string()
        .email(t("Please enter a valid email"))
        .required(t("Please enter your email")),
    }),
    otp: yup.object().shape({
      otp: yup
        .string()
        .required(t("Please enter OTP"))
        .matches(/^[0-9]{6}$/, t("OTP must be 6 digits")),
    }),
    password: yup.object().shape({
      newPassword: yup
        .string()
        .required(t("Please enter new password"))
        .min(6, t("Password must be at least 6 characters")),
      confirmPassword: yup
        .string()
        .required(t("Please confirm your password"))
        .oneOf([yup.ref('newPassword')], t("Passwords must match")),
    }),
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schemas[step]),
    mode: 'onChange'
  });

  const handleResendOTP = async () => {
    try {
      setIsResending(true);
      setApiError(null);
      const response = await generateForgotPasswordOtp({ 
        email: userEmail 
      });
      
      if (response.status) { // Adjusted to match API response structure
        setApiSuccess(t("OTP resent successfully. Please check your email."));
      } else {
        setApiError(response?.data?.message || t("Failed to resend OTP. Please try again."));
      }
    } catch (error: any) {
      setApiError(error.response?.data?.message || t("An error occurred. Please try again."));
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (formData: FormData) => {
    try {
      setApiError(null);
      setApiSuccess(null);
  
      switch (step) {
        case 'email':
          const emailResponse = await generateForgotPasswordOtp({ 
            email: formData.email! 
          });
          
          console.log('Email Response:', emailResponse); // Debug log
          
          if (emailResponse.status) { // Adjusted to match API response structure
            setUserEmail(formData.email!);
            setApiSuccess(emailResponse.message || t("OTP sent successfully. Please check your email."));
            setStep('otp');
          } else {
            setApiError(emailResponse?.data?.message || t("Failed to send OTP. Please try again."));
          }
          break;
  
        case 'otp':
          const otpResponse = await verifyForgotPasswordOtp({ 
            email: userEmail, 
            otp: formData.otp!,
            token: isToken // Pass the token here
          });
          setIsToken(otpResponse.data.token); 

          if (otpResponse.data.isToken) {
            setApiSuccess(otpResponse?.data?.message || t("OTP verified successfully. Please set your new password."));
            setTimeout(() => {
              setStep('password');
            }, 2000);
          } else {
            setApiError(otpResponse?.data?.message || t("Invalid token. Please try again."));
          }
          
          if (otpResponse.status) { 
            setTimeout(() => {
              setStep('password');
            }, 1000);
          } else {
          }
          break;
  
        case 'password':
          const passwordResponse = await updateAdminPassword({
            email: userEmail,
            newPassword: formData.newPassword!,
            confirmPassword: formData.confirmPassword!,
            token: isToken 
          });
          
          console.log('Password Response:', passwordResponse); // Debug log
          
          if (passwordResponse.status) { // Adjusted to match API response structure
            setApiSuccess(passwordResponse?.data?.message || t("Password updated successfully!"));
            setTimeout(() => {
              navigate("/auth/login");
            }, 2000);
          } else {
            setApiError(passwordResponse?.data?.message || t("Failed to update password. Please try again."));
          }
          break;
      }
    } catch (error: any) {
      console.error('Error:', error); // Debug log
      setApiError(error.response?.data?.message || t("An error occurred. Please try again."));
    }
  };

  const renderFormFields = () => {
    switch (step) {
      case 'email':
        return (
          <div className="mb-3">
            <label className="form-label">{t("Email")}</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder={t("Enter your email")}
              {...register('email')}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>
        );
      case 'otp':
        return (
          <div className="mb-3">
            <label className="form-label">{t("OTP")}</label>
            <input
              type="text"
              className={`form-control ${errors.otp ? 'is-invalid' : ''}`}
              placeholder={t("Enter 6-digit OTP")}
              maxLength={6}
              {...register('otp')}
            />
            {errors.otp && (
              <div className="invalid-feedback">{errors.otp.message}</div>
            )}
            <div className="text-center mt-2">
              <Button
                variant="link"
                onClick={handleResendOTP}
                disabled={isResending}
                className="p-0"
              >
                {isResending ? t("Resending...") : t("Resend OTP")}
              </Button>
            </div>
            <div className="text-center mt-2">
              <small className="text-muted">
                {t("Email sent to")}: {userEmail}
              </small>
            </div>
          </div>
        );
      case 'password':
        return (
          <>
            <div className="mb-3">
              <label className="form-label">{t("New Password")}</label>
              <input
                type="password"
                className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                placeholder={t("Enter new password")}
                {...register('newPassword')}
              />
              {errors.newPassword && (
                <div className="invalid-feedback">{errors.newPassword.message}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">{t("Confirm Password")}</label>
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder={t("Confirm new password")}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <div className="invalid-feedback">{errors.confirmPassword.message}</div>
              )}
            </div>
          </>
        );
    }
  };

  return (
    <AuthLayout 
      helpText={t(step === 'email' 
        ? "Enter your email address and we'll send you an OTP to reset your password."
        : step === 'otp'
        ? "Enter the 6-digit OTP sent to your email address."
        : "Enter and confirm your new password."
      )} 
      bottomLinks={<BottomLink />}
    >
      {apiSuccess && (
        <Alert variant="success" style={{ color: "green" }}>
          {apiSuccess}
        </Alert>
      )}
      {apiError && (
        <Alert variant="danger">
          {apiError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="authentication-form">
        {renderFormFields()}

        <div className="d-grid text-center">
          <Button 
            type="submit" 
            variant="primary"
            disabled={loading || isResending}
          >
            {step === 'email' 
              ? t("Send OTP")
              : step === 'otp'
              ? t("Verify OTP")
              : t("Update Password")
            }
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgetPassword;