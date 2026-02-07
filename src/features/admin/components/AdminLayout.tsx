import { useState, useEffect } from 'react';
import { useNavigate, useLocation, matchPath } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  Settings, 
  LogOut,
  Search,
  Menu,
  ExternalLink,
  Activity,
  ArrowLeft,
} from 'lucide-react';
import { signOut } from '@/lib/supabase';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
}

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { id: 'projects', label: 'Projects', icon: FolderOpen, path: '/admin/projects' },
  { id: 'team', label: 'Team Members', icon: Users, path: '/admin/team' },
  { id: 'logs', label: 'Activity Logs', icon: Activity, path: '/admin/logs' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export function AdminLayout({ 
  children, 
  title,
  subtitle,
  showBackButton,
  onBack,
  actions 
}: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Determine active tab from URL
  const getActiveTabFromUrl = () => {
    const path = location.pathname;
    if (matchPath('/admin/team/*', path)) return 'team';
    if (matchPath('/admin/portfolio/*', path)) return 'projects';
    if (matchPath('/admin/projects/*', path)) return 'projects';
    if (path.includes('/logs')) return 'logs';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const activeTab = getActiveTabFromUrl();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleNavigate = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const activeItem = sidebarItems.find(item => item.id === activeTab);
  const pageTitle = title || activeItem?.label || 'Admin';

  return (
    <div className="h-screen bg-[#050505] flex overflow-hidden">
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

      {/* Sidebar - Fixed */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 admin-sidebar border-r border-white/10 flex-shrink-0 transition-transform duration-300 flex flex-col h-full ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-4 sm:p-6 flex-shrink-0">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl bg-white flex items-center justify-center">
              <LayoutDashboard className="w-4 sm:w-5 h-4 sm:h-5 text-black" />
            </div>
            <span className="font-bold text-white text-sm sm:text-base">Admin Panel</span>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeTab;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-left transition-all text-sm ${
                    isActive
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

        <div className="mt-auto p-4 sm:p-6 border-t border-white/10 flex-shrink-0">
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
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header - Fixed */}
        <header className="flex-shrink-0 z-30 glass-strong border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors flex-shrink-0"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
              
              {showBackButton && (
                <button
                  onClick={onBack}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/60 hover:text-white flex-shrink-0"
                  title="Go back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-white truncate">
                  {pageTitle}
                </h1>
                {subtitle && (
                  <p className="text-white/40 text-xs sm:text-sm truncate hidden sm:block">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {actions}
              <div className="relative hidden sm:block">
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

        {/* Page Content - Scrollable */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
