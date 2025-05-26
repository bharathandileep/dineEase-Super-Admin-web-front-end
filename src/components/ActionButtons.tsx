import React, { useState } from "react";
import { Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

interface ActionButtonsProps {
  isActive: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: (status: boolean) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isActive,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const [active, setActive] = useState(isActive);

  const handleToggle = () => {
    const newStatus = !active;
    setActive(newStatus);
    onToggleStatus(newStatus);
  };

  return (
    <div className="d-flex align-items-center gap-3">
      <button
        onClick={handleToggle}
        className={`btn btn-sm d-inline-flex align-items-center ${
          active ? "btn-outline-success" : "btn-outline-danger"
        }`}
      >
        {active ? (
          <>
            <ToggleRight size={18} className="me-1" />
            <span>Active</span>
          </>
        ) : (
          <>
            <ToggleLeft size={18} className="me-1" />
            <span>Inactive</span>
          </>
        )}
      </button>
      <button
        onClick={onEdit}
        className="btn btn-sm btn-outline-primary d-inline-flex align-items-center"
      >
        <Pencil size={16} className="me-1" />
        <span>Edit</span>
      </button>
      <button
        onClick={onDelete}
        className="btn btn-sm btn-outline-danger d-inline-flex align-items-center"
      >
        <Trash2 size={16} className="me-1" />
        <span>Delete</span>
      </button>
    </div>
  );
};

export default ActionButtons;
