import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Github, 
  Linkedin, 
  Twitter, 
  Globe,
  Download,
  Briefcase,
  GraduationCap,
  Award,
  FolderOpen,
  Calendar,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import type { TeamMember, Project } from '@/types';
import { mockDataService } from '@/lib/dataService';

export function TeamMemberDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<TeamMember | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      if (!slug) return;
      const data = await mockDataService.getTeamMemberBySlug(slug);
      if (data) {
        setMember(data);
        // Fetch member's projects
        const allProjects = await mockDataService.getProjects();
        const memberProjects = allProjects.filter(p => data.projects.includes(p.id));
        setProjects(memberProjects);
      }
      setLoading(false);
    };
    fetchMember();
  }, [slug]);

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'github': return Github;
      case 'linkedin': return Linkedin;
      case 'twitter': return Twitter;
      case 'portfolio': return Globe;
      case 'email': return Mail;
      default: return ExternalLink;
    }
  };

  if (loading) {
    return (
      <main className="relative min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-2xl h-72 sm:h-96 animate-pulse" />
        </div>
      </main>
    );
  }

  if (!member) {
    return (
      <main className="relative min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Member Not Found</h1>
          <p className="text-white/50 mb-6 sm:mb-8">The team member you're looking for doesn't exist.</p>
          <Link
            to="/team"
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
            Back to Team
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-6 sm:mb-8"
        >
          <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
          Back
        </motion.button>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-2xl sm:rounded-3xl overflow-hidden mb-6 sm:mb-8"
        >
          {/* Cover Image */}
          {member.coverImage && (
            <div className="relative h-32 sm:h-48 lg:h-64 overflow-hidden">
              <img
                src={member.coverImage}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505]" />
            </div>
          )}

          {/* Profile Info */}
          <div className={`relative px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 ${member.coverImage ? '-mt-12 sm:-mt-16 lg:-mt-20' : 'pt-6 sm:pt-8'}`}>
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="w-20 sm:w-28 lg:w-36 h-20 sm:h-28 lg:h-36 rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-4 border-[#050505] shadow-2xl flex-shrink-0">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 pt-0 sm:pt-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                  {member.name}
                </h1>
                <p className="text-white/40 text-sm sm:text-base mb-3 sm:mb-4">{member.role}</p>
                <p className="text-white/50 text-sm leading-relaxed max-w-2xl mb-4 sm:mb-6">
                  {member.bio}
                </p>

                {/* Contact & Social */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-1.5 sm:gap-2 text-white/40 hover:text-white transition-colors"
                    >
                      <Mail className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                      <span className="text-xs sm:text-sm">{member.email}</span>
                    </a>
                  )}
                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className="flex items-center gap-1.5 sm:gap-2 text-white/40 hover:text-white transition-colors"
                    >
                      <Phone className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                      <span className="text-xs sm:text-sm">{member.phone}</span>
                    </a>
                  )}

                  {/* Social Links */}
                  <div className="flex items-center gap-1.5 sm:gap-2 ml-0 sm:ml-auto">
                    {member.socialLinks.map((link) => {
                      const Icon = getSocialIcon(link.platform);
                      return (
                        <a
                          key={link.platform}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 sm:w-10 h-8 sm:h-10 rounded-full glass flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                        >
                          <Icon className="w-4 sm:w-5 h-4 sm:h-5" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Resume Download */}
              {member.resume && (
                <a
                  href={member.resume.url}
                  download={member.resume.filename}
                  className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-black font-medium rounded-full hover:bg-zinc-200 transition-colors text-xs sm:text-sm"
                >
                  <Download className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                  Resume
                </a>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Experience */}
            {member.experience.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6"
              >
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
                  <Briefcase className="w-4 sm:w-5 h-4 sm:h-5 text-white/40" />
                  Experience
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  {member.experience.map((exp) => (
                    <div key={exp.id} className="relative pl-4 sm:pl-6 border-l-2 border-white/10">
                      <div className="absolute left-0 top-0 w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-white -translate-x-[5px]" />
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-1">
                        <h3 className="text-white text-sm sm:text-base font-medium">{exp.position}</h3>
                        <span className="text-white/30 text-xs sm:text-sm mt-0.5 sm:mt-0">
                          {new Date(exp.startDate).getFullYear()} -
                          {exp.current ? ' Present' : exp.endDate ? ` ${new Date(exp.endDate).getFullYear()}` : ''}
                        </span>
                      </div>
                      <p className="text-white/40 text-xs sm:text-sm mb-1">{exp.company}</p>
                      <p className="text-white/30 text-xs sm:text-sm">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Education */}
            {member.education.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6"
              >
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
                  <GraduationCap className="w-4 sm:w-5 h-4 sm:h-5 text-white/40" />
                  Education
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  {member.education.map((edu) => (
                    <div key={edu.id} className="relative pl-4 sm:pl-6 border-l-2 border-white/10">
                      <div className="absolute left-0 top-0 w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-white/60 -translate-x-[5px]" />
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-1">
                        <h3 className="text-white text-sm sm:text-base font-medium">
                          {edu.degree} in {edu.field}
                        </h3>
                        <span className="text-white/30 text-xs sm:text-sm mt-0.5 sm:mt-0">
                          {edu.startYear} -
                          {edu.current ? ' Present' : edu.endYear ? ` ${edu.endYear}` : ''}
                        </span>
                      </div>
                      <p className="text-white/40 text-xs sm:text-sm mb-1">{edu.institution}</p>
                      {edu.description && (
                        <p className="text-white/30 text-xs sm:text-sm">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6"
              >
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
                  <FolderOpen className="w-4 sm:w-5 h-4 sm:h-5 text-white/40" />
                  Projects
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {projects.map((project) => (
                    <Link
                      key={project.id}
                      to={`/portfolio/${project.slug}`}
                      className="group glass rounded-lg sm:rounded-xl overflow-hidden hover:border-white/20 transition-colors"
                    >
                      <div className="relative h-24 sm:h-32 overflow-hidden">
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="text-white text-sm sm:text-base font-medium group-hover:text-zinc-300 transition-colors mb-0.5 sm:mb-1">
                          {project.title}
                        </h3>
                        <p className="text-white/40 text-xs line-clamp-2">
                          {project.shortDescription}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Skills */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6"
            >
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-3 sm:mb-4">Skills</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white/5 text-white/50 text-xs sm:text-sm hover:bg-white/10 hover:text-white transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.section>

            {/* Achievements */}
            {member.achievements.length > 0 && (
              <motion.section
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6"
              >
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Award className="w-4 sm:w-5 h-4 sm:h-5 text-white/40" />
                  Achievements
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {member.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-white/40 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white text-xs sm:text-sm font-medium">{achievement.title}</p>
                        <p className="text-white/40 text-[10px] sm:text-xs">{achievement.description}</p>
                        <p className="text-white/30 text-[10px] sm:text-xs mt-0.5">
                          {new Date(achievement.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Member Since */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6"
            >
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-white/40" />
                Member Info
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <p className="text-white/30 text-[10px] sm:text-xs">Member Since</p>
                  <p className="text-white text-sm sm:text-base">
                    {new Date(member.joinedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-white/30 text-[10px] sm:text-xs">Status</p>
                  <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                    member.isActive
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    <span className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full ${member.isActive ? 'bg-green-400' : 'bg-gray-400'}`} />
                    {member.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </main>
  );
}
