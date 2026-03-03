/**
 * Centralized category image mapping
 *
 * Single source of truth for local fallback images used when
 * the Shopify collection has no image configured.
 *
 * Images live in: public/images/categories/
 *
 * The map is keyed by collection handle AND common title-slugified
 * variants so that a lookup never misses due to handle mismatch.
 */

export const DEFAULT_CATEGORY_PLACEHOLDER = "/placeholder.svg";

export type CategoryImageSource =
    | "shopify"
    | "handle-fallback"
    | "title-fallback"
    | "placeholder";

/**
 * Maps collection handles (and slug variants) → local image paths.
 * Add any known alias (e.g. with/without accents or dashes).
 */
export const categoryImageMap: Record<string, string> = {
    // Limpeza e Higiene
    "limpeza-e-higiene": "/images/categories/limpeza-higiene.jpg",
    "limpeza-higiene": "/images/categories/limpeza-higiene.jpg",

    // Organização e Utilidades
    "organizacao-e-utilidades": "/images/categories/utilidades.png",
    "organizacao-utilidades": "/images/categories/utilidades.png",

    // Cozinha e Bar
    "cozinha-e-bar": "/images/categories/cozinha-e-bar.png",
    "cozinha-bar": "/images/categories/cozinha-e-bar.png",
};

/**
 * Slugifies a title for fallback lookup.
 * Removes accents, lowercases, replaces spaces/special chars with dashes.
 */
export function slugifyCategoryKey(text: string): string {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

export interface ResolvedCategoryImage {
    url: string;
    source: CategoryImageSource;
}

export function resolveCategoryImageWithSource(
    shopifyImageUrl: string | null | undefined,
    handle: string,
    title: string,
): ResolvedCategoryImage {
    if (shopifyImageUrl) {
        return {
            url: shopifyImageUrl,
            source: "shopify",
        };
    }

    const byHandle = categoryImageMap[handle];
    if (byHandle) {
        return {
            url: byHandle,
            source: "handle-fallback",
        };
    }

    const byTitle = categoryImageMap[slugifyCategoryKey(title)];
    if (byTitle) {
        return {
            url: byTitle,
            source: "title-fallback",
        };
    }

    if (import.meta.env.DEV) {
        console.warn(
            `[category-images] Missing image for collection handle="${handle}" title="${title}". ` +
            `Add it to categoryImageMap in src/lib/category-images.ts`,
        );
    }

    return {
        url: DEFAULT_CATEGORY_PLACEHOLDER,
        source: "placeholder",
    };
}

/**
 * Resolves the best image URL for a category.
 *
 * Priority:
 * 1. `shopifyImageUrl` — if the collection has an image on Shopify
 * 2. `categoryImageMap[handle]` — local fallback by handle
 * 3. `categoryImageMap[slugify(title)]` — local fallback by slugified title
 * 4. `DEFAULT_PLACEHOLDER`
 *
 * In dev mode, logs a warning when no mapping is found.
 */
export function resolveCategoryImage(
    shopifyImageUrl: string | null | undefined,
    handle: string,
    title: string,
): string {
    return resolveCategoryImageWithSource(shopifyImageUrl, handle, title).url;
}
