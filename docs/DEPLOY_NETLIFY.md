# Deploy no Netlify + Shopify

Guia oficial de deploy do storefront BWK no Netlify com Shopify como backend de e-commerce.

---

## 1. Importar Repositório no Netlify

1. Acesse [app.netlify.com](https://app.netlify.com)
2. Clique em **"Add new site"** → **"Import an existing project"**
3. Conecte sua conta GitHub e selecione o repositório `bwk-utilidades-site-1`
4. O Netlify detectará automaticamente as configurações do `netlify.toml`

### Configuração Automática (via netlify.toml)

O arquivo `netlify.toml` na raiz já configura:

| Campo | Valor |
|-------|-------|
| **Base directory** | `storefront` |
| **Build command** | `npm ci && npm run build` |
| **Publish directory** | `dist` |
| **SPA Redirect** | `/* → /index.html` (status 200) |

---

## 2. Variáveis de Ambiente

Em **Site settings → Environment variables**, adicione:

| Variable | Value | Exemplo |
|----------|-------|---------|
| `VITE_SHOPIFY_STORE_DOMAIN` | Seu domínio Shopify | `bwk-utilidades.myshopify.com` |
| `VITE_SHOPIFY_STOREFRONT_TOKEN` | Token da Storefront API | `shpat_xxx...` |
| `VITE_SHOPIFY_API_VERSION` | Versão da API | `2024-01` |

> ⚠️ **Importante**: Use o token **PUBLIC** da Storefront API, não o Admin token.

### Como obter o token Shopify

1. Shopify Admin → **Settings** → **Apps and sales channels**
2. Clique em **Develop apps** → **Create an app**
3. Em **Configuration**, ative **Storefront API**
4. Marque os scopes: `unauthenticated_read_products`, `unauthenticated_read_product_listings`
5. Instale o app e copie o **Storefront API access token**

---

## 3. Verificação Pós-Deploy

Após o deploy, verifique:

| Rota | Esperado |
|------|----------|
| `/` | Home carrega com categorias e produtos em destaque |
| `/catalogo` | Lista produtos do Shopify |
| `/catalogo?collection=limpeza-e-higiene` | Filtra por collection |
| Refresh em `/catalogo` | Não dá 404 (SPA redirect funcionando) |
| Checkout | Redireciona para `*.myshopify.com/checkouts/...` |

### Testar o Checkout

1. Adicione um produto ao carrinho
2. Clique em "Finalizar Compra"
3. Deve redirecionar diretamente para o checkout do Shopify
4. URL no formato: `https://<loja>.myshopify.com/checkouts/cn/...`

---

## 4. Domínio Personalizado

### No Netlify

1. **Site settings** → **Domain management** → **Add custom domain**
2. Adicione: `www.seudominio.com.br` e `seudominio.com.br`

### No seu DNS

Configure os registros:

| Tipo | Nome | Valor |
|------|------|-------|
| **A** | `@` | IP fornecido pelo Netlify |
| **CNAME** | `www` | `<seu-site>.netlify.app` |

O Netlify gera automaticamente o certificado SSL.

---

## 5. Redeploy

- **Automático**: Push para a branch `main`
- **Manual**: Netlify Dashboard → **Deploys** → **Trigger deploy**

---

## Troubleshooting

| Problema | Solução |
|----------|---------|
| Produtos não aparecem | Verifique env vars no Netlify e se produtos estão publicados no Shopify |
| 404 em refresh | Verifique se `netlify.toml` tem o redirect `/* → /index.html` |
| Checkout não redireciona | Verifique token Shopify e se produtos têm variants válidos |
