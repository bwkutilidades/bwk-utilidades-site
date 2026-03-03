/**
 * Shopify Collections Category Map
 * 
 * Maps frontend category labels to Shopify collection handles.
 * These handles must match the collections created in Shopify Admin.
 */

import { slugifyCategoryKey } from "@/lib/category-images";

export const CATEGORY_MAP = [
    { label: "Limpeza e Higiene", handle: "limpeza-e-higiene" },
    { label: "Organização e Utilidades", handle: "organizacao-e-utilidades" },
    { label: "Cozinha e Bar", handle: "cozinha-e-bar" },
] as const;

export type CategoryHandle = typeof CATEGORY_MAP[number]["handle"];

const CATEGORY_HANDLE_ALIASES: Record<CategoryHandle, string[]> = {
    "limpeza-e-higiene": ["limpeza-e-higiene", "limpeza-higiene"],
    "organizacao-e-utilidades": ["organizacao-e-utilidades", "organizacao-utilidades"],
    "cozinha-e-bar": ["cozinha-e-bar", "cozinha-bar"],
};

/**
 * Fallback images for categories when Shopify collection doesn't have an image
 * These are stored in /public/images/categories/
 */
export const CATEGORY_IMAGE_FALLBACK: Record<CategoryHandle, string> = {
    "limpeza-e-higiene": "/images/categories/limpeza-higiene.jpg",
    "organizacao-e-utilidades": "/images/categories/utilidades.png",
    "cozinha-e-bar": "/images/categories/cozinha-e-bar.png",
};

/**
 * Get category label by handle
 */
export function getCategoryLabel(handle: string): string | undefined {
    const normalizedHandle = slugifyCategoryKey(handle);

    return CATEGORY_MAP.find((category) => (
        CATEGORY_HANDLE_ALIASES[category.handle].includes(normalizedHandle)
        || slugifyCategoryKey(category.label) === normalizedHandle
    ))?.label;
}

/**
 * Get fallback image for a category
 */
export function getCategoryFallbackImage(handle: string): string {
    return CATEGORY_IMAGE_FALLBACK[handle as CategoryHandle] || "/placeholder.svg";
}
