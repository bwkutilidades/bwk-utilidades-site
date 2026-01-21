// Core types for the e-commerce

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: CategorySlug;
  images: string[];
  specs: ProductSpec[];
  featured?: boolean;
  inStock: boolean;
  variants?: ProductVariant[];
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price?: number;
  inStock: boolean;
}

export type CategorySlug = "limpeza-e-higiene" | "organizacao-e-utilidades" | "cozinha-e-bar";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variantId?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping?: number;
  total: number;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
  cpfCnpj?: string;
  address: Address;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: Customer;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  paymentMethod?: string;
}

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

export interface ListProductsParams {
  category?: CategorySlug;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "relevance" | "price-asc" | "price-desc" | "name";
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface B2BLead {
  company: string;
  segment: string;
  city: string;
  state: string;
  itemsOfInterest: string;
  estimatedVolume: string;
  urgency: "low" | "medium" | "high";
  contactName: string;
  email: string;
  phone: string;
  message?: string;
}
