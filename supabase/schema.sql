-- Run this once in Supabase: Dashboard → SQL Editor → New query → paste → Run.

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null check (char_length(full_name) between 2 and 100),
  phone text not null check (char_length(phone) between 7 and 25),
  attending boolean not null,
  guests int not null default 1 check (guests between 0 and 10),
  message text check (message is null or (char_length(message) <= 500 and message !~* '(https?://|www\.)'))
);

create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 80),
  message text not null check (char_length(message) between 5 and 500 and message !~* '(https?://|www\.)'),
  approved boolean not null default false
);

alter table public.rsvps  enable row level security;
alter table public.wishes enable row level security;

-- Guests (anon key) may ONLY add RSVPs. They can never read them (phone numbers stay private).
create policy "anyone can rsvp" on public.rsvps for insert to anon with check (true);

-- Guests may add wishes, but only as unapproved; and may only READ approved wishes.
create policy "anyone can submit a wish" on public.wishes for insert to anon with check (approved = false);
create policy "anyone can read approved wishes" on public.wishes for select to anon using (approved = true);

-- Tighten privileges to the minimum.
revoke all on public.rsvps  from anon;
revoke all on public.wishes from anon;
grant insert on public.rsvps  to anon;
grant insert on public.wishes to anon;
grant select (name, message, approved, created_at) on public.wishes to anon;
