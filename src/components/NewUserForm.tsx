import React from "react";
import { ArrowRight, Mail, User } from "lucide-react";

interface UserData {
  email: string;
  name?: string;
  phone?: string;
}

interface NewUserFormProps {
  userData: UserData;
  onUserDataChange: (data: UserData) => void;
  onNext: () => void;
}

export function NewUserForm({
  userData,
  onUserDataChange,
  onNext,
}: NewUserFormProps) {
  return (
    <div>
      <h2 className="h4 fw-bold mb-4">Create New Account</h2>
      <div className="mb-3">
        <label className="form-label">Full Name</label>
        <div className="input-group">
          <span className="input-group-text">
            <User className="text-secondary" size={18} />
          </span>
          <input
            type="text"
            value={userData.name || ""}
            onChange={(e) =>
              onUserDataChange({ ...userData, name: e.target.value })
            }
            className="form-control"
            placeholder="Enter your full name"
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Email Address</label>
        <div className="input-group">
          <span className="input-group-text">
            <Mail className="text-secondary" size={18} />
          </span>
          <input
            type="email"
            value={userData.email}
            onChange={(e) =>
              onUserDataChange({ ...userData, email: e.target.value })
            }
            className="form-control"
            placeholder="Enter your email"
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Phone Number</label>
        <input
          type="tel"
          value={userData.phone || ""}
          onChange={(e) =>
            onUserDataChange({ ...userData, phone: e.target.value })
          }
          className="form-control"
          placeholder="Enter your phone number"
        />
      </div>
      <div className="d-flex justify-content-end mt-4">
        <button
          onClick={onNext}
          className="btn btn-warning text-white d-flex align-items-center"
        >
          Continue <ArrowRight className="ms-2" size={16} />
        </button>
      </div>
    </div>
  );
}
