import { createClient } from '@supabase/supabase-js';
import type { Project, TeamMember, AboutData, AdminUser, ActivityLog, SocialLink } from '@/types';

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
          contactPhone?: string;
          contactAddress?: string;
          heroVideoUrl: string;
          footerDescription?: string;
          footerSocialLinks?: SocialLink[];
          isPrimary?: boolean;
          createdAt?: string;
          updatedAt?: string;
        };
        Insert: {
          siteName: string;
          contactEmail: string;
          contactPhone?: string;
          contactAddress?: string;
          heroVideoUrl: string;
          footerDescription?: string;
          footerSocialLinks?: SocialLink[];
        };
        Update: Partial<{
          siteName: string;
          contactEmail: string;
          contactPhone?: string;
          contactAddress?: string;
          heroVideoUrl: string;
          footerDescription?: string;
          footerSocialLinks?: SocialLink[];
        }>;
      };
      activity_logs: {
        Row: ActivityLog;
        Insert: Omit<ActivityLog, 'id' | 'createdAt'>;
        Update: Partial<ActivityLog>;
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

export async function getProjectsByOwner(ownerId: string): Promise<Project[]> {
  if (!ownerId) return [];

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('ownerId', ownerId)
    .order('createdAt', { ascending: false });

  if (error) {
    console.error('Error fetching member projects:', error);
    return [];
  }

  return data || [];
}

export async function getProjectsForMember(memberId: string, userId?: string): Promise<Project[]> {
  if (!memberId && !userId) return [];

  let query = supabase
    .from('projects')
    .select('*')
    .order('createdAt', { ascending: false });

  if (memberId && userId) {
    query = query.or(`ownerId.eq.${userId},teamMembers.cs.{${memberId}}`);
  } else if (userId) {
    query = query.eq('ownerId', userId);
  } else if (memberId) {
    query = query.contains('teamMembers', [memberId]);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching assigned projects:', error);
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

export async function getTeamMemberByUser(user: { id: string; email?: string | null }): Promise<TeamMember | null> {
  if (!user?.id && !user?.email) return null;

  if (user.id) {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('userId', user.id)
      .maybeSingle();

    if (!error && data) {
      return data;
    }
  }

  if (user.email) {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('email', user.email)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    if (!data.userId) {
      const { data: updated, error: updateError } = await supabase
        .from('team_members')
        .update({ userId: user.id })
        .eq('id', data.id)
        .select()
        .single();

      if (!updateError && updated) {
        return updated;
      }
    }

    return data;
  }

  return null;
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

export async function getCurrentMember() {
  const user = await getCurrentUser();
  if (!user) return null;
  return getTeamMemberByUser(user);
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

// Activity Logs
export async function createActivityLog(entry: Omit<ActivityLog, 'id' | 'createdAt'>) {
  const { error } = await supabase
    .from('activity_logs')
    .insert({
      ...entry,
      details: entry.details || {},
    });

  if (error) {
    console.error('Error creating activity log:', error);
  }
}

export async function getActivityLogs(limit = 200): Promise<ActivityLog[]> {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .order('createdAt', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching activity logs:', error);
    return [];
  }

  return data || [];
}
