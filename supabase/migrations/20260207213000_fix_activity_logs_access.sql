-- Normalize admin check and activity logs access.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users au
    where (
      lower(coalesce(au.email, '')) = lower(coalesce((auth.jwt() ->> 'email'), ''))
      or au."userId" = auth.uid()
    )
      and lower(coalesce(au.role, 'admin')) in ('admin', 'editor')
  );
$$;

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  "actorId" uuid,
  "actorName" text,
  "actorEmail" text,
  "actorRole" text check ("actorRole" in ('admin', 'member')),
  action text not null,
  "entityType" text not null,
  "entityId" text,
  "entitySlug" text,
  "entityName" text,
  message text,
  details jsonb not null default '{}'::jsonb,
  "createdAt" timestamptz not null default now()
);

create index if not exists activity_logs_created_at_idx on public.activity_logs ("createdAt");
create index if not exists activity_logs_actor_name_idx on public.activity_logs ("actorName");
create index if not exists activity_logs_actor_email_idx on public.activity_logs ("actorEmail");
create index if not exists activity_logs_entity_type_idx on public.activity_logs ("entityType");
create index if not exists activity_logs_action_idx on public.activity_logs (action);

alter table public.activity_logs enable row level security;

drop policy if exists "Activity logs admin read" on public.activity_logs;
drop policy if exists "Activity logs member/admin insert" on public.activity_logs;
drop policy if exists "Activity logs authenticated insert" on public.activity_logs;

create policy "Activity logs admin read"
on public.activity_logs
for select
using (public.is_admin());

create policy "Activity logs authenticated insert"
on public.activity_logs
for insert
with check (auth.uid() is not null);
