import { Link } from "react-router-dom";
import {
    DEFAULT_CATEGORY_PLACEHOLDER,
    resolveCategoryImageWithSource,
} from "@/lib/category-images";

interface CategoryCardProps {
    /** Collection handle, used for building the link */
    handle: string;
    /** Display title */
    title: string;
    /** Optional short description */
    description?: string;
    /** Image URL (Shopify or local fallback) */
    imageUrl?: string;
    /** Alt text for the image */
    imageAlt?: string;
}

/**
 * Reusable category card with image, gradient overlay, and accent bar.
 * Used on the Home page ("Nossas Categorias") and the "Ver Todas" page.
 *
 * Image resolution:
 *   1. Shopify imageUrl (if provided and truthy)
 *   2. Local fallback by handle via categoryImageMap
 *   3. Local fallback by slugified title
 *   4. Generic placeholder
 */
export function CategoryCard({ handle, title, description, imageUrl, imageAlt }: CategoryCardProps) {
    const { url: resolvedImage } = resolveCategoryImageWithSource(imageUrl, handle, title);
    const { url: localFallbackImage } = resolveCategoryImageWithSource(null, handle, title);

    if (import.meta.env.DEV && !imageUrl) {
        console.warn(
            `[CategoryCard] No Shopify image for "${title}" (handle="${handle}"), ` +
            `using fallback: ${resolvedImage}`,
        );
    }

    return (
        <Link
            to={`/catalogo?collection=${handle}`}
            className="group relative overflow-hidden rounded-xl bg-card border border-border aspect-[4/3] min-h-[160px] md:min-h-[180px] flex items-end hover:border-primary hover:shadow-lg transition-all duration-300"
        >
            {/* Category Image — always rendered, never blank */}
            <img
                src={resolvedImage}
                alt={imageAlt || title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                    const target = e.currentTarget;

                    if (!target.dataset.localFallbackApplied && target.src !== new URL(localFallbackImage, window.location.origin).href) {
                        target.dataset.localFallbackApplied = "true";
                        target.src = localFallbackImage;

                        if (import.meta.env.DEV) {
                            console.warn(
                                `[CategoryCard] Image failed to load for "${title}", falling back to local asset: ${localFallbackImage}`,
                            );
                        }
                        return;
                    }

                    if (!target.dataset.placeholderApplied) {
                        target.dataset.placeholderApplied = "true";
                        target.src = DEFAULT_CATEGORY_PLACEHOLDER;

                        if (import.meta.env.DEV) {
                            console.warn(
                                `[CategoryCard] Image failed to load for "${title}", falling back to placeholder: ${resolvedImage}`,
                            );
                        }
                    }
                }}
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            {/* Top accent bar */}
            <div className="absolute inset-x-0 top-0 h-1 bg-primary z-10" aria-hidden="true" />
            {/* Text content */}
            <div className="relative z-20 p-6">
                <h3 className="text-xl font-semibold text-white group-hover:text-primary transition-colors">
                    {title}
                </h3>
                {description && (
                    <p className="text-sm text-white/80 mt-1 line-clamp-2">{description}</p>
                )}
            </div>
        </Link>
    );
}
