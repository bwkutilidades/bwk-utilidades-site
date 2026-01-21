import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";

// Pages
import Index from "./pages/Index";
import Solucoes from "./pages/Solucoes";
import Category from "./pages/Category";
import B2B from "./pages/B2B";
import Licitacoes from "./pages/Licitacoes";
import Catalogo from "./pages/Catalogo";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import { EntregasPage, TrocasPage, PagamentosPage, PrivacidadePage, TermosPage } from "./pages/Legal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/solucoes" element={<Solucoes />} />
            <Route path="/solucoes/:categoria" element={<Category />} />
            <Route path="/b2b" element={<B2B />} />
            <Route path="/licitacoes" element={<Licitacoes />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/produto/:slug" element={<Product />} />
            <Route path="/carrinho" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/pedido/:orderId" element={<OrderConfirmation />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/entregas" element={<EntregasPage />} />
            <Route path="/trocas-e-devolucoes" element={<TrocasPage />} />
            <Route path="/pagamentos" element={<PagamentosPage />} />
            <Route path="/privacidade" element={<PrivacidadePage />} />
            <Route path="/termos" element={<TermosPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
