/**
 * Shopify Storefront API Types
 * 
 * TypeScript interfaces for Shopify GraphQL responses.
 */

// ========================================
// Image Types
// ========================================

export interface ShopifyImage {
    url: string;
    altText: string | null;
    width?: number;
    height?: number;
}

export interface ShopifyImageEdge {
    node: ShopifyImage;
}

export interface ShopifyImageConnection {
    edges: ShopifyImageEdge[];
}

// ========================================
// Price Types
// ========================================

export interface ShopifyMoney {
    amount: string;
    currencyCode: string;
}

export interface ShopifyPriceRange {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
}

// ========================================
// Variant Types
// ========================================

export interface ShopifyVariant {
    id: string;
    title: string;
    availableForSale: boolean;
    price: ShopifyMoney;
    compareAtPrice?: ShopifyMoney | null;
}

export interface ShopifyVariantEdge {
    node: ShopifyVariant;
}

export interface ShopifyVariantConnection {
    edges: ShopifyVariantEdge[];
}

// ========================================
// Product Types
// ========================================

export interface ShopifyProduct {
    id: string;
    title: string;
    handle: string;
    description: string;
    descriptionHtml: string;
    featuredImage: ShopifyImage | null;
    images: ShopifyImageConnection;
    priceRange: ShopifyPriceRange;
    variants: ShopifyVariantConnection;
    productType: string;
    tags: string[];
    availableForSale: boolean;
}

export interface ShopifyProductEdge {
    node: ShopifyProduct;
    cursor: string;
}

export interface ShopifyPageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    endCursor: string | null;
    startCursor: string | null;
}

export interface ShopifyProductConnection {
    edges: ShopifyProductEdge[];
    pageInfo: ShopifyPageInfo;
}

// ========================================
// Query Response Types
// ========================================

export interface ProductsQueryResponse {
    products: ShopifyProductConnection;
}

export interface ProductByHandleQueryResponse {
    product: ShopifyProduct | null;
}

// ========================================
// Collection Types
// ========================================

export interface ShopifyCollection {
    id: string;
    title: string;
    handle: string;
    description: string;
    products: ShopifyProductConnection;
}

export interface CollectionByHandleQueryResponse {
    collection: ShopifyCollection | null;
}

/**
 * Collection metadata for category cards (lighter version without products)
 */
export interface CollectionMetadata {
    id: string;
    title: string;
    handle: string;
    description: string;
    image: {
        url: string;
        altText: string | null;
        width: number;
        height: number;
    } | null;
}

export interface CollectionMetadataEdge {
    node: CollectionMetadata;
}

export interface CollectionMetadataConnection {
    edges: CollectionMetadataEdge[];
}

export interface CollectionsMetadataQueryResponse {
    collections: CollectionMetadataConnection;
}

// ========================================
// Cart Types (Storefront Cart API)
// ========================================

export interface ShopifyCartLineItem {
    id: string;
    quantity: number;
    cost: {
        totalAmount: ShopifyMoney;
    };
    merchandise: {
        id: string;
        title: string;
        product: {
            title: string;
            handle: string;
            featuredImage: ShopifyImage | null;
        };
        price: ShopifyMoney;
    };
}

export interface ShopifyCartLineEdge {
    node: ShopifyCartLineItem;
}

export interface ShopifyCart {
    id: string;
    checkoutUrl: string;
    totalQuantity: number;
    cost: {
        totalAmount: ShopifyMoney;
        subtotalAmount: ShopifyMoney;
    };
    lines: {
        edges: ShopifyCartLineEdge[];
    };
}

export interface ShopifyUserError {
    field: string[] | null;
    message: string;
}

export interface CartCreateResponse {
    cartCreate: {
        cart: ShopifyCart | null;
        userErrors: ShopifyUserError[];
    };
}

export interface CartLinesAddResponse {
    cartLinesAdd: {
        cart: ShopifyCart | null;
        userErrors: ShopifyUserError[];
    };
}

export interface CartLinesUpdateResponse {
    cartLinesUpdate: {
        cart: ShopifyCart | null;
        userErrors: ShopifyUserError[];
    };
}

export interface CartLinesRemoveResponse {
    cartLinesRemove: {
        cart: ShopifyCart | null;
        userErrors: ShopifyUserError[];
    };
}

export interface CartQueryResponse {
    cart: ShopifyCart | null;
}

// ========================================
// Legacy Checkout Types (deprecated)
// ========================================

export interface ShopifyCheckout {
    id: string;
    webUrl: string;
    totalPrice: ShopifyMoney;
    lineItems: {
        edges: Array<{
            node: {
                id: string;
                title: string;
                quantity: number;
                variant: ShopifyVariant;
            };
        }>;
    };
}

export interface CheckoutCreateResponse {
    checkoutCreate: {
        checkout: ShopifyCheckout | null;
        checkoutUserErrors: Array<{
            code: string;
            field: string[];
            message: string;
        }>;
    };
}
