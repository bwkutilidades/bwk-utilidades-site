import type { Product, CartItem } from '@/lib/types';

/**
 * Dispara ViewContent — chamar na página de produto após o produto carregar.
 */
export function pixelViewContent(product: Product) {
  if (!window.fbq) return;
  window.fbq('track', 'ViewContent', {
    content_name: product.name,
    content_ids: [product.id],
    content_type: 'product',
    value: product.price,
    currency: 'BRL',
  });
}

/**
 * Dispara AddToCart — chamar ao clicar em "Comprar" / "Adicionar ao carrinho".
 */
export function pixelAddToCart(product: Product, quantity = 1) {
  if (!window.fbq) return;
  window.fbq('track', 'AddToCart', {
    content_name: product.name,
    content_ids: [product.id],
    content_type: 'product',
    value: product.price * quantity,
    currency: 'BRL',
  });
}

/**
 * Dispara InitiateCheckout — chamar imediatamente antes do redirect para o Shopify.
 */
export function pixelInitiateCheckout(items: CartItem[], total: number) {
  if (!window.fbq) return;
  window.fbq('track', 'InitiateCheckout', {
    content_ids: items.map((i) => i.product.id),
    num_items: items.reduce((sum, i) => sum + i.quantity, 0),
    value: total,
    currency: 'BRL',
  });
}
