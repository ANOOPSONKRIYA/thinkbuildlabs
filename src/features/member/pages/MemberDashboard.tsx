import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, FolderOpen, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';

import type { Project } from '@/types';
import { deleteProject, getProjectsForMember } from '@/lib/supabase';
import { useMemberSession } from '@/features/member/context/MemberContext';
import { logMemberAction } from '@/lib/activityLogs';
import { MemberLayout } from '@/features/member/components/MemberLayout';

export function MemberDashboard() {
  const navigate = useNavigate();
  const { user, member } = useMemberSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    const data = await getProjectsForMember(member.id, user.id);
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, [member.id, user.id]);

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const project = projects.find((p) => p.id === id);
      await deleteProject(id);
      toast.success('Project deleted successfully');
      await logMemberAction(
        {
          action: 'delete',
          entityType: 'project',
          entityId: id,
          entitySlug: project?.slug,
          entityName: project?.title,
          message: `Deleted project "${project?.title || 'Unknown'}"`,
        },
        user,
        member
      );
      fetchProjects();
    } catch {
      toast.error('Failed to delete project');
    }
  };

  const stats = [
    { label: 'My Projects', value: projects.length, icon: FolderOpen },
    { label: 'Ongoing', value: projects.filter(p => p.status === 'ongoing').length, icon: Clock },
    { label: 'Completed', value: projects.filter(p => p.status === 'completed').length, icon: CheckCircle2 },
  ];

  // Header actions
  const headerActions = (
    <button
      onClick={() => navigate('/member/projects/new')}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors text-sm"
    >
      <Plus className="w-4 h-4" />
      New Project
    </button>
  );

  return (
    <MemberLayout title="Dashboard" actions={headerActions}>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center"
              >
                <div className="w-8 sm:w-12 h-8 sm:h-12 rounded-lg sm:rounded-xl bg-white/5 flex items-center justify-center mb-2 sm:mb-4 mx-auto">
                  <Icon className="w-4 sm:w-6 h-4 sm:h-6 text-white/40" />
                </div>
                <p className="text-white/40 text-[10px] sm:text-sm">{stat.label}</p>
                <p className="text-xl sm:text-3xl font-bold text-white mt-0.5 sm:mt-1">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Profile Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-5 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex-shrink-0">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/40">
                  <span className="text-2xl font-bold">{member.name?.[0]}</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-white text-lg font-semibold">{member.name}</h2>
              <p className="text-white/50 text-sm">{member.role}</p>
              <p className="text-white/40 text-xs mt-1">{member.email}</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={() => navigate('/member/profile')}
                className="inline-flex items-center justify-center gap-2 flex-1 sm:flex-none px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
              <button
                onClick={() => window.open(`/team/${member.slug}`, '_blank')}
                className="inline-flex items-center justify-center gap-2 flex-1 sm:flex-none px-4 py-2 rounded-lg bg-white/10 text-white/70 hover:text-white hover:bg-white/15 text-sm transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Public
              </button>
            </div>
          </div>
        </motion.section>

        {/* Projects Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-white/50" />
              <h3 className="text-white text-base font-semibold">My Projects</h3>
            </div>
            <button
              onClick={() => navigate('/member/projects/new')}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Project</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>

          {loading ? (
            <div className="h-40 sm:h-56 rounded-xl bg-white/5 animate-pulse" />
          ) : projects.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-white/50 text-sm">No projects yet.</p>
              <button
                onClick={() => navigate('/member/projects/new')}
                className="mt-3 text-white/70 hover:text-white text-sm underline"
              >
                Create your first project
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="text-left px-3 py-3 text-white/40 font-medium text-xs">Project</th>
                    <th className="text-left px-3 py-3 text-white/40 font-medium text-xs">Status</th>
                    <th className="text-left px-3 py-3 text-white/40 font-medium text-xs hidden sm:table-cell">Visibility</th>
                    <th className="text-right px-3 py-3 text-white/40 font-medium text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={project.thumbnail}
                            alt={project.title}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="text-white text-sm font-medium">{project.title}</p>
                            <p className="text-white/30 text-xs">/{project.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          project.status === 'ongoing'
                            ? 'bg-blue-500/20 text-blue-400'
                            : project.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : project.status === 'draft'
                            ? 'bg-gray-500/20 text-gray-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 hidden sm:table-cell">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          project.visibility === 'public'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {project.visibility}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => window.open(`/portfolio/${project.slug}`, '_blank')}
                            className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/member/projects/${project.slug}`)}
                            className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>
      </div>
    </MemberLayout>
  );
}
