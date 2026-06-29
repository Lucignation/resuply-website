# ReSuply Database Setup

Use a Neon Postgres project/database named `resuply_core`.

## 1. Create the database

1. Create a free Neon project.
2. Copy the unpooled connection string.
3. Add it to `.env.local`:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST/resuply_core?sslmode=require"
RESEND_API_KEY="re_xxxxxxxxx"
EMAIL_FROM="ReSuply <hello@useresuply.com>"
SIGNUP_NOTIFICATION_EMAIL="resuplytech@gmail.com"
```

## 2. Run the schema

Run this from the project root after replacing `DATABASE_URL`:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

## 3. Export before launch migration

Use an unpooled connection string for exports:

```bash
pg_dump -Fc -v -d "$DATABASE_URL" -f resuply_core.bak
```

Restore into the launch database:

```bash
pg_restore -v -O -d "$NEW_DATABASE_URL" resuply_core.bak
```

## Tables

- `customers`: people who want to shop with ReSuply
- `shoppers`: people applying to become shoppers
- `markets`: market/store catalog
- `shopper_markets`: shopper-to-market categorization
- `launch_subscribers`: launch email audience
