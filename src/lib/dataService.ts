import {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  getTeamMembers,
  getTeamMemberBySlug,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getAboutData,
  saveAboutData,
} from '@/lib/supabase';

// Keep the same interface name used across the app,
// but back it with Supabase instead of mock data.
export const mockDataService = {
  // Projects
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,

  // Team Members
  getTeamMembers,
  getTeamMemberBySlug,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,

  // About
  getAboutData,
  saveAboutData,
};
