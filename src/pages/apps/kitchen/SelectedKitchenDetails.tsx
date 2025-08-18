import React, { useEffect, useState } from "react";
import KitchenOverviewDetails from "../../../components/KitchenOverviewDetails";
import { getkitchenDetails } from "../../../services/admin/kitchens";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import CollaborationAgreementForm from "../../../components/CollaborationAgreementForm";

export interface IKitchenDetails {
  _id: string;
  kitchen_name: string;
  kitchen_status: string;
  kitchen_owner_name: string;
  owner_email: string;
  owner_phone_number: string;
  restaurant_type: string;
  kitchen_type: string;
  kitchen_image: string;
  status: boolean;
  isapproved: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  addresses: Array<{
    _id: string;
    street_address: string;
    city_name: string;
    state_name: string;
    district_name: string;
    pincode: string;
    country_name: string;
  }>;
  fssaiDetails: Array<{
    _id: string;
    ffsai_certificate_number: string;
    expiry_date: string;
    is_verified: boolean;
    ffsai_certificate_image: string;
    ffsai_card_owner_name: string;
  }>;
  panDetails: Array<{
    pan_card_image: string | undefined;
    _id: string;
    pan_card_number: string;
    pan_card_user_name: string;
    is_verified: boolean;
  }>;
  gstDetails: Array<{
    gst_certificate_image: string | undefined;
    _id: string;
    gst_number: string;
    expiry_date: string;
    is_verified: boolean;
  }>;
}

function SelectedKitchenDetails() {
  const { kitchen } = useParams();
  const [kitchenData, setKitchenData] = useState<IKitchenDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchKitchenDetails = async () => {
      setLoading(true);
      try {
        const response = await getkitchenDetails(kitchen);
        setKitchenData(response.data);
      } catch (error: any) {
        console.error("Error fetching kitchen details:", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchKitchenDetails();
  }, [kitchen]);
  return (
    <div className="container-fluid px-4 py-3">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb m-0">
          <li className="breadcrumb-item">
            <Link to="/products">Products</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {kitchenData?.kitchen_name}
          </li>
        </ol>
      </nav>
      <KitchenOverviewDetails kitchenData={kitchenData} />
      <CollaborationAgreementForm kitchenData={kitchenData} />
    </div>
  );
}

export default SelectedKitchenDetails;
