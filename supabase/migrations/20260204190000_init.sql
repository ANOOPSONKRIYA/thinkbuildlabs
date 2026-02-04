create extension if not exists "pgcrypto";

-- Base tables
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid unique,
  email text not null unique,
  name text not null default '',
  role text not null default 'admin' check (role in ('admin', 'editor')),
  avatar text,
  "lastLogin" timestamptz not null default now(),
  "createdAt" timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  "shortDescription" text not null,
  "fullDescription" text not null,
  category text not null check (category in ('vlsi', 'ai-robotics', 'research', 'quantum', 'embedded')),
  status text not null check (status in ('draft', 'ongoing', 'completed', 'archived')),
  visibility text not null check (visibility in ('public', 'private')),
  thumbnail text not null,
  "coverImage" text,
  images text[] not null default '{}'::text[],
  videos jsonb not null default '[]'::jsonb,
  "techStack" text[] not null default '{}'::text[],
  timeline jsonb not null default '[]'::jsonb,
  "teamMembers" uuid[] not null default '{}'::uuid[],
  "teamMemberRoles" jsonb not null default '[]'::jsonb,
  "startDate" date not null,
  "endDate" date,
  duration text,
  "githubUrl" text,
  "demoUrl" text,
  "documentationUrl" text,
  "researchPaperUrl" text,
  "externalLinks" jsonb not null default '[]'::jsonb,
  "metaTitle" text,
  "metaDescription" text,
  keywords text[] not null default '{}'::text[],
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  "publishedAt" timestamptz
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  role text not null,
  title text,
  email text not null,
  phone text,
  bio text not null,
  about text,
  avatar text not null,
  "coverImage" text,
  "bannerImage" text,
  "socialLinks" jsonb not null default '[]'::jsonb,
  skills text[] not null default '{}'::text[],
  projects uuid[] not null default '{}'::uuid[],
  resume jsonb,
  education jsonb not null default '[]'::jsonb,
  experience jsonb not null default '[]'::jsonb,
  achievements jsonb not null default '[]'::jsonb,
  "isActive" boolean not null default true,
  status text not null check (status in ('active', 'inactive', 'alumni')),
  "joinedAt" date not null,
  "leftAt" date,
  "memberSince" text,
  "metaTitle" text,
  "metaDescription" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.about_data (
  id uuid primary key default gen_random_uuid(),
  mission text not null,
  vision text not null,
  description text not null,
  stats jsonb not null default '[]'::jsonb,
  history jsonb not null default '[]'::jsonb,
  facilities jsonb not null default '[]'::jsonb,
  partners jsonb not null default '[]'::jsonb
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  "siteName" text not null,
  "contactEmail" text not null default '',
  "heroVideoUrl" text not null default '',
  "isPrimary" boolean not null default true,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  constraint site_settings_singleton unique ("isPrimary")
);

-- UpdatedAt trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$;

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row execute procedure public.set_updated_at();

drop trigger if exists set_team_members_updated_at on public.team_members;
create trigger set_team_members_updated_at
before update on public.team_members
for each row execute procedure public.set_updated_at();

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute procedure public.set_updated_at();

-- Helper function for admin checks
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
    where (au.email = (auth.jwt() ->> 'email') or au."userId" = auth.uid())
      and au.role in ('admin', 'editor')
  );
$$;

-- Enable RLS
alter table public.admin_users enable row level security;
alter table public.projects enable row level security;
alter table public.team_members enable row level security;
alter table public.about_data enable row level security;
alter table public.site_settings enable row level security;

-- Policies: projects
create policy "Projects public read"
on public.projects
for select
using (visibility = 'public' or public.is_admin());

create policy "Projects admin insert"
on public.projects
for insert
with check (public.is_admin());

create policy "Projects admin update"
on public.projects
for update
using (public.is_admin())
with check (public.is_admin());

create policy "Projects admin delete"
on public.projects
for delete
using (public.is_admin());

-- Policies: team_members
create policy "Team members public read"
on public.team_members
for select
using (true);

create policy "Team members admin insert"
on public.team_members
for insert
with check (public.is_admin());

create policy "Team members admin update"
on public.team_members
for update
using (public.is_admin())
with check (public.is_admin());

create policy "Team members admin delete"
on public.team_members
for delete
using (public.is_admin());

-- Policies: about_data
create policy "About data public read"
on public.about_data
for select
using (true);

create policy "About data admin insert"
on public.about_data
for insert
with check (public.is_admin());

create policy "About data admin update"
on public.about_data
for update
using (public.is_admin())
with check (public.is_admin());

create policy "About data admin delete"
on public.about_data
for delete
using (public.is_admin());

-- Policies: site_settings
create policy "Site settings public read"
on public.site_settings
for select
using (true);

create policy "Site settings admin insert"
on public.site_settings
for insert
with check (public.is_admin());

create policy "Site settings admin update"
on public.site_settings
for update
using (public.is_admin())
with check (public.is_admin());

create policy "Site settings admin delete"
on public.site_settings
for delete
using (public.is_admin());

-- Policies: admin_users
create policy "Admin users self read"
on public.admin_users
for select
using (email = (auth.jwt() ->> 'email') or "userId" = auth.uid());

create policy "Admin users self update"
on public.admin_users
for update
using (email = (auth.jwt() ->> 'email') or "userId" = auth.uid())
with check (email = (auth.jwt() ->> 'email') or "userId" = auth.uid());

-- Storage bucket and policies
-- Note: storage.objects is owned by supabase_storage_admin in hosted Supabase.
-- If your SQL editor role isn't the owner, policy creation will fail.
-- We wrap these in a DO block to avoid hard failures and surface notices instead.

do $$
begin
  begin
    insert into storage.buckets (id, name, public)
    values ('media', 'media', true)
    on conflict (id) do nothing;
  exception when insufficient_privilege then
    raise notice 'Skipping storage.buckets insert (insufficient privileges).';
  end;

  begin
    execute 'alter table storage.objects enable row level security';
  exception when insufficient_privilege then
    raise notice 'Skipping storage.objects RLS enable (insufficient privileges).';
  end;

  begin
    execute $pol$
      create policy "Media public read"
      on storage.objects
      for select
      using (bucket_id = 'media')
    $pol$;
  exception when duplicate_object then
    raise notice 'Policy "Media public read" already exists.';
  when insufficient_privilege then
    raise notice 'Skipping policy "Media public read" (insufficient privileges).';
  end;

  begin
    execute $pol$
      create policy "Media admin insert"
      on storage.objects
      for insert
      with check (bucket_id = 'media' and public.is_admin())
    $pol$;
  exception when duplicate_object then
    raise notice 'Policy "Media admin insert" already exists.';
  when insufficient_privilege then
    raise notice 'Skipping policy "Media admin insert" (insufficient privileges).';
  end;

  begin
    execute $pol$
      create policy "Media admin update"
      on storage.objects
      for update
      using (bucket_id = 'media' and public.is_admin())
    $pol$;
  exception when duplicate_object then
    raise notice 'Policy "Media admin update" already exists.';
  when insufficient_privilege then
    raise notice 'Skipping policy "Media admin update" (insufficient privileges).';
  end;

  begin
    execute $pol$
      create policy "Media admin delete"
      on storage.objects
      for delete
      using (bucket_id = 'media' and public.is_admin())
    $pol$;
  exception when duplicate_object then
    raise notice 'Policy "Media admin delete" already exists.';
  when insufficient_privilege then
    raise notice 'Skipping policy "Media admin delete" (insufficient privileges).';
  end;
end $$;
