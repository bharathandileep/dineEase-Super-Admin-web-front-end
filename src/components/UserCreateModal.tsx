import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import FormInput from "./FormInput";
import VerticalForm from "./VerticalForm";
import { checkUserIspresent, createNewUser } from "../server/admin/auth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface UserData {
  email: string;
  name?: string;
  phone?: string;
}

interface userModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo?: UserData | null;
  setIsOpen: (isOpen: boolean) => void;
  onUserDataChange?: (data: UserData) => void;
}

export function UserCreateModal({
  isOpen,
  onClose,
  userInfo,
  setIsOpen,
  onUserDataChange,
}: userModalProps) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>(userInfo || { email: "" });
  const [selectedTab, setSelectedTab] = useState<"existing" | "new">(
    "existing"
  );
  const [step, setStep] = useState<"existing-user" | "new-user">(
    "existing-user"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getSchema = () => {
    return yup.object().shape({
      email: yup
        .string()
        .email("Please enter a valid email")
        .required("Email is required"),
      name:
        selectedTab === "new"
          ? yup.string().required("Name is required")
          : yup.string(),
      phone:
        selectedTab === "new"
          ? yup.string().required("Phone is required")
          : yup.string(),
    });
  };

  const {
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    setValue,
    trigger,
    clearErrors,
  } = useForm({
    resolver: yupResolver(getSchema()),
    defaultValues: userData,
  });

  useEffect(() => {
    reset(userData);
    clearErrors();
  }, [selectedTab]);

  useEffect(() => {
    if (userInfo) {
      setUserData(userInfo);
      reset(userInfo);
    }
  }, [userInfo]);

  useEffect(() => {
    Object.entries(userData).forEach(([key, value]) => {
      setValue(key as any, value);
    });
  }, [userData, setValue]);

  const handleTabChange = (tab: "existing" | "new") => {
    setSelectedTab(tab);
    setStep(tab === "existing" ? "existing-user" : "new-user");
    clearErrors();
    reset(userData);
  };

  const handleStepChange = async () => {
    const isValid = await trigger();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      let response;
      if (step === "existing-user") {
        if (!userData.email || !userData.email.includes("@")) {
          setError("email", {
            type: "manual",
            message: "Please enter a valid email address",
          });
          setIsSubmitting(false);
          return;
        }

        response = await checkUserIspresent({ email: userData.email });

        if (response.status) {
          toast.success(response.message);
          const updatedUserData = response.data;
          setUserData(updatedUserData);
          if (onUserDataChange) {
            onUserDataChange(updatedUserData);
          }
          setIsOpen(false);
        } else {
          setError("email", {
            type: "manual",
            message: response.message || "User not found with this email",
          });
        }
      } else if (step === "new-user") {
        const isValid = await trigger();
        if (!isValid) {
          setIsSubmitting(false);
          return;
        }
        response = await createNewUser(userData);
        if (response.status) {
          toast.success(response.message);
          const updatedUserData = response.data;
          setUserData(updatedUserData);
          if (onUserDataChange) {
            onUserDataChange(updatedUserData);
          }
          setIsOpen(false);
        } else {
          if (response.errors && typeof response.errors === "object") {
            Object.entries(response.errors).forEach(([field, message]) => {
              if (field === "name" || field === "email" || field === "phone") {
                setError(field as any, {
                  type: "manual",
                  message: message as string,
                });
              }
            });
          } else {
            setError("email", {
              type: "manual",
              message: response.message || "Failed to create user",
            });
          }
        }
      }
    } catch (error: any) {
      setError("email", {
        type: "manual",
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData({ ...userData, [field]: value });
    setValue(field, value);
    clearErrors(field);
  };

  const handleCloseModal = () => {
    if (!userInfo || !userInfo.email) {
      navigate("/apps/kitchen/list");
    } else {
      console.log(userInfo);
      onClose();
    }
  };

  const renderStep = () => {
    if (!userInfo) {
      return null;
    }

    switch (step) {
      case "existing-user":
        return (
          <div>
            <h4 className="mb-3">Enter Your Email</h4>
            <FormInput
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              containerClass="mb-3"
              value={userData.email}
              onChange={(e: any) => handleInputChange("email", e.target.value)}
            />
            {errors.email && (
              <div className="text-danger mb-2">{errors.email.message}</div>
            )}
            <div className="text-end">
              <Button
                variant="warning"
                className="text-white"
                onClick={handleStepChange}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Continue"}
              </Button>
            </div>
          </div>
        );
      case "new-user":
        return (
          <div>
            <h4 className="mb-3">Create New Account</h4>
            <FormInput
              label="Full Name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              containerClass="mb-3"
              value={userData.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            {errors.name && (
              <div className="text-danger mb-2">{errors.name.message}</div>
            )}

            <FormInput
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              containerClass="mb-3"
              value={userData.email}
              onChange={(e: any) => handleInputChange("email", e.target.value)}
            />
            {errors.email && (
              <div className="text-danger mb-2">{errors.email.message}</div>
            )}

            <FormInput
              label="Phone Number"
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              containerClass="mb-3"
              value={userData.phone || ""}
              onChange={(e: any) => handleInputChange("phone", e.target.value)}
            />
            {errors.phone && (
              <div className="text-danger mb-2">{errors.phone.message}</div>
            )}

            <div className="text-end">
              <Button
                variant="warning"
                className="text-white"
                onClick={handleStepChange}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Continue"}
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal show={isOpen} onHide={handleCloseModal} centered>
      <Modal.Header className="bg-light" closeButton></Modal.Header>
      <ul className="nav nav-tabs nav-justified">
        <li className="nav-item">
          <a
            className={`nav-link ${
              selectedTab === "existing" ? "active bg-warning text-white" : ""
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleTabChange("existing");
            }}
          >
            Have Account
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${
              selectedTab === "new" ? "active bg-warning text-white" : ""
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleTabChange("new");
            }}
          >
            New Account
          </a>
        </li>
      </ul>

      <Modal.Body className="p-4">
        <form onSubmit={(e) => e.preventDefault()}>{renderStep()}</form>
      </Modal.Body>
    </Modal>
  );
}
