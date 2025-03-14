import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import FileUploader from "../../../components/FileUploader";
import { FormInput } from "../../../components";
import { createItem } from "../../../server/admin/items";
import {
  getAllCategories,
  getSubcategoriesByCategory,
} from "../../../server/admin/menu";

const AddFoodItem = () => {
  const [itemImage, setItemImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [subcategories, setSubcategories] = useState<
    { _id: string; name: string }[]
  >([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [addMenulaoder, setMenuLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories({ page: 1, limit: 100 });
        if (response.status) {
          setCategories(response.data.categories);
        } else {
          toast.error( response.message);
        }
      } catch (error:any) {
        console.error("Error fetching categories:", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      const fetchSubcategories = async () => {
        try {
          const response = await getSubcategoriesByCategory(selectedCategoryId);
          if (response.status) {
            setSubcategories(response.data);
            console.log(response.data);
          } else {
            toast.error(response.message);
          }
        } catch (error:any) {
          console.error("Error fetching subcategories:", error);
          toast.error(error.message);
        }
      };
      fetchSubcategories();
    } else {
      setSubcategories([]);
    }
  }, [selectedCategoryId]);

  const schemaResolver = yupResolver(
    yup.object().shape({
      item_name: yup.string().required("Item name is required"),
      category: yup.string().required("Category is required"),
      subcategory: yup.string().required("Subcategory is required"),
      item_description: yup.string().required("Description is required"),
    })
  );

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    resolver: schemaResolver,
  });

  const onSubmit = async (data: any) => {
    try {
      setMenuLoading(true); // Start loading

      const formData = new FormData();
      formData.append("item_name", data.item_name);
      formData.append("category", data.category);
      formData.append("subcategory", data.subcategory);
      formData.append("item_description", data.item_description);

      // Append image if selected
      if (itemImage) {
        formData.append("item_image", itemImage);
      }

      const response = await createItem(formData);

      if (response.status) {
        toast.success("Item created successfully!");
        navigate("/apps/menu-items/list");
      } else {
        toast.error(response.message);
      }
    } catch (error:any) {
      console.error("Error creating item:", error);
      toast.error(error.message);
    } finally {
      setMenuLoading(false);
    }
  };

  const handleFileUpload = (files: any) => {
    if (files.length > 0) {
      setItemImage(files[0]);
    }
  };

  return (
    <div className="container py-2">
      <Card className="mb-2">
        <Card.Body>
          <h3 className="text-uppercase">Add Food Item</h3>
        </Card.Body>
      </Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col lg={6}>
            <Card>
              <Card.Body>
                <h5 className="text-uppercase mt-0 mb-3">General</h5>
                <FormInput
                  name="item_name"
                  label="Item Name"
                  placeholder="e.g: Burger"
                  containerClass="mb-3"
                  register={register}
                  errors={errors}
                  control={control}
                />
                <FormInput
                  name="category"
                  label="Category"
                  containerClass="mb-3"
                  register={register}
                  errors={errors}
                  control={control}
                  type="select"
                  defaultValue=""
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories?.map((cat: any) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.category || cat.name}
                    </option>
                  ))}
                </FormInput>
                <FormInput
                  name="subcategory"
                  label="Subcategory"
                  containerClass="mb-3"
                  register={register}
                  errors={errors}
                  control={control}
                  type="select"
                  defaultValue=""
                >
                  <option value="">Select Subcategory</option>
                  {subcategories?.map((sub: any) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.subcategoryName || sub.name}
                    </option>
                  ))}
                </FormInput>
                <FormInput
                  type="textarea"
                  rows="3"
                  name="item_description"
                  label="Item Description"
                  placeholder="Please enter description"
                  containerClass="mb-3"
                  register={register}
                  errors={errors}
                  control={control}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card>
              <Card.Body>
                <h5 className="text-uppercase mt-0 mb-3">Product Images</h5>
                <FileUploader
                  onFileUpload={(files) => handleFileUpload(Array.from(files))}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mt-3 mb-4">
          <Col className="text-end">
            <Button
              variant="light"
              className="me-2"
              onClick={() => navigate("/apps/menu-items/list")}
            >
              Cancel
            </Button>
            <Button type="submit" variant="success" disabled={addMenulaoder}>
              {addMenulaoder ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />
                  <span
                    className="spinner-grow spinner-grow-sm"
                    role="status"
                  />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default AddFoodItem;
