# Think Build Labs

A modern, full-stack portfolio and team management platform built with React, TypeScript, and Supabase. Features a sleek dark-themed UI, real-time collaboration, and comprehensive admin dashboards.

![Think Build Labs](https://ik.imagekit.io/asdflkj/Screenshot%202026-02-08%20190704.png)

---

## 🚀 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 19, TypeScript, Vite |
| **Styling** | Tailwind CSS 3.4, shadcn/ui |
| **Animations** | Framer Motion, AOS (Animate On Scroll) |
| **Backend/Database** | Supabase (PostgreSQL + Auth + Storage) |
| **Routing** | React Router v7 |
| **Forms** | React Hook Form + Zod |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Carousel** | Embla Carousel |
| **Date Handling** | date-fns |
| **Notifications** | Sonner |

---

## 📁 Project Structure

```
thinkbuildlabs/
├── public/                     # Static assets
│   ├── sitemap.xml            # SEO sitemap
│   └── robots.txt             # Search engine directives
│
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── blocks/           # Complex page sections
│   │   │   ├── about-gallery-section.tsx
│   │   │   └── circular-carousel-gallery.tsx
│   │   ├── shared/           # Shared layout components
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── BackgroundEffects.tsx
│   │   │   └── ScrollToTop.tsx
│   │   └── ui/               # shadcn/ui components (50+ components)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       └── ...
│   │
│   ├── features/             # Feature-based modules
│   │   ├── public/          # Public-facing pages
│   │   │   ├── pages/
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── About.tsx
│   │   │   │   ├── Portfolio.tsx
│   │   │   │   ├── ProjectDetail.tsx
│   │   │   │   ├── Team.tsx
│   │   │   │   └── TeamMemberDetail.tsx
│   │   │   └── sections/    # Page sections
│   │   │       ├── Hero.tsx
│   │   │       ├── FeaturedProjects.tsx
│   │   │       ├── FeaturedTeam.tsx
│   │   │       └── Stats.tsx
│   │   │
│   │   ├── admin/           # Admin portal
│   │   │   ├── components/
│   │   │   │   ├── AdminGate.tsx      # Auth guard
│   │   │   │   ├── AdminLayout.tsx    # Dashboard layout
│   │   │   │   └── forms/            # Reusable form components
│   │   │   │       ├── ImageUpload.tsx
│   │   │   │       ├── SlugInput.tsx
│   │   │   │       ├── TechStackSelect.tsx
│   │   │   │       └── TimelineEditor.tsx
│   │   │   └── pages/
│   │   │       ├── Dashboard.tsx
│   │   │       ├── ProjectsPage.tsx
│   │   │       ├── PortfolioForm.tsx
│   │   │       ├── TeamPage.tsx
│   │   │       ├── TeamForm.tsx
│   │   │       ├── LogsPage.tsx
│   │   │       └── SettingsPage.tsx
│   │   │
│   │   └── member/          # Member portal
│   │       ├── components/
│   │       │   ├── MemberGate.tsx
│   │       │   └── MemberLayout.tsx
│   │       ├── context/
│   │       │   └── MemberContext.tsx
│   │       └── pages/
│   │           ├── MemberDashboard.tsx
│   │           ├── MemberProjectsPage.tsx
│   │           ├── MemberProjectForm.tsx
│   │           └── MemberProfileForm.tsx
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── use-mobile.ts
│   │   └── use-long-press.ts
│   │
│   ├── lib/                 # Utility functions & services
│   │   ├── supabase.ts     # Supabase client & database operations
│   │   ├── dataService.ts  # Data fetching utilities
│   │   ├── activityLogs.ts # Activity logging service
│   │   ├── settings.ts     # Site settings management
│   │   ├── url.ts          # URL normalization utilities
│   │   ├── utils.ts        # General utilities (cn, etc.)
│   │   └── mockData.ts     # Mock data for development
│   │
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # All types, interfaces & constants
│   │
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles & CSS variables
│
├── supabase/
│   └── migrations/         # Database migration files
│       ├── 20260204190000_init.sql
│       ├── 20260205120000_member_portal.sql
│       └── ...
│
├── index.html              # HTML template with SEO meta tags
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json
```

---

## 🏗️ Architecture Overview

### Feature-Based Architecture

This project uses a **feature-based folder structure** where each feature is self-contained:

```
features/
├── public/          # Public website (marketing pages)
├── admin/           # Admin dashboard (content management)
└── member/          # Member portal (team collaboration)
```

Each feature contains:
- `components/` - Feature-specific components
- `pages/` - Route-level components
- `context/` - Feature-specific state (if needed)

### Route Protection Pattern

```tsx
// App.tsx
const AdminRoute = ({ children }: { children: React.ReactNode }) => (
  <AdminGate>{children}</AdminGate>
);

<Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
```

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         UI Layer                             │
│  (Pages → Sections → Components → shadcn/ui primitives)     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                            │
│  (supabase.ts → dataService.ts → activityLogs.ts)           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                               │
│  (Supabase: PostgreSQL + Auth + Storage + Realtime)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### Core Tables

```sql
-- Projects
projects {
  id: uuid
  slug: string (unique)
  title: string
  shortDescription: string
  fullDescription: string
  category: enum (vlsi | ai-robotics | research | quantum | embedded)
  status: enum (draft | ongoing | completed | archived)
  visibility: enum (public | private)
  thumbnail: string (url)
  coverImage: string (url)
  images: string[] (urls)
  videos: jsonb
  techStack: string[]
  timeline: jsonb
  teamMembers: uuid[]
  teamMemberRoles: jsonb
  ownerId: uuid
  isFeatured: boolean
  metaTitle: string
  metaDescription: string
  keywords: string[]
  createdAt: timestamp
  updatedAt: timestamp
}

-- Team Members
team_members {
  id: uuid
  userId: uuid (links to auth.users)
  slug: string (unique)
  name: string
  role: string
  email: string
  bio: string
  about: string
  avatar: string (url)
  coverImage: string (url)
  socialLinks: jsonb
  skills: string[]
  projects: uuid[]
  resume: jsonb
  education: jsonb
  experience: jsonb
  achievements: jsonb
  isFeatured: boolean
  status: enum (active | inactive | alumni)
  joinedAt: timestamp
  createdAt: timestamp
  updatedAt: timestamp
}

-- Admin Users
admin_users {
  id: uuid
  userId: uuid
  email: string
  name: string
  role: enum (admin | editor)
  avatar: string
  lastLogin: timestamp
  createdAt: timestamp
}

-- Activity Logs
activity_logs {
  id: uuid
  actorId: uuid
  actorName: string
  actorEmail: string
  actorRole: enum (admin | member)
  action: string
  entityType: string
  entityId: uuid
  entitySlug: string
  entityName: string
  message: string
  details: jsonb
  createdAt: timestamp
}

-- Site Settings
site_settings {
  id: uuid
  siteName: string
  contactEmail: string
  heroVideoUrl: string
  footerDescription: string
  footerSocialLinks: jsonb
  isPrimary: boolean
  updatedAt: timestamp
}

-- About Data
about_data {
  id: uuid
  mission: string
  vision: string
  description: string
  stats: jsonb
  history: jsonb
  facilities: jsonb
  partners: jsonb
  gallery: string[]
}
```

---

## 🔄 Development Workflow

### 1. Local Development Setup

```bash
# Clone repository
git clone <repo-url>
cd thinkbuildlabs

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

### 2. Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Database Migrations

```bash
# Apply migrations via Supabase CLI
supabase db push

# Or run SQL files directly in Supabase Dashboard
# SQL Editor → New Query → Paste migration content
```

### 4. Creating New Features

```bash
# Example: Adding a new public page

# 1. Create page component
src/features/public/pages/NewPage.tsx

# 2. Add to exports
src/features/public/pages/index.ts

# 3. Add route in App.tsx
<Route path="/new-page" element={<MainLayout><NewPage /></MainLayout>} />

# 4. Add navigation link in Navigation.tsx
```

### 5. Component Development Pattern

```tsx
// 1. Import types
import type { Project } from '@/types';

// 2. Import UI components
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// 3. Import utilities
import { cn } from '@/lib/utils';

// 4. Component definition
interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <h3>{project.title}</h3>
      </CardHeader>
      <CardContent>
        <p>{project.shortDescription}</p>
      </CardContent>
    </Card>
  );
}
```

---

## 🎨 Design System

### Color Palette

```css
:root {
  --void: #050505;        /* Primary background */
  --surface: #0a0a0a;     /* Cards, sections */
  --elevated: #111111;    /* Hover states, dropdowns */
  
  --border: rgba(255,255,255,0.1);
  --foreground: #ffffff;
  --muted: rgba(255,255,255,0.6);
}
```

### Category Colors

| Category | Color |
|----------|-------|
| VLSI Design | `#3b82f6` (Blue) |
| AI & Robotics | `#8b5cf6` (Purple) |
| Research | `#10b981` (Green) |
| Quantum Computing | `#f59e0b` (Amber) |
| Embedded Systems | `#ef4444` (Red) |

### Typography

- **Primary Font**: Inter, system-ui, sans-serif
- **Headings**: font-semibold to font-bold
- **Body**: font-normal
- **Small/Captions**: text-sm, text-muted-foreground

---

## 🔐 Authentication & Authorization

### Role-Based Access Control

```
┌────────────────────────────────────────────┐
│              PUBLIC (No Auth)               │
│  Home, About, Portfolio, Team, Project      │
└────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────┐
│           MEMBER (Authenticated)            │
│  Member Dashboard, My Projects, Profile     │
│  Can: Edit own profile, manage own projects │
└────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────┐
│            ADMIN (Privileged)               │
│  Admin Dashboard, All CRUD Operations       │
│  Can: Manage all content, view logs         │
└────────────────────────────────────────────┘
```

### Auth Flow

1. User clicks "Sign In" → Supabase OAuth (Google)
2. Callback handled by Supabase Auth
3. `AdminGate`/`MemberGate` check user role
4. Redirect to appropriate dashboard or request access

---

## 📊 Key Features

### Public Website
- 🏠 **Home**: Hero section, featured projects, stats, team highlights
- 📁 **Portfolio**: Filterable project grid with categories
- 👥 **Team**: Team member directory with detailed profiles
- 📄 **About**: Company mission, vision, history, facilities

### Admin Dashboard
- 📊 **Dashboard**: Overview stats, recent activity
- 📝 **Projects**: Full CRUD, image uploads, video embedding
- 👤 **Team**: Member management, role assignment
- 📜 **Logs**: Activity tracking for audit
- ⚙️ **Settings**: Site configuration, contact info

### Member Portal
- 🏠 **Dashboard**: Personal overview
- 📁 **My Projects**: Projects assigned to member
- ✏️ **Profile**: Edit personal info, skills, resume

---

## 🚀 Deployment

### Build

```bash
npm run build
```

Output generated in `dist/` folder.

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables (Production)

Set these in your hosting platform:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes following existing code patterns
3. Test thoroughly
4. Submit pull request

### Code Style

- Use TypeScript strictly
- Follow existing component patterns
- Use `cn()` utility for conditional classes
- Prefer composition over inheritance
- Keep components focused and small

---

## 📚 Additional Documentation

- [SEO & Google Search Guide](./SEO_GOOGLE_SEARCH_GUIDE.md) - Search engine optimization setup
- [auth.md](./auth.md) - Authentication implementation details

---

## 📄 License

MIT License - see LICENSE file for details.

---

## 🆘 Support

For issues or questions:
- Check existing documentation
- Review Supabase docs: https://supabase.com/docs
- React docs: https://react.dev

---

**Built with ❤️ by Think Build Labs Team**
