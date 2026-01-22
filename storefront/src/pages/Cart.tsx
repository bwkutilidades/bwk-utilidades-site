import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  
  if (items.length === 0) {
    return (
      <Layout>
        <div className="container-bwk py-20 text-center">
          <ShoppingBag className="h-20 w-20 text-muted-foreground/30 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
          <p className="text-muted-foreground mb-6">Adicione produtos para continuar comprando.</p>
          <Button asChild size="lg">
            <Link to="/catalogo">Ver Catálogo</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container-bwk py-8">
        <h1 className="text-3xl font-bold mb-8">Carrinho</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.variantId || ""}`}
                className="flex gap-4 p-4 bg-card border border-border rounded-xl"
              >
                <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <Link to={`/produto/${item.product.slug}`} className="font-medium hover:text-primary line-clamp-2">
                    {item.product.name}
                  </Link>
                  {item.variantId && (
                    <p className="text-sm text-muted-foreground">
                      {item.product.variants?.find((v) => v.id === item.variantId)?.name}
                    </p>
                  )}
                  <p className="font-semibold text-lg mt-2">{formatPrice(item.product.price)}</p>
                </div>
                
                <div className="flex flex-col items-end justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeItem(item.product.id, item.variantId)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variantId)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variantId)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={clearCart} className="text-destructive">
                Limpar Carrinho
              </Button>
              <Button variant="outline" asChild>
                <Link to="/catalogo">Continuar Comprando</Link>
              </Button>
            </div>
          </div>
          
          {/* Summary */}
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
                  <span className="text-muted-foreground">Calculado no checkout</span>
                </div>
              </div>
              
              <hr className="border-border my-4" />
              
              <div className="flex justify-between text-lg font-semibold mb-6">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              <Button asChild size="lg" className="w-full">
                <Link to="/checkout">
                  Finalizar Compra <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
