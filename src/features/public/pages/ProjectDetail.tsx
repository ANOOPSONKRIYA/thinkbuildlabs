import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  Github, 
  Play,
  Users,
  Clock,
  Tag
} from 'lucide-react';
import type { Project, TeamMember } from '@/types';
import { mockDataService } from '@/lib/dataService';

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) return;
      const data = await mockDataService.getProjectBySlug(slug);
      if (data) {
        setProject(data);
        // Fetch team members
        const allMembers = await mockDataService.getTeamMembers();
        const projectMembers = allMembers.filter(m => data.teamMembers.includes(m.id));
        setTeamMembers(projectMembers);
      }
      setLoading(false);
    };
    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <main className="relative min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-2xl h-72 sm:h-96 animate-pulse" />
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="relative min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Project Not Found</h1>
          <p className="text-white/50 mb-6 sm:mb-8">The project you're looking for doesn't exist.</p>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
            Back to Portfolio
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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 sm:mb-12"
        >
          {/* Badges */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
            <span className="px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-white/10 text-white/80">
              {project.category === 'ai-robotics' ? 'AI & Robotics' : project.category.toUpperCase()}
            </span>
            <span className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium ${
              project.status === 'ongoing'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-blue-500/20 text-blue-400'
            }`}>
              {project.status === 'ongoing' ? 'Ongoing' : 'Completed'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
            {project.title}
          </h1>
          <p className="text-sm sm:text-base text-white/50 max-w-3xl">
            {project.shortDescription}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Image Gallery */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass rounded-xl sm:rounded-2xl overflow-hidden"
            >
              <div className="relative aspect-video">
                <img
                  src={project.images[activeImage] || project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {project.images.length > 1 && (
                <div className="flex gap-2 p-3 sm:p-4 overflow-x-auto">
                  {project.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`flex-shrink-0 w-16 sm:w-20 h-16 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === index
                          ? 'border-white'
                          : 'border-transparent hover:border-white/20'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${project.title} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.section>

            {/* Description */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">About the Project</h2>
              <div className="prose prose-invert max-w-none">
                {project.fullDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-white/50 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.section>

            {/* Videos */}
            {project.videos.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6"
              >
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Videos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {project.videos.map((video) => (
                    <div
                      key={video.id}
                      className="relative aspect-video rounded-lg sm:rounded-xl overflow-hidden bg-black cursor-pointer group"
                      onClick={() => setActiveVideo(video.url)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                          <Play className="w-5 sm:w-8 h-5 sm:h-8 text-white ml-0.5 sm:ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black to-transparent">
                        <p className="text-white text-xs sm:text-sm font-medium">{video.title}</p>
                        {video.description && (
                          <p className="text-white/50 text-[10px] sm:text-xs">{video.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Timeline */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Project Timeline</h2>
              <div className="relative">
                <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-0.5 timeline-line" />
                <div className="space-y-4 sm:space-y-6">
                  {project.timeline.map((event) => (
                    <div key={event.id} className="relative pl-10 sm:pl-12">
                      <div className={`absolute left-0 w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center ${
                        event.milestone
                          ? 'bg-white timeline-dot'
                          : 'bg-[#0a0a0a] border-2 border-white/20'
                      }`}>
                        {event.milestone ? (
                          <CheckCircle2 className="w-3 sm:w-4 h-3 sm:h-4 text-black" />
                        ) : (
                          <Circle className="w-2 sm:w-3 h-2 sm:h-3 text-white/40" />
                        )}
                      </div>
                      <div className="glass rounded-lg sm:rounded-xl p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-3 sm:w-4 h-3 sm:h-4 text-white/40" />
                          <span className="text-white/40 text-xs sm:text-sm">
                            {new Date(event.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <h3 className="text-white text-sm sm:text-base font-medium mb-1">{event.title}</h3>
                        <p className="text-white/40 text-xs sm:text-sm">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Tech Stack */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6"
            >
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <Tag className="w-4 sm:w-5 h-4 sm:h-5 text-white/40" />
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white/5 text-white/60 text-xs sm:text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.section>

            {/* Project Info */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6"
            >
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-white/40" />
                Project Info
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <p className="text-white/30 text-xs sm:text-sm">Start Date</p>
                  <p className="text-white text-sm sm:text-base">
                    {new Date(project.startDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </p>
                </div>
                {project.endDate && (
                  <div>
                    <p className="text-white/30 text-xs sm:text-sm">End Date</p>
                    <p className="text-white text-sm sm:text-base">
                      {new Date(project.endDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-white/30 text-xs sm:text-sm">Duration</p>
                  <p className="text-white text-sm sm:text-base">
                    {project.endDate
                      ? `${Math.ceil(
                          (new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) /
                            (1000 * 60 * 60 * 24 * 30)
                        )} months`
                      : 'Ongoing'}
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Team Members */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6"
            >
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <Users className="w-4 sm:w-5 h-4 sm:h-5 text-white/40" />
                Team
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {teamMembers.map((member) => (
                  <Link
                    key={member.id}
                    to={`/team/${member.slug}`}
                    className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-white text-sm font-medium group-hover:text-zinc-300 transition-colors">
                        {member.name}
                      </p>
                      <p className="text-white/40 text-xs">{member.role}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>

            {/* Links */}
            {(project.githubUrl || project.demoUrl || project.documentationUrl) && (
              <motion.section
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6"
              >
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Links</h3>
                <div className="space-y-2 sm:space-y-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 sm:gap-3 text-white/50 hover:text-white transition-colors"
                    >
                      <Github className="w-4 sm:w-5 h-4 sm:h-5" />
                      <span className="text-xs sm:text-sm">GitHub Repository</span>
                      <ExternalLink className="w-3 sm:w-4 h-3 sm:h-4 ml-auto" />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 sm:gap-3 text-white/50 hover:text-white transition-colors"
                    >
                      <Play className="w-4 sm:w-5 h-4 sm:h-5" />
                      <span className="text-xs sm:text-sm">Live Demo</span>
                      <ExternalLink className="w-3 sm:w-4 h-3 sm:h-4 ml-auto" />
                    </a>
                  )}
                  {project.documentationUrl && (
                    <a
                      href={project.documentationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 sm:gap-3 text-white/50 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-4 sm:w-5 h-4 sm:h-5" />
                      <span className="text-xs sm:text-sm">Documentation</span>
                      <ExternalLink className="w-3 sm:w-4 h-3 sm:h-4 ml-auto" />
                    </a>
                  )}
                </div>
              </motion.section>
            )}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div className="relative w-full max-w-4xl aspect-video">
            <iframe
              src={activeVideo}
              title="Project Video"
              className="w-full h-full rounded-xl sm:rounded-2xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </main>
  );
}
