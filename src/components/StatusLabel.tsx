import React from "react";

interface StatusLabelProps {
  label: string;
  type: "kitchen" | "category" | "restaurant";
}

const StatusLabel: React.FC<StatusLabelProps> = ({ label, type }) => {
  let badgeClass = "";

  switch (type) {
    case "kitchen":
      badgeClass =
        label === "Veg"
          ? "bg-success text-success-emphasis bg-opacity-25"
          : "bg-danger text-danger-emphasis bg-opacity-25";
      break;
    case "category":
      badgeClass = "bg-primary text-primary-emphasis bg-opacity-25";
      break;
    case "restaurant":
      badgeClass = "bg-warning text-warning-emphasis bg-opacity-25";
      break;
    default:
      badgeClass = "bg-secondary text-secondary-emphasis bg-opacity-25";
  }

  return (
    <span className={`badge rounded-pill fw-medium small ${badgeClass}`}>
      {label}
    </span>
  );
};

export default StatusLabel;
