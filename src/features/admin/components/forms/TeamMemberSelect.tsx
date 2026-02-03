import { useState, useMemo } from 'react';
import { Search, X, Users } from 'lucide-react';
import type { TeamMember, TeamMemberRole } from '@/types';

interface TeamMemberSelectProps {
  availableMembers: TeamMember[];
  selectedIds: string[];
  memberRoles?: TeamMemberRole[];
  onChange: (ids: string[], roles?: TeamMemberRole[]) => void;
  label?: string;
}

export function TeamMemberSelect({
  availableMembers,
  selectedIds,
  memberRoles = [],
  onChange,
  label = 'Team Members',
}: TeamMemberSelectProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const selectedMembers = useMemo(() => {
    return availableMembers.filter((m) => selectedIds.includes(m.id));
  }, [availableMembers, selectedIds]);

  const filteredMembers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return availableMembers.filter(
      (m) =>
        !selectedIds.includes(m.id) &&
        (m.name.toLowerCase().includes(query) || m.role.toLowerCase().includes(query))
    );
  }, [availableMembers, selectedIds, searchQuery]);

  const toggleMember = (memberId: string) => {
    if (selectedIds.includes(memberId)) {
      onChange(
        selectedIds.filter((id) => id !== memberId),
        memberRoles.filter((r) => r.memberId !== memberId)
      );
    } else {
      onChange([...selectedIds, memberId], memberRoles);
    }
  };

  const updateMemberRole = (memberId: string, role: string) => {
    const existingIndex = memberRoles.findIndex((r) => r.memberId === memberId);
    let newRoles: TeamMemberRole[];

    if (existingIndex >= 0) {
      newRoles = [...memberRoles];
      newRoles[existingIndex] = { memberId, role };
    } else {
      newRoles = [...memberRoles, { memberId, role }];
    }

    onChange(selectedIds, newRoles);
  };

  const getMemberRole = (memberId: string): string => {
    return memberRoles.find((r) => r.memberId === memberId)?.role || '';
  };

  return (
    <div className="space-y-3">
      <label className="block text-white/60 text-sm">{label}</label>

      {/* Selected members */}
      {selectedMembers.length > 0 && (
        <div className="space-y-2">
          {selectedMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
            >
              <img
                src={member.avatar}
                alt={member.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{member.name}</p>
                <p className="text-white/40 text-xs truncate">{member.role}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={getMemberRole(member.id)}
                  onChange={(e) => updateMemberRole(member.id, e.target.value)}
                  placeholder="Role in project"
                  className="w-32 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-white/20"
                />
                <button
                  type="button"
                  onClick={() => toggleMember(member.id)}
                  className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add members dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-colors"
        >
          <Users className="w-4 h-4" />
          <span className="text-sm">
            {selectedMembers.length > 0 ? 'Add more members' : 'Select team members'}
          </span>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-50">
            {/* Search */}
            <div className="px-3 pb-2 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search members..."
                  autoFocus
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
                />
              </div>
            </div>

            {/* Member list */}
            <div className="max-h-60 overflow-auto">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => {
                      toggleMember(member.id);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors text-left"
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{member.name}</p>
                      <p className="text-white/40 text-xs truncate">{member.role}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-white/30 text-sm">
                  {searchQuery ? 'No members found' : 'All members added'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <p className="text-white/30 text-xs">
        Select team members involved in this project. You can specify their role in the project.
      </p>
    </div>
  );
}

// Multi-select for projects (for team member form)
interface ProjectSelectProps {
  availableProjects: Array<{ id: string; title: string; thumbnail: string; category: string }>;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  label?: string;
}

export function ProjectSelect({
  availableProjects,
  selectedIds,
  onChange,
  label = 'Linked Projects',
}: ProjectSelectProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const selectedProjects = availableProjects.filter((p) => selectedIds.includes(p.id));

  const filteredProjects = availableProjects.filter(
    (p) =>
      !selectedIds.includes(p.id) &&
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleProject = (projectId: string) => {
    if (selectedIds.includes(projectId)) {
      onChange(selectedIds.filter((id) => id !== projectId));
    } else {
      onChange([...selectedIds, projectId]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-white/60 text-sm">{label}</label>

      {/* Selected projects */}
      {selectedProjects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {selectedProjects.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 group"
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
              <button
                type="button"
                onClick={() => toggleProject(project.id)}
                className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add projects dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span className="text-sm">
            {selectedProjects.length > 0 ? 'Link more projects' : 'Link projects'}
          </span>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-50">
            <div className="px-3 pb-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                autoFocus
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
              />
            </div>

            <div className="max-h-60 overflow-auto">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => {
                      toggleProject(project.id);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors text-left"
                  >
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{project.title}</p>
                      <p className="text-white/40 text-xs capitalize">{project.category}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-white/30 text-sm">
                  {searchQuery ? 'No projects found' : 'All projects linked'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
