/**
 * Safe compilation of public environment variables.
 * Handles fallback between VITE_ and NEXT_PUBLIC_ prefixes.
 */
export const publicEnv = {
  // Site context
  SITE_URL:
    import.meta.env.VITE_SITE_URL ||
    import.meta.env.NEXT_PUBLIC_SITE_URL ||
    "https://bwkutilidades.com.br",
  
  // API context
  API_URL:
    import.meta.env.VITE_API_URL ||
    import.meta.env.NEXT_PUBLIC_API_URL ||
    "/api",

  // Feature flags / Mode
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};

// Simple logger to verify env loads
if (publicEnv.isDev) {
  console.info("[Config] Public Env Loaded:", publicEnv);
}
