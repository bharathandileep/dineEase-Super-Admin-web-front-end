import React, { useState, useCallback, useEffect } from "react";
import {
  Edit2,
  Save,
  X,
  Plus,
  Star,
  Image as ImageIcon,
  Trash2,
  Upload,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";
import {
  getKitchenMenuItemDetails,
  updateKitchenMenuItemDetails,
} from "../../../services/admin/kitchensMenuCreation";
import { appendToFormData } from "../../../helpers/formdataAppend";
import { toast } from "react-toastify";

export default function MenuDetails() {
  const { kitchenId, id } = useParams();
  const [loading, setLoading] = useState(false);
  const [food, setFood] = useState<any>();
  const [isEditing, setIsEditing] = useState(false);
  const [newIngredient, setNewIngredient] = useState("");
  const [itemImage, setItemImage] = useState<any>();
  const [editedFood, setEditedFood] = useState<any>({
    item_name: "",
    description: "",
    custom_image: "",
    ingredients: [],
    price: 0.0,
    viewType: "both",
    priceOrganization: 0.0,
    priceUser: 0.0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setFood(editedFood);
    setIsEditing(false);
    setPreviewUrl(null);

    const updatedFood = {
      ...editedFood,
      custom_image:
        itemImage instanceof File ? itemImage : editedFood.custom_image,
    };
    const formData = appendToFormData(updatedFood);

    try {
      const response = await updateKitchenMenuItemDetails(
        kitchenId,
        id,
        formData
      );
      if (response?.status) {
        toast.success(response.message);
      } else {
        toast.error(response?.data?.message || "Failed to update item!");
      }
    } catch (error: any) {
      console.error("Error during save:", error);
      toast.error(error?.message || "An unexpected error occurred!");
    } finally {
      setLoading(false);
      setFood(editedFood);
      setIsEditing(false);
      setPreviewUrl(null);
    }
  };

  const handleCancel = () => {
    setEditedFood(food);
    setIsEditing(false);
    setPreviewUrl(null);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    setItemImage(file);
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        if (event.target?.result) {
          setPreviewUrl(event.target.result as string);
          setEditedFood((prev: any) => ({
            ...prev,
            custom_image: event.target.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          if (event.target?.result) {
            setPreviewUrl(event.target.result as string);
            setEditedFood((prev: any) => ({
              ...prev,
              custom_image: event.target.result as string,
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setEditedFood((prev: any) => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient.trim()],
      }));
      setNewIngredient("");
    }
  };

  const removeIngredient = (index: number) => {
    setEditedFood((prev: any) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addIngredient();
    }
  };

  useEffect(() => {
    const fetchMenuItemDetails = async () => {
      try {
        const response = await getKitchenMenuItemDetails(kitchenId, id);
        setFood(response.data);
        setEditedFood({
          ...response.data,
          ingredients: response.data.ingredients || [],
          price: response.data.price || null,
          viewType: response.data.viewType || "Both",
          priceOrganization: response.data.price_organization || 0.0,
          priceUser: response.data.price_user || 0.0,
        });
      } catch (error: any) {}
    };
    fetchMenuItemDetails();
  }, [id, kitchenId]);

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Kitchen", path: "/apps/kitchen/list" },
          {
            label: "List",
            path: "/apps/kitchen/list",
            active: true,
          },
        ]}
        title={"Customers"}
      />
      <div
        className="mb-3"
        style={{ backgroundColor: "#5bd2bc", padding: "10px" }}
      >
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="page-title m-0" style={{ color: "#fff" }}>
            Kitchens
          </h3>
        </div>
      </div>
      <div className="min-vh-100 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-12 p-0">
              <div className="card shadow">
                <div className="position-relative" style={{ height: "300px" }}>
                  <img
                    src={
                      previewUrl ||
                      (isEditing ? editedFood.custom_image : food?.custom_image)
                    }
                    alt={food?.item_name}
                    className="w-100 h-100 object-fit-cover"
                  />
                  {isEditing && (
                    <div
                      className={`position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center ${
                        isDragging
                          ? "bg-dark bg-opacity-75"
                          : "bg-dark bg-opacity-50"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="text-white text-center p-4">
                        <div className="border border-2 border-white rounded p-4">
                          <Upload className="mb-3" size={48} />
                          <p className="fs-5 mb-2">
                            Drag and drop an image here
                          </p>
                          <p className="small mb-3">or</p>
                          <label className="btn btn-light">
                            Choose File
                            <input
                              type="file"
                              className="d-none"
                              accept="image/*"
                              onChange={handleFileInput}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="flex-grow-1">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedFood.item_name}
                          onChange={(e) =>
                            setEditedFood((prev: any) => ({
                              ...prev,
                              item_name: e.target.value,
                            }))
                          }
                          className="form-control form-control-lg"
                        />
                      ) : (
                        <h1 className="fs-2 fw-bold">{food?.item_name}</h1>
                      )}
                    </div>
                    <div className="d-flex gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSave}
                            className="btn btn-success rounded-circle ms-2 p-2"
                          >
                            <Save size={20} />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="btn btn-danger rounded-circle p-2"
                          >
                            <X size={20} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="btn btn-primary rounded-circle p-2"
                        >
                          <Edit2 size={20} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h2 className="fs-5 fw-semibold mb-2">View Type</h2>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          id="Organization"
                          checked={editedFood.viewType === "Organization"}
                          onChange={() =>
                            setEditedFood((prev: any) => ({
                              ...prev,
                              viewType: "Organization",
                            }))
                          }
                          className="form-check-input"
                        />
                        <label
                          htmlFor="Organization"
                          className="form-check-label"
                        >
                          Organization
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          id="User"
                          checked={editedFood.viewType === "User"}
                          onChange={() =>
                            setEditedFood((prev: any) => ({
                              ...prev,
                              viewType: "User",
                            }))
                          }
                          className="form-check-input"
                        />
                        <label htmlFor="User" className="form-check-label">
                          User
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          id="Both"
                          checked={editedFood.viewType === "Both"}
                          onChange={() =>
                            setEditedFood((prev: any) => ({
                              ...prev,
                              viewType: "Both",
                            }))
                          }
                          className="form-check-input"
                        />
                        <label htmlFor="Both" className="form-check-label">
                          Both
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h2 className="fs-5 fw-semibold mb-2">Description</h2>
                    {isEditing ? (
                      <textarea
                        value={editedFood.description}
                        onChange={(e) =>
                          setEditedFood((prev: any) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className="form-control"
                        rows={4}
                      />
                    ) : (
                      <p className="text-secondary">{food?.description}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <h2 className="fs-5 fw-semibold mb-2">Price</h2>
                    {isEditing ? (
                      <>
                        {editedFood.viewType === "Organization" && (
                          <input
                            type="number"
                            value={editedFood.priceOrganization || ""}
                            onChange={(e) =>
                              setEditedFood((prev: any) => ({
                                ...prev,
                                priceOrganization: e.target.value
                                  ? parseFloat(e.target.value)
                                  : "",
                              }))
                            }
                            className="form-control w-auto mb-2"
                            step="0.01"
                            placeholder="Enter price for Organization"
                          />
                        )}
                        {editedFood.viewType === "User" && (
                          <input
                            type="number"
                            value={editedFood.priceUser || ""}
                            onChange={(e) =>
                              setEditedFood((prev: any) => ({
                                ...prev,
                                priceUser: e.target.value
                                  ? parseFloat(e.target.value)
                                  : "",
                              }))
                            }
                            className="form-control w-auto mb-2"
                            step="0.01"
                            placeholder="Enter price for User"
                          />
                        )}
                        {editedFood.viewType === "Both" && (
                          <>
                            <input
                              type="number"
                              value={editedFood.priceOrganization || ""}
                              onChange={(e) =>
                                setEditedFood((prev: any) => ({
                                  ...prev,
                                  priceOrganization: e.target.value
                                    ? parseFloat(e.target.value)
                                    : "",
                                }))
                              }
                              className="form-control w-auto mb-2"
                              step="0.01"
                              placeholder="Enter price for organization"
                            />
                            <input
                              type="number"
                              value={editedFood.priceUser || ""}
                              onChange={(e) =>
                                setEditedFood((prev: any) => ({
                                  ...prev,
                                  priceUser: e.target.value
                                    ? parseFloat(e.target.value)
                                    : "",
                                }))
                              }
                              className="form-control w-auto mb-2"
                              step="0.01"
                              placeholder="Enter price for user"
                            />
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {editedFood.viewType === "Organization" && (
                          <p className="fs-4 fw-bold text-success">
                            {editedFood.priceOrganization
                              ? `₹${Number(
                                  editedFood.priceOrganization
                                ).toFixed(2)}`
                              : "No price set for organization"}
                          </p>
                        )}
                        {editedFood.viewType === "User" && (
                          <p className="fs-4 fw-bold text-success">
                            {editedFood.priceUser
                              ? `₹${Number(editedFood.priceUser).toFixed(2)}`
                              : "No price set for user"}
                          </p>
                        )}
                        {editedFood.viewType === "Both" && (
                          <>
                            <p className="fs-4 fw-bold text-success">
                              {editedFood.priceOrganization
                                ? `₹${Number(
                                    editedFood.priceOrganization
                                  ).toFixed(2)}`
                                : "No price set for organization"}
                            </p>
                            <p className="fs-4 fw-bold text-success">
                              {editedFood.priceUser
                                ? `₹${Number(editedFood.priceUser).toFixed(2)}`
                                : "No price set for user"}
                            </p>
                          </>
                        )}
                      </>
                    )}
                  </div>

                  <div className="mb-4">
                    <h2 className="fs-5 fw-semibold mb-2">Ingredients</h2>
                    <div className="bg-light p-3 rounded border">
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {(isEditing ? editedFood : food)?.ingredients?.map(
                          (ingredient: any, index: number) => (
                            <div
                              key={index}
                              className="d-flex align-items-center bg-white rounded-pill px-3 py-2 border shadow-sm"
                            >
                              <span className="text-secondary">
                                {ingredient}
                              </span>
                              {isEditing && (
                                <button
                                  onClick={() => removeIngredient(index)}
                                  className="btn btn-link text-danger p-0 ms-2"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          )
                        )}
                      </div>
                      {isEditing && (
                        <div className="input-group">
                          <input
                            type="text"
                            value={newIngredient}
                            onChange={(e) => setNewIngredient(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="form-control"
                            placeholder="Type an ingredient and press Enter"
                          />
                          <button
                            onClick={addIngredient}
                            className="btn btn-primary"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h2 className="fs-5 fw-semibold mb-2">Reviews</h2>
                    <div className="d-flex flex-column gap-3">
                      {food?.reviews_id?.length === 0 ? (
                        <p className="text-muted">No reviews yet.</p>
                      ) : (
                        food?.reviews_id?.map((review: any) => (
                          <div key={review.id} className="border-bottom pb-3">
                            <div className="d-flex align-items-center gap-2 mb-2">
                              <div className="text-warning d-flex">
                                {[...Array(review.rating)]?.map((_, i) => (
                                  <Star key={i} size={16} fill="currentColor" />
                                ))}
                              </div>
                              <span className="small text-secondary">
                                by {review.author}
                              </span>
                            </div>
                            <p className="text-secondary mb-1">
                              {review.comment}
                            </p>
                            <p className="small text-muted">{review.date}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
