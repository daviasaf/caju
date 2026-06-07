# CAJU / vistacaju — Ecommerce Nuxt UI

Loja ecommerce da **CAJU / vistacaju**, feita com Nuxt 4, Nuxt UI, Prisma e PostgreSQL/Supabase. O projeto não possui carrinho, checkout ou login de cliente: a compra acontece por WhatsApp com mensagem pronta a partir da página do produto.

## Stack

- Nuxt 4
- Vue 3
- TypeScript
- Nuxt UI v4
- Prisma
- PostgreSQL/Supabase
- Zod
- Sharp
- Upload local em desenvolvimento
- Vercel Blob em produção
- Deploy recomendado na Vercel

## Rotas públicas

- `/` — home editorial com produto e coleção em destaque
- `/produtos` — catálogo com filtros
- `/produtos/[slug]` — página de produto com seleção de tamanho, cor e quantidade
- `/colecoes` — listagem de coleções
- `/colecoes/[slug]` — coleção com produtos vinculados
- `/sobre` — apresentação da marca
- `/contato` — WhatsApp e Instagram

## Rotas admin

- `/admin/login` — login com `ADMIN_PASSWORD`
- `/admin` — dashboard
- `/admin/produtos` — produtos
- `/admin/categorias` — categorias
- `/admin/colecoes` — coleções
- `/admin/configuracoes` — home, SEO, WhatsApp, textos e destaques

## Instalação

```bash
pnpm install
```

Depois gere o Prisma Client:

```bash
pnpm prisma:generate
```

## Variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Configure:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"

ADMIN_PASSWORD="troque-esta-senha"
SESSION_SECRET="gere-uma-chave-forte-com-32-caracteres-ou-mais"

NUXT_PUBLIC_SITE_NAME="CAJU"
NUXT_PUBLIC_SITE_URL="http://localhost:3000"

UPLOAD_PROVIDER="local"
BLOB_ACCESS="public"
BLOB_STORE_ID=""
BLOB_READ_WRITE_TOKEN=""
BLOB_WEBHOOK_PUBLIC_KEY=""
```

Nunca coloque credenciais reais no `.env.example`.

## Banco de dados com Supabase/PostgreSQL

1. Crie um projeto no Supabase.
2. Copie a connection string PostgreSQL.
3. Preencha `DATABASE_URL` no `.env`.
4. Rode:

```bash
pnpm prisma:push
pnpm db:seed
```

## Upload de imagens

### Local

Para desenvolvimento:

```env
UPLOAD_PROVIDER="local"
```

As imagens serão otimizadas com Sharp, convertidas para WebP e salvas em:

```txt
public/uploads/products
```

### Vercel Blob

Para produção/serverless:

```bash
pnpm add @vercel/blob
```

Na Vercel, crie/configure um Blob Store e adicione:

```env
UPLOAD_PROVIDER="vercel-blob"
BLOB_ACCESS="public"
BLOB_STORE_ID="id-do-store"
BLOB_READ_WRITE_TOKEN="opcional-quando-usar-store-antigo-com-token"
BLOB_WEBHOOK_PUBLIC_KEY="chave-publica-do-webhook-se-houver"
```

A API sempre retorna um caminho utilizavel da imagem em WebP. Para loja publica, prefira criar o Blob Store como `Public` e manter `BLOB_ACCESS="public"`. Se o Store ja foi criado como `Private`, use `BLOB_ACCESS="private"` ou deixe o sistema tentar esse modo automaticamente; nesse caso as imagens passam por `/api/blob`.

Se `UPLOAD_PROVIDER` nao for definido, o projeto usa Blob automaticamente quando encontrar `BLOB_READ_WRITE_TOKEN` ou `BLOB_STORE_ID`. Stores novos da Vercel podem autenticar por OIDC sem token longo; nesse caso, mantenha o Blob Store conectado ao projeto e nao precisa criar `BLOB_READ_WRITE_TOKEN`. Em stores antigos, use `BLOB_READ_WRITE_TOKEN`.

## Rodando localmente

```bash
pnpm dev
```

Acesse:

- Loja: `http://localhost:3000`
- Admin: `http://localhost:3000/admin/login`

## Comandos úteis

```bash
pnpm prisma:generate
pnpm prisma:push
pnpm db:seed
pnpm typecheck
pnpm build
```

## Fluxo de compra

1. Cliente abre um produto.
2. Escolhe tamanho.
3. Escolhe cor/variação.
4. Escolhe quantidade.
5. Clica em **Comprar pelo WhatsApp**.
6. O site chama `/api/whatsapp-url` e abre o WhatsApp com uma mensagem pronta.

## Deploy na Vercel

Checklist:

- Configurar `DATABASE_URL`.
- Configurar `ADMIN_PASSWORD`.
- Configurar `SESSION_SECRET` com 32 caracteres ou mais.
- Configurar `NUXT_PUBLIC_SITE_URL` com a URL final.
- Configurar `UPLOAD_PROVIDER="vercel-blob"`.
- Configurar `BLOB_ACCESS="public"` para Store publico ou `"private"` para Store privado.
- Configurar `BLOB_STORE_ID`.
- Configurar `BLOB_READ_WRITE_TOKEN` apenas se o Blob Store antigo gerar token read-write.
- Configurar `BLOB_WEBHOOK_PUBLIC_KEY` quando o store gerar webhook.
- Rodar `pnpm prisma:generate` no build.

## Checklist de produção

- [ ] `.env.example` sem credenciais reais
- [ ] Produto destaque configurado
- [ ] Coleção destaque configurada
- [ ] WhatsApp correto
- [ ] SEO preenchido
- [ ] Upload testado com Vercel Blob
- [ ] `pnpm typecheck` sem erro
- [ ] `pnpm build` sem erro
