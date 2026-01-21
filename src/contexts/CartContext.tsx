import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import type { CartItem, Product } from "@/lib/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product; quantity?: number; variantId?: string }
  | { type: "REMOVE_ITEM"; productId: string; variantId?: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number; variantId?: string }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "SET_CART_OPEN"; isOpen: boolean }
  | { type: "LOAD_CART"; items: CartItem[] };

const CART_STORAGE_KEY = "bwk-cart";

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === action.product.id && item.variantId === action.variantId
      );
      
      if (existingIndex > -1) {
        const newItems = [...state.items];
        newItems[existingIndex].quantity += action.quantity || 1;
        return { ...state, items: newItems };
      }
      
      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: action.quantity || 1, variantId: action.variantId }],
      };
    }
    
    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter(
          (item) => !(item.product.id === action.productId && item.variantId === action.variantId)
        ),
      };
    }
    
    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => !(item.product.id === action.productId && item.variantId === action.variantId)
          ),
        };
      }
      
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.productId && item.variantId === action.variantId
            ? { ...item, quantity: action.quantity }
            : item
        ),
      };
    }
    
    case "CLEAR_CART":
      return { ...state, items: [] };
    
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    
    case "SET_CART_OPEN":
      return { ...state, isOpen: action.isOpen };
    
    case "LOAD_CART":
      return { ...state, items: action.items };
    
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number, variantId?: string) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        const items = JSON.parse(stored);
        dispatch({ type: "LOAD_CART", items });
      } catch (e) {
        console.error("Failed to load cart from storage", e);
      }
    }
  }, []);
  
  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);
  
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  const value: CartContextValue = {
    items: state.items,
    isOpen: state.isOpen,
    itemCount,
    subtotal,
    addItem: (product, quantity, variantId) => dispatch({ type: "ADD_ITEM", product, quantity, variantId }),
    removeItem: (productId, variantId) => dispatch({ type: "REMOVE_ITEM", productId, variantId }),
    updateQuantity: (productId, quantity, variantId) => dispatch({ type: "UPDATE_QUANTITY", productId, quantity, variantId }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
    toggleCart: () => dispatch({ type: "TOGGLE_CART" }),
    setCartOpen: (isOpen) => dispatch({ type: "SET_CART_OPEN", isOpen }),
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
