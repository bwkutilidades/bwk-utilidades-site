/**
 * Hook for managing the "Added to Cart" modal state
 * 
 * Provides a centralized way to show the modal after adding a product.
 * Used by ProductCard, Product page, etc.
 */

import { useState, useCallback } from "react";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/lib/types";

export interface UseAddToCartModalResult {
    /** Whether modal is open */
    isModalOpen: boolean;
    /** Name of last added product */
    addedProductName: string | null;
    /** Open the modal (after adding product) */
    openModal: (productName: string) => void;
    /** Close the modal */
    closeModal: () => void;
    /** Add product to cart and show modal */
    addToCartWithModal: (product: Product, quantity?: number, variantId?: string) => void;
}

/**
 * Hook to handle add-to-cart flow with modal
 * 
 * Usage:
 * ```tsx
 * const { isModalOpen, addedProductName, closeModal, addToCartWithModal } = useAddToCartModal();
 * 
 * <button onClick={() => addToCartWithModal(product, 1)}>Comprar</button>
 * 
 * <AddedToCartModal
 *   open={isModalOpen}
 *   onOpenChange={closeModal}
 *   productName={addedProductName}
 * />
 * ```
 */
export function useAddToCartModal(): UseAddToCartModalResult {
    const { addItem, setCartOpen } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addedProductName, setAddedProductName] = useState<string | null>(null);

    const openModal = useCallback((productName: string) => {
        setAddedProductName(productName);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        // Keep product name for animation purposes, clear after transition
        setTimeout(() => setAddedProductName(null), 300);
    }, []);

    const addToCartWithModal = useCallback(
        (product: Product, quantity?: number, variantId?: string) => {
            // Add to cart
            addItem(product, quantity, variantId);

            // Open cart drawer briefly (optional, for visual feedback)
            // Commenting out for cleaner UX - modal is enough
            // setCartOpen(true);

            // Show modal
            openModal(product.name);
        },
        [addItem, openModal]
    );

    return {
        isModalOpen,
        addedProductName,
        openModal,
        closeModal,
        addToCartWithModal,
    };
}
