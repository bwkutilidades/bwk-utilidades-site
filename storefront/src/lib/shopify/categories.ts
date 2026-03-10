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

/**
 * Local descriptions for each category.
 * Used as primary description on the homepage cards, overriding any
 * placeholder text (e.g. "Teste") set in Shopify collection description.
 */
export const CATEGORY_DESCRIPTIONS: Record<CategoryHandle, string> = {
    "limpeza-e-higiene": "Produtos essenciais para limpeza profissional e doméstica. Baldes, vassouras, rodos, esponjas e muito mais.",
    "organizacao-e-utilidades": "Produtos para organização, descarte e utilidades do dia a dia.",
    "cozinha-e-bar": "Utensílios de qualidade para cozinhas profissionais, bares e restaurantes. Copos, facas e acessórios.",
};

const CATEGORY_HANDLE_ALIASES: Record<CategoryHandle, string[]> = {
    "limpeza-e-higiene": ["limpeza-e-higiene", "limpeza-higiene", "limpeza", "higiene", "produtos-de-limpeza"],
    "organizacao-e-utilidades": ["organizacao-e-utilidades", "organizacao-utilidades", "organizacao", "utilidades", "organização"],
    "cozinha-e-bar": ["cozinha-e-bar", "cozinha-bar", "cozinha", "bar", "utensilios"],
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
