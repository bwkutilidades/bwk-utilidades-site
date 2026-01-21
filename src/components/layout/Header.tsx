import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { siteConfig } from "@/config/site";
import bwkLogoHeader from "@/assets/bwk-logo-header.png";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solucoesOpen, setSolucoesOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount, toggleCart } = useCart();
  
  const isActive = (path: string) => location.pathname === path;
  const isSolucoesActive = location.pathname.startsWith("/solucoes");

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setSolucoesOpen(false);

    // Já está na Home: faz scroll suave para o herói
    if (location.pathname === "/") {
      const el = document.getElementById("inicio");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    // Em outras rotas: navega para Home com hash (compatível com refresh)
    navigate("/#inicio");
  };

  useEffect(() => {
    const handleScroll = () => {
      // Se o menu mobile está aberto, nunca esconder (evita UX ruim)
      if (mobileMenuOpen) {
        setHidden(false);
        lastScrollY.current = window.scrollY;
        return;
      }

      const currentY = window.scrollY;

      // No topo: sempre visível
      if (currentY <= 10) {
        setHidden(false);
        lastScrollY.current = currentY;
        return;
      }

      const delta = currentY - lastScrollY.current;
      const threshold = 5;

      if (Math.abs(delta) < threshold) return;

      // Scroll para baixo e passou do offset: esconder
      if (delta > 0 && currentY > 80) {
        setHidden(true);
      }

      // Scroll para cima: mostrar
      if (delta < 0) {
        setHidden(false);
      }

      lastScrollY.current = currentY;
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen]);
  
  return (
    <>
      {/* Spacer para evitar layout shift (header agora é fixed) */}
      <div className="h-16 md:h-20" aria-hidden="true" />

      <header
        className={
          "fixed top-0 left-0 right-0 z-50 bg-background border-b border-border transition-transform duration-300 ease-in-out will-change-transform " +
          (hidden ? "-translate-y-[110%]" : "translate-y-0 shadow-sm")
        }
      >
        <div className="container-bwk">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/#inicio" className="flex-shrink-0" onClick={handleLogoClick}>
              <img src={bwkLogoHeader} alt="BWK Utilidades" className="h-14 md:h-16 w-auto" />
            </Link>
          
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-foreground"
              }`}
            >
              Início
            </Link>
            
            {/* Soluções Dropdown */}
            <div className="relative group">
              <button
                className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                  isSolucoesActive ? "text-primary" : "text-foreground"
                }`}
                onClick={() => setSolucoesOpen(!solucoesOpen)}
              >
                Soluções <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-56 bg-card rounded-lg shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <Link
                    to="/solucoes"
                    className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    Ver Todas
                  </Link>
                  <Link
                    to="/solucoes/limpeza-e-higiene"
                    className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    Limpeza e Higiene
                  </Link>
                  <Link
                    to="/solucoes/organizacao-e-utilidades"
                    className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    Organização e Utilidades
                  </Link>
                  <Link
                    to="/solucoes/cozinha-e-bar"
                    className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    Cozinha e Bar
                  </Link>
                </div>
              </div>
            </div>
            
            <Link
              to="/b2b"
              className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                isActive("/b2b") ? "text-primary" : "text-foreground"
              }`}
            >
              Para Empresas
            </Link>
            
            <Link
              to="/licitacoes"
              className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                isActive("/licitacoes") ? "text-primary" : "text-foreground"
              }`}
            >
              Licitações
            </Link>
            
            <Link
              to="/catalogo"
              className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                isActive("/catalogo") ? "text-primary" : "text-foreground"
              }`}
            >
              Catálogo
            </Link>
            
            <Link
              to="/sobre"
              className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                isActive("/sobre") ? "text-primary" : "text-foreground"
              }`}
            >
              Sobre
            </Link>
            
            <Link
              to="/contato"
              className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                isActive("/contato") ? "text-primary" : "text-foreground"
              }`}
            >
              Contato
            </Link>
          </nav>
          
            {/* Right Section */}
            <div className="flex items-center gap-2">
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={toggleCart}
              aria-label="Abrir carrinho"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Button>
            
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
          </div>
        </div>
      
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <nav className="container-bwk py-4 space-y-1">
            <Link
              to="/"
              className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Início
            </Link>
            <Link
              to="/solucoes"
              className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Soluções
            </Link>
            <Link
              to="/b2b"
              className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Para Empresas
            </Link>
            <Link
              to="/licitacoes"
              className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Licitações
            </Link>
            <Link
              to="/catalogo"
              className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Catálogo
            </Link>
            <Link
              to="/sobre"
              className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link
              to="/contato"
              className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contato
            </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
