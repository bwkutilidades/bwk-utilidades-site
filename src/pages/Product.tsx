import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Minus, Plus, Truck, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { apiClient } from "@/lib/api-client";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const { addItem } = useCart();
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const p = await apiClient.getProductBySlug(slug);
        setProduct(p);
        if (p) {
          const related = await apiClient.getRelatedProducts(p.id);
          setRelatedProducts(related);
          if (p.variants && p.variants.length > 0) {
            setSelectedVariant(p.variants[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    setQuantity(1);
  }, [slug]);
  
  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity, selectedVariant || undefined);
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }
  
  if (!product) {
    return (
      <Layout>
        <div className="container-bwk py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <Button asChild>
            <Link to="/catalogo">Voltar ao Catálogo</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container-bwk py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Início</Link>
          <span className="mx-2">/</span>
          <Link to="/catalogo" className="hover:text-primary">Catálogo</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-xl overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((img, i) => (
                  <div key={i} className="aspect-square bg-muted rounded-lg overflow-hidden border-2 border-transparent hover:border-primary cursor-pointer">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Details */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-foreground">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            <p className="text-muted-foreground mb-6">{product.description}</p>
            
            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Versão</label>
                <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants.map((v) => (
                      <SelectItem key={v.id} value={v.id} disabled={!v.inStock}>
                        {v.name} {!v.inStock && "(Indisponível)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Quantity */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Quantidade</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Add to Cart */}
            <Button
              size="lg"
              className="w-full mb-4"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.inStock ? "Adicionar ao Carrinho" : "Produto Indisponível"}
            </Button>
            
            {/* Shipping Info */}
            <div className="p-4 bg-muted rounded-lg flex items-start gap-3">
              <Truck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Entrega para todo o Brasil</p>
                <p className="text-xs text-muted-foreground">Frete calculado no checkout</p>
              </div>
            </div>
            
            {/* Specs */}
            {product.specs.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold mb-4">Especificações</h3>
                <dl className="space-y-2">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex justify-between text-sm py-2 border-b border-border">
                      <dt className="text-muted-foreground">{spec.label}</dt>
                      <dd className="font-medium">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
