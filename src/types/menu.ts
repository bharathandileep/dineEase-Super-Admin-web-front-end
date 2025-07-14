export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  ingredients: string[];
  tags: string[];
  available: boolean;
  masterFoodId?: number;
  image?: string;
  mealPeriods: string[];
}

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface MasterFood {
  id: number;
  name: string;
  category: string;
  description: string;
  ingredients: string[];
  tags: string[];
  suggestedPrice: number;
  image?: string;
  mealPeriods: string[];
}
export interface MenuItems {
  kitchenId: string;
  id?: string;
  category: string;
  name: string;
  mealTypes: string[];
  foodType: string;
  basicprice: string;
  orgPirce: string;
  image?: string;
  description: string;
  ingredients: string[];
  tags: string[];
  addOns: AddOnGroup[];
  gst?: number;
}

export interface AddOnGroup {
  id: string;
  title: string;
  items: AddOnItem[];
  required?: boolean;
  multiSelect?: boolean;
}

export interface AddOnItem {
  id: string;
  name: string;
  price: number;
  active: boolean;
  gst?: number;
  discount?: number;
  description?: string;
}

export interface SuggestionData {
  categories: string[];
  items: string[];
  ingredients: string[];
  tags: string[];
  addOnItems: string[];
  quantityTypes: string[];
}
