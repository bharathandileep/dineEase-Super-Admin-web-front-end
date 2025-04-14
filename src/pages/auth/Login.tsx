import React, { useEffect } from "react";
import { Button, Alert, Row, Col } from "react-bootstrap";
import { Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";

// components
import { VerticalForm, FormInput } from "../../components/";
import AuthLayout from "./AuthLayout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { loginUser } from "../../redux/actions";
import { setContext } from "../../helpers/api/utils";

interface UserData {
  userName: string;
  password: string;
}

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const schemaResolver = yupResolver(
    yup.object().shape({
      userName: yup.string().required(t("Please enter userName")),
      password: yup.string().required(t("Please enter Password")),
    })
  );
  const { userLoggedIn, user, loading } = useSelector(
    (state: RootState) => state.Auth
  );
  const onSubmit = (formData: UserData) => {
    dispatch(loginUser(formData["userName"], formData["password"]));
    const organizationViewDetails = {
      role: "Admin",
      adminName: "admin@123",
      id: "67a1083b3c9f01a384e9683c",
      slug: "admin",
    };
    setContext({
      contextId: "67a1083b3c9f01a384e9683c",
      contextType: "Admin",
      slug: "admin",
    });
    localStorage.setItem(
      "accessDetails",
      JSON.stringify(organizationViewDetails)
    );
  };
  useEffect(() => {
    if (userLoggedIn && user) {
      navigate(`/apps/${user.role.toLowerCase()}`);
    }
  }, [userLoggedIn, user, navigate]);

  return (
    <>
      <AuthLayout
        helpText={t("Enter your User name and password to access admin panel.")}
      >
        <VerticalForm<UserData> onSubmit={onSubmit} resolver={schemaResolver}>
          <FormInput
            label={t("userName")}
            type="text"
            name="userName"
            placeholder="Enter your userName"
            containerClass={"mb-3"}
          />
          <FormInput
            label={t("Password")}
            type="password"
            name="password"
            placeholder="Enter your password"
            containerClass={"mb-3"}
          ></FormInput>

          <div className="text-center d-grid">
            <Button variant="primary" type="submit">
              {t("Log In")}
            </Button>
          </div>

          <div className="text-center mt-3">
            <Link to="/auth/forget-password" className="text-muted">
              {t("Forgot Password?")}
            </Link>
          </div>
        </VerticalForm>
      </AuthLayout>
    </>
  );
};

export default Login;
