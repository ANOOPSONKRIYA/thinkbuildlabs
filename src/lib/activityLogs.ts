import type { ActivityLog, TeamMember } from '@/types';
import type { User } from '@supabase/supabase-js';
import { createActivityLog, getCurrentUser } from '@/lib/supabase';

type LogPayload = Omit<ActivityLog, 'id' | 'createdAt' | 'actorId' | 'actorName' | 'actorEmail' | 'actorRole'> & {
  details?: Record<string, any>;
};

export async function logAdminAction(payload: LogPayload) {
  const user = await getCurrentUser();
  if (!user) return;

  const actorName = user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'Unknown Admin';

  const ok = await createActivityLog({
    actorId: user.id,
    actorName,
    actorEmail: user.email || undefined,
    actorRole: 'admin',
    ...payload,
  });

  if (!ok) {
    console.warn('Failed to write admin activity log', payload);
  }
}

export async function logMemberAction(payload: LogPayload, user: User, member: TeamMember) {
  if (!user || !member) return;

  const ok = await createActivityLog({
    actorId: user.id,
    actorName: member.name || user.email || 'Unknown Member',
    actorEmail: member.email || user.email || undefined,
    actorRole: 'member',
    ...payload,
  });

  if (!ok) {
    console.warn('Failed to write member activity log', payload);
  }
}
