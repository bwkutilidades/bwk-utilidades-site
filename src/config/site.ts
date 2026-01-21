// Site configuration - all settings in one place
export const siteConfig = {
  name: "BWK Utilidades",
  description: "Insumos de limpeza, higiene e utilidades para empresas e consumidores",
  url: import.meta.env.VITE_SITE_URL || "https://bwkutilidades.com.br",
  
  contact: {
    whatsapp: import.meta.env.VITE_WHATSAPP_URL || "https://wa.me/5511999999999",
    phone: "(11) 99999-9999",
    email: "contato@bwkutilidades.com.br",
    address: {
      street: "Rua Exemplo, 123",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zip: "01000-000",
    },
    businessHours: "Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h",
  },
  
  social: {
    instagram: "https://instagram.com/bwk_utilidades",
    facebook: "https://facebook.com/bwkutilidades",
    linkedin: "",
  },
  
  api: {
    baseUrl: import.meta.env.VITE_API_URL || "/api",
  },
  
  navigation: {
    main: [
      { label: "Início", href: "/" },
      {
        label: "Soluções",
        href: "/solucoes",
        children: [
          { label: "Limpeza e Higiene", href: "/solucoes/limpeza-e-higiene" },
          { label: "Organização e Utilidades", href: "/solucoes/organizacao-e-utilidades" },
          { label: "Cozinha e Bar", href: "/solucoes/cozinha-e-bar" },
        ],
      },
      { label: "Para Empresas", href: "/b2b" },
      { label: "Licitações", href: "/licitacoes" },
      { label: "Catálogo", href: "/catalogo" },
      { label: "Sobre", href: "/sobre" },
      { label: "Contato", href: "/contato" },
    ],
    footer: [
      { label: "Entregas e Prazos", href: "/entregas" },
      { label: "Trocas e Devoluções", href: "/trocas-e-devolucoes" },
      { label: "Formas de Pagamento", href: "/pagamentos" },
      { label: "Política de Privacidade", href: "/privacidade" },
      { label: "Termos de Uso", href: "/termos" },
    ],
  },
  
  differentials: [
    { title: "Variedade", description: "Amplo catálogo de produtos para limpeza, higiene e utilidades" },
    { title: "Rapidez", description: "Entrega ágil para todo o Brasil" },
    { title: "Atendimento Consultivo", description: "Equipe especializada para ajudar na melhor escolha" },
    { title: "Qualidade", description: "Produtos selecionados com garantia de procedência" },
    { title: "Preços Competitivos", description: "Condições especiais para empresas e compras em volume" },
    { title: "Experiência", description: "Anos de mercado atendendo B2B, varejo e licitações" },
  ],
};

export type SiteConfig = typeof siteConfig;
