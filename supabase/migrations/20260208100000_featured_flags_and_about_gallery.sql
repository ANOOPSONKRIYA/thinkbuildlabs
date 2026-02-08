-- Add feature/spotlight flags and about page gallery support

-- Projects: mark which ones are featured on the home page
alter table if exists public.projects
  add column if not exists "isFeatured" boolean not null default false;

create index if not exists projects_is_featured_idx
  on public.projects ("isFeatured");

-- Team members: spotlight individuals on the home page
alter table if exists public.team_members
  add column if not exists "isFeatured" boolean not null default false;

create index if not exists team_members_is_featured_idx
  on public.team_members ("isFeatured");

-- About page: image gallery support
alter table if exists public.about_data
  add column if not exists gallery text[] not null default '{}'::text[];
