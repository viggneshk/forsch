create extension if not exists pgcrypto;

create table if not exists public.content_entries (
  id text primary key,
  type text not null check (type in ('use-case', 'blog', 'article')),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  seo_title text,
  meta_description text,
  category text,
  published_at date,
  hero_label text,
  short_title text,
  cta text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_content_entries_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_content_entries_updated_at on public.content_entries;

create trigger set_content_entries_updated_at
before update on public.content_entries
for each row
execute function public.set_content_entries_updated_at();

create index if not exists content_entries_type_idx on public.content_entries(type);
create index if not exists content_entries_slug_idx on public.content_entries(slug);

alter table public.content_entries enable row level security;
