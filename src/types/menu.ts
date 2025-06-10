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
  id?: number;
  category: string;
  name: string;
  mealTypes: string[];
  foodType: string;
  image?: string;
  description: string;
  ingredients: string[];
  tags: string[];
  addOns: AddOnGroup[];
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
}

export interface SuggestionData {
  categories: string[];
  items: string[];
  ingredients: string[];
  tags: string[];
  addOnItems: string[];
}
