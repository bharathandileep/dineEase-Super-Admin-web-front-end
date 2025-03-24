import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  value?: File;
  error?: string;
  disabled?: boolean;
}

export function FileUpload({ onFileSelect, value, error }: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ["image/jpeg", "image/png"],
    maxFiles: 1,
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(undefined as any);
  };

  return (
    <div
      {...getRootProps()}
      className={`card p-4 text-center ${
        isDragActive ? "bg-light border-primary" : ""
      } ${error ? "border-danger" : ""}`}
      style={{ cursor: "pointer", border: "2px dashed #dee2e6" }}
    >
      <input {...getInputProps()} />
      {value ? (
        <div className="position-relative">
          <button
            onClick={removeFile}
            className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle"
            style={{ transform: "translate(50%, -50%)" }}
          >
            <X className="h-4 w-4" />
          </button>
          <img
            src={typeof value === "string" ? value : URL.createObjectURL(value)}
            alt="Preview"
            className="img-fluid mb-2"
            style={{ maxHeight: "128px" }}
            onLoad={(e) =>
              URL.revokeObjectURL((e.target as HTMLImageElement).src)
            }
          />
          <p className="text-muted small mb-0">{value.name}</p>
        </div>
      ) : (
        <>
          <Upload
            className="mx-auto mb-2"
            style={{ width: "48px", height: "48px", color: "#6c757d" }}
          />
          <p className="text-muted small mb-0">
            Drag & drop an image here, or click to select
          </p>
        </>
      )}
      {error && <div className="text-danger small mt-2">{error}</div>}
    </div>
  );
}
