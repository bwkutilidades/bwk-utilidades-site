import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { apiClient } from "@/lib/api-client";
import { categories } from "@/data/categories";
import { siteConfig } from "@/config/site";
import type { Product, CategorySlug, ListProductsParams } from "@/lib/types";

export default function CatalogoPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const [search, setSearch] = useState(searchParams.get("busca") || "");
  const [category, setCategory] = useState<string>(searchParams.get("categoria") || "");
  const [sort, setSort] = useState<string>(searchParams.get("ordem") || "relevance");
  
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: ListProductsParams = {
        page,
        limit: 12,
        search: search || undefined,
        category: category as CategorySlug || undefined,
        sort: sort as ListProductsParams["sort"],
      };
      
      const result = await apiClient.listProducts(params);
      setProducts(result.data);
      setTotal(result.total);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, [page, search, category, sort]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    const params = new URLSearchParams();
    if (search) params.set("busca", search);
    if (category) params.set("categoria", category);
    if (sort !== "relevance") params.set("ordem", sort);
    setSearchParams(params);
  };
  
  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSort("relevance");
    setPage(1);
    setSearchParams({});
  };
  
  const hasFilters = search || category || sort !== "relevance";
  
  return (
    <Layout>
      <section className="section-padding bg-muted min-h-screen">
        <div className="container-bwk">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Catálogo</h1>
            <p className="text-muted-foreground">
              {total} produto{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Premium band (dark) */}
          <div className="mb-8 rounded-2xl bg-secondary text-secondary-foreground border border-secondary-foreground/10 p-6 md:p-7 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-primary" aria-hidden="true" />
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-secondary-foreground/75">Atendimento consultivo</p>
                <h2 className="text-xl md:text-2xl font-bold">Precisa de orçamento ou compra em volume?</h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild>
                  <a href={siteConfig.contact.whatsapp} target="_blank" rel="noopener noreferrer">
                    Falar no WhatsApp
                  </a>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="border-secondary-foreground/40 text-secondary-foreground hover:bg-secondary-foreground/10"
                >
                  <a href={siteConfig.contact.whatsapp} target="_blank" rel="noopener noreferrer">
                    Solicitar cotação
                  </a>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Filters Bar */}
          <div className="bg-card border border-border rounded-xl p-4 mb-8">
            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar produtos..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Select value={category || "all"} onValueChange={(v) => { setCategory(v === "all" ? "" : v); setPage(1); }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={sort} onValueChange={(v) => { setSort(v); setPage(1); }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevância</SelectItem>
                    <SelectItem value="price-asc">Menor Preço</SelectItem>
                    <SelectItem value="price-desc">Maior Preço</SelectItem>
                    <SelectItem value="name">Nome A-Z</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button type="submit">Buscar</Button>
                
                {hasFilters && (
                  <Button type="button" variant="ghost" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" /> Limpar
                  </Button>
                )}
              </div>
            </form>
          </div>
          
          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Nenhum produto encontrado.</p>
              {hasFilters && (
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Limpar Filtros
                </Button>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          {/* Load More */}
          {products.length < total && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setPage((p) => p + 1)}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Carregar Mais
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
