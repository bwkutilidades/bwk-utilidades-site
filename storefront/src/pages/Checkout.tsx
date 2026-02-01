import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, ShoppingBag, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import { createCart, type CartLineInput } from "@/lib/shopify";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container-bwk py-20 text-center">
          <ShoppingBag className="h-20 w-20 text-muted-foreground/30 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
          <Button asChild size="lg">
            <Link to="/catalogo">Ver Catálogo</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const handleProceedToCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build cart lines from local cart items
      // We need to use Shopify variant IDs (merchandiseId)
      const lines: CartLineInput[] = items.map((item) => {
        // Priority: variantId (if user selected) > defaultVariantId > first variant from variants array
        let merchandiseId = item.variantId;

        if (!merchandiseId && item.product.defaultVariantId) {
          merchandiseId = item.product.defaultVariantId;
        }

        if (!merchandiseId && item.product.variants?.[0]?.id) {
          merchandiseId = item.product.variants[0].id;
        }

        if (!merchandiseId) {
          // Fallback: this shouldn't happen with Shopify products
          console.warn('[Checkout] No variant ID found for product:', item.product.name);
          merchandiseId = item.product.id;
        }

        return {
          merchandiseId,
          quantity: item.quantity,
        };
      });

      // Create Shopify cart
      const cart = await createCart(lines);

      if (!cart) {
        setError("Não foi possível criar o carrinho. Verifique se os produtos estão disponíveis.");
        return;
      }

      if (!cart.checkoutUrl) {
        setError("URL de checkout não disponível. Tente novamente.");
        return;
      }

      // Clear local cart before redirecting
      clearCart();

      // Redirect to Shopify checkout
      window.location.assign(cart.checkoutUrl);
    } catch (err) {
      console.error("[Checkout] Error:", err);
      setError("Ocorreu um erro ao processar o checkout. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container-bwk py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Info Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Redirect Notice */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ExternalLink className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    Pagamento Seguro via Shopify
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Você será redirecionado para o checkout seguro da Shopify,
                    onde poderá preencher seus dados de entrega e pagamento.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Dados protegidos por criptografia SSL
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Múltiplas formas de pagamento aceitas
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Cálculo de frete automático
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive">{error}</p>
                  <p className="text-xs text-destructive/80 mt-1">
                    Se o problema persistir, entre em contato conosco.
                  </p>
                </div>
              </div>
            )}

            {/* Cart Items Review */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Itens do Pedido</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.variantId || ""}`}
                    className="flex gap-4"
                  >
                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2">
                        {item.product.name}
                      </h4>
                      {item.variantId && item.product.variants && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.product.variants.find((v) => v.id === item.variantId)?.name}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          Qtd: {item.quantity}
                        </span>
                        <span className="font-medium text-sm">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Resumo</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="text-muted-foreground text-xs">
                    Calculado no checkout
                  </span>
                </div>
              </div>

              <hr className="border-border my-4" />

              <div className="flex justify-between text-lg font-semibold mb-6">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleProceedToCheckout}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    Ir para Pagamento
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Você será redirecionado para o checkout seguro
              </p>

              <Button variant="ghost" asChild className="w-full mt-2">
                <Link to="/carrinho">Voltar ao Carrinho</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
