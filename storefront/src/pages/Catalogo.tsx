import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { apiClient } from "@/lib/api-client";
import { getProductsByCollectionHandle, getCategoryLabel, validateCatalogCoverage } from "@/lib/shopify";
import { categories } from "@/data/categories";
import { siteConfig } from "@/config/site";
import type { Product, CategorySlug, ListProductsParams } from "@/lib/types";

const PRODUCTS_PER_PAGE = 24;

function mergeUniqueProducts(current: Product[], incoming: Product[]): Product[] {
  const productsById = new Map<string, Product>();

  for (const product of current) {
    productsById.set(product.id, product);
  }

  for (const product of incoming) {
    productsById.set(product.id, product);
  }

  return Array.from(productsById.values());
}

function sortProducts(products: Product[], sort: ListProductsParams["sort"]): Product[] {
  switch (sort) {
    case "price-asc":
      return [...products].sort((a, b) => a.price - b.price);
    case "price-desc":
      return [...products].sort((a, b) => b.price - a.price);
    case "name":
      return [...products].sort((a, b) => a.name.localeCompare(b.name));
    default:
      return products;
  }
}

export default function CatalogoPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);

  // Read collection from URL (for category filtering via Shopify Collections)
  const collectionHandle = searchParams.get("collection") || "";
  const collectionLabel = collectionHandle ? getCategoryLabel(collectionHandle) : null;

  const [search, setSearch] = useState(searchParams.get("busca") || "");
  const [category, setCategory] = useState<string>(searchParams.get("categoria") || "");
  const [sort, setSort] = useState<string>(searchParams.get("ordem") || "relevance");
  const coverageValidationRanRef = useRef(false);

  /**
   * Fetch products — either from a specific collection or from all products.
   * When `append` is true, new results are appended (for "load more").
   */
  const fetchProducts = useCallback(async (opts: { append?: boolean; cursor?: string | null } = {}) => {
    const { append = false, cursor = null } = opts;

    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      // If filtering by Shopify collection
      if (collectionHandle) {
        const result = await getProductsByCollectionHandle(
          collectionHandle,
          PRODUCTS_PER_PAGE,
          cursor || undefined,
        );

        const applyCollectionFilters = (items: Product[]) => {
          if (!search) {
            return sortProducts(items, sort as ListProductsParams["sort"]);
          }

          const searchLower = search.toLowerCase();
          const filteredItems = items.filter(
            (p) =>
              p.name.toLowerCase().includes(searchLower) ||
              p.description.toLowerCase().includes(searchLower)
          );

          return sortProducts(filteredItems, sort as ListProductsParams["sort"]);
        };

        if (append) {
          setProducts((prev) => applyCollectionFilters(mergeUniqueProducts(prev, result.products)));
        } else {
          setProducts(applyCollectionFilters(result.products));
        }

        setHasNextPage(result.hasNextPage);
        setEndCursor(result.endCursor);
      } else {
        // All products via cursor-based pagination
        const params: ListProductsParams = {
          limit: PRODUCTS_PER_PAGE,
          search: search || undefined,
          category: category as CategorySlug || undefined,
          sort: sort as ListProductsParams["sort"],
          after: cursor || undefined,
        };

        const result = await apiClient.listProducts(params);

        if (append) {
          setProducts((prev) =>
            sortProducts(
              mergeUniqueProducts(prev, result.data),
              sort as ListProductsParams["sort"],
            ),
          );
        } else {
          setProducts(sortProducts(result.data, sort as ListProductsParams["sort"]));
        }
        setHasNextPage(result.hasNextPage ?? false);
        setEndCursor(result.endCursor ?? null);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      if (!append) {
        setProducts([]);
      }
      setHasNextPage(false);
      setEndCursor(null);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [collectionHandle, search, category, sort]);

  // Initial load & re-fetch when filters change
  useEffect(() => {
    setEndCursor(null);
    setHasNextPage(false);
    fetchProducts({ append: false, cursor: null });
  }, [fetchProducts]);

  useEffect(() => {
    if (!import.meta.env.DEV || collectionHandle || coverageValidationRanRef.current) {
      return;
    }

    coverageValidationRanRef.current = true;
    void validateCatalogCoverage();
  }, [collectionHandle]);

  const handleLoadMore = () => {
    if (endCursor && hasNextPage) {
      fetchProducts({ append: true, cursor: endCursor });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (collectionHandle) params.set("collection", collectionHandle);
    if (search) params.set("busca", search);
    if (category) params.set("categoria", category);
    if (sort !== "relevance") params.set("ordem", sort);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSort("relevance");
    // Keep collection if it exists
    if (collectionHandle) {
      setSearchParams({ collection: collectionHandle });
    } else {
      setSearchParams({});
    }
  };

  const clearCollection = () => {
    setSearch("");
    setCategory("");
    setSort("relevance");
    setSearchParams({});
  };

  const hasFilters = search || category || sort !== "relevance";

  return (
    <Layout>
      <section className="section-padding bg-muted min-h-screen">
        <div className="container-bwk">
          <div className="mb-8">
            {collectionLabel ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Button variant="ghost" size="sm" onClick={clearCollection} className="p-0 h-auto">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Voltar ao catálogo
                  </Button>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{collectionLabel}</h1>
              </>
            ) : (
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Catálogo</h1>
            )}
            <p className="text-muted-foreground">
              {products.length} produto{products.length !== 1 ? "s" : ""} encontrado{products.length !== 1 ? "s" : ""}
              {hasNextPage ? " (mais disponíveis)" : ""}
            </p>
          </div>

          {/* Premium band (dark) */}
          <div className="mb-8 rounded-2xl bg-secondary text-secondary-foreground p-6 md:p-7 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-primary" aria-hidden="true" />
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-secondary-foreground/75">Atendimento consultivo</p>
                <h2 className="text-xl md:text-2xl font-bold">Precisa de orçamento ou compra em volume?</h2>
              </div>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 w-fit">
                <a href={siteConfig.contact.whatsapp} target="_blank" rel="noopener noreferrer">
                  {siteConfig.ctaQuoteText}
                </a>
              </Button>
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
                {/* Only show category filter when not in collection mode */}
                {!collectionHandle && (
                  <Select value={category || "all"} onValueChange={(v) => { setCategory(v === "all" ? "" : v); }}>
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
                )}

                <Select value={sort} onValueChange={(v) => { setSort(v); }}>
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
              <p className="text-muted-foreground text-lg">
                {collectionHandle
                  ? "Nenhum produto nessa categoria ainda…"
                  : "Nenhum produto encontrado."}
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                {hasFilters
                  ? "Tente ajustar seus filtros de busca."
                  : collectionHandle
                    ? "Essa collection ainda não tem produtos associados no Shopify."
                    : "Verifique se os produtos estão publicados no Shopify."}
              </p>
              {hasFilters && (
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Limpar Filtros
                </Button>
              )}
              {collectionHandle && !hasFilters && (
                <Button variant="outline" onClick={clearCollection} className="mt-4">
                  Ver todos os produtos
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
          {hasNextPage && !loading && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Carregar Mais
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
