import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Building2, ShoppingBag, FileText, Package, Truck, Headset, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { siteConfig } from "@/config/site";
import { categories } from "@/data/categories";
import { getFeaturedProducts } from "@/data/products";

const featuredProducts = getFeaturedProducts();

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
      <section id="inicio" className="relative bg-muted overflow-hidden border-b border-border scroll-mt-24">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-[0.04] bg-cover bg-center" />
        <div className="container-bwk py-20 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-fade-in">
              Insumos de{" "}
              <span className="text-primary">limpeza e higiene</span>
              <br />+ utilidades para empresas e consumidores
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl animate-fade-in" style={{ animationDelay: "0.1s" }}>
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
              <Button size="lg" variant="outline" asChild className="text-base">
                <a href={siteConfig.contact.whatsapp} target="_blank" rel="noopener noreferrer">
                  Pedir Orçamento
                </a>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
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
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/solucoes/${category.slug}`}
                className="group relative overflow-hidden rounded-xl bg-card border border-border aspect-[4/3] flex items-end p-6 hover:border-primary hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-primary" aria-hidden="true" />
                <div className="relative z-20">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{category.description}</p>
                </div>
              </Link>
            ))}
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
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
                  Solicitar Orçamento
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
