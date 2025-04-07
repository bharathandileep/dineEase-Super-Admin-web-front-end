import React, { useState } from 'react';
import { FileText, Printer, Eye } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';

interface QuotationFormData {
  orgName: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  kitchenName: string;
  quotationDate: string;
  serviceDescription: string;
  mealType: string;
  mealCount: string;
  ratePerMeal: string;
  discountOffer: string;
  paymentTerms: string;
  contractDuration: string;
  additionalNotes: string;
}

const initialFormData: QuotationFormData = {
  orgName: '',
  contactPerson: '',
  contactEmail: '',
  contactPhone: '',
  kitchenName: '',
  quotationDate: '',
  serviceDescription: '',
  mealType: '',
  mealCount: '',
  ratePerMeal: '',
  discountOffer: '',
  paymentTerms: '',
  contractDuration: '',
  additionalNotes: ''
};

function CollaborationQuotationForm() {
  const [formData, setFormData] = useState<QuotationFormData>(initialFormData);
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generatePDF = (openInNewTab: boolean = false) => {
    const doc = new jsPDF();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Meal Service Quotation', 105, 20, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
  
    doc.setFont('helvetica', 'bold');
    doc.text('Organization Details:', 20, 40);
    doc.setFont('helvetica', 'normal');
    doc.text(`Organization: ${formData.orgName}`, 20, 50);
    doc.text(`Contact Person: ${formData.contactPerson}`, 20, 60);
    doc.text(`Email: ${formData.contactEmail}`, 20, 70);
    doc.text(`Phone: ${formData.contactPhone}`, 20, 80);
  
    doc.setFont('helvetica', 'bold');
    doc.text('Kitchen Details:', 20, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(`Kitchen/Restaurant: ${formData.kitchenName}`, 20, 110);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Quotation Details:', 20, 130);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${formData.quotationDate}`, 20, 140);
    doc.text(`Meal Type: ${formData.mealType}`, 20, 150);
    doc.text(`Daily Meal Count: ${formData.mealCount}`, 20, 160);
    doc.text(`Rate per Meal: ${formData.ratePerMeal}`, 20, 170);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Service Description:', 20, 190);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.serviceDescription, 20, 200, { maxWidth: 170 });

    if (openInNewTab) {
      window.open(doc.output('bloburl'), '_blank');
    } else {
      doc.save('meal-service-quotation.pdf');
    }
  };

  return (
    <div className="py-1">
      <h1 className="mb-2 fs-2">Meal Service Quotation Form</h1>
      <div className="row justify-content-center">
        {!showPreview ? (
          <div>
            <form className="bg-white p-4 rounded shadow-sm">
              <h3 className="mb-3">Organization Details</h3>
              <div className="mb-3">
                <label className="form-label">Organization Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="orgName"
                  value={formData.orgName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Contact Person</label>
                <input
                  type="text"
                  className="form-control"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Contact Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Contact Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                />
              </div>
              <h3 className="mb-3 mt-4">Kitchen Details</h3>
              <div className="mb-3">
                <label className="form-label">Kitchen/Restaurant Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="kitchenName"
                  value={formData.kitchenName}
                  onChange={handleInputChange}
                />
              </div>
              <h3 className="mb-3 mt-4">Quotation Details</h3>
              <div className="mb-3">
                <label className="form-label">Quotation Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="quotationDate"
                  value={formData.quotationDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Service Description</label>
                <textarea
                  className="form-control"
                  name="serviceDescription"
                  value={formData.serviceDescription}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Meal Type</label>
                <input
                  type="text"
                  className="form-control"
                  name="mealType"
                  value={formData.mealType}
                  onChange={handleInputChange}
                  placeholder="e.g., Breakfast, Lunch, Dinner"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Expected Daily Meal Count</label>
                <input
                  type="number"
                  className="form-control"
                  name="mealCount"
                  value={formData.mealCount}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Proposed Rate per Meal</label>
                <input
                  type="text"
                  className="form-control"
                  name="ratePerMeal"
                  value={formData.ratePerMeal}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Discount Offer</label>
                <textarea
                  className="form-control"
                  name="discountOffer"
                  value={formData.discountOffer}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Payment Terms</label>
                <textarea
                  className="form-control"
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Contract Duration</label>
                <input
                  type="text"
                  className="form-control"
                  name="contractDuration"
                  value={formData.contractDuration}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Additional Notes</label>
                <textarea
                  className="form-control"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowPreview(true)}
                >
                  <Eye className="me-2" size={20} />
                  Preview Quotation
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <div className="bg-white p-4 rounded shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Quotation Preview</h3>
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={() => setShowPreview(false)}
                  >
                    <Eye className="me-2" size={20} />
                    Back to Form
                  </button>
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
                <h4>Organization Details</h4>
                <p><strong>Organization:</strong> {formData.orgName}</p>
                <p><strong>Contact Person:</strong> {formData.contactPerson}</p>
                <p><strong>Email:</strong> {formData.contactEmail}</p>
                <p><strong>Phone:</strong> {formData.contactPhone}</p>

                <h4 className="mt-4">Kitchen Details</h4>
                <p><strong>Kitchen/Restaurant:</strong> {formData.kitchenName}</p>

                <h4 className="mt-4">Quotation Details</h4>
                <p><strong>Date:</strong> {formData.quotationDate}</p>
                <p><strong>Service Description:</strong> {formData.serviceDescription}</p>
                <p><strong>Meal Type:</strong> {formData.mealType}</p>
                <p><strong>Daily Meal Count:</strong> {formData.mealCount}</p>
                <p><strong>Rate per Meal:</strong> {formData.ratePerMeal}</p>
                <p><strong>Discount Offer:</strong> {formData.discountOffer}</p>
                <p><strong>Payment Terms:</strong> {formData.paymentTerms}</p>
                <p><strong>Contract Duration:</strong> {formData.contractDuration}</p>
                <p><strong>Additional Notes:</strong> {formData.additionalNotes}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CollaborationQuotationForm;