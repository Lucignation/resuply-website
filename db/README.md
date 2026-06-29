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
CONTACT_NOTIFICATION_EMAIL="support@useresuply.com"
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

- `customers`: people who want to shop with ReSuply, including likely first purchase intent
- `shoppers`: people applying to earn as personal shoppers, including the place they know well
- `markets`: market/store catalog
- `shopper_markets`: shopper-to-market categorization
- `specialties`: item types shoppers are good at buying, grouped by category
- `shopper_market_specialties`: market-specific shopper specialties
- `launch_subscribers`: launch email audience with role-specific signup context

## Example shopper query

Fetch shoppers by city, market, item, or category:

```sql
select
  s.full_name,
  s.email,
  s.phone,
  s.city,
  m.name as market_name,
  sp.name as specialty_name,
  sp.category as specialty_category
from shoppers s
join shopper_markets sm on sm.shopper_id = s.id
join markets m on m.id = sm.market_id
join shopper_market_specialties sms on sms.shopper_market_id = sm.id
join specialties sp on sp.id = sms.specialty_id
where s.status = 'pending'
  and lower(s.city) = lower('Lagos')
  and lower(m.name) = lower('Mile 12 Market')
  and lower(sp.category) = lower('Produce')
order by s.created_at desc;
```
