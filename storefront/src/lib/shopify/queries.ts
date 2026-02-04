/**
 * Shopify Storefront API GraphQL Queries
 */

/**
 * Fragment with common product fields
 */
const PRODUCT_FRAGMENT = `
  id
  title
  handle
  description
  descriptionHtml
  productType
  tags
  availableForSale
  featuredImage {
    url
    altText
    width
    height
  }
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
    maxVariantPrice {
      amount
      currencyCode
    }
  }
`;

/**
 * Fragment with cart fields
 */
const CART_FRAGMENT = `
  id
  checkoutUrl
  totalQuantity
  cost {
    totalAmount {
      amount
      currencyCode
    }
    subtotalAmount {
      amount
      currencyCode
    }
  }
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            product {
              title
              handle
              featuredImage {
                url
                altText
              }
            }
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

/**
 * Query to list products with pagination
 * 
 * @param first - Number of products to fetch (default: 12)
 * @param after - Cursor for pagination (optional)
 */
export const PRODUCTS_QUERY = `
  query listProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          ${PRODUCT_FRAGMENT}
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
    }
  }
`;

/**
 * Query to get a single product by handle (slug)
 * 
 * @param handle - Product handle/slug
 */
export const PRODUCT_BY_HANDLE_QUERY = `
  query productByHandle($handle: String!) {
    product(handle: $handle) {
      ${PRODUCT_FRAGMENT}
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 50) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

/**
 * Query to search products
 * 
 * @param query - Search query string
 * @param first - Number of products to fetch
 */
export const SEARCH_PRODUCTS_QUERY = `
  query searchProducts($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
      edges {
        node {
          ${PRODUCT_FRAGMENT}
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// ========================================
// Cart API Mutations
// ========================================

/**
 * Mutation to create a new cart with line items
 */
export const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        ${CART_FRAGMENT}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Mutation to add lines to an existing cart
 */
export const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FRAGMENT}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Mutation to update cart line quantities
 */
export const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FRAGMENT}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Mutation to remove lines from cart
 */
export const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ${CART_FRAGMENT}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Query to get an existing cart by ID
 */
export const CART_QUERY = `
  query cart($cartId: ID!) {
    cart(id: $cartId) {
      ${CART_FRAGMENT}
    }
  }
`;

/**
 * Query to get products from a collection by handle
 * 
 * @param handle - Collection handle/slug
 * @param first - Number of products to fetch
 */
export const COLLECTION_BY_HANDLE_QUERY = `
  query collectionByHandle($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      products(first: $first) {
        edges {
          node {
            ${PRODUCT_FRAGMENT}
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

/**
 * Query to get metadata for multiple collections by handle
 * Used for the "Nossas Categorias" section on the Home page
 * 
 * Note: We use aliases to fetch all 3 collections in a single request
 */
export const COLLECTIONS_METADATA_QUERY = `
  query collectionsMetadata {
    limpezaEHigiene: collection(handle: "limpeza-e-higiene") {
      id
      title
      handle
      description
      image {
        url
        altText
        width
        height
      }
    }
    organizacaoEUtilidades: collection(handle: "organizacao-e-utilidades") {
      id
      title
      handle
      description
      image {
        url
        altText
        width
        height
      }
    }
    cozinhaEBar: collection(handle: "cozinha-e-bar") {
      id
      title
      handle
      description
      image {
        url
        altText
        width
        height
      }
    }
  }
`;
