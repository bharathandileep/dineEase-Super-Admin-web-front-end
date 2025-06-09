import React from 'react';
import { Badge, Form } from 'react-bootstrap';

interface MealPeriodSelectorProps {
  selectedPeriods: string[];
  onPeriodsChange: (periods: string[]) => void;
  className?: string;
}

const availablePeriods = ['Breakfast', 'Lunch', 'Tea & Snacks', 'Dinner'];

export const MealPeriodSelector: React.FC<MealPeriodSelectorProps> = ({
  selectedPeriods,
  onPeriodsChange,
  className = '',
}) => {
  const togglePeriod = (period: string) => {
    if (selectedPeriods.includes(period)) {
      onPeriodsChange(selectedPeriods.filter(p => p !== period));
    } else {
      onPeriodsChange([...selectedPeriods, period]);
    }
  };

  return (
    <div className={`mb-3 ${className}`}>
      <Form.Label className="d-block">Meal Periods *</Form.Label>
      <div className="d-flex flex-wrap gap-2 mb-2">
        {availablePeriods.map((period) => (
          <Badge
            key={period}
            pill
            bg={selectedPeriods.includes(period) ? "success" : "outline-primary text-black"}
            className={`cursor-pointer border p-2 fs-6  ${selectedPeriods.includes(period) ? '' : 'hover-bg-light'}`}
            onClick={() => togglePeriod(period)}
            style={{ cursor: 'pointer' }}
          >
            {period}
          </Badge>
        ))}
      </div>
      {selectedPeriods.length === 0 && (
        <Form.Text className="text-danger">Please select at least one meal period</Form.Text>
      )}
    </div>
  );
};