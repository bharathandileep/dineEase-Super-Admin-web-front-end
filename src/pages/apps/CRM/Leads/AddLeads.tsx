import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { VerticalForm, FormInput } from "../../../../components/";
import { getAllCategories } from "../../../../server/admin/menu";

interface AddLeadsProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (value: any) => void;
  action?: string;
  isSubCategory?: boolean;
  selectedItem?: any;
}

const AddLeads = ({
  show,
  onHide,
  onSubmit,
  action,
  isSubCategory,
  selectedItem,
}: AddLeadsProps) => {
  const [menuItems, setMenuItems] = useState([]);
  const schemaResolver = yupResolver(
    yup.object().shape({
      category: yup.string().required("Please enter category"),
    })
  );
  
  const fetchAllCategories = async () => {
    try {
      const response = await getAllCategories({ page: 1, limit: 100 });
      setMenuItems(response.data);
      if (response.status) {
      } else {
      }
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
    }
  };
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header className="bg-light" onHide={onHide} closeButton>
        <Modal.Title className="m-0">
          {action === "edit" ? "Edit Category" : "Add New Category"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <VerticalForm
          onSubmit={(data) => onSubmit({ ...data, id: selectedItem?._id })}
          resolver={schemaResolver}
        >
          {isSubCategory && (
            <div className="d-lg-flex align-items-center pb-1 mb-3">
              <div className="w-100">
                <label className="form-label">Display:</label>
                <select
                  className="form-select w-100"
                  name="categegoyName"
                  onClick={() => fetchAllCategories()}
                >
                  <option value="">Select Category</option>;
                  {menuItems?.map((item: any, index: number) => {
                    return (
                      <option value={item?._id} key={index}>
                        {item?.category}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          )}
          <FormInput
            label="Category"
            type="text"
            name="category"
            placeholder="Enter category"
            containerClass="mb-3"
            defaultValue={selectedItem?.category || ""}
          />
          <div className="text-end">
            <Button variant="success" type="submit" className="me-1">
              {action === "edit" ? "Update" : "Add"}
            </Button>
            <Button variant="danger" onClick={onHide}>
              Cancel
            </Button>
          </div>
        </VerticalForm>
      </Modal.Body>
    </Modal>
  );
};

export default AddLeads;
