import React, { useEffect } from "react";
import { Button, Alert } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";

// actions
import { resetAuth, loginUser } from "../../redux/actions";

// store
import { RootState, AppDispatch } from "../../redux/store";


// components
import { VerticalForm, FormInput } from "../../components/";

import AuthLayout from "./AuthLayout";
import { authAccessCredentials } from "../../server/admin/login";
import { toast } from "react-toastify";


interface UserData {
  username: string;
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


  const { userLoggedIn, user, loading } = useSelector(
     (state: RootState) => state.Auth
   );

  useEffect(() => {
    // if (userLoggedIn && user) {
    if (user) {
      // navigate("/");
      navigate("/")
      
    }
  }, [userLoggedIn, user, navigate]);


  useEffect(() => {
    dispatch(resetAuth());
  }, [dispatch]);

  // const { loading, userLoggedIn, user, error } = useSelector(
  //   (state: RootState) => ({
  //     loading: state.Auth.loading,
  //     user: state.Auth.user,
  //     error: state.Auth.error,
  //     userLoggedIn: state.Auth.userLoggedIn,
  //   })
  // );

  /*
   * form validation schema
   */
  const schemaResolver = yupResolver(
    yup.object().shape({
      username: yup.string().required(t("Please enter Username")),
      password: yup.string().required(t("Please enter Password")),
    })
  );



  const onSubmit = async (formData: UserData) => {
  try {
    const response = await authAccessCredentials(formData);
    if (response.status) {
      toast.success(response.message);
      window.location.href = "/";
      navigate("/")
    } else {
      toast.error(response.message || "Something went wrong.");
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
    toast.error(errorMessage);
    console.error("Error:", error);
  }
};


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
          defaultValues={{ username: "", password: "" }}
        >
          <FormInput
            label={t("Username")}
            type="text"
            name="username"
            placeholder={t("Enter your Username")}
            containerClass={"mb-3"}
          />
          <FormInput
            label={t("Password")}
            type="password"
            name="password"
            placeholder={t("Enter your password")}
            containerClass={"mb-3"}
          >
            <Link to="/auth/login" className="text-muted float-end">
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
