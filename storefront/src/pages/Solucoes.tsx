import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { useCategoryCollections } from "@/hooks/useCategoryCollections";
import { siteConfig } from "@/config/site";
import { buildContactMessage, buildWhatsappUrl } from "@/lib/whatsapp";

export default function SolucoesPage() {
  const { collections, loading } = useCategoryCollections();

  return (
    <Layout>
      <section className="section-padding bg-muted">
        <div className="container-bwk">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nossas Soluções</h1>
            <p className="text-lg text-muted-foreground">
              Produtos de qualidade para limpeza, organização e utilidades.
              Conheça nossas linhas e encontre o que você precisa.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {loading ? (
              // Skeleton loading state (same as Home page)
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
            ) : collections.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Carregando categorias...</p>
              </div>
            ) : (
              collections.map((collection) => (
                <CategoryCard
                  key={collection.handle}
                  handle={collection.handle}
                  title={collection.title}
                  description={collection.description}
                  imageUrl={collection.imageUrl}
                  imageAlt={collection.imageAlt}
                />
              ))
            )}
          </div>

          <div className="mt-12 text-center flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/catalogo">
                Ver Catálogo Completo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={buildWhatsappUrl(buildContactMessage())} target="_blank" rel="noreferrer noopener">
                {siteConfig.ctaQuoteText}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
