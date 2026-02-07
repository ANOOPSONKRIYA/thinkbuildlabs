-- Project and member access refinements (4th migration)
-- - Admins retain full control
-- - Members can work on projects they're assigned to or create
-- - Public can still read public projects
-- - Team member creation stays admin-only

-- Helper: member check (copied to avoid dependency on earlier migrations)
create or replace function public.is_project_member(project_team_members uuid[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.team_members tm
    where tm.id = any(project_team_members)
      and (
        tm."userId" = auth.uid()
        or tm.email = (auth.jwt() ->> 'email')
      )
  );
$$;

-- Helper: allow admin override while keeping member assignment checks
create or replace function public.project_access_guard(project_team_members uuid[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin() or public.is_project_member(project_team_members);
$$;

-- Clean up legacy project policies to avoid duplicates
drop policy if exists "Projects public read" on public.projects;
drop policy if exists "Projects admin insert" on public.projects;
drop policy if exists "Projects admin update" on public.projects;
drop policy if exists "Projects admin delete" on public.projects;
drop policy if exists "Projects owner read" on public.projects;
drop policy if exists "Projects member insert" on public.projects;
drop policy if exists "Projects member update" on public.projects;
drop policy if exists "Projects member delete" on public.projects;
drop policy if exists "Projects member read assigned" on public.projects;
drop policy if exists "Projects member insert assigned" on public.projects;
drop policy if exists "Projects member update assigned" on public.projects;
drop policy if exists "Projects member delete assigned" on public.projects;

-- Recreate project policies
create policy "Projects public read"
on public.projects
for select
using (visibility = 'public');

create policy "Projects admin manage"
on public.projects
for all
using (public.is_admin())
with check (public.is_admin());

create policy "Projects member read assigned"
on public.projects
for select
using (public.project_access_guard("teamMembers"));

create policy "Projects member insert assigned"
on public.projects
for insert
with check (public.project_access_guard("teamMembers"));

create policy "Projects member update assigned"
on public.projects
for update
using (public.project_access_guard("teamMembers"))
with check (public.project_access_guard("teamMembers"));

create policy "Projects member delete assigned"
on public.projects
for delete
using (public.project_access_guard("teamMembers"));

-- Team members: keep inserts admin-only
drop policy if exists "Team members admin insert" on public.team_members;
create policy "Team members admin insert"
on public.team_members
for insert
with check (public.is_admin());
