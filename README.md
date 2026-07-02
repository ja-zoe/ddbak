# Decorative Designs by AK

E-commerce site for Decorative Designs by AK, a custom decor business. Customers browse product categories, view products with image carousels, and build a shopping cart; all content is managed through a headless CMS.

## Structure

- **client/** - Next.js storefront (App Router, Tailwind CSS)
  - Home page with hero, product category sections, and gallery
  - Product category and product detail pages
  - Shopping cart with a React context provider
- **cms/** - [Payload CMS](https://payloadcms.com/) on Postgres
  - Collections: products, product categories, gallery pictures, media, users

## Running it

**CMS:**

```bash
cd cms
cp .env.example .env   # set DATABASE_URI + PAYLOAD_SECRET
pnpm install
pnpm dev               # admin panel at http://localhost:3000/admin
```

A `docker-compose.yml` in `cms/` can stand up the database.

**Storefront:**

```bash
cd client
pnpm install
pnpm dev
```
