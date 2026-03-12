// Declaração global — garante tipagem de window.fbq em todo o projeto
declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

const PIXEL_ID = '2005189303360516';

/**
 * Inicializa o Meta Pixel uma única vez.
 * Deve ser chamado em main.tsx, ANTES do ReactDOM.createRoot.
 */
export const initPixel = (): void => {
  if (typeof window === 'undefined' || window.fbq) return;

  // Código base oficial da Meta — não modificar
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (function (f: any, b: Document, e: string, v: string, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0';
    n.queue = [];
    t = b.createElement(e); t.async = true;
    t.src = v; s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  window.fbq('init', PIXEL_ID);
};

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
