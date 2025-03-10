import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { VerticalForm, FormInput } from "../../../../components";
import { toast } from "react-toastify";
import { createDesignation, updateDesignation } from "../../../../server/admin/designations";

interface DesignationModalProps {
  show: boolean;
  onHide: () => void;
  action?: string;
  selectedItem?: any;
}

const DesignationModal = ({ show, onHide, action, selectedItem }: DesignationModalProps) => {
  const schemaResolver = yupResolver(
    yup.object().shape({
      designation: yup.string().required("Please enter designation"),
    })
  );

  const onSubmit = async (formData: any) => {
    if (!formData.designation) {
      toast.error("All fields are required.");
      return;
    }
    try {
      if (action === "edit") {
        await updateDesignation(selectedItem._id, formData);
        toast.success("Designation updated successfully!");
      } else {
        await createDesignation(formData);
        toast.success("Designation created successfully!");
      }
      onHide();
    } catch (error) {
      toast.error("Operation failed.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header className="bg-light" closeButton>
        <Modal.Title>{action === "edit" ? "Edit Designation" : "Add New Designation"}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <VerticalForm onSubmit={onSubmit} resolver={schemaResolver}>
          <FormInput
            label="Designation"
            type="text"
            name="designation"
            placeholder="Enter Designation"
            containerClass="mb-3"
            defaultValue={selectedItem?.designation_name || ""}
          />

          <div className="text-end">
            <Button variant="success" type="submit">
              {action === "edit" ? "Update" : "Add"}
            </Button>
          </div>
        </VerticalForm>
      </Modal.Body>
    </Modal>
  );
};

export default DesignationModal;
