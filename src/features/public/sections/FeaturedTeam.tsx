import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin } from 'lucide-react';
import type { TeamMember } from '@/types';
import { mockDataService } from '@/lib/mockData';

export function FeaturedTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      const data = await mockDataService.getTeamMembers();
      setMembers(data.slice(0, 4));
      setLoading(false);
    };
    fetchMembers();
  }, []);

  if (loading) {
    return (
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass rounded-2xl h-64 sm:h-80 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 sm:mb-12"
        >
          <div>
            <span className="text-white/40 text-xs sm:text-sm font-medium tracking-wider uppercase mb-2 block">
              Our People
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Meet the Team
            </h2>
          </div>
          <Link
            to="/team"
            className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors mt-4 sm:mt-0"
          >
            View All Members
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/team/${member.slug}`}
                className="group block relative overflow-hidden rounded-2xl glass card-hover"
              >
                {/* Image - Colorful (no grayscale) */}
                <div className="relative h-48 sm:h-56 lg:h-72 overflow-hidden">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Social Links - Appear on Hover */}
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    {member.socialLinks.map((link) => {
                      if (link.platform === 'github') {
                        return (
                          <a
                            key={link.platform}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 sm:w-10 h-8 sm:h-10 rounded-full glass flex items-center justify-center text-white hover:text-white hover:bg-white/10 transition-all"
                          >
                            <Github className="w-4 sm:w-5 h-4 sm:h-5" />
                          </a>
                        );
                      }
                      if (link.platform === 'linkedin') {
                        return (
                          <a
                            key={link.platform}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 sm:w-10 h-8 sm:h-10 rounded-full glass flex items-center justify-center text-white hover:text-white hover:bg-white/10 transition-all"
                          >
                            <Linkedin className="w-4 sm:w-5 h-4 sm:h-5" />
                          </a>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-5">
                  <h3 className="text-sm sm:text-lg font-semibold text-white group-hover:text-zinc-300 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-white/40 text-xs sm:text-sm">{member.role}</p>
                  
                  {/* Skills */}
                  <div className="flex flex-wrap gap-1 mt-2 sm:mt-3">
                    {member.skills.slice(0, 2).map((skill) => (
                      <span
                        key={skill}
                        className="px-1.5 sm:px-2 py-0.5 rounded-md bg-white/5 text-white/30 text-[10px] sm:text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
