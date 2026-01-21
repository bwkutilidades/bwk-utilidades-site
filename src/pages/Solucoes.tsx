import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { categories } from "@/data/categories";
import { siteConfig } from "@/config/site";

export default function SolucoesPage() {
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
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/solucoes/${category.slug}`}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-x-0 top-0 h-1 bg-primary" aria-hidden="true" />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {category.name}
                  </h2>
                  <p className="text-muted-foreground mt-2 text-sm">
                    {category.description}
                  </p>
                  <span className="inline-flex items-center text-sm font-medium text-primary mt-4">
                    Ver produtos <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/catalogo">Ver Catálogo Completo</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={siteConfig.contact.whatsapp} target="_blank" rel="noopener noreferrer">
                Solicitar Orçamento
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
