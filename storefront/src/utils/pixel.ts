/**
 * Wrappers tipados sobre lib/metaPixel.ts
 * Mantém a assinatura forte (Product, CartItem) para uso nos componentes.
 */
import type { Product, CartItem } from '@/lib/types';
import { trackViewContent, trackAddToCart, trackInitiateCheckout } from '@/lib/metaPixel';

export function pixelViewContent(product: Product): void {
  trackViewContent({
    name: product.name,
    id: product.id,
    price: product.price,
  });
}

export function pixelAddToCart(product: Product, quantity = 1): void {
  trackAddToCart({
    name: product.name,
    id: product.id,
    price: product.price * quantity,
  });
}

export function pixelInitiateCheckout(items: CartItem[], total: number): void {
  trackInitiateCheckout();
  // Os parâmetros são mantidos na assinatura para consistência futura
  void items;
  void total;
}
