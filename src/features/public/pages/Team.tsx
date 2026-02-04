import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, Instagram, Search } from 'lucide-react';
import type { TeamMember } from '@/types';
import { mockDataService } from '@/lib/dataService';

export function Team() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      const data = await mockDataService.getTeamMembers();
      setMembers(data);
      setFilteredMembers(data);
      setLoading(false);
    };
    fetchMembers();
  }, []);

  useEffect(() => {
    const filtered = members.filter(
      (member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.skills.some((skill) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
    setFilteredMembers(filtered);
  }, [searchQuery, members]);

  return (
    <main className="relative min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="text-white/40 text-xs sm:text-sm font-medium tracking-wider uppercase mb-2 block">
            Our People
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            Meet the Team
          </h1>
          <p className="text-white/50 text-sm sm:text-base max-w-2xl mx-auto">
            Our team consists of passionate researchers, engineers, and innovators 
            working at the intersection of VLSI design and AI robotics.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-md mx-auto mb-8 sm:mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search by name, role, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-full glass text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-white/20"
            />
          </div>
        </motion.div>

        {/* Team Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="glass rounded-2xl h-64 sm:h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {filteredMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link
                  to={`/team/${member.slug}`}
                  className="group block relative overflow-hidden rounded-xl sm:rounded-2xl glass card-hover h-full"
                >
                  {/* Cover Image */}
                  {member.coverImage && (
                    <div className="relative h-20 sm:h-28 overflow-hidden">
                      <img
                        src={member.coverImage}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505]" />
                    </div>
                  )}

                  {/* Avatar - Colorful (no grayscale) */}
                  <div className={`relative mx-auto ${member.coverImage ? '-mt-8 sm:-mt-10' : 'mt-4 sm:mt-6'} mb-2 sm:mb-4`}>
                    <div className="w-14 sm:w-20 h-14 sm:h-20 rounded-full overflow-hidden border-2 sm:border-4 border-[#050505] mx-auto">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover transition-all duration-500"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-5 pt-0 text-center">
                    <h3 className="text-sm sm:text-lg font-semibold text-white group-hover:text-zinc-300 transition-colors mb-0.5 sm:mb-1">
                      {member.name}
                    </h3>
                    <p className="text-white/40 text-[10px] sm:text-xs mb-2 sm:mb-3">{member.role}</p>
                    <p className="text-white/40 text-[10px] sm:text-xs line-clamp-2 mb-2 sm:mb-3 hidden sm:block">
                      {member.bio}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap justify-center gap-1 mb-2 sm:mb-3">
                      {member.skills.slice(0, 2).map((skill) => (
                        <span
                          key={skill}
                          className="px-1.5 sm:px-2 py-0.5 rounded-md bg-white/5 text-white/30 text-[9px] sm:text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Social Links - LinkedIn, Instagram, GitHub */}
                    <div className="flex justify-center gap-1.5 sm:gap-2">
                      {member.socialLinks
                        .filter((link) => ['github', 'linkedin', 'instagram'].includes(link.platform))
                        .slice(0, 3)
                        .map((link) => {
                          const icons = {
                            github: Github,
                            linkedin: Linkedin,
                            instagram: Instagram,
                          };
                          const Icon = icons[link.platform as keyof typeof icons];
                          if (!Icon) return null;
                          
                          return (
                            <a
                              key={link.platform}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-7 sm:w-9 h-7 sm:h-9 rounded-full glass flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                              title={link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                            >
                              <Icon className="w-3 sm:w-4 h-3 sm:h-4" />
                            </a>
                          );
                        })}
                    </div>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 group-hover:-translate-y-1">
                    <ArrowUpRight className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredMembers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 sm:py-20"
          >
            <p className="text-white/50 text-sm sm:text-lg">No team members found matching your search.</p>
          </motion.div>
        )}
      </div>
    </main>
  );
}
