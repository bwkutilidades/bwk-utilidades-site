# Operational Guide

## Quick Start - Desenvolvimento Local

### Pré-requisitos

- Node.js >= 20
- Credenciais Shopify Storefront API configuradas em `storefront/.env`

### Iniciar o Storefront

```bash
cd storefront
npm install    # primeira vez ou após mudanças em package.json
npm run dev    # inicia na porta 8080
```

### Portas utilizadas

| Serviço     | Porta | URL                          |
|-------------|-------|------------------------------|
| Storefront  | 8080  | http://localhost:8080        |

---

## Frontend (Storefront) com Shopify

O frontend está em `/storefront`. É uma aplicação Vite + React que consome a Shopify Storefront API.

### Variáveis de ambiente

1. Copie o exemplo:
   ```bash
   cp storefront/.env.example storefront/.env
   ```

2. Configure as variáveis em `storefront/.env`:

| Variável | Descrição |
|----------|-----------|
| `VITE_SHOPIFY_STORE_DOMAIN` | Domínio da loja (ex: `minha-loja.myshopify.com`) |
| `VITE_SHOPIFY_STOREFRONT_TOKEN` | Token da Storefront API |
| `VITE_SHOPIFY_API_VERSION` | Versão da API (ex: `2024-01`) |

### Como obter as credenciais Shopify

1. Acesse o **Admin do Shopify** → **Settings** → **Apps and sales channels**
2. Clique em **Develop apps** → **Create an app**
3. Dê um nome (ex: "BWK Storefront")
4. Em **Configuration**, clique em **Configure Storefront API scopes**
5. Marque: `unauthenticated_read_products`, `unauthenticated_read_product_listings`
6. Clique em **Install app**
7. Copie o **Storefront API access token**

### Commands

- `npm run dev`: Servidor de desenvolvimento (porta 8080)
- `npm run build`: Build para produção

---

## Como Testar com 1 Produto

### 1. Criar produto no Shopify

1. Acesse o **Admin do Shopify** → **Products** → **Add product**
2. Preencha **Title**, **Price**, **Description**
3. Faça upload de uma **imagem**
4. Em **Status**, selecione **Active**
5. Em **Sales channels**, marque **Online Store** ✓
6. Clique em **Save**

### 2. Aguardar sincronização

Aguarde 1-2 minutos para a API refletir as alterações.

### 3. Verificar no site

1. Abra http://localhost:8080
2. **Home**: Seção "Produtos em Destaque" deve mostrar o produto
3. **Catálogo**: Acesse `/catalogo` e verifique se o produto aparece

### Troubleshooting

| Problema | Solução |
|----------|---------|
| Produtos não aparecem | Verifique se estão publicados no canal "Online Store" |
| Erro de API | Confirme que o token Storefront está correto no `.env` |
| Console mostra erro | Verifique a versão da API (`VITE_SHOPIFY_API_VERSION`) |

---

## Testar o Checkout Shopify

O checkout redireciona diretamente para o Shopify (sem página intermediária).

### Passo a passo

1. **Adicionar produto ao carrinho**
   - Navegue para `/catalogo`
   - Clique em um produto e depois em "Adicionar ao Carrinho"

2. **Clicar em "Finalizar Compra"**
   - No drawer do carrinho ou na página `/carrinho`
   - Clique no botão "Finalizar Compra"

3. **Verificar redirecionamento**
   - O navegador deve abrir diretamente a URL do checkout Shopify
   - Formato: `https://<loja>.myshopify.com/checkouts/cn/...`
   - **NÃO** deve aparecer tela de "carrinho vazio" ou página intermediária

4. **Confirmar no Shopify Admin**
   - Se completar o pagamento: **Orders**
   - Se abandonar: **Settings → Checkout → Abandoned checkouts**

### Comportamento esperado

- ✅ Botão entra em estado de loading ("Processando...")
- ✅ UI do carrinho fica desabilitada durante o processo
- ✅ Redirect direto para checkout Shopify
- ✅ Carrinho local NÃO é limpo antes do redirect (evita "flash" de carrinho vazio)


## Deploy no Google Cloud Run (Backend - Legado)

> **Nota**: O backend Medusa não é mais necessário para o storefront após a migração para Shopify.

O backend Medusa está preparado para ser publicado no Cloud Run usando build automatizado do código-fonte.

### 📜 Documentação de Variáveis
Veja detalhes completos em [backend/CLOUD_RUN_ENV.md](file:///Users/kauanclaudinodossantos/Documents/Next%20Corporation/Clientes/Bwk%20Utilidades/bwk-utilidades-site-1/backend/CLOUD_RUN_ENV.md).

### 🚀 Comando de Deploy

Execute na raiz do monorepo:
```bash
gcloud run deploy bwk-medusa-api \
  --source backend \
  --region southamerica-east1 \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 2 \
  --memory 1Gi \
  --cpu 1
```


