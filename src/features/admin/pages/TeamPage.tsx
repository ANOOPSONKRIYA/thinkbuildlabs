import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, Star } from 'lucide-react';
import { toast } from 'sonner';
import type { TeamMember } from '@/types';
import { mockDataService } from '@/lib/dataService';
import { deleteTeamMemberMedia } from '@/lib/supabase';
import { logAdminAction } from '@/lib/activityLogs';
import { AdminLayout } from '@/features/admin/components/AdminLayout';

export function TeamPage() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const data = await mockDataService.getTeamMembers();
    setMembers(data);
    setLoading(false);
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;

    try {
      const member = members.find((m) => m.id === id);
      if (member) {
        await deleteTeamMemberMedia(member);
      }
      await mockDataService.deleteTeamMember(id);
      toast.success('Team member deleted successfully');
      await logAdminAction({
        action: 'delete',
        entityType: 'team_member',
        entityId: id,
        entitySlug: member?.slug,
        entityName: member?.name,
        message: `Deleted team member "${member?.name || 'Unknown'}"`,
      });
      fetchMembers();
    } catch (error) {
      toast.error('Failed to delete team member');
    }
  };

  const handleToggleFeatured = async (member: TeamMember) => {
    try {
      const next = !member.isFeatured;
      await mockDataService.updateTeamMember(member.id, { isFeatured: next });
      toast.success(next ? 'Member starred for home page' : 'Removed from featured members');
      await logAdminAction({
        action: next ? 'feature' : 'unfeature',
        entityType: 'team_member',
        entityId: member.id,
        entitySlug: member.slug,
        entityName: member.name,
        message: `${next ? 'Started' : 'Unstarted'} member "${member.name}"`,
        details: { isFeatured: next },
      });
      fetchMembers();
    } catch (error) {
      toast.error('Failed to update member');
    }
  };

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const headerActions = (
    <button
      onClick={() => navigate('/admin/team/new')}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors text-sm"
    >
      <Plus className="w-4 h-4" />
      Add Member
    </button>
  );

  return (
    <AdminLayout title="Team Members" subtitle="Manage team member profiles" actions={headerActions}>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search members..."
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
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-white/40 font-medium text-[10px] sm:text-xs">Member</th>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-white/40 font-medium text-[10px] sm:text-xs">Role</th>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-white/40 font-medium text-[10px] sm:text-xs">Status</th>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-white/40 font-medium text-[10px] sm:text-xs hidden sm:table-cell">Joined</th>
                  <th className="text-right px-3 sm:px-6 py-3 sm:py-4 text-white/40 font-medium text-[10px] sm:text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <p className="text-white text-xs sm:text-sm font-medium truncate max-w-[120px] sm:max-w-none">{member.name}</p>
                            {member.isFeatured && (
                              <Star className="w-3.5 h-3.5 text-amber-300" fill="currentColor" />
                            )}
                          </div>
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
                          onClick={() => handleToggleFeatured(member)}
                          className={`p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors ${
                            member.isFeatured ? 'text-amber-300' : 'text-white/40 hover:text-white'
                          }`}
                          title={member.isFeatured ? 'Unstart member' : 'Start / feature member'}
                        >
                          <Star
                            className="w-3.5 sm:w-4 h-3.5 sm:h-4"
                            fill={member.isFeatured ? 'currentColor' : 'none'}
                          />
                        </button>
                        <button
                          onClick={() => window.open(`/team/${member.slug}`, '_blank')}
                          className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                          title="View profile"
                        >
                          <Eye className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/team/${member.slug}`)}
                          className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id)}
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
            
            {filteredMembers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-white/40 text-sm">No team members found</p>
                <button
                  onClick={() => navigate('/admin/team/new')}
                  className="mt-3 text-white/60 hover:text-white text-sm underline"
                >
                  Add your first team member
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
}
