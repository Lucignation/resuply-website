create extension if not exists pgcrypto;

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  phone text not null,
  city text not null,
  source text not null default 'landing_page',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists shoppers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  phone text not null,
  city text not null,
  status text not null default 'pending',
  source text not null default 'landing_page',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint shoppers_status_check check (
    status in ('pending', 'approved', 'rejected', 'inactive')
  )
);

create table if not exists markets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists markets_name_city_unique
  on markets (lower(name), lower(city));

create table if not exists shopper_markets (
  id uuid primary key default gen_random_uuid(),
  shopper_id uuid not null references shoppers(id) on delete cascade,
  market_id uuid not null references markets(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (shopper_id, market_id)
);

create table if not exists specialties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Other',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists specialties_name_unique
  on specialties (lower(name));

alter table specialties
  add column if not exists category text not null default 'Other';

create table if not exists shopper_market_specialties (
  id uuid primary key default gen_random_uuid(),
  shopper_market_id uuid not null references shopper_markets(id) on delete cascade,
  specialty_id uuid not null references specialties(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (shopper_market_id, specialty_id)
);

create table if not exists launch_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text not null,
  phone text not null,
  city text not null,
  role text not null,
  source text not null default 'landing_page',
  marketing_consent boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint launch_subscribers_role_check check (
    role in ('customer', 'shopper')
  )
);

create index if not exists customers_city_idx on customers (city);
create index if not exists shoppers_city_status_idx on shoppers (city, status);
create index if not exists markets_city_idx on markets (city);
create index if not exists specialties_name_idx on specialties (name);
create index if not exists specialties_category_idx on specialties (category);
create index if not exists shopper_markets_market_id_idx on shopper_markets (market_id);
create index if not exists shopper_market_specialties_specialty_id_idx
  on shopper_market_specialties (specialty_id);
create index if not exists launch_subscribers_role_idx on launch_subscribers (role);
