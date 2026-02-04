/**
 * Shopify Collections Category Map
 * 
 * Maps frontend category labels to Shopify collection handles.
 * These handles must match the collections created in Shopify Admin.
 */

export const CATEGORY_MAP = [
    { label: "Limpeza e Higiene", handle: "limpeza-e-higiene" },
    { label: "Organização e Utilidades", handle: "organizacao-e-utilidades" },
    { label: "Cozinha e Bar", handle: "cozinha-e-bar" },
] as const;

export type CategoryHandle = typeof CATEGORY_MAP[number]["handle"];

/**
 * Fallback images for categories when Shopify collection doesn't have an image
 * These are stored in /public/categories/
 */
export const CATEGORY_IMAGE_FALLBACK: Record<CategoryHandle, string> = {
    "limpeza-e-higiene": "/categories/limpeza-e-higiene.jpg",
    "organizacao-e-utilidades": "/categories/organizacao-e-utilidades.png",
    "cozinha-e-bar": "/categories/cozinha-e-bar.png",
};

/**
 * Get category label by handle
 */
export function getCategoryLabel(handle: string): string | undefined {
    return CATEGORY_MAP.find((c) => c.handle === handle)?.label;
}

/**
 * Get fallback image for a category
 */
export function getCategoryFallbackImage(handle: string): string {
    return CATEGORY_IMAGE_FALLBACK[handle as CategoryHandle] || "/placeholder.svg";
}
