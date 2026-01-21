import { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "limpeza-e-higiene",
    name: "Limpeza e Higiene",
    description: "Produtos essenciais para limpeza profissional e doméstica. Baldes, vassouras, rodos, esponjas e muito mais.",
  },
  {
    slug: "organizacao-e-utilidades",
    name: "Organização e Utilidades",
    description: "Soluções práticas para organizar ambientes residenciais e comerciais. Suportes, organizadores e acessórios.",
  },
  {
    slug: "cozinha-e-bar",
    name: "Cozinha e Bar",
    description: "Utensílios de qualidade para cozinhas profissionais, bares e restaurantes. Copos, facas e acessórios.",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
