import React, { useState, useMemo } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { SearchFilters } from "../../../components/menu/SearchFilters";
import { MenuAccordion } from "../../../components/menu/MenuAccordion";
import { AddItemModal } from "../../../components/menu/AddItemModal";
import { EditItemModal } from "../../../components/menu/EditItemModal";
import { categories, masterFoods, menuItems } from "../../../helpers/api/data";
import { KitchenHeader } from "../../../components/menu/KitchenHeader";
import { MenuItem } from "../../../types/menu";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";
import { useAuthDetails } from "../../../hooks/useAuthDetails";

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { context } = useAuthDetails();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState<
    "all" | "available" | "unavailable"
  >("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [items, setItems] = useState(menuItems);
  const navigate = useNavigate();

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        !selectedCategory || item.category === selectedCategory;

      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && item.available) ||
        (availabilityFilter === "unavailable" && !item.available);

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => item.tags.includes(tag));

      return (
        matchesSearch && matchesCategory && matchesAvailability && matchesTags
      );
    });
  }, [items, searchTerm, selectedCategory, availabilityFilter, selectedTags]);

  const groupedItems = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    filteredItems.forEach((item: any) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }, [filteredItems]);

  const handleAddItem = (newItem: any) => {
    const id = Math.max(...items.map((item) => item.id)) + 1;
    setItems([...items, { ...newItem, id }]);
    setIsAddModalOpen(false);
  };

  const handleEditItem = (updatedItem: any) => {
    setItems(
      items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setEditingItem(null);
  };

  const handleDeleteItem = (id: any) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="min-vh-100 bg-light">
      <PageTitle
        breadCrumbItems={[
          { label: "Kitchens", path: "/apps/kitchen/our-menu" },
          {
            label: "Our Menu",
            path: "/apps/kitchen/OurMenu",
            active: true,
          },
        ]}
        title={"Customers"}
      />

      <div
        className="mb-3"
        style={{ backgroundColor: "#5bd2bc", padding: "10px" }}
      >
        <div className="d-flex  align-items-center justify-content-between">
          <h3 className="page-title m-0" style={{ color: "#fff" }}>
            Our Menu
          </h3>
          <Button
            onClick={() => navigate("/apps/kitchen/create-menu")}
            className="btn btn-danger"
          >
            <i className="mdi mdi-plus me-1"></i> Add Food Item
          </Button>
        </div>
      </div>
      <Container fluid className="m-0 p-0">
        <Row className="m-0 p-0">
          <Col xs={12} className="m-0 p-0">
            <SearchFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              availabilityFilter={availabilityFilter}
              onAvailabilityChange={setAvailabilityFilter}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              categories={categories}
            />

            <MenuAccordion
              groupedItems={groupedItems}
              categories={categories}
              onEditItem={setEditingItem}
              onDeleteItem={handleDeleteItem}
            />
          </Col>
        </Row>
      </Container>

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddItem}
        categories={categories}
        masterFoods={masterFoods}
      />

      {editingItem && (
        <EditItemModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={handleEditItem}
          item={editingItem}
          categories={categories}
        />
      )}
    </div>
  );
};

export default Menu;
