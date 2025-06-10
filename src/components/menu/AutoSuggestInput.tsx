import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Form,
  InputGroup,
  Button,
  ListGroup,
  Dropdown
} from 'react-bootstrap';

interface AutoSuggestInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export const AutoSuggestInput: React.FC<AutoSuggestInputProps> = ({
  label,
  value,
  onChange,
  suggestions,
  placeholder,
  required = false,
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(suggestions);
    }
  }, [value, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
  };

  return (
    <Form.Group className="mb-3 position-relative">
      <Form.Label>
        {label} {required && <span className="text-danger">*</span>}
      </Form.Label>
      
      <InputGroup>
        <Form.Control
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          isInvalid={!!error}
        />
        {error && (
          <Form.Control.Feedback type="invalid">
            {error}
          </Form.Control.Feedback>
        )}
      </InputGroup>

      <Dropdown.Menu
        ref={dropdownRef}
        show={isOpen && filteredSuggestions.length > 0}
        className="w-100 mt-1 position-absolute"
        style={{
          maxHeight: '200px',
          overflowY: 'auto',
        //   zIndex: 50
        }}
      >
        {filteredSuggestions.map((suggestion, index) => (
          <Dropdown.Item
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            className="py-2 z-50"
          >
            {suggestion}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Form.Group>
  );
};