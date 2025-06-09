import { Category, MasterFood, MenuItem } from "../../types/menu";


export const categories: Category[] = [
  { id: 1, name: 'Starters', icon: '🥗' },
  { id: 2, name: 'Main Course', icon: '🍛' },
  { id: 3, name: 'Biryani', icon: '🍚' },
  { id: 4, name: 'Beverages', icon: '🥤' },
  { id: 5, name: 'Desserts', icon: '🍰' },
  { id: 6, name: 'Breads', icon: '🥖' },
];

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Chicken Tikka Masala',
    category: 'Main Course',
    price: 350,
    description: 'Tender chicken pieces in rich, creamy tomato-based sauce with aromatic spices that will tantalize your taste buds and leave you craving for more. A perfect blend of Indian spices.',
    ingredients: ['Chicken', 'Tomatoes', 'Cream', 'Onions', 'Garam Masala', 'Ginger-Garlic'],
    tags: ['Non-Veg', 'Spicy', 'Signature'],
    available: true,
    masterFoodId: 1,
    mealPeriods: ['Lunch', 'Dinner'],
  },
  {
    id: 2,
    name: 'Paneer Butter Masala',
    category: 'Main Course',
    price: 280,
    description: 'Soft paneer cubes in creamy, mildly spiced tomato gravy that melts in your mouth. A vegetarian delight that combines the richness of butter with aromatic Indian spices.',
    ingredients: ['Paneer', 'Tomatoes', 'Butter', 'Cream', 'Onions', 'Spices'],
    tags: ['Veg', 'Signature'],
    available: true,
    masterFoodId: 2,
    mealPeriods: ['Lunch', 'Dinner'],
  },
  {
    id: 3,
    name: 'Hyderabadi Chicken Biryani',
    category: 'Biryani',
    price: 450,
    description: 'Fragrant basmati rice layered with marinated chicken and cooked in dum style. A royal dish that brings together the finest spices and cooking techniques from Hyderabad.',
    ingredients: ['Basmati Rice', 'Chicken', 'Yogurt', 'Saffron', 'Fried Onions', 'Mint', 'Spices'],
    tags: ['Non-Veg', 'Spicy', 'Signature'],
    available: true,
    masterFoodId: 3,
    mealPeriods: ['Lunch', 'Dinner'],
  },
  {
    id: 4,
    name: 'Vegetable Spring Rolls',
    category: 'Starters',
    price: 180,
    description: 'Crispy rolls filled with fresh vegetables and served with sweet chili sauce. A perfect appetizer to start your meal.',
    ingredients: ['Cabbage', 'Carrots', 'Bell Peppers', 'Spring Roll Sheets', 'Soy Sauce'],
    tags: ['Veg', 'Gluten-Free'],
    available: true,
    mealPeriods: ['Snacks', 'Dinner'],
  },
  {
    id: 5,
    name: 'Masala Chai',
    category: 'Beverages',
    price: 50,
    description: 'Traditional Indian tea brewed with aromatic spices and milk. A warm, comforting drink perfect for any time of the day.',
    ingredients: ['Tea Leaves', 'Milk', 'Cardamom', 'Ginger', 'Cinnamon', 'Sugar'],
    tags: ['Veg', 'Dairy-Free'],
    available: true,
    mealPeriods: ['Breakfast', 'Tea', 'Snacks'],
  },
  {
    id: 6,
    name: 'Gulab Jamun',
    category: 'Desserts',
    price: 120,
    description: 'Soft, spongy milk dumplings soaked in aromatic sugar syrup. A traditional Indian sweet that melts in your mouth.',
    ingredients: ['Milk Powder', 'Flour', 'Sugar', 'Cardamom', 'Rose Water', 'Ghee'],
    tags: ['Veg'],
    available: false,
    mealPeriods: ['Dinner'],
  },
  {
    id: 7,
    name: 'Garlic Naan',
    category: 'Breads',
    price: 80,
    description: 'Soft, fluffy bread topped with fresh garlic and herbs. Perfect companion for curries and gravies.',
    ingredients: ['Flour', 'Yogurt', 'Garlic', 'Cilantro', 'Butter'],
    tags: ['Veg'],
    available: true,
    mealPeriods: ['Lunch', 'Dinner'],
  },
  {
    id: 8,
    name: 'Fish Curry',
    category: 'Main Course',
    price: 380,
    description: 'Fresh fish cooked in coconut-based curry with traditional spices. A coastal delicacy that brings the ocean to your plate.',
    ingredients: ['Fish', 'Coconut Milk', 'Curry Leaves', 'Turmeric', 'Red Chili', 'Tamarind'],
    tags: ['Non-Veg', 'Spicy', 'Gluten-Free'],
    available: true,
    mealPeriods: ['Lunch', 'Dinner'],
  },
];

export const masterFoods: MasterFood[] = [
  {
    id: 1,
    name: 'Chicken Tikka Masala',
    category: 'Main Course',
    description: 'Tender chicken pieces in rich, creamy tomato-based sauce with aromatic spices',
    ingredients: ['Chicken', 'Tomatoes', 'Cream', 'Onions', 'Garam Masala', 'Ginger-Garlic'],
    tags: ['Non-Veg', 'Spicy'],
    suggestedPrice: 350,
    mealPeriods: ['Lunch', 'Dinner'],
  },
  {
    id: 2,
    name: 'Paneer Butter Masala',
    category: 'Main Course',
    description: 'Soft paneer cubes in creamy, mildly spiced tomato gravy',
    ingredients: ['Paneer', 'Tomatoes', 'Butter', 'Cream', 'Onions', 'Spices'],
    tags: ['Veg'],
    suggestedPrice: 280,
    mealPeriods: ['Lunch', 'Dinner'],
  },
  {
    id: 3,
    name: 'Hyderabadi Chicken Biryani',
    category: 'Biryani',
    description: 'Fragrant basmati rice layered with marinated chicken and cooked in dum style',
    ingredients: ['Basmati Rice', 'Chicken', 'Yogurt', 'Saffron', 'Fried Onions', 'Mint', 'Spices'],
    tags: ['Non-Veg', 'Spicy'],
    suggestedPrice: 450,
    mealPeriods: ['Lunch', 'Dinner'],
  },
  {
    id: 4,
    name: 'Dal Makhani',
    category: 'Main Course',
    description: 'Creamy black lentils slow-cooked with butter and cream',
    ingredients: ['Black Lentils', 'Butter', 'Cream', 'Tomatoes', 'Onions', 'Spices'],
    tags: ['Veg'],
    suggestedPrice: 220,
    mealPeriods: ['Lunch', 'Dinner'],
  },
  {
    id: 5,
    name: 'Mutton Rogan Josh',
    category: 'Main Course',
    description: 'Tender mutton pieces in rich, aromatic gravy with Kashmiri spices',
    ingredients: ['Mutton', 'Yogurt', 'Onions', 'Kashmiri Red Chili', 'Fennel', 'Ginger'],
    tags: ['Non-Veg', 'Spicy'],
    suggestedPrice: 420,
    mealPeriods: ['Lunch', 'Dinner'],
  },
];

// Mock review data
export interface Review {
  id: number;
  menuItemId: number;
  userName: string;
  userProfile: string;
  rating: number;
  review: string;
  timestamp: string;
}

export const reviews: Review[] = [
  {
    id: 1,
    menuItemId: 1,
    userName: 'Rajesh Kumar',
    userProfile: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    review: 'Absolutely delicious! The chicken was tender and the sauce was perfectly spiced. Will definitely order again.',
    timestamp: '2024-01-15T14:30:00Z'
  },
  {
    id: 2,
    menuItemId: 1,
    userName: 'Priya Sharma',
    userProfile: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100&h=100&fit=crop&crop=face',
    rating: 4,
    review: 'Great taste but a bit too spicy for my liking. Overall good quality.',
    timestamp: '2024-01-12T19:45:00Z'
  },
  {
    id: 3,
    menuItemId: 2,
    userName: 'Amit Singh',
    userProfile: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    review: 'Best paneer dish I have ever had! Creamy and flavorful.',
    timestamp: '2024-01-10T12:20:00Z'
  },
  {
    id: 4,
    menuItemId: 3,
    userName: 'Sneha Patel',
    userProfile: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    review: 'Authentic Hyderabadi biryani! The rice was perfectly cooked and the chicken was so tender.',
    timestamp: '2024-01-08T20:15:00Z'
  },
  {
    id: 5,
    menuItemId: 3,
    userName: 'Mohammed Ali',
    userProfile: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    rating: 4,
    review: 'Good biryani but could use a bit more saffron. Still very tasty!',
    timestamp: '2024-01-05T18:30:00Z'
  }
];
