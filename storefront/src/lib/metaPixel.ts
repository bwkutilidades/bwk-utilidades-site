// Declaração global — garante tipagem de window.fbq em todo o projeto
// O pixel é inicializado via script inline no index.html (não via bundle JS)
declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

/**
 * Dispara PageView — chamar a cada troca de rota na SPA.
 */
export const trackPageView = (): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

/**
 * Dispara ViewContent — chamar na página de produto após o produto carregar.
 */
export const trackViewContent = (productData: Record<string, unknown> = {}): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: productData.name ?? '',
      content_ids: [productData.id ?? ''],
      content_type: 'product',
      value: productData.price ?? 0,
      currency: 'BRL',
    });
  }
};

/**
 * Dispara AddToCart — chamar ao clicar em "Comprar".
 */
export const trackAddToCart = (productData: Record<string, unknown> = {}): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_name: productData.name ?? '',
      content_ids: [productData.id ?? ''],
      content_type: 'product',
      value: productData.price ?? 0,
      currency: 'BRL',
    });
  }
};

/**
 * Dispara InitiateCheckout — chamar antes do redirect para o Shopify.
 */
export const trackInitiateCheckout = (): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout');
  }
};
