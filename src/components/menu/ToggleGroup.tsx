import React from 'react';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface ToggleOption {
  value: string;
  label: string;
}

interface ToggleGroupProps {
  label: string;
  options: ToggleOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  multiSelect?: boolean;
  required?: boolean;
  error?: string;
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  multiSelect = true,
  required = false,
  error
}) => {
  const handleToggle = (value: string) => {
    if (multiSelect) {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value];
      onChange(newValues);
    } else {
      onChange(selectedValues.includes(value) ? [] : [value]);
    }
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label className="fw-medium">
        {label} {required && <span className="text-danger">*</span>}
      </Form.Label>
      <div className="d-flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={selectedValues.includes(option.value) ? 'primary' : 'outline-secondary'}
            onClick={() => handleToggle(option.value)}
            className="rounded-pill px-4 py-2 me-2 mb-2"
            style={{ borderWidth: '2px', fontWeight: '500' }}
          >
            {option.label}
          </Button>
        ))}
      </div>
      {error && <Form.Text className="text-danger">{error}</Form.Text>}
    </Form.Group>
  );
};  