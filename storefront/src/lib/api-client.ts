// API Client interface - integrates with Shopify Storefront API
import {
  listProducts as shopifyListProducts,
  getProductByHandle,
  getFeaturedProducts as shopifyGetFeaturedProducts,
  getRelatedProducts as shopifyGetRelatedProducts,
} from "./shopify";
import { categories } from "@/data/categories";
import type {
  Product,
  Category,
  ListProductsParams,
  PaginatedResponse,
} from "@/lib/types";

export const apiClient = {
  // Products - using Shopify Storefront API
  async listProducts(params: ListProductsParams = {}): Promise<PaginatedResponse<Product>> {
    try {
      const page = params.page || 1;
      const limit = params.limit || 12;

      const result = await shopifyListProducts({
        limit,
        search: params.search,
      });

      let products = result.products;

      // Client-side category filter
      if (params.category) {
        products = products.filter(p => p.category === params.category);
      }

      // Client-side price filters
      if (params.minPrice !== undefined) {
        products = products.filter(p => p.price >= params.minPrice!);
      }
      if (params.maxPrice !== undefined) {
        products = products.filter(p => p.price <= params.maxPrice!);
      }

      // Client-side sorting
      switch (params.sort) {
        case "price-asc":
          products = [...products].sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          products = [...products].sort((a, b) => b.price - a.price);
          break;
        case "name":
          products = [...products].sort((a, b) => a.name.localeCompare(b.name));
          break;
        // "relevance" - keep original order
      }

      return {
        data: products,
        total: products.length,
        page,
        totalPages: result.hasNextPage ? page + 1 : page,
      };
    } catch (error) {
      console.error("[apiClient.listProducts] Error:", error);
      // Return empty result on error
      return {
        data: [],
        total: 0,
        page: params.page || 1,
        totalPages: 0,
      };
    }
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      return await getProductByHandle(slug);
    } catch (error) {
      console.error("[apiClient.getProductBySlug] Error:", error);
      return null;
    }
  },

  async getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
    try {
      return await shopifyGetRelatedProducts(productId, undefined, limit);
    } catch (error) {
      console.error("[apiClient.getRelatedProducts] Error:", error);
      return [];
    }
  },

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    try {
      return await shopifyGetFeaturedProducts(limit);
    } catch (error) {
      console.error("[apiClient.getFeaturedProducts] Error:", error);
      return [];
    }
  },

  // Categories - using local data (matches Shopify collection handles)
  async listCategories(): Promise<Category[]> {
    return categories;
  },
};

export type ApiClient = typeof apiClient;
