-- HiveMind: hives, each assigned to exactly one apiary.
-- Run once in the Supabase dashboard: SQL Editor > New query > paste > Run (after 001_apiaries.sql).

create table public.hives (
  id         uuid primary key default gen_random_uuid(),
  apiary_id  uuid not null references public.apiaries (id) on delete cascade,
  name       text not null check (char_length(btrim(name)) between 1 and 80),
  hive_type  text not null default 'other'
             check (hive_type in ('dadant', 'langstroth', 'simplex', 'warre', 'top_bar', 'other')),
  notes      text not null default '' check (char_length(notes) <= 2000),
  created_at timestamptz not null default now(),
  unique (apiary_id, name)
);

create index hives_apiary_id_idx on public.hives (apiary_id);

alter table public.hives enable row level security;

create policy "members can read hives" on public.hives
  for select to authenticated
  using (public.is_apiary_member(apiary_id));

create policy "owner, administrators and contributors can add hives" on public.hives
  for insert to authenticated
  with check (public.apiary_role_of(apiary_id) in ('owner', 'administrator', 'contributor'));

grant select on public.hives to authenticated;
grant insert (apiary_id, name, hive_type, notes) on public.hives to authenticated;
