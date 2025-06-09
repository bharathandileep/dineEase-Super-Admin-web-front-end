import React from 'react';
import { Button } from 'react-bootstrap';
import { Plus } from 'lucide-react';

interface KitchenHeaderProps {
  onAddClick: () => void;
}

export const KitchenHeader: React.FC<KitchenHeaderProps> = ({ onAddClick }) => {
  return (
    <header className="bg-white border-bottom shadow-sm">
      <div className="container-fluid px-4">
        <div className="d-flex justify-content-between align-items-center py-4">
          <div>
            <h1 className="display-6 fw-bold text-dark">Spice Villa</h1>
            <p className="text-muted mt-1">Menu Management Dashboard</p>
          </div>
          
          <Button 
            onClick={onAddClick}
            variant="success"
            size="lg"
            className="px-4 py-2 fw-semibold shadow"
          >
            <Plus size={20} className="me-2" />
            Add New Menu Item
          </Button>
        </div>
      </div>
    </header>
  );
};