// API Client interface - structured for easy swap to real backend
const API_URL = import.meta.env.VITE_API_URL;

import { products, getProductBySlug as getProduct, getProductsByCategory } from "@/data/products";
import { categories } from "@/data/categories";
import type { 
  Product, 
  Category, 
  ListProductsParams, 
  PaginatedResponse, 
  Cart, 
  Customer, 
  Order, 
  OrderStatus 
} from "@/lib/types";

// Simulated delay for realistic behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiClient = {
  // Products
  async listProducts(params: ListProductsParams = {}): Promise<PaginatedResponse<Product>> {
    await delay(100);
    
    let filtered = [...products];
    
    // Filter by category
    if (params.category) {
      filtered = filtered.filter(p => p.category === params.category);
    }
    
    // Filter by search
    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.description.toLowerCase().includes(search)
      );
    }
    
    // Filter by price
    if (params.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= params.minPrice!);
    }
    if (params.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= params.maxPrice!);
    }
    
    // Sort
    switch (params.sort) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // relevance: featured first
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    
    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 12;
    const start = (page - 1) * limit;
    const paginatedData = filtered.slice(start, start + limit);
    
    return {
      data: paginatedData,
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit),
    };
  },
  
  async getProductBySlug(slug: string): Promise<Product | null> {
    await delay(50);
    return getProduct(slug) || null;
  },
  
  async getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
    await delay(50);
    const product = products.find(p => p.id === productId);
    if (!product) return [];
    
    return getProductsByCategory(product.category)
      .filter(p => p.id !== productId)
      .slice(0, limit);
  },
  
  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    await delay(50);
    return products.filter(p => p.featured).slice(0, limit);
  },
  
  // Categories
  async listCategories(): Promise<Category[]> {
    await delay(50);
    return categories;
  },
  
  // Checkout
  async createCheckoutSession(cart: Cart, customer: Customer): Promise<{ orderId: string; success: boolean }> {
    await delay(500);
    
    // In real implementation, this would call payment gateway
    const orderId = `BWK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Store order in localStorage for demo
    const order: Order = {
      id: orderId,
      items: cart.items,
      customer,
      subtotal: cart.subtotal,
      shipping: cart.shipping || 0,
      total: cart.total,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    
    const orders = JSON.parse(localStorage.getItem("bwk-orders") || "[]");
    orders.push(order);
    localStorage.setItem("bwk-orders", JSON.stringify(orders));
    
    return { orderId, success: true };
  },
  
  async getOrderStatus(orderId: string): Promise<Order | null> {
    await delay(100);
    
    const orders: Order[] = JSON.parse(localStorage.getItem("bwk-orders") || "[]");
    return orders.find(o => o.id === orderId) || null;
  },
};

export type ApiClient = typeof apiClient;
