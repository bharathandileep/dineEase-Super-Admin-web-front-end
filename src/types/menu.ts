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
