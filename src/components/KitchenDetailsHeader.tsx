import React from "react";
import { MapPin, Phone, Mail, User } from "lucide-react";
import StatusLabel from "./StatusLabel";
import ActionButtons from "./ActionButtons";

interface KitchenDetailsHeaderProps {
  kitchen: any;
}

const KitchenDetailsHeader: React.FC<KitchenDetailsHeaderProps> = ({
  kitchen,
}) => {
  const handleEdit = () => {
    alert("Edit clicked");
  };

  const handleDelete = () => {
    alert("Delete clicked");
  };

  const handleStatusToggle = (status: boolean) => {
    alert(`Status toggled to: ${status ? "Active" : "Inactive"}`);
  };

  return (
    <div className="card">
      <div className="position-relative">
        {kitchen.kitchen_image && (
          <img
            src={kitchen.kitchen_image}
            alt={kitchen.kitchen_name}
            className="card-img-top opacity-50"
            style={{ height: "12rem", objectFit: "cover" }}
          />
        )}
        {!kitchen.kitchen_image && (
          <div
            className="card-img-top bg-gradient-success"
            style={{ height: "12rem" }}
          ></div>
        )}
        <div className="position-absolute top-0 start-0 end-0 bottom-0 bg-dark bg-opacity-25"></div>
        <div className="position-absolute bottom-0 start-0 end-0 p-4 text-white">
          <h1 className="display-6 fw-bold">{kitchen.kitchen_name}</h1>
        </div>
      </div>

      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div className="d-flex flex-wrap gap-2">
            <StatusLabel label={kitchen.kitchen_type} type="kitchen" />
            <StatusLabel
              label={kitchen.category.category_name}
              type="category"
            />
            <StatusLabel label={kitchen.restaurant_type} type="restaurant" />
            <StatusLabel
              label={kitchen.subcategoryName.subcategory_name}
              type="category"
            />
          </div>
          <ActionButtons
            isActive={kitchen.status}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleStatusToggle}
          />
        </div>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mt-3">
          <div className="col">
            <div className="d-flex align-items-start">
              <User
                className="text-secondary me-2 mt-1 flex-shrink-0"
                size={18}
              />
              <div>
                <p className="text-secondary small mb-1">Owner</p>
                <p className="fw-medium mb-0">{kitchen.kitchen_owner_name}</p>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="d-flex align-items-start">
              <Phone
                className="text-secondary me-2 mt-1 flex-shrink-0"
                size={18}
              />
              <div>
                <p className="text-secondary small mb-1">Phone</p>
                <p className="fw-medium mb-0">{kitchen.kitchen_phone_number}</p>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="d-flex align-items-start">
              <Mail
                className="text-secondary me-2 mt-1 flex-shrink-0"
                size={18}
              />
              <div>
                <p className="text-secondary small mb-1">Email</p>
                <p className="fw-medium mb-0">{kitchen.owner_email}</p>
              </div>
            </div>
          </div>

          {kitchen.addresses.length > 0 && (
            <div className="col">
              <div className="d-flex align-items-start">
                <MapPin
                  className="text-secondary me-2 mt-1 flex-shrink-0"
                  size={18}
                />
                <div>
                  <p className="text-secondary small mb-1">Location</p>
                  <p className="fw-medium mb-0">
                    {kitchen.addresses[0].city_name},{" "}
                    {kitchen.addresses[0].state_name}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KitchenDetailsHeader;
