import React from 'react';
import { ArrowRight, Mail } from 'lucide-react';

interface ExistingUserFormProps {
  email: string;
  onEmailChange: (email: string) => void;
  onNext: () => void;
}

export function ExistingUserForm({ email, onEmailChange, onNext }: ExistingUserFormProps) {
  return (
    <div>
      <h2 className="h4 fw-bold mb-4">Enter Your Email</h2>
      <div className="mb-4">
        <label className="form-label">
          Email Address
        </label>
        <div className="input-group">
          <span className="input-group-text">
            <Mail className="text-secondary" size={18} />
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="form-control"
            placeholder="Enter your email"
          />
        </div>
      </div>
      <div className="d-flex justify-content-end">
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