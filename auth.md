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

## 2) Run Database Migration
Apply the migration in `supabase/migrations/20260204190000_init.sql`.

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
https://your-domain.com/admin
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

Uploads from the admin panel will be stored in:
```
media/images/
media/gallery/
```

## 6) First Run Checks
1. Start the app:
```
npm run dev
```
2. Open `/admin`.
3. Sign in with Google using an email from `admin_users`.
4. Create a project or team member to verify DB write access.

## 7) Optional: Seed Site Settings
If `site_settings` is empty, the UI uses defaults. You can insert a row:
```sql
insert into public.site_settings ("siteName", "contactEmail", "heroVideoUrl")
values ('VLSI & AI Robotics Lab', 'contact@lab.edu', 'https://example.com/hero.mp4');
```

## 8) Optional: Seed About Page Data
`/about` reads from `about_data`. You can seed it with your own content (or copy the sample structure in `src/lib/mockData.ts`).

## Notes
- Admin access is enforced by RLS + `admin_users` table.
- If a user is not in `admin_users`, they will be signed out immediately.
- `VITE_ADMIN_EMAILS` is no longer used for access control; the database allowlist is the source of truth.
