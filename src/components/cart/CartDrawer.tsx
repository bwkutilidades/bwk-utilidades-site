import { Link } from "react-router-dom";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, setCartOpen, itemCount, subtotal, updateQuantity, removeItem } = useCart();
  
  return (
    <Sheet open={isOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Carrinho ({itemCount} {itemCount === 1 ? "item" : "itens"})
          </SheetTitle>
        </SheetHeader>
        
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">Seu carrinho está vazio</p>
            <Button asChild onClick={() => setCartOpen(false)}>
              <Link to="/catalogo">Ver Catálogo</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.variantId || ""}`}
                  className="flex gap-4 p-3 bg-muted/50 rounded-lg"
                >
                  <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2">{item.product.name}</h4>
                    {item.variantId && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.product.variants?.find((v) => v.id === item.variantId)?.name}
                      </p>
                    )}
                    <p className="font-semibold text-primary mt-1">{formatPrice(item.product.price)}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variantId)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variantId)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.product.id, item.variantId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Frete calculado no checkout
              </p>
              <div className="grid gap-2">
                <Button asChild size="lg" onClick={() => setCartOpen(false)}>
                  <Link to="/carrinho">Ver Carrinho</Link>
                </Button>
                <Button asChild variant="secondary" size="lg" onClick={() => setCartOpen(false)}>
                  <Link to="/checkout">Finalizar Compra</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
