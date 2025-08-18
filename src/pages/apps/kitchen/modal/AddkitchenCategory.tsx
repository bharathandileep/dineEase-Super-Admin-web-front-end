import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { VerticalForm, FormInput } from "../../../../components";
import {
  createCategory,
  createSubcategory,
  getAllCategories,
  updateCategory,
  updateSubcategory,
} from "../../../../services/admin/menu";
import { toast } from "react-toastify";
import {
  kitchenCreateCategory,
  kitchensCreateSubcategory,
  kitchensGetAllCategories,
  kitchensUpdateCategory,
  kitchensUpdateSubcategory,
} from "../../../../services/admin/kitchens";

interface AddkitchenCategory {
  show: boolean;
  onHide: () => void;
  onSubmit?: (value: any) => void;
  action?: string;
  isSubCategory?: boolean;
  selectedItem?: any;
}

const AddkitchenCategory = ({
  show,
  onHide,
  action,
  isSubCategory,
  selectedItem,
}: AddkitchenCategory) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const schemaResolver = yupResolver(
    yup.object().shape({
      category: yup.string().required("Please enter category"),
    })
  );

  const fetchAllCategories = async () => {
    try {
      const response = await kitchensGetAllCategories({ page: 1, limit: 100 });
      if (response.status) {
        setMenuItems(response.data.categories);
      }
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (selectedItem && isSubCategory && action === "edit") {
      setSelectedCategory(selectedItem.category._id);
      fetchAllCategories();
    } else {
      setSelectedCategory("");
    }
  }, [selectedItem, isSubCategory, action]);

  const onSubmit = async (formdata: any) => {
    try {
      let response;
      if (action === "edit") {
        if (isSubCategory) {
          const updateData = {
            subcategoryName: formdata.category,
            category: selectedCategory,
          };
          response = await kitchensUpdateSubcategory(
            selectedItem._id,
            updateData
          );
        } else {
          response = await kitchensUpdateCategory(
            selectedItem._id,
            formdata.category
          );
        }
      } else {
        if (isSubCategory) {
          response = await kitchensCreateSubcategory({
            category: selectedCategory,
            subcategoryName: formdata.category,
          });
        } else {
          response = await kitchenCreateCategory(formdata);
        }
      }
      if (response.status) {
        toast.success(response.message);
        onHide();
      } else {
        toast.error(response.message || "Operation failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.message);
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
          onSubmit={(data) =>
            onSubmit({
              ...data,
            })
          }
          resolver={schemaResolver}
        >
          {isSubCategory && (
            <div className="d-lg-flex align-items-center pb-1 mb-3">
              <div className="w-100">
                <label className="form-label">Display:</label>
                <select
                  className="form-select w-100"
                  name="categoryName"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  value={selectedCategory}
                  onClick={() => fetchAllCategories()}
                >
                  <option value="">Select Category</option>
                  {menuItems?.map((item: any, index: number) => (
                    <option value={item?._id} key={index}>
                      {item?.category}
                    </option>
                  ))}
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
            defaultValue={
              action === "add"
                ? ""
                : isSubCategory
                ? selectedItem?.subcategoryName
                : selectedItem?.category || ""
            }
          />
          <div className="text-end">
            <Button variant="success" type="submit" className="me-1">
              {action === "edit" ? "Update" : "Add"}
            </Button>
          </div>
        </VerticalForm>
      </Modal.Body>
    </Modal>
  );
};

export default AddkitchenCategory;
