import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Filter } from 'lucide-react';
// import { toast } from 'sonner';
import type { ActivityLog } from '@/types';
import { getActivityLogs } from '@/lib/supabase';
import { AdminLayout } from '@/features/admin/components/AdminLayout';

export function LogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'admin' | 'member'>('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    const data = await getActivityLogs(500); // Get last 500 logs
    setLogs(data);
    setLoading(false);
  };

  const filteredLogs = logs.filter((log) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = [
      log.actorName,
      log.actorEmail,
      log.actorRole,
      log.action,
      log.entityType,
      log.entityName,
      log.entitySlug,
      log.message,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(query);

    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'admin' ? log.actorRole === 'admin' :
      filter === 'member' ? log.actorRole === 'member' : true;

    return matchesSearch && matchesFilter;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-500/20 text-green-400';
      case 'update':
        return 'bg-blue-500/20 text-blue-400';
      case 'delete':
        return 'bg-red-500/20 text-red-400';
      case 'media_update':
        return 'bg-purple-500/20 text-purple-400';
      case 'login':
        return 'bg-amber-500/20 text-amber-400';
      case 'logout':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-white/10 text-white/60';
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'project':
        return '📁';
      case 'team_member':
      case 'member_profile':
        return '👤';
      case 'site_settings':
        return '⚙️';
      default:
        return '📝';
    }
  };

  const headerActions = (
    <div className="flex items-center gap-2">
      <button
        onClick={fetchLogs}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 transition-colors text-sm disabled:opacity-50"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        Refresh
      </button>
    </div>
  );

  return (
    <AdminLayout title="Activity Logs" subtitle="Track all admin and member actions" actions={headerActions}>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 sm:max-w-md px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-white/20"
          />
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/40" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin Only</option>
              <option value="member">Member Only</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Logs', value: logs.length },
            { label: 'Creates', value: logs.filter(l => l.action === 'create').length },
            { label: 'Updates', value: logs.filter(l => l.action === 'update').length },
            { label: 'Deletes', value: logs.filter(l => l.action === 'delete').length },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-4">
              <p className="text-white/40 text-xs">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="glass rounded-xl h-96 animate-pulse" />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="text-left px-4 py-3 text-white/40 font-medium text-xs">Time</th>
                    <th className="text-left px-4 py-3 text-white/40 font-medium text-xs">Actor</th>
                    <th className="text-left px-4 py-3 text-white/40 font-medium text-xs">Action</th>
                    <th className="text-left px-4 py-3 text-white/40 font-medium text-xs">Target</th>
                    <th className="text-left px-4 py-3 text-white/40 font-medium text-xs">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-white/40 text-xs whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            log.actorRole === 'admin' ? 'bg-red-400' : 'bg-blue-400'
                          }`} />
                          <div>
                            <p className="text-white text-sm font-medium">
                              {log.actorName || log.actorEmail || 'Unknown'}
                            </p>
                            <p className="text-white/30 text-xs">{log.actorRole}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span>{getEntityIcon(log.entityType)}</span>
                          <div>
                            <p className="text-white text-sm">
                              {log.entityName || log.entitySlug || 'Unknown'}
                            </p>
                            <p className="text-white/30 text-xs uppercase">{log.entityType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white/50 text-xs max-w-[300px] truncate">
                        {log.message || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-white/40 text-sm">No logs found</p>
                <button
                  onClick={fetchLogs}
                  className="mt-3 text-white/60 hover:text-white text-sm underline"
                >
                  Refresh logs
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
}
