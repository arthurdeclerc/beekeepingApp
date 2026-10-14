-- HiveMind: queen details per hive, and editing hives.
-- Run once in the Supabase dashboard: SQL Editor > New query > paste > Run (after 002_hives.sql).

alter table public.hives
  add column queen_birth_year smallint check (queen_birth_year between 2000 and 2100),
  add column queen_breed      text    not null default '' check (char_length(queen_breed) <= 80),
  add column queen_marked     boolean not null default false,
  add column queen_clipped    boolean not null default false,
  add column queen_mated      boolean not null default false;

create policy "owner, administrators and contributors can edit hives" on public.hives
  for update to authenticated
  using (public.apiary_role_of(apiary_id) in ('owner', 'administrator', 'contributor'))
  with check (public.apiary_role_of(apiary_id) in ('owner', 'administrator', 'contributor'));

-- apiary_id can never be changed here (moving hives between apiaries comes later).
grant insert (queen_birth_year, queen_breed, queen_marked, queen_clipped, queen_mated)
  on public.hives to authenticated;
grant update (name, hive_type, notes, queen_birth_year, queen_breed, queen_marked, queen_clipped, queen_mated)
  on public.hives to authenticated;
