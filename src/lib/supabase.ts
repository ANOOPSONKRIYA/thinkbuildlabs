import { createClient } from '@supabase/supabase-js';
import type { Project, TeamMember, AboutData, AdminUser } from '@/types';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Database Types for TypeScript
export type Database = {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Project>;
      };
      team_members: {
        Row: TeamMember;
        Insert: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<TeamMember>;
      };
      about_data: {
        Row: AboutData;
        Insert: Omit<AboutData, 'id'>;
        Update: Partial<AboutData>;
      };
      admin_users: {
        Row: AdminUser;
        Insert: Omit<AdminUser, 'id' | 'createdAt'>;
        Update: Partial<AdminUser>;
      };
      site_settings: {
        Row: {
          id?: string;
          siteName: string;
          contactEmail: string;
          heroVideoUrl: string;
          isPrimary?: boolean;
          createdAt?: string;
          updatedAt?: string;
        };
        Insert: {
          siteName: string;
          contactEmail: string;
          heroVideoUrl: string;
        };
        Update: Partial<{
          siteName: string;
          contactEmail: string;
          heroVideoUrl: string;
        }>;
      };
    };
  };
};

// Helper functions for common operations

// Projects
export async function getProjects(category?: string): Promise<Project[]> {
  let query = supabase.from('projects').select('*').order('createdAt', { ascending: false });
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
  
  return data || [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }
  
  return data;
}

export async function createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating project:', error);
    return null;
  }
  
  return data;
}

export async function updateProject(id: string, project: Partial<Project>): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .update({ ...project, updatedAt: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating project:', error);
    return null;
  }
  
  return data;
}

export async function deleteProject(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting project:', error);
    return false;
  }
  
  return true;
}

// Team Members
export async function getTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
  
  return data || [];
}

export async function getTeamMemberBySlug(slug: string): Promise<TeamMember | null> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error('Error fetching team member:', error);
    return null;
  }
  
  return data;
}

export async function createTeamMember(member: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<TeamMember | null> {
  const { data, error } = await supabase
    .from('team_members')
    .insert(member)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating team member:', error);
    return null;
  }
  
  return data;
}

export async function updateTeamMember(id: string, member: Partial<TeamMember>): Promise<TeamMember | null> {
  const { data, error } = await supabase
    .from('team_members')
    .update({ ...member, updatedAt: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating team member:', error);
    return null;
  }
  
  return data;
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting team member:', error);
    return false;
  }
  
  return true;
}

// About
export async function getAboutData(): Promise<AboutData | null> {
  const { data, error } = await supabase
    .from('about_data')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching about data:', error);
    return null;
  }

  return data || null;
}

// File Upload
export async function uploadFile(bucket: string, path: string, file: File): Promise<string | null> {
  const { data, error } = await supabase
    .storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });
  
  if (error) {
    console.error('Error uploading file:', error);
    return null;
  }
  
  const { data: { publicUrl } } = supabase
    .storage
    .from(bucket)
    .getPublicUrl(data.path);
  
  return publicUrl;
}

// Auth
export async function signInWithGoogle(redirectTo?: string) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: redirectTo ? { redirectTo } : undefined,
  });

  if (error) {
    console.error('Error signing in with Google:', error);
    return null;
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    console.error('Error signing in:', error);
    return null;
  }
  
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Error signing out:', error);
    return false;
  }
  
  return true;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getAdminUserByEmail(email: string): Promise<AdminUser | null> {
  if (!email) return null;

  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    return null;
  }

  return data || null;
}

export async function recordAdminLogin(user: { id: string; email?: string | null; user_metadata?: any }) {
  if (!user?.email) return;

  const updates = {
    userId: user.id,
    email: user.email,
    name: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
    avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture,
    lastLogin: new Date().toISOString(),
  };

  await supabase
    .from('admin_users')
    .update(updates)
    .eq('email', user.email);
}

// Real-time subscriptions
export function subscribeToProjects(callback: (payload: any) => void) {
  return supabase
    .channel('projects')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, callback)
    .subscribe();
}

export function subscribeToTeamMembers(callback: (payload: any) => void) {
  return supabase
    .channel('team_members')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, callback)
    .subscribe();
}
