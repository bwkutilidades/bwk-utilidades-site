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
 * Get category label by handle
 */
export function getCategoryLabel(handle: string): string | undefined {
    return CATEGORY_MAP.find((c) => c.handle === handle)?.label;
}
