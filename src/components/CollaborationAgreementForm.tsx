import React, { useState } from "react";
import { FileText, Printer } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import jsPDF from "jspdf";
import { requestCollaboration } from "../server/admin/collab";
import { getContext } from "../helpers/api/utils";
import { toast } from "react-toastify";

function CollaborationQuotationForm({ kitchenData }: any) {
  const [terms, setTerms] = useState("");
  const [loading, setLoading] = useState(false);
  const userInfo = getContext();

  const generatePDF = (openInNewTab: boolean = false) => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Meal Service Quotation", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Kitchen Details:", 20, 40);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Kitchen/Restaurant: ${kitchenData?.kitchen_name || "N/A"}`,
      20,
      50
    );
    doc.text(
      `Contact Person: ${kitchenData?.owner_phone_number || "N/A"}`,
      20,
      60
    );
    doc.text(`Email: ${kitchenData?.owner_email || "N/A"}`, 20, 70);

    doc.setFont("helvetica", "bold");
    doc.text("Quotation Details:", 20, 90);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: 2025-04-14`, 20, 100);
    doc.text(`Meal Type: Veg/Non-Veg`, 20, 110);
    doc.text(`Daily Meal Count: 150`, 20, 120);
    doc.text(`Rate per Meal: $5`, 20, 130);
    doc.text(`Discount Offer: 10%`, 20, 140);
    doc.text(`Payment Terms: Within 30 days`, 20, 150);
    doc.text(`Contract Duration: 6 months`, 20, 160);
    doc.text(`Additional Notes: Sample note for quotation`, 20, 170);

    doc.setFont("helvetica", "bold");
    doc.text("Terms and Conditions:", 20, 190);
    doc.setFont("helvetica", "normal");
    doc.text(terms || "Standard terms and conditions apply.", 20, 200, {
      maxWidth: 170,
    });

    if (openInNewTab) {
      window.open(doc.output("bloburl"), "_blank");
    } else {
      doc.save("meal-service-quotation.pdf");
    }
  };

  const handleSendRequest = async () => {
    setLoading(true);
    const payload = {
      organization_id: userInfo?.contextId,
      kitchen_id: kitchenData?._id,
      kitchenName: kitchenData?.kitchen_name,
      contactPerson: kitchenData?.owner_phone_number,
      contactEmail: kitchenData?.owner_email,
      quotation: {
        date: "2025-04-14",
        mealType: "Veg/Non-Veg",
        mealCount: 150,
        ratePerMeal: 5,
        discountOffer: "10%",
        paymentTerms: "Within 30 days",
        contractDuration: "6 months",
        additionalNotes: "Sample note for quotation",
        termsAndConditions: terms,
      },
    };

    try {
      const data = await requestCollaboration(payload);
      if (data) {
        toast.success("Collaboration request sent successfully!");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      toast.error("Something went wrong while sending the request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-1">
      <h1 className="mb-2 fs-2">Meal Service Quotation Form</h1>
      <div className="row justify-content-center">
        <div>
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3>Quotation Preview</h3>
              <div className="btn-group">
                <button
                  type="button"
                  className="btn btn-success me-2"
                  onClick={() => generatePDF(false)}
                >
                  <FileText className="me-2" size={20} />
                  Download PDF
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => generatePDF(true)}
                >
                  <Printer className="me-2" size={20} />
                  Open PDF
                </button>
              </div>
            </div>

            <div className="preview-content">
              <h4 className="mt-4">Kitchen Details</h4>
              <p>
                <strong>Kitchen/Restaurant:</strong>{" "}
                {kitchenData?.kitchen_name || "N/A"}
              </p>
              <p>
                <strong>Contact Person:</strong>{" "}
                {kitchenData?.owner_phone_number || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {kitchenData?.owner_email || "N/A"}
              </p>

              <h4 className="mt-4">Quotation Details</h4>
              <p>
                <strong>Date:</strong> 2025-04-14
              </p>
              <p>
                <strong>Meal Type:</strong> Veg/Non-Veg
              </p>
              <p>
                <strong>Daily Meal Count:</strong> 150
              </p>
              <p>
                <strong>Rate per Meal:</strong> $5
              </p>
              <p>
                <strong>Discount Offer:</strong> 10%
              </p>
              <p>
                <strong>Payment Terms:</strong> Within 30 days
              </p>
              <p>
                <strong>Contract Duration:</strong> 6 months
              </p>
              <p>
                <strong>Additional Notes:</strong> Sample note for quotation
              </p>

              <h4 className="mt-4">Terms and Conditions</h4>
              <div className="mb-3">
                <label htmlFor="terms" className="form-label">
                  Please enter the terms and conditions
                </label>
                <textarea
                  id="terms"
                  className="form-control"
                  rows={5}
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  placeholder="Enter any terms and conditions here..."
                />
              </div>

              <div className="text-end">
                <button
                  className="btn btn-primary"
                  onClick={handleSendRequest}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Collab Request"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollaborationQuotationForm;
