import React, { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Form, Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (imageUrl: string) => void;
  required?: boolean;
  error?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  required = false,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeImage = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>
        {label} {required && <span className="text-danger">*</span>}
      </Form.Label>

      {value ? (
        <Card className="position-relative">
          <Card.Img
            variant="top"
            src={value}
            className="object-fit-contain"
            style={{ height: "200px" }}
          />
          <Button
            variant="danger"
            size="sm"
            className="position-absolute top-0 end-0 m-2"
            onClick={removeImage}
            style={{ zIndex: 1, opacity: 1 }}
          >
            <X size={16} />
          </Button>
          <Card.ImgOverlay
            className="bg-dark bg-opacity-10"
            onMouseEnter={(e: any) =>
              e.currentTarget.classList.add("bg-opacity-25")
            }
            onMouseLeave={(e: any) =>
              e.currentTarget.classList.remove("bg-opacity-25")
            }
          />
        </Card>
      ) : (
        <Card
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`text-center border ${
            isDragging
              ? "border-primary bg-primary bg-opacity-10"
              : error
              ? "border-danger"
              : "border-secondary border-2"
          } border-dashed`}
          style={{
            minHeight: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Card.Body>
            <div className="d-flex flex-column align-items-center gap-3">
              <div className="p-3 bg-light rounded-circle">
                {isDragging ? (
                  <Upload size={32} className="text-primary" />
                ) : (
                  <ImageIcon size={32} className="text-secondary" />
                )}
              </div>
              <div>
                <h5 className="mb-1">
                  {isDragging ? "Drop image here" : "Upload dish image"}
                </h5>
                <p className="text-muted mb-0">
                  Drag & drop or click to browse
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      <Form.Control
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="d-none"
        isInvalid={!!error}
      />

      {error && (
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      )}
    </Form.Group>
  );
};
