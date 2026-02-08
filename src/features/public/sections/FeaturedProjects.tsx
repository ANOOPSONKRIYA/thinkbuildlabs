import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types';
import { mockDataService } from '@/lib/dataService';

export function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const featured = await mockDataService.getProjects(undefined, { featuredOnly: true });
      const source = featured.length > 0 ? featured : await mockDataService.getProjects();
      setProjects(source.slice(0, 3));
      setLoading(false);
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-2xl h-72 sm:h-96 animate-pulse" />
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
              Our Work
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Featured Projects
            </h2>
          </div>
          <Link
            to="/portfolio"
            className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors mt-4 sm:mt-0"
          >
            View All Projects
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/portfolio/${project.slug}`}
                className="group block relative overflow-hidden rounded-2xl glass card-hover"
              >
                {/* Image */}
                <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                    <span className="px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-white/10 text-white/80">
                      {project.category === 'ai-robotics' ? 'AI & Robotics' : project.category.toUpperCase()}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                    <span className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                      project.status === 'ongoing'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {project.status === 'ongoing' ? 'Ongoing' : 'Completed'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 group-hover:text-zinc-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-white/50 text-sm line-clamp-2 mb-3 sm:mb-4">
                    {project.shortDescription}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 sm:py-1 rounded-md bg-white/5 text-white/40 text-[10px] sm:text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span className="px-2 py-0.5 sm:py-1 rounded-md bg-white/5 text-white/40 text-[10px] sm:text-xs">
                        +{project.techStack.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Link */}
                  <div className="flex items-center gap-2 text-white text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    View Project
                    <ArrowUpRight className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
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
