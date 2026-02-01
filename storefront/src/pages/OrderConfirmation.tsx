import { Link } from "react-router-dom";
import { Info, ShoppingBag, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

/**
 * Legacy Order Confirmation Page
 * 
 * This page no longer shows fake order confirmations.
 * Real orders are processed through Shopify checkout.
 */
export default function OrderConfirmationPage() {
  return (
    <Layout>
      <div className="container-bwk py-20">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="h-10 w-10 text-blue-600" />
          </div>

          <h1 className="text-2xl font-bold mb-4">Confirmação de Pedido</h1>

          <p className="text-muted-foreground mb-6">
            Os pedidos são processados diretamente pelo checkout da Shopify.
            Após a conclusão do pagamento, você receberá um e-mail de confirmação
            com todos os detalhes do seu pedido.
          </p>

          <div className="bg-card border border-border rounded-xl p-6 mb-8 text-left">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Como acompanhar seu pedido
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>Verifique o e-mail de confirmação enviado após a compra</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>Acompanhe o status do envio pelo link no e-mail</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary flex-shrink-0 mt-0.5">
                  3
                </span>
                <span>Em caso de dúvidas, entre em contato conosco</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link to="/catalogo">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Ver Catálogo
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contato">Falar Conosco</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
