import React, { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";
import {
  Form,
  InputGroup,
  Button,
  Badge,
  ListGroup,
  Stack,
} from "react-bootstrap";

interface IngredientsInputProps {
  label: string;
  value: string[];
  onChange: (ingredients: string[]) => void;
  suggestions: string[];
  required?: boolean;
  error?: string;
  placeholder: string;
}

export const IngredientsInput: React.FC<IngredientsInputProps> = ({
  label,
  value,
  onChange,
  suggestions,
  required = false,
  error,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputValue) {
      const filtered = suggestions.filter(
        (suggestion) =>
          suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
          !value.includes(suggestion)
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(suggestions.filter((s) => !value.includes(s)));
    }
  }, [inputValue, suggestions, value]);

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addIngredient = (ingredient: string) => {
    if (ingredient.trim() && !value.includes(ingredient.trim())) {
      onChange([...value, ingredient.trim()]);
      setInputValue("");
      setIsOpen(false);
    }
  };

  const removeIngredient = (index: number) => {
    const newIngredients = value.filter((_, i) => i !== index);
    onChange(newIngredients);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredient(inputValue);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    addIngredient(suggestion);
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>
        {label} {required && <span className="text-danger">*</span>}
      </Form.Label>
      {value.length > 0 && (
        <Stack direction="horizontal" gap={2} className="flex-wrap mb-2">
          {value.map((ingredient, index) => (
            <Badge
              key={index}
              pill
              bg="primary"
              className="d-flex align-items-center fs-6"
            >
              {ingredient}
              <Button
                variant="link"
                size="sm"
                className="p-0 ms-2 text-white"
                onClick={() => removeIngredient(index)}
              >
                <X size={14} />
              </Button>
            </Badge>
          ))}
        </Stack>
      )}
      <div className="position-relative">
        <InputGroup>
          <Form.Control
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            isInvalid={!!error}
          />
          <Button variant="primary" onClick={() => addIngredient(inputValue)}>
            <Plus size={20} />
          </Button>
          {error && (
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          )}
        </InputGroup>
        {isOpen && filteredSuggestions.length > 0 && (
          <ListGroup
            ref={dropdownRef}
            className="position-absolute w-100 mt-1 z-3"
            style={{ maxHeight: "200px", overflowY: "auto" }}
          >
            {filteredSuggestions.map((suggestion, index) => (
              <ListGroup.Item
                key={index}
                action
                onClick={() => handleSuggestionClick(suggestion)}
                className="cursor-pointer"
              >
                {suggestion}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
    </Form.Group>
  );
};
