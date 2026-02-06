import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Building2, ShoppingBag, FileText, Package, Truck, CheckCircle, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { siteConfig } from "@/config/site";
import { useShopifyFeaturedProducts } from "@/hooks/useShopifyProducts";
import { useCategoryCollections } from "@/hooks/useCategoryCollections";

const channels = [
  {
    icon: Building2,
    title: "B2B",
    description: "Fornecimento para empresas com condições especiais, volume e atendimento consultivo.",
    cta: "Saiba mais",
    href: "/b2b",
  },
  {
    icon: ShoppingBag,
    title: "E-commerce",
    description: "Compre online com praticidade. Entrega em todo o Brasil.",
    cta: "Ver catálogo",
    href: "/catalogo",
  },
  {
    icon: FileText,
    title: "Licitações",
    description: "Atendemos órgãos públicos com documentação completa e experiência.",
    cta: "Ver mais",
    href: "/licitacoes",
  },
];

const steps = [
  {
    icon: Package,
    title: "Escolha os Produtos",
    description: "Navegue pelo catálogo e adicione ao carrinho",
  },
  {
    icon: Truck,
    title: "Receba em Casa",
    description: "Entregamos em todo o Brasil com segurança",
  },
  {
    icon: CheckCircle,
    title: "Satisfação Garantida",
    description: "Qualidade BWK em cada produto",
  },
];

export default function HomePage() {
  const location = useLocation();
  const { products: featuredProducts, loading: productsLoading } = useShopifyFeaturedProducts(8);
  const { collections: categoryCollections } = useCategoryCollections();

  useEffect(() => {
    if (location.hash === "#inicio") {
      // Defer para garantir que o layout (incluindo o header fixo) já foi renderizado
      requestAnimationFrame(() => {
        const el = document.getElementById("inicio");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [location.hash]);

  return (
    <Layout>
      {/* Hero Section */}
      <section id="inicio" className="relative overflow-hidden border-b border-border scroll-mt-24">
        {/* Fallback background color */}
        <div className="absolute inset-0 bg-background" />

        {/* Background Image */}
        <img
          src="/images/home/hero-bwk-1920x820.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-[70%_50%] lg:object-[70%_50%]"
          loading="eager"
          fetchPriority="high"
        />

        {/* Overlay Layer A: Legibility gradient (foreground-based, dark) */}
        <div
          className="absolute inset-0 z-10 hidden lg:block"
          style={{
            background: `linear-gradient(
              to right,
              hsl(var(--foreground) / 0.92) 0%,
              hsl(var(--foreground) / 0.85) 25%,
              hsl(var(--foreground) / 0.6) 50%,
              hsl(var(--foreground) / 0.3) 80%,
              hsl(var(--foreground) / 0.15) 100%
            )`
          }}
        />
        {/* Mobile: vertical gradient */}
        <div
          className="absolute inset-0 z-10 lg:hidden"
          style={{
            background: `linear-gradient(
              to bottom,
              hsl(var(--foreground) / 0.92) 0%,
              hsl(var(--foreground) / 0.85) 30%,
              hsl(var(--foreground) / 0.6) 60%,
              hsl(var(--foreground) / 0.4) 100%
            )`
          }}
        />

        {/* Overlay Layer B: Subtle primary glow (brand signature) */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `radial-gradient(
              ellipse 50% 60% at 20% 70%,
              hsl(var(--primary) / 0.12) 0%,
              transparent 70%
            )`
          }}
        />

        {/* Content */}
        <div className="container-bwk py-20 md:py-32 relative z-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight animate-fade-in drop-shadow-lg">
              Insumos de{" "}
              <span className="text-primary">limpeza e higiene</span>
              <br />+ utilidades para empresas e consumidores
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl animate-fade-in drop-shadow-md" style={{ animationDelay: "0.1s" }}>
              A BWK é sua parceira em soluções de limpeza, organização e utilidades.
              Atendemos B2B, e-commerce e licitações públicas com qualidade e agilidade.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Button size="lg" asChild className="text-base">
                <Link to="/catalogo">
                  Comprar no Catálogo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white">
                <a href={siteConfig.contact.whatsapp} target="_blank" rel="noopener noreferrer">
                  {siteConfig.ctaQuoteText}
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade to next section - taller for smoother transition */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 z-20 pointer-events-none"
          style={{
            background: `linear-gradient(
              to top,
              hsl(var(--background)) 0%,
              hsl(var(--background) / 0.8) 30%,
              hsl(var(--background) / 0.4) 60%,
              transparent 100%
            )`
          }}
        />
      </section>

      {/* How BWK Serves Section */}
      <section className="section-padding bg-background">
        <div className="container-bwk">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Como a BWK atende</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Três canais para atender às suas necessidades, seja você consumidor final, empresa ou órgão público.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {channels.map((channel) => (
              <div
                key={channel.title}
                className="group p-6 bg-card border border-border rounded-xl hover:border-primary hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <channel.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{channel.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{channel.description}</p>
                <Link
                  to={channel.href}
                  className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  {channel.cta} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding bg-muted">
        <div className="container-bwk">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Nossas Categorias</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Produtos selecionados para atender sua casa, empresa ou estabelecimento.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {categoryCollections.length === 0 ? (
              // Skeleton loading state
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-xl bg-card border border-border aspect-[4/3] animate-pulse"
                >
                  <div className="absolute inset-0 bg-muted" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="h-6 bg-muted-foreground/20 rounded w-2/3 mb-2" />
                    <div className="h-4 bg-muted-foreground/10 rounded w-full" />
                  </div>
                </div>
              ))
            ) : (
              categoryCollections.map((collection) => (
                <Link
                  key={collection.handle}
                  to={`/catalogo?collection=${collection.handle}`}
                  className="group relative overflow-hidden rounded-xl bg-card border border-border aspect-[4/3] flex items-end hover:border-primary hover:shadow-lg transition-all duration-300"
                >
                  {/* Category Image */}
                  <img
                    src={collection.imageUrl}
                    alt={collection.imageAlt}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  {/* Top accent bar */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-primary z-10" aria-hidden="true" />
                  {/* Text content */}
                  <div className="relative z-20 p-6">
                    <h3 className="text-xl font-semibold text-white group-hover:text-primary transition-colors">
                      {collection.title}
                    </h3>
                    {collection.description && (
                      <p className="text-sm text-white/80 mt-1 line-clamp-2">{collection.description}</p>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Differentials Section */}
      <section className="section-padding bg-muted">
        <div className="container-bwk">
          <div className="rounded-2xl border border-border bg-card p-8 md:p-10 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-primary" aria-hidden="true" />

            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold">Diferenciais da BWK</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Por que escolher a BWK Utilidades para suas compras.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {siteConfig.differentials.map((diff, index) => (
                <div
                  key={index}
                  className="flex gap-4 rounded-xl border border-border bg-background p-5 shadow-sm"
                >
                  <div className="flex-shrink-0">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{diff.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{diff.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section-padding bg-muted">
        <div className="container-bwk">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Produtos em Destaque</h2>
              <p className="mt-2 text-muted-foreground">Os mais procurados pelos nossos clientes.</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/catalogo">
                Ver todos <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {productsLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum produto disponível no momento.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How to Buy Section */}
      <section className="section-padding bg-background">
        <div className="container-bwk">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Como Comprar</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Simples e rápido, para consumidores e empresas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 border border-border rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-lg">{step.title}</h4>
                <p className="text-sm text-muted-foreground mt-2">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h4 className="font-semibold text-lg mb-2">Para Consumidores</h4>
              <p className="text-muted-foreground text-sm mb-4">
                Navegue pelo catálogo, adicione ao carrinho e finalize a compra online.
              </p>
              <Button asChild>
                <Link to="/catalogo">Ir para o Catálogo</Link>
              </Button>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h4 className="font-semibold text-lg mb-2">Para Empresas</h4>
              <p className="text-muted-foreground text-sm mb-4">
                Solicite um orçamento personalizado via WhatsApp ou formulário.
              </p>
              <Button variant="secondary" asChild>
                <a href={siteConfig.contact.whatsapp} target="_blank" rel="noopener noreferrer">
                  {siteConfig.ctaQuoteText}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="container-bwk text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Pronto para começar?
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
            Entre em contato conosco ou navegue pelo catálogo para encontrar os melhores produtos.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/catalogo">Ver Catálogo</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground/60 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              asChild
            >
              <Link to="/contato">Fale Conosco</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
