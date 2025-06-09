import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button, Form } from 'react-bootstrap';

interface ImageUploadProps {
  image?: string;
  onImageChange: (image: string | undefined) => void;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  image,
  onImageChange,
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageChange(e.target?.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageChange(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onImageChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`mb-3 ${className}`}>
      <Form.Label>Item Image (Optional)</Form.Label>
      
      {image ? (
        <div className="position-relative">
          <img
            src={image}
            alt="Menu item"
            className="w-100 h-32 object-cover rounded border"
            style={{ objectFit: 'cover' }}
          />
          <Button
            variant="outline-secondary"
            size="sm"
            className="position-absolute top-0 end-0 bg-white m-2"
            onClick={handleRemoveImage}
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <div
          className={`
            border-2 border-dashed rounded p-5 text-center cursor-pointer
            ${isDragOver 
              ? 'border-success bg-success bg-opacity-10' 
              : 'border-secondary hover-border-primary'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          style={{ transition: 'border-color 0.2s ease, background-color 0.2s ease' }}
        >
          <div className="d-flex flex-column align-items-center gap-2">
            <div className="d-flex align-items-center gap-2 text-muted">
              <ImageIcon size={32} />
              <Upload size={24} />
            </div>
            <div className="text-muted small">
              <span className="fw-medium">Click to upload</span> or drag and drop
            </div>
            <div className="text-muted small">
              PNG, JPG, GIF up to 10MB
            </div>
          </div>
        </div>
      )}
      
      <Form.Control
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="d-none"
      />
    </div>
  );
};