/**
 * Shopify Storefront API Client
 * 
 * Provides a typed GraphQL fetch helper for Shopify Storefront API.
 * Uses environment variables for configuration.
 * 
 * IMPORTANT: The token used here MUST be a PUBLIC Storefront API access token,
 * NOT a private Admin API token. Public tokens are safe to expose in frontend code.
 * 
 * To get a Storefront API token:
 * 1. Go to Shopify Admin → Settings → Apps and sales channels
 * 2. Click "Develop apps" → Create an app
 * 3. Configure Storefront API scopes (unauthenticated_read_products, etc.)
 * 4. Install the app and copy the Storefront API access token
 */

const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const SHOPIFY_API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || '2024-01';

// Development-only validation
if (import.meta.env.DEV) {
    if (SHOPIFY_TOKEN && !SHOPIFY_TOKEN.startsWith('shpat_')) {
        // Good - Storefront API tokens don't start with shpat_ (Admin tokens do)
        console.log('[Shopify] ✓ Using Storefront API token (safe for frontend)');
    } else if (SHOPIFY_TOKEN?.startsWith('shpat_')) {
        console.warn(
            '[Shopify] ⚠️ WARNING: The token appears to be an Admin API token (starts with shpat_).\n' +
            'You should use a PUBLIC Storefront API access token for frontend code.\n' +
            'Admin tokens should NEVER be exposed in client-side code.'
        );
    }
}

/**
 * Get the Shopify Storefront API endpoint
 */
function getEndpoint(): string {
    if (!SHOPIFY_DOMAIN) {
        console.warn('[Shopify] VITE_SHOPIFY_STORE_DOMAIN not configured');
        return '';
    }
    return `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
}

/**
 * Check if Shopify is properly configured
 */
export function isShopifyConfigured(): boolean {
    return Boolean(SHOPIFY_DOMAIN && SHOPIFY_TOKEN);
}

/**
 * Fetch data from Shopify Storefront API
 * 
 * @param query - GraphQL query string
 * @param variables - Optional query variables
 * @returns Typed response data
 */
export async function shopifyFetch<T>(
    query: string,
    variables?: Record<string, unknown>
): Promise<T> {
    const endpoint = getEndpoint();

    if (!endpoint || !SHOPIFY_TOKEN) {
        throw new Error(
            '[Shopify] API not configured. Please set VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN in your .env file.'
        );
    }

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
        },
        body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[Shopify] API Error:', response.status, errorText);
        throw new Error(`Shopify API error: ${response.status}`);
    }

    const json = await response.json();

    if (json.errors) {
        console.error('[Shopify] GraphQL Errors:', json.errors);
        throw new Error(`Shopify GraphQL error: ${json.errors[0]?.message || 'Unknown error'}`);
    }

    return json.data as T;
}

