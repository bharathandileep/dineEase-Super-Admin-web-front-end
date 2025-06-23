import React from "react";
import { Accordion, Card, Container } from "react-bootstrap";
import { Category, MenuItem } from "../../types/menu";
import { MenuItemCard } from "./MenuItemCard";

interface MenuAccordionProps {
  groupedItems: Record<string, MenuItem[]>;
  categories: Category[];
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (id: number) => void;
}

export const MenuAccordion: React.FC<MenuAccordionProps> = ({
  groupedItems,
  categories,
  onEditItem,
  onDeleteItem,
}) => {
  return (
    <div>
      {Object.keys(groupedItems).length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <div className="text-muted display-4 mb-3">🍽️</div>
            <h3 className="h4 text-muted mb-2">No menu items found</h3>
            <p className="text-muted">
              Try adjusting your search filters or add some new menu items.
            </p>
          </Card.Body>
        </Card>
      ) : (
        <Accordion defaultActiveKey={Object.keys(groupedItems)[0]}>
          {Object.entries(groupedItems).map(([categoryName, items]) => (
            <Accordion.Item
              key={categoryName}
              eventKey={categoryName}
              className="mb-3 border rounded"
            >
              <Accordion.Header className="m-0 p-0">
                <div className="d-flex align-items-center gap-3">
                  <div className="text-start">
                    <h3 className="h5 fs-4 mb-0 m-0 p-0 text-dark">
                      {categoryName}
                    </h3>
                    <small className="text-muted">{items.length} items</small>
                  </div>
                </div>
              </Accordion.Header>
              <Accordion.Body className=" p-0                 p-md-3">
                <Container fluid>
                  <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3 g-3">
                    {items.map((item) => (
                      <div key={item.id} className="col">
                        <MenuItemCard
                          item={item}
                          onEdit={() => onEditItem(item)}
                          onDelete={() => onDeleteItem(item.id)}
                        />
                      </div>
                    ))}
                  </div>
                </Container>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </div>
  );
};
