import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { getCategoryBySlug } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";

export default function CategoryPage() {
  const { categoria } = useParams<{ categoria: string }>();
  const category = categoria ? getCategoryBySlug(categoria) : undefined;
  const products = categoria ? getProductsByCategory(categoria) : [];
  
  if (!category) {
    return (
      <Layout>
        <div className="container-bwk py-20 text-center">
          <h1 className="text-2xl font-bold">Categoria não encontrada</h1>
          <Button asChild className="mt-4">
            <Link to="/solucoes">Ver todas as soluções</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <section className="section-padding bg-muted">
        <div className="container-bwk">
          <div className="max-w-3xl mb-12">
            <nav className="text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-primary">Início</Link>
              <span className="mx-2">/</span>
              <Link to="/solucoes" className="hover:text-primary">Soluções</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{category.name}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
            <p className="text-lg text-muted-foreground">{category.description}</p>
          </div>
          
          {products.length > 0 ? (
            <>
              <h2 className="text-2xl font-semibold mb-6">Principais Itens</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">Nenhum produto encontrado nesta categoria.</p>
          )}
          
          <div className="text-center pt-8 border-t border-border">
            <p className="text-muted-foreground mb-4">Quer ver todos os produtos desta categoria?</p>
            <Button asChild>
              <Link to={`/catalogo?categoria=${categoria}`}>
                Ver no Catálogo <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
