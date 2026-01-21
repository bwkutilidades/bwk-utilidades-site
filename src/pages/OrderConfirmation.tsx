import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Package, Truck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { apiClient } from "@/lib/api-client";
import { formatPrice } from "@/lib/utils";
import bwkLogo from "@/assets/bwk-logo.png";
import type { Order } from "@/lib/types";

const STATUS_MAP = {
  pending: { label: "Pendente", icon: Package, color: "text-yellow-500" },
  confirmed: { label: "Confirmado", icon: CheckCircle, color: "text-green-500" },
  processing: { label: "Em Processamento", icon: Package, color: "text-blue-500" },
  shipped: { label: "Enviado", icon: Truck, color: "text-blue-500" },
  delivered: { label: "Entregue", icon: CheckCircle, color: "text-green-600" },
  cancelled: { label: "Cancelado", icon: Package, color: "text-red-500" },
};

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      setLoading(true);
      try {
        const o = await apiClient.getOrderStatus(orderId);
        setOrder(o);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);
  
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }
  
  if (!order) {
    return (
      <Layout>
        <div className="container-bwk py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Pedido não encontrado</h1>
          <Button asChild>
            <Link to="/catalogo">Voltar ao Catálogo</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  const status = STATUS_MAP[order.status];
  const StatusIcon = status.icon;
  
  return (
    <Layout>
      <div className="container-bwk py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Pedido Confirmado!</h1>
            <p className="text-muted-foreground">
              Obrigado pela sua compra. Seu pedido foi recebido com sucesso.
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={bwkLogo} alt="BWK" className="h-12 w-auto" />
                <div>
                  <p className="font-semibold">Pedido #{order.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-2 ${status.color}`}>
                <StatusIcon className="h-5 w-5" />
                <span className="font-medium">{status.label}</span>
              </div>
            </div>
            
            <hr className="border-border my-4" />
            
            <h3 className="font-semibold mb-3">Itens do Pedido</h3>
            <div className="space-y-3 mb-4">
              {order.items.map((item) => (
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
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span>{formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
            
            <hr className="border-border my-4" />
            
            <h3 className="font-semibold mb-3">Endereço de Entrega</h3>
            <p className="text-sm text-muted-foreground">
              {order.customer.name}<br />
              {order.customer.address.street}, {order.customer.address.number}
              {order.customer.address.complement && ` - ${order.customer.address.complement}`}<br />
              {order.customer.address.neighborhood}, {order.customer.address.city} - {order.customer.address.state}<br />
              CEP: {order.customer.address.zip}
            </p>
          </div>
          
          <div className="text-center">
            <Button asChild size="lg">
              <Link to="/catalogo">Continuar Comprando</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
