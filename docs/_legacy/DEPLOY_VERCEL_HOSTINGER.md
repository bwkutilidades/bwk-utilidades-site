# Deploy no Vercel + DNS Hostinger

Guia completo para deploy do storefront BWK no Vercel com domínio gerenciado pela Hostinger.

---

## 1. Criar Projeto no Vercel

### 1.1 Importar Repositório

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Conecte sua conta GitHub
3. Selecione o repositório `bwk-utilidades-site-1`
4. **IMPORTANTE**: Configure o Root Directory

### 1.2 Configurar Build

| Campo | Valor |
|-------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `storefront` ← clique em "Edit" e digite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm ci` |

### 1.3 Variáveis de Ambiente

Clique em **"Environment Variables"** e adicione:

| Variable | Value | Environment |
|----------|-------|-------------|
| `VITE_SHOPIFY_STORE_DOMAIN` | `sua-loja.myshopify.com` | Production, Preview |
| `VITE_SHOPIFY_STOREFRONT_TOKEN` | `shpat_xxx...` | Production, Preview |
| `VITE_SHOPIFY_API_VERSION` | `2024-01` | Production, Preview |

> ⚠️ **Use o token PUBLIC da Storefront API**, não o Admin token.

### 1.4 Deploy

Clique em **"Deploy"** e aguarde ~2 minutos.

---

## 2. Configurar Domínio Customizado

### 2.1 No Vercel

1. Vá em **Settings → Domains**
2. Adicione seu domínio: `www.seudominio.com.br`
3. Adicione também: `seudominio.com.br` (apex)
4. O Vercel vai mostrar os registros DNS necessários

### 2.2 Na Hostinger

Acesse **Domínios → Gerenciar → Zona DNS** e configure:

#### Para o apex (seudominio.com.br):

| Tipo | Nome | Valor | TTL |
|------|------|-------|-----|
| **A** | `@` | `76.76.21.21` | 3600 |

#### Para www:

| Tipo | Nome | Valor | TTL |
|------|------|-------|-----|
| **CNAME** | `www` | `cname.vercel-dns.com` | 3600 |

> 💡 Se o Vercel mostrar IPs diferentes, use os IPs que ele mostrar.

### 2.3 Aguardar Propagação

- DNS pode levar até 48h para propagar globalmente
- Geralmente funciona em 10-30 minutos
- Verifique em: https://dnschecker.org

---

## 3. Configurar HTTPS

O Vercel gera automaticamente certificado SSL gratuito via Let's Encrypt.

Em **Settings → Domains**, verifique se aparece:
- ✅ Valid Configuration
- ✅ SSL Certificate: Active

---

## 4. Checklist Pós-Deploy

Após o deploy, verifique:

- [ ] **Home** (`/`) — Carrega sem erros
- [ ] **Catálogo** (`/catalogo`) — Produtos aparecem
- [ ] **Produto** (`/produto/{slug}`) — Refresh funciona (não dá 404)
- [ ] **Carrinho** (`/carrinho`) — Adicionar produto funciona
- [ ] **Checkout** — Clique em "Finalizar" redireciona para Shopify
- [ ] **Console** — Sem erros de CORS ou API

---

## 5. Troubleshooting

### 404 ao dar refresh em rotas

**Causa**: SPA rewrite não está funcionando.

**Solução**: Verifique que `storefront/vercel.json` existe e contém:
```json
{
  "rewrites": [
    {
      "source": "/((?!assets/).*)",
      "destination": "/index.html"
    }
  ]
}
```

### Produtos não aparecem

**Causas possíveis**:
1. Variáveis de ambiente não configuradas no Vercel
2. Token incorreto ou expirado
3. Produtos não publicados no Shopify

**Verificar**:
- Vercel → Settings → Environment Variables
- Shopify Admin → Products → Status = Active
- Shopify Admin → Products → Sales Channels = Online Store ✓

### CORS Error

**Causa**: Domínio não permitido na Storefront API.

**Solução**: A Storefront API não tem restrições de CORS por padrão. Verifique se o token está correto.

---

## 6. Redeploy

Para forçar um novo deploy:

1. **Via Vercel Dashboard**: Deployments → Redeploy
2. **Via Git**: Faça commit e push para `main`

---

## Resumo de Configurações

| Item | Valor |
|------|-------|
| Root Directory | `storefront` |
| Framework | Vite |
| Build Command | `npm run build` |
| Output | `dist` |
| Node Version | 20.x |
