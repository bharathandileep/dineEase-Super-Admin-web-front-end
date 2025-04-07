import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";
import Dropzone from "react-dropzone";

interface FileType extends File {
  preview?: string;
  formattedSize?: string;
}

interface FileUploaderProps {
  onFileUpload?: (files: FileType[]) => void;
  showPreview?: boolean;
}

const FileUploader = (props: FileUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<FileType[]>([]);

  const handleAcceptedFiles = (files: FileType[]) => {
    const imageFile = files.find((file) => file.type.startsWith("image/"));
    if (!imageFile) return;

    if (props.showPreview) {
      Object.assign(imageFile, {
        preview: URL.createObjectURL(imageFile),
        formattedSize: formatBytes(imageFile.size),
      });
    }

    setSelectedFiles([imageFile]);

    if (props.onFileUpload) props.onFileUpload([imageFile]);
  };

  /**
   * Formats the size
   */
  const formatBytes = (bytes: number, decimals: number = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  /*
   * Removes the selected file
   */
  const removeFile = (fileIndex: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(fileIndex, 1);
    setSelectedFiles(newFiles);
    if (props.onFileUpload) props.onFileUpload(newFiles);
  };

  /*
   * Clean up previews on unmount
   */
  useEffect(() => {
    return () => {
      selectedFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [selectedFiles]);

  return (
    <>
      <Dropzone
        accept="image/*"
        multiple={false}
        onDrop={(acceptedFiles) => handleAcceptedFiles(acceptedFiles)}
      >
        {({ getRootProps, getInputProps }) => (
          <div className="dropzone">
            <div className="dz-message needsclick" {...getRootProps()}>
              <input {...getInputProps()} />
              <i className="h3 text-muted dripicons-cloud-upload"></i>
              <h4>Drop image here or click to upload.</h4>
              <span className="text-muted font-13">
                Only one image allowed. (This is a demo; files are not
                uploaded.)
              </span>
            </div>
          </div>
        )}
      </Dropzone>

      {props.showPreview && selectedFiles.length > 0 && (
        <div className="dropzone-previews mt-3" id="uploadPreviewTemplate">
          {selectedFiles.map((f, i) => (
            <Card className="mt-1 mb-0 shadow-none border" key={i + "-file"}>
              <div className="p-2">
                <Row className="align-items-center">
                  {f.preview ? (
                    <Col className="col-auto">
                      <img
                        data-dz-thumbnail=""
                        className="avatar-sm rounded bg-light"
                        alt={f.name}
                        src={f.preview}
                      />
                    </Col>
                  ) : (
                    <Col className="col-auto">
                      <div className="avatar-sm">
                        <span className="avatar-title bg-primary rounded">
                          {f.type.split("/")[0]}
                        </span>
                      </div>
                    </Col>
                  )}
                  <Col className="ps-0">
                    <Link to="#" className="text-muted fw-bold">
                      {f.name}
                    </Link>
                    <p className="mb-0">
                      <strong>{f.formattedSize}</strong>
                    </p>
                  </Col>
                  <Col className="text-end">
                    <Link
                      to="#"
                      className="btn btn-link btn-lg text-muted shadow-none"
                    >
                      <i
                        className="dripicons-cross"
                        onClick={() => removeFile(i)}
                      ></i>
                    </Link>
                  </Col>
                </Row>
                <div className="w-100 d-flex justify-content-center">
                  <img
                    src={f.preview}
                    alt="Profile Preview"
                    className="mt-3"
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

FileUploader.defaultProps = {
  showPreview: true,
};

export default FileUploader;
