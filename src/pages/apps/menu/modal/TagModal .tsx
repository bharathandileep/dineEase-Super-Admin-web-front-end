import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Badge, Stack } from "react-bootstrap";
import { createNewTags, updateTag } from "../../../../services/admin/admin";
import { toast } from "react-toastify";

interface TagModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (tags: string[]) => void;
  existingTags?: string[];
  type: string;
  editData?: {
    _id: string;
    name: string;
  };
}

const TagModal: React.FC<TagModalProps> = ({
  show,
  onHide,
  onSave,
  existingTags = [],
  type = "add",
  editData,
}) => {
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(existingTags);
  const [editingTagName, setEditingTagName] = useState("");

  useEffect(() => {
    if (show) {
      if (type === "edit" && editData) {
        setEditingTagName(editData.name);
        setTags([editData.name]);
      } else {
        setTags(existingTags);
        setEditingTagName("");
      }
      setTagInput("");
    }
  }, [show, type, editData, existingTags]);

  const handleAddTag = () => {
    if (type === "edit") {
      if (tagInput.trim()) {
        setTags([tagInput.trim()]);
        setEditingTagName(tagInput.trim());
        setTagInput("");
      }
    } else {
      if (tagInput.trim() && !tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (type === "edit") {
      setTags([]);
      setEditingTagName("");
    } else {
      setTags(tags.filter((tag) => tag !== tagToRemove));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async () => {
    try {
      let response;

      if (type === "edit" && editData) {
        if (tags.length > 0) {
          response = await updateTag(editData._id, tags[0]);
        }
      } else {
        response = await createNewTags(tags);
      }

      if (response && response.status) {
        toast.success(response.message);
        onSave(tags);
        onHide();
      } else {
        toast.error(response?.message || "Operation failed");
      }
    } catch (error) {
      toast.error(`Failed to ${type === "edit" ? "update" : "create"} tags`);
    }
  };

  const modalTitle = type === "edit" ? "Edit Tag" : "Manage Tags";
  const submitButtonText = type === "edit" ? "Update Tag" : "Save Tags";
  const inputPlaceholder =
    type === "edit" ? "Enter new tag name" : "Enter tag name";
  const buttonText = type === "edit" ? "Update" : "Add";

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>
            {type === "edit" ? "Edit Tag Name" : "Add New Tag"}
          </Form.Label>
          {type === "edit" && editingTagName && (
            <div className="mb-2">
              <small className="text-muted">
                Current: <strong>{editingTagName}</strong>
              </small>
            </div>
          )}
          <div className="d-flex gap-2">
            <Form.Control
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={inputPlaceholder}
            />
            <Button
              variant="primary"
              onClick={handleAddTag}
              disabled={!tagInput.trim()}
            >
              {buttonText}
            </Button>
          </div>
        </Form.Group>

        {tags.length > 0 && (
          <div className="mt-3">
            <h6 className="mb-2">Current Tags:</h6>
            <Stack direction="horizontal" gap={2} className="flex-wrap">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  bg="primary"
                  className="d-flex align-items-center py-2 px-3"
                >
                  {tag}
                  <Button
                    variant="link"
                    className="text-white p-0 ms-2"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X size={12} />
                  </Button>
                </Badge>
              ))}
            </Stack>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={tags.length === 0}
        >
          {submitButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TagModal;
