import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

import type { Project } from '@/types';
import { deleteProject, getProjectsForMember } from '@/lib/supabase';
import { logMemberAction } from '@/lib/activityLogs';
import { MemberLayout } from '@/features/member/components/MemberLayout';
import { useMemberSession } from '@/features/member/context/MemberContext';

export function MemberProjectsPage() {
  const navigate = useNavigate();
  const { user, member } = useMemberSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const data = await getProjectsForMember(member.id, user.id);
    setProjects(data);
    setLoading(false);
  }, [member.id, user.id]);

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

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
      await fetchProjects();
    } catch {
      toast.error('Failed to delete project');
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <MemberLayout title="My Projects" subtitle="Manage your assigned and owned projects" actions={headerActions}>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-96 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-white/20"
          />
        </div>

        {loading ? (
          <div className="glass rounded-xl sm:rounded-2xl h-64 sm:h-96 animate-pulse" />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl sm:rounded-2xl overflow-hidden overflow-x-auto"
          >
            <table className="w-full min-w-[600px]">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-white/40 font-medium text-[10px] sm:text-xs">Project</th>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-white/40 font-medium text-[10px] sm:text-xs">Category</th>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-white/40 font-medium text-[10px] sm:text-xs">Status</th>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-white/40 font-medium text-[10px] sm:text-xs hidden sm:table-cell">Visibility</th>
                  <th className="text-right px-3 sm:px-6 py-3 sm:py-4 text-white/40 font-medium text-[10px] sm:text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-white text-xs sm:text-sm font-medium truncate max-w-[120px] sm:max-w-none">{project.title}</p>
                          <p className="text-white/30 text-[10px] sm:text-xs">/{project.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className="text-white/40 text-[10px] sm:text-xs capitalize">{project.category}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs ${
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
                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                      <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs ${
                        project.visibility === 'public'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {project.visibility}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <button
                          onClick={() => window.open(`/portfolio/${project.slug}`, '_blank')}
                          className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                          title="View on site"
                        >
                          <Eye className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/member/projects/${project.slug}`)}
                          className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-white/40 text-sm">No projects found</p>
                <button
                  onClick={() => navigate('/member/projects/new')}
                  className="mt-3 text-white/60 hover:text-white text-sm underline"
                >
                  Create your first project
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </MemberLayout>
  );
}
