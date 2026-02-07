import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  Users, 
  CheckCircle2,
  Clock,
  Activity,
  ArrowRight,
  Plus,
  Edit2,
} from 'lucide-react';
// import { toast } from 'sonner';
import type { Project, TeamMember, ActivityLog } from '@/types';
import { mockDataService } from '@/lib/dataService';
import { getActivityLogs } from '@/lib/supabase';
import { AdminLayout } from '@/features/admin/components/AdminLayout';

export function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [projectsData, membersData, logsData] = await Promise.all([
      mockDataService.getProjects(),
      mockDataService.getTeamMembers(),
      getActivityLogs(10),
    ]);
    setProjects(projectsData);
    setTeamMembers(membersData);
    setLogs(logsData);
    setLoading(false);
  };

  const stats = [
    { 
      label: 'Total Projects', 
      value: projects.length, 
      icon: FolderOpen, 
      color: 'bg-blue-500/20 text-blue-400',
      onClick: () => navigate('/admin/projects')
    },
    { 
      label: 'Team Members', 
      value: teamMembers.length, 
      icon: Users, 
      color: 'bg-green-500/20 text-green-400',
      onClick: () => navigate('/admin/team')
    },
    { 
      label: 'Ongoing', 
      value: projects.filter(p => p.status === 'ongoing').length, 
      icon: Clock, 
      color: 'bg-amber-500/20 text-amber-400',
      onClick: () => navigate('/admin/projects')
    },
    { 
      label: 'Completed', 
      value: projects.filter(p => p.status === 'completed').length, 
      icon: CheckCircle2, 
      color: 'bg-purple-500/20 text-purple-400',
      onClick: () => navigate('/admin/projects')
    },
  ];

  const recentProjects = projects.slice(0, 5);
  const recentMembers = teamMembers.slice(0, 5);

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* Welcome */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Dashboard</h2>
            <p className="text-white/40 mt-1">Welcome back! Here's what's happening.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/admin/portfolio/new')}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.button
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={stat.onClick}
                className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 text-left hover:bg-white/[0.05] transition-colors group"
              >
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-white/40 text-xs sm:text-sm">{stat.label}</p>
                <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{stat.value}</p>
                <ArrowRight className="w-4 h-4 text-white/20 mt-2 group-hover:text-white/40 transition-colors" />
              </motion.button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 glass rounded-xl sm:rounded-2xl p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-medium">Recent Projects</h3>
                <p className="text-white/40 text-sm">Latest portfolio updates</p>
              </div>
              <button 
                onClick={() => navigate('/admin/projects')}
                className="text-xs text-white/40 hover:text-white transition-colors"
              >
                View all
              </button>
            </div>

            {loading ? (
              <div className="h-40 rounded-xl bg-white/5 animate-pulse" />
            ) : recentProjects.length > 0 ? (
              <div className="space-y-2">
                {recentProjects.map((project) => (
                  <div 
                    key={project.id} 
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/[0.07] transition-colors group"
                  >
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{project.title}</p>
                      <p className="text-white/40 text-xs capitalize">{project.category}</p>
                    </div>
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
                    <button
                      onClick={() => navigate(`/admin/portfolio/${project.slug}`)}
                      className="p-1.5 rounded-lg text-white/20 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/40 text-sm">No projects yet</p>
                <button
                  onClick={() => navigate('/admin/portfolio/new')}
                  className="mt-2 text-white/60 hover:text-white text-sm underline"
                >
                  Create your first project
                </button>
              </div>
            )}
          </motion.div>

          {/* Side Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Team Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-medium">Team</h3>
                  <p className="text-white/40 text-sm">Active members</p>
                </div>
                <button 
                  onClick={() => navigate('/admin/team')}
                  className="text-xs text-white/40 hover:text-white transition-colors"
                >
                  View all
                </button>
              </div>

              {loading ? (
                <div className="h-32 rounded-xl bg-white/5 animate-pulse" />
              ) : recentMembers.length > 0 ? (
                <div className="space-y-2">
                  {recentMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{member.name}</p>
                        <p className="text-white/40 text-xs truncate">{member.role}</p>
                      </div>
                      <span className={`w-2 h-2 rounded-full ${
                        member.status === 'active' ? 'bg-green-400' : 
                        member.status === 'alumni' ? 'bg-amber-400' : 'bg-gray-400'
                      }`} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-white/40 text-sm py-4">No team members</p>
              )}
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-medium">Recent Activity</h3>
                  <p className="text-white/40 text-sm">Latest actions</p>
                </div>
                <button 
                  onClick={() => navigate('/admin/logs')}
                  className="text-xs text-white/40 hover:text-white transition-colors"
                >
                  View all
                </button>
              </div>

              {loading ? (
                <div className="h-32 rounded-xl bg-white/5 animate-pulse" />
              ) : logs.length > 0 ? (
                <div className="space-y-3">
                  {logs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-start gap-3 text-sm">
                      <Activity className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white/70 text-xs truncate">
                          <span className="text-white font-medium">{log.actorName || log.actorEmail}</span>
                          {' '}<span className="text-white/50">{log.action}</span>{' '}
                          <span className="text-white/70">{log.entityType}</span>
                        </p>
                        <p className="text-white/30 text-xs mt-0.5">
                          {new Date(log.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-white/40 text-sm py-4">No recent activity</p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
