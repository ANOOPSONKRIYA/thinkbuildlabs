import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  Settings, 
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  Menu,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Project, TeamMember } from '@/types';
import { mockDataService } from '@/lib/dataService';
import { getSettings, saveSettings } from '@/lib/settings';
import { signOut } from '@/lib/supabase';
import type { SiteSettings } from '@/types';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'team', label: 'Team Members', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active tab from URL
  const getActiveTabFromUrl = () => {
    if (location.pathname.includes('/team')) return 'team';
    if (location.pathname.includes('/project')) return 'projects';
    if (location.pathname.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromUrl());
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setActiveTab(getActiveTabFromUrl());
  }, [location.pathname]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [projectsData, membersData] = await Promise.all([
      mockDataService.getProjects(),
      mockDataService.getTeamMembers(),
    ]);
    setProjects(projectsData);
    setTeamMembers(membersData);
    setLoading(false);
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await mockDataService.deleteProject(id);
        toast.success('Project deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      try {
        await mockDataService.deleteTeamMember(id);
        toast.success('Team member deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete team member');
      }
    }
  };

  const handleAddProject = () => {
    navigate('/admin/portfolio/new');
  };

  const handleEditProject = (slug: string) => {
    navigate(`/admin/portfolio/${slug}`);
  };

  const handleViewProject = (slug: string) => {
    window.open(`/portfolio/${slug}`, '_blank');
  };

  const handleAddMember = () => {
    navigate('/admin/team/new');
  };

  const handleEditMember = (slug: string) => {
    navigate(`/admin/team/${slug}`);
  };

  const handleViewMember = (slug: string) => {
    window.open(`/team/${slug}`, '_blank');
  };

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMembers = teamMembers.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 admin-sidebar border-r border-white/10 flex-shrink-0 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl bg-white flex items-center justify-center">
              <LayoutDashboard className="w-4 sm:w-5 h-4 sm:h-5 text-black" />
            </div>
            <span className="font-bold text-white text-sm sm:text-base">Admin Panel</span>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                    // Update URL without navigating away
                    if (item.id === 'dashboard') navigate('/admin');
                    else navigate(`/admin/${item.id}`);
                  }}
                  className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-left transition-all text-sm ${
                    activeTab === item.id
                      ? 'bg-white/10 text-white'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 sm:w-5 h-4 sm:h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 border-t border-white/10">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm"
          >
            <ExternalLink className="w-4 sm:w-5 h-4 sm:h-5" />
            View Website
          </button>
          <button
            onClick={async () => {
              await signOut();
              navigate('/');
            }}
            className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm mt-1"
          >
            <LogOut className="w-4 sm:w-5 h-4 sm:h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 glass-strong border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
              <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-white capitalize">
                {activeTab === 'dashboard' ? 'Dashboard' : activeTab}
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 sm:w-4 h-3.5 sm:h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 rounded-lg glass text-white text-xs sm:text-sm placeholder:text-white/40 focus:outline-none focus:border-white/20 w-32 sm:w-48 lg:w-64"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <DashboardContent 
              projects={projects} 
              teamMembers={teamMembers}
              onViewProjects={() => {
                setActiveTab('projects');
                navigate('/admin/projects');
              }}
              onViewTeam={() => {
                setActiveTab('team');
                navigate('/admin/team');
              }}
            />
          )}
          
          {activeTab === 'projects' && (
            <ProjectsContent
              projects={filteredProjects}
              onAdd={handleAddProject}
              onEdit={handleEditProject}
              onView={handleViewProject}
              onDelete={handleDeleteProject}
              loading={loading}
            />
          )}
          
          {activeTab === 'team' && (
            <TeamContent
              members={filteredMembers}
              onAdd={handleAddMember}
              onEdit={handleEditMember}
              onView={handleViewMember}
              onDelete={handleDeleteMember}
              loading={loading}
            />
          )}
          
          {activeTab === 'settings' && (
            <SettingsContent />
          )}
        </div>
      </main>
    </div>
  );
}

// Dashboard Content
function DashboardContent({ 
  projects, 
  teamMembers,
  onViewProjects,
  onViewTeam,
}: { 
  projects: Project[]; 
  teamMembers: TeamMember[];
  onViewProjects: () => void;
  onViewTeam: () => void;
}) {
  const stats = [
    { label: 'Total Projects', value: projects.length, icon: FolderOpen, onClick: onViewProjects },
    { label: 'Team Members', value: teamMembers.length, icon: Users, onClick: onViewTeam },
    { label: 'Ongoing Projects', value: projects.filter(p => p.status === 'ongoing').length, icon: CheckCircle2, onClick: onViewProjects },
    { label: 'Completed', value: projects.filter(p => p.status === 'completed').length, icon: CheckCircle2, onClick: onViewProjects },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.button
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={stat.onClick}
              className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 text-left hover:bg-white/[0.05] transition-colors"
            >
              <div className="w-8 sm:w-12 h-8 sm:h-12 rounded-lg sm:rounded-xl bg-white/5 flex items-center justify-center mb-2 sm:mb-4">
                <Icon className="w-4 sm:w-6 h-4 sm:h-6 text-white/40" />
              </div>
              <p className="text-white/40 text-[10px] sm:text-sm">{stat.label}</p>
              <p className="text-xl sm:text-3xl font-bold text-white mt-0.5 sm:mt-1">{stat.value}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base font-semibold text-white">Recent Projects</h3>
            <button 
              onClick={onViewProjects}
              className="text-xs text-white/40 hover:text-white transition-colors"
            >
              View all
            </button>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {projects.slice(0, 5).map((project) => (
              <div key={project.id} className="flex items-center gap-3 p-2 sm:p-3 rounded-lg bg-white/5">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs sm:text-sm font-medium truncate">{project.title}</p>
                  <p className="text-white/40 text-[10px] sm:text-xs capitalize">{project.category}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs ${
                  project.status === 'ongoing'
                    ? 'bg-green-500/20 text-green-400'
                    : project.status === 'completed'
                    ? 'bg-blue-500/20 text-blue-400'
                    : project.status === 'draft'
                    ? 'bg-gray-500/20 text-gray-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base font-semibold text-white">Team Overview</h3>
            <button 
              onClick={onViewTeam}
              className="text-xs text-white/40 hover:text-white transition-colors"
            >
              View all
            </button>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {teamMembers.slice(0, 5).map((member) => (
              <div key={member.id} className="flex items-center gap-3 p-2 sm:p-3 rounded-lg bg-white/5">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs sm:text-sm font-medium truncate">{member.name}</p>
                  <p className="text-white/40 text-[10px] sm:text-xs">{member.role}</p>
                </div>
                <span className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${
                  member.status === 'active' ? 'bg-green-400' : 
                  member.status === 'alumni' ? 'bg-amber-400' : 'bg-gray-400'
                }`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Projects Content
function ProjectsContent({ 
  projects, 
  onAdd, 
  onEdit, 
  onView,
  onDelete, 
  loading 
}: { 
  projects: Project[]; 
  onAdd: () => void; 
  onEdit: (slug: string) => void;
  onView: (slug: string) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-white">All Projects</h2>
          <p className="text-white/40 text-sm">Manage portfolio projects and their details</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors text-xs sm:text-sm"
        >
          <Plus className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          <span className="hidden sm:inline">Add Project</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {loading ? (
        <div className="glass rounded-xl sm:rounded-2xl h-64 sm:h-96 animate-pulse" />
      ) : (
        <div className="glass rounded-xl sm:rounded-2xl overflow-hidden overflow-x-auto">
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
              {projects.map((project) => (
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
                        onClick={() => onView(project.slug)}
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                        title="View on site"
                      >
                        <Eye className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(project.slug)}
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(project.id)}
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
          
          {projects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/40 text-sm">No projects found</p>
              <button
                onClick={onAdd}
                className="mt-3 text-white/60 hover:text-white text-sm underline"
              >
                Create your first project
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Team Content
function TeamContent({ 
  members, 
  onAdd, 
  onEdit, 
  onView,
  onDelete, 
  loading 
}: { 
  members: TeamMember[]; 
  onAdd: () => void; 
  onEdit: (slug: string) => void;
  onView: (slug: string) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-white">Team Members</h2>
          <p className="text-white/40 text-sm">Manage team member profiles and information</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors text-xs sm:text-sm"
        >
          <Plus className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          <span className="hidden sm:inline">Add Member</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {loading ? (
        <div className="glass rounded-xl sm:rounded-2xl h-64 sm:h-96 animate-pulse" />
      ) : (
        <div className="glass rounded-xl sm:rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="border-b border-white/10">
              <tr>
                <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-white/40 font-medium text-[10px] sm:text-xs">Member</th>
                <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-white/40 font-medium text-[10px] sm:text-xs">Role</th>
                <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-white/40 font-medium text-[10px] sm:text-xs">Status</th>
                <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-white/40 font-medium text-[10px] sm:text-xs hidden sm:table-cell">Joined</th>
                <th className="text-right px-3 sm:px-6 py-3 sm:py-4 text-white/40 font-medium text-[10px] sm:text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-white text-xs sm:text-sm font-medium truncate max-w-[120px] sm:max-w-none">{member.name}</p>
                        <p className="text-white/30 text-[10px] sm:text-xs">/{member.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <span className="text-white/40 text-[10px] sm:text-xs">{member.role}</span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs ${
                      member.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : member.status === 'alumni'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                    <span className="text-white/40 text-xs">
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                      <button
                        onClick={() => onView(member.slug)}
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                        title="View profile"
                      >
                        <Eye className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(member.slug)}
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(member.id)}
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
          
          {members.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/40 text-sm">No team members found</p>
              <button
                onClick={onAdd}
                className="mt-3 text-white/60 hover:text-white text-sm underline"
              >
                Add your first team member
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Settings Content
function SettingsContent() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: '',
    contactEmail: '',
    heroVideoUrl: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      const loaded = await getSettings();
      if (!mounted) return;
      setSettings(loaded);
      setIsLoading(false);
    };

    loadSettings();
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (field: keyof SiteSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await saveSettings(settings);
    toast.success('Settings saved successfully!');

    // Notify other tabs/windows about the change
    window.dispatchEvent(new Event('site-settings-updated'));
  };

  if (isLoading) {
    return (
      <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="h-64 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6">
      <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-4 sm:mb-6">Site Settings</h2>
      <div className="space-y-4 sm:space-y-6">
        {/* Site Name */}
        <div>
          <label className="block text-white/60 text-xs sm:text-sm mb-1.5 sm:mb-2">
            Site Name
          </label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => handleChange('siteName', e.target.value)}
            placeholder="VLSI & AI Robotics Lab"
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
          />
        </div>

        {/* Contact Email */}
        <div>
          <label className="block text-white/60 text-xs sm:text-sm mb-1.5 sm:mb-2">
            Contact Email
          </label>
          <input
            type="email"
            value={settings.contactEmail}
            onChange={(e) => handleChange('contactEmail', e.target.value)}
            placeholder="contact@lab.edu"
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
          />
        </div>

        {/* Hero Video URL */}
        <div>
          <label className="block text-white/60 text-xs sm:text-sm mb-1.5 sm:mb-2">
            Hero Video URL
          </label>
          <input
            type="url"
            value={settings.heroVideoUrl}
            onChange={(e) => handleChange('heroVideoUrl', e.target.value)}
            placeholder="https://example.com/video.mp4"
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
          />
          <p className="text-white/30 text-xs mt-1.5">
            Video will be displayed in the background of the home page hero section.
          </p>
          
          {/* Video Preview */}
          {settings.heroVideoUrl && (
            <div className="mt-3 rounded-lg overflow-hidden bg-black/50 aspect-video">
              <video
                src={settings.heroVideoUrl}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => e.currentTarget.pause()}
              />
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end pt-2">
          <button 
            onClick={handleSave}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors text-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
