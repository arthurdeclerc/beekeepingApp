-- HiveMind: apiaries + members with role-based access (Row Level Security).
-- Run once in the Supabase dashboard: SQL Editor > New query > paste > Run.
-- Safe to re-run? No. Run it once on a fresh project.

-- 1. Roles ---------------------------------------------------------------
create type public.apiary_role as enum ('owner', 'administrator', 'contributor', 'read_only');

-- 2. Tables --------------------------------------------------------------
create table public.apiaries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(btrim(name)) between 1 and 80),
  address    text not null default '' check (char_length(address) <= 200),
  notes      text not null default '' check (char_length(notes) <= 2000),
  owner_id   uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.apiary_members (
  apiary_id  uuid not null references public.apiaries (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  role       public.apiary_role not null,
  created_at timestamptz not null default now(),
  primary key (apiary_id, user_id)
);

create index apiary_members_user_id_idx on public.apiary_members (user_id);

alter table public.apiaries enable row level security;
alter table public.apiary_members enable row level security;

-- 3. Helper functions ----------------------------------------------------
-- security definer so the policies can look at apiary_members without recursing into its own RLS.
create function public.is_apiary_member(target uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.apiary_members
    where apiary_id = target and user_id = (select auth.uid())
  );
$$;

create function public.apiary_role_of(target uuid)
returns public.apiary_role
language sql stable security definer set search_path = ''
as $$
  select role from public.apiary_members
  where apiary_id = target and user_id = (select auth.uid());
$$;

-- The creator of an apiary automatically becomes its owner.
create function public.add_owner_as_member()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.apiary_members (apiary_id, user_id, role)
  values (new.id, new.owner_id, 'owner');
  return new;
end;
$$;

create trigger apiaries_add_owner
after insert on public.apiaries
for each row execute function public.add_owner_as_member();

revoke execute on function public.is_apiary_member(uuid) from public, anon;
revoke execute on function public.apiary_role_of(uuid) from public, anon;
revoke execute on function public.add_owner_as_member() from public, anon, authenticated;
grant execute on function public.is_apiary_member(uuid) to authenticated;
grant execute on function public.apiary_role_of(uuid) to authenticated;

-- 4. Row Level Security policies -----------------------------------------
-- apiaries: members can read. "owner_id = me" is needed so the row can be returned right after
-- INSERT (the membership row is only added by the trigger afterwards).
create policy "members can read apiaries" on public.apiaries
  for select to authenticated
  using (owner_id = (select auth.uid()) or public.is_apiary_member(id));

create policy "users can create their own apiaries" on public.apiaries
  for insert to authenticated
  with check (owner_id = (select auth.uid()));

create policy "owner and administrators can update apiaries" on public.apiaries
  for update to authenticated
  using (public.apiary_role_of(id) in ('owner', 'administrator'))
  with check (public.apiary_role_of(id) in ('owner', 'administrator'));

create policy "only the owner can delete an apiary" on public.apiaries
  for delete to authenticated
  using (owner_id = (select auth.uid()));

-- apiary_members: read-only from the app for now (inviting people comes in a later step).
create policy "members can see the members of their apiaries" on public.apiary_members
  for select to authenticated
  using (public.is_apiary_member(apiary_id));

-- 5. Table privileges (tables are not exposed automatically) --------------
grant select on public.apiaries to authenticated;
grant insert (name, address, notes) on public.apiaries to authenticated;  -- owner_id comes from auth.uid()
grant update (name, address, notes) on public.apiaries to authenticated;  -- owner_id can never be changed
grant delete on public.apiaries to authenticated;
grant select on public.apiary_members to authenticated;

-- 6. View the app reads from: my apiaries including my own role ----------
create view public.my_apiaries with (security_invoker = true) as
  select a.id, a.name, a.address, a.notes, a.created_at, m.role
  from public.apiaries a
  join public.apiary_members m on m.apiary_id = a.id
  where m.user_id = (select auth.uid());

grant select on public.my_apiaries to authenticated;
