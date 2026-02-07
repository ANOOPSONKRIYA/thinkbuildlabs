# Supabase + Google Admin Auth Setup

This project uses Supabase for database + storage and Google OAuth for admin access. Only emails listed in `public.admin_users` can access the admin panel.

## 1) Create Supabase Project
1. Create a Supabase project in your Supabase dashboard.
2. Copy the `Project URL` and `anon` key.
3. Update `.env` with:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 2) Run Database Migrations
Apply all migrations:
- `supabase/migrations/20260204190000_init.sql`
- `supabase/migrations/20260205120000_member_portal.sql`
- `supabase/migrations/20260205193000_activity_logs_and_settings.sql`

You can do this in two ways:
1. Supabase CLI:
```
supabase db push
```
2. Supabase SQL editor:
1. Open the SQL editor in Supabase.
2. Paste the contents of `supabase/migrations/20260204190000_init.sql`.
3. Run it.

This creates:
- `projects`, `team_members`, `about_data`, `site_settings`, `admin_users`
- RLS policies and `is_admin()` function
- Storage bucket `media` with policies
The second migration adds:
- `team_members.userId` (links to auth user)
- `projects.ownerId` (project ownership)
- `is_member()` helper and member RLS policies
- Storage policies for member uploads

## 3) Add Admin Allowlist (Required)
Only emails in `admin_users` can use `/admin`.

Run this once in the Supabase SQL editor:
```sql
insert into public.admin_users (email, name, role)
values
  ('you@example.com', 'Your Name', 'admin'),
  ('teammate@example.com', 'Teammate', 'editor');
```

## 4) Configure Google OAuth
### Google Cloud Console
1. Create an OAuth Client ID (Web Application).
2. Add authorized redirect URI:
```
https://<YOUR-PROJECT-REF>.supabase.co/auth/v1/callback
```
3. Copy the Client ID and Client Secret.

### Supabase Auth Settings
1. Go to Supabase → Authentication → Providers → Google.
2. Enable Google.
3. Paste Client ID + Client Secret.
4. Disable Email/Password provider (only Google should be enabled).
5. Set Site URL:
```
http://localhost:5173
```
6. Add Redirect URLs (dev + prod):
```
http://localhost:5173/admin
http://localhost:5173/member
https://your-domain.com/admin
https://your-domain.com/member
```

## 5) Storage Bucket
The migration attempts to create a public `media` bucket and policies. On hosted Supabase,
policy creation can fail in SQL Editor due to `storage.objects` ownership.

If you see notices about skipped storage policies, create them manually in:
Supabase → Storage → Policies → `storage.objects`.

Use these policies (SQL):
```sql
create policy "Media public read"
on storage.objects
for select
using (bucket_id = 'media');

create policy "Media admin insert"
on storage.objects
for insert
with check (bucket_id = 'media' and public.is_admin());

create policy "Media admin update"
on storage.objects
for update
using (bucket_id = 'media' and public.is_admin());

create policy "Media admin delete"
on storage.objects
for delete
using (bucket_id = 'media' and public.is_admin());
```

Uploads from the admin or member portals will be stored in:
```
media/images/
media/gallery/
```

## 6) Member Portal Setup (Required)
The member portal lives at `/member`. Only team members whose email matches a row in
`public.team_members` can sign in (Google OAuth).

1. Create (or update) a team member with the correct email:
```sql
insert into public.team_members (name, slug, role, email, bio, avatar, status, joinedAt)
values ('Member Name', 'member-name', 'Researcher', 'member@lab.edu', 'Short bio', 'https://...', 'active', '2024-01-01');
```
2. Ask the member to sign in at `/member`. The first sign-in will link `team_members.userId`
to their Supabase auth user automatically.

## 7) First Run Checks
1. Start the app:
```
npm run dev
```
2. Open `/admin`.
3. Sign in with Google using an email from `admin_users`.
4. Create a project or team member to verify DB write access.

## 8) Optional: Seed Site Settings
If `site_settings` is empty, the UI uses defaults. You can insert a row:
```sql
insert into public.site_settings ("siteName", "contactEmail", "heroVideoUrl")
values ('thinkbuildlabs', 'contact@lab.edu', 'https://example.com/hero.mp4');
```

## 9) Optional: Seed About Page Data
`/about` reads from `about_data`. You can seed it with your own content (or copy the sample structure in `src/lib/mockData.ts`).

## Notes
- Admin access is enforced by RLS + `admin_users` table.
- If a user is not in `admin_users`, they will be signed out immediately.
- `VITE_ADMIN_EMAILS` is no longer used for access control; the database allowlist is the source of truth.

## Troubleshooting
- **DNS_PROBE_FINISHED_NXDOMAIN on Google sign-in**: the app is pointing at the wrong Supabase project URL.
  - Ensure `VITE_SUPABASE_URL` in Vercel (Production + Preview) matches your Supabase project ref (shown in the Supabase dashboard URL).
  - Redeploy after changing env vars.
