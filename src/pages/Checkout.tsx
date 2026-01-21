import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, ShoppingBag, Truck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Layout } from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { apiClient } from "@/lib/api-client";
import { formatPrice } from "@/lib/utils";
import bwkLogo from "@/assets/bwk-logo.png";

const SHIPPING_OPTIONS = [
  { id: "standard", name: "Entrega Padrão", price: 19.90, days: "5-10 dias úteis" },
  { id: "express", name: "Entrega Expressa", price: 39.90, days: "2-3 dias úteis" },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState(SHIPPING_OPTIONS[0].id);
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cpfCnpj: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zip: "",
  });
  
  const selectedShipping = SHIPPING_OPTIONS.find((s) => s.id === shipping)!;
  const total = subtotal + selectedShipping.price;
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const customer = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        cpfCnpj: form.cpfCnpj || undefined,
        address: {
          street: form.street,
          number: form.number,
          complement: form.complement || undefined,
          neighborhood: form.neighborhood,
          city: form.city,
          state: form.state,
          zip: form.zip,
        },
      };
      
      const cart = {
        items,
        subtotal,
        shipping: selectedShipping.price,
        total,
      };
      
      const result = await apiClient.createCheckoutSession(cart, customer);
      
      if (result.success) {
        clearCart();
        navigate(`/pedido/${result.orderId}`);
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="container-bwk py-8">
        <div className="flex items-center gap-3 mb-8">
          <img src={bwkLogo} alt="BWK" className="h-12 w-auto" />
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Info */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">Dados de Contato</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      placeholder="(11) 99999-9999"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                    <Input
                      id="cpfCnpj"
                      placeholder="Opcional"
                      value={form.cpfCnpj}
                      onChange={(e) => setForm({ ...form, cpfCnpj: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              
              {/* Address */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">Endereço de Entrega</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zip">CEP *</Label>
                    <Input
                      id="zip"
                      required
                      placeholder="00000-000"
                      value={form.zip}
                      onChange={(e) => setForm({ ...form, zip: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="street">Rua *</Label>
                    <Input
                      id="street"
                      required
                      value={form.street}
                      onChange={(e) => setForm({ ...form, street: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number">Número *</Label>
                    <Input
                      id="number"
                      required
                      value={form.number}
                      onChange={(e) => setForm({ ...form, number: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complement">Complemento</Label>
                    <Input
                      id="complement"
                      placeholder="Apto, bloco..."
                      value={form.complement}
                      onChange={(e) => setForm({ ...form, complement: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Bairro *</Label>
                    <Input
                      id="neighborhood"
                      required
                      value={form.neighborhood}
                      onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado *</Label>
                    <Input
                      id="state"
                      required
                      maxLength={2}
                      placeholder="SP"
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })}
                    />
                  </div>
                </div>
              </div>
              
              {/* Shipping */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Truck className="h-5 w-5" /> Método de Entrega
                </h2>
                <RadioGroup value={shipping} onValueChange={setShipping}>
                  {SHIPPING_OPTIONS.map((opt) => (
                    <div
                      key={opt.id}
                      className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                        shipping === opt.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setShipping(opt.id)}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={opt.id} id={opt.id} />
                        <div>
                          <Label htmlFor={opt.id} className="cursor-pointer font-medium">{opt.name}</Label>
                          <p className="text-sm text-muted-foreground">{opt.days}</p>
                        </div>
                      </div>
                      <span className="font-semibold">{formatPrice(opt.price)}</span>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Payment Placeholder */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" /> Pagamento
                </h2>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-muted-foreground">
                    O pagamento será processado na próxima etapa.<br />
                    <span className="text-xs">(Integração com gateway em desenvolvimento)</span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
                
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.variantId || ""}`} className="flex gap-3">
                      <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                        <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                
                <hr className="border-border my-4" />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frete</span>
                    <span>{formatPrice(selectedShipping.price)}</span>
                  </div>
                </div>
                
                <hr className="border-border my-4" />
                
                <div className="flex justify-between text-lg font-semibold mb-6">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Confirmar Pedido
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
