import React, { useEffect } from "react";
import { Button, Alert } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

// actions
import { resetAuth, loginUser, emploginUser } from "../../redux/actions";

// store
import { RootState, AppDispatch } from "../../redux/store";

// components
import { VerticalForm, FormInput } from "../../components/";

import AuthLayout from "./AuthLayout";
import { toast } from "react-toastify";
import { useAuthDetails } from "../../hooks/useAuthDetails";

interface UserData {
  email: string;
  password: string;
}

/* bottom link */
const BottomLink = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer footer-alt">
      <p className="text-muted">
        {t("Don't have an account?")}{" "}
        <Link to={"/auth/register2"} className="text-muted ms-1">
          <b>{t("Sign Up")}</b>
        </Link>
      </p>
    </footer>
  );
};

const Login2 = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { context } = useAuthDetails();

  const { userLoggedIn, user, loading } = useSelector(
    (state: RootState) => state.Auth
  );

  useEffect(() => {
    dispatch(resetAuth());
  }, [dispatch]);

  const schemaResolver = yupResolver(
    yup.object().shape({
      email: yup.string().required(t("Please enter email")),
      password: yup.string().required(t("Please enter Password")),
    })
  );

  const onSubmit = async (formData: UserData) => {
    try {
      dispatch(emploginUser(formData["email"], formData["password"]));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    if (userLoggedIn && user && context?.slug) {
      navigate(`/apps/${context.slug}`);
    }
  }, [userLoggedIn, user, context, navigate]);

  return (
    <>
      <AuthLayout bottomLinks={<BottomLink />}>
        <h4 className="mt-0">{t("Sign In")}</h4>
        <p className="text-muted mb-4">
          {t("Enter your User name and password to access account.")}
        </p>

        <VerticalForm
          onSubmit={onSubmit}
          resolver={schemaResolver}
          defaultValues={{ email: "", password: "" }}
        >
          <FormInput
            label={t("email")}
            type="text"
            name="email"
            placeholder={t("Enter your email")}
            containerClass={"mb-3"}
          />
          <FormInput
            label={t("Password")}
            type="password"
            name="password"
            placeholder={t("Enter your password")}
            containerClass={"mb-3"}
          >
            <Link to="/" className="text-muted float-end">
              <small>{t("Forgot your password?")}</small>
            </Link>
          </FormInput>

          <div className="d-grid mb-0 text-center">
            <Button variant="primary" type="submit" disabled={loading}>
              {t("Log In")}
            </Button>
          </div>
        </VerticalForm>
      </AuthLayout>
    </>
  );
};

export default Login2;
