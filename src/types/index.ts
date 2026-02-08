// Project Types
export interface Video {
  id: string;
  url: string;
  title: string;
  description?: string;
  type: 'youtube' | 'vimeo' | 'direct';
  thumbnailUrl?: string;
  isFeatured?: boolean;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  milestone: boolean;
}

export interface TeamMemberRole {
  memberId: string;
  role: string;
}

export interface Project {
  id: string;
  ownerId?: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: 'vlsi' | 'ai-robotics' | 'research' | 'quantum' | 'embedded';
  status: 'draft' | 'ongoing' | 'completed' | 'archived';
  visibility: 'public' | 'private';
  thumbnail: string;
  coverImage?: string;
  images: string[];
  videos: Video[];
  techStack: string[];
  timeline: TimelineEvent[];
  teamMembers: string[]; // Array of team member IDs
  teamMemberRoles?: TeamMemberRole[]; // Optional role per member
  startDate: string;
  endDate?: string;
  duration?: string; // Auto-calculated or manual
  githubUrl?: string;
  demoUrl?: string;
  documentationUrl?: string;
  researchPaperUrl?: string;
  externalLinks?: ExternalLink[];
  isFeatured: boolean;
  // Meta & SEO
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  // Timestamps
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ExternalLink {
  id: string;
  title: string;
  url: string;
  type: 'documentation' | 'reference' | 'article' | 'other';
}

// Team Member Types
export interface SocialLink {
  platform: 'linkedin' | 'github' | 'twitter' | 'instagram' | 'portfolio' | 'email' | 'google-scholar';
  url: string;
}

export interface Resume {
  url: string;
  filename: string;
  uploadedAt: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear?: string;
  current: boolean;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  link?: string;
}

export interface TeamMember {
  id: string;
  userId?: string;
  slug: string;
  name: string;
  role: string;
  title?: string; // Alternative to role for display
  email: string;
  phone?: string;
  bio: string; // Short bio
  about?: string; // Detailed about section
  avatar: string;
  coverImage?: string;
  bannerImage?: string;
  socialLinks: SocialLink[];
  skills: string[];
  projects: string[]; // Array of project IDs
  resume?: Resume;
  education: Education[];
  experience: Experience[];
  achievements: Achievement[];
  isActive: boolean;
  status: 'active' | 'inactive' | 'alumni';
  isFeatured: boolean;
  joinedAt: string;
  leftAt?: string;
  memberSince?: string;
  // Meta & SEO
  metaTitle?: string;
  metaDescription?: string;
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Admin Types
export interface AdminUser {
  id: string;
  userId?: string;
  email: string;
  name: string;
  role: 'admin' | 'editor';
  avatar?: string;
  lastLogin: string;
  createdAt: string;
}

// Site Settings
export interface SiteSettings {
  id?: string;
  siteName: string;
  contactEmail: string;
  contactPhone?: string;
  contactAddress?: string;
  heroVideoUrl: string;
  footerDescription?: string;
  footerSocialLinks?: SocialLink[];
  isPrimary?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Activity Logs
export interface ActivityLog {
  id: string;
  actorId?: string;
  actorName?: string;
  actorEmail?: string;
  actorRole?: 'admin' | 'member';
  action: string;
  entityType: string;
  entityId?: string;
  entitySlug?: string;
  entityName?: string;
  message?: string;
  details?: Record<string, any>;
  createdAt: string;
}

// About Page Types
export interface AboutData {
  id: string;
  mission: string;
  vision: string;
  description: string;
  stats: Stat[];
  history: HistoryEvent[];
  facilities: Facility[];
  partners: Partner[];
  gallery: string[];
}

export interface Stat {
  id: string;
  label: string;
  value: string;
  icon: string;
}

export interface HistoryEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  milestone?: boolean;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  website?: string;
}

// Form Types - Project
export interface ProjectFormData {
  ownerId?: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: Project['category'];
  status: Project['status'];
  visibility: Project['visibility'];
  thumbnail: string;
  coverImage?: string;
  images: string[];
  videos: Video[];
  techStack: string[];
  timeline: TimelineEvent[];
  teamMembers: string[];
  teamMemberRoles?: TeamMemberRole[];
  startDate: string;
  endDate?: string;
  duration?: string;
  githubUrl?: string;
  demoUrl?: string;
  documentationUrl?: string;
  researchPaperUrl?: string;
  externalLinks?: ExternalLink[];
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

// Form Types - Team Member
export interface TeamMemberFormData {
  userId?: string;
  name: string;
  slug: string;
  role: string;
  title?: string;
  email: string;
  phone?: string;
  bio: string;
  about?: string;
  avatar: string;
  coverImage?: string;
  bannerImage?: string;
  socialLinks: SocialLink[];
  skills: string[];
  projects: string[];
  resume?: Resume;
  education: Education[];
  experience: Experience[];
  achievements: Achievement[];
  isActive: boolean;
  status: TeamMember['status'];
  joinedAt: string;
  leftAt?: string;
  memberSince?: string;
  metaTitle?: string;
  metaDescription?: string;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

// Animation Types
export interface AOSConfig {
  duration?: number;
  easing?: string;
  once?: boolean;
  mirror?: boolean;
  anchorPlacement?: string;
}

// Category Options
export const PROJECT_CATEGORIES = [
  { value: 'vlsi', label: 'VLSI Design', color: '#3b82f6' },
  { value: 'ai-robotics', label: 'AI & Robotics', color: '#8b5cf6' },
  { value: 'research', label: 'Research', color: '#10b981' },
  { value: 'quantum', label: 'Quantum Computing', color: '#f59e0b' },
  { value: 'embedded', label: 'Embedded Systems', color: '#ef4444' },
] as const;

// Status Options
export const PROJECT_STATUSES = [
  { value: 'draft', label: 'Draft', color: '#6b7280' },
  { value: 'ongoing', label: 'Ongoing', color: '#3b82f6' },
  { value: 'completed', label: 'Completed', color: '#10b981' },
  { value: 'archived', label: 'Archived', color: '#ef4444' },
] as const;

// Visibility Options
export const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public', color: '#10b981' },
  { value: 'private', label: 'Private', color: '#ef4444' },
] as const;

// Social Platform Options
export const SOCIAL_PLATFORMS = [
  { value: 'linkedin', label: 'LinkedIn', icon: 'Linkedin' },
  { value: 'github', label: 'GitHub', icon: 'Github' },
  { value: 'twitter', label: 'Twitter', icon: 'Twitter' },
  { value: 'portfolio', label: 'Portfolio', icon: 'Globe' },
  { value: 'google-scholar', label: 'Google Scholar', icon: 'BookOpen' },
  { value: 'email', label: 'Email', icon: 'Mail' },
] as const;

// Tech Stack Presets
export const TECH_STACK_OPTIONS = [
  'Verilog', 'VHDL', 'SystemVerilog', 'Cadence', 'Synopsys', 'Mentor Graphics',
  'FPGA', 'ASIC', 'Python', 'TensorFlow', 'PyTorch', 'Keras',
  'ROS', 'ROS2', 'OpenCV', 'C++', 'C', 'MATLAB', 'Simulink',
  'CUDA', 'OpenCL', 'Qiskit', 'Cirq', 'Jupyter', 'Pandas', 'NumPy',
  'SolidWorks', 'AutoCAD', 'Blender', 'Unity', 'Gazebo', 'RViz',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'GitHub',
  'Jenkins', 'Jira', 'Confluence', 'LaTeX', 'Markdown',
] as const;

// Skills Presets
export const SKILLS_OPTIONS = [
  'VLSI Design', 'Digital Design', 'Analog Design', 'Low Power Design',
  'FPGA Design', 'ASIC Design', 'Physical Design', 'Verification',
  'Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP',
  'Robotics', 'SLAM', 'Path Planning', 'Control Systems',
  'Embedded Systems', 'RTOS', 'IoT', 'Signal Processing',
  'Quantum Computing', 'Quantum Algorithms', 'Quantum Error Correction',
  'Python', 'C++', 'C', 'Java', 'Rust', 'Go', 'JavaScript', 'TypeScript',
  'React', 'Vue', 'Node.js', 'FastAPI', 'Django', 'Flask',
  'Leadership', 'Team Management', 'Technical Writing', 'Public Speaking',
] as const;
