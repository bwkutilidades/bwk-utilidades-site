import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCategoryBySlug } from "@/data/categories";

/**
 * Category page - redirects to catalog with collection filter
 * 
 * This page previously used local mock data. Now it redirects to the
 * catalog page with the appropriate Shopify collection filter.
 */
export default function CategoryPage() {
  const { categoria } = useParams<{ categoria: string }>();
  const navigate = useNavigate();
  const category = categoria ? getCategoryBySlug(categoria) : undefined;

  useEffect(() => {
    if (categoria) {
      // Redirect to catalog with collection filter
      navigate(`/catalogo?collection=${categoria}`, { replace: true });
    } else {
      navigate("/catalogo", { replace: true });
    }
  }, [categoria, navigate]);

  // Show minimal loading state during redirect
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Redirecionando...</p>
    </div>
  );
}
