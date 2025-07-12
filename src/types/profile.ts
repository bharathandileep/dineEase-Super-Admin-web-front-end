export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  website: string;
  facebook: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  avatar: string;
  fullName: string;
}

export interface Organisation {
  _id: string;
  id: string;
  name: string;
  address: string;
  profilePic?: string;
  employees?: number;
  isapproved: string;
  slug: string;
  createdAt: string;
  industry?: string[];
}

export interface Kitchen {
  _id: string;
  id: string;
  name: string;
  address: string;
  profilePic?: string;
  isapproved: string;
  slug: string;
  rating?: number;
  cuisine?: string[];
  specialty?: string;
}

export type TabKey =
  | "account"
  | "restaurants"
  | "kitchens"
  | "settings"
  | "support"
  | "referral"
  | "logout";
