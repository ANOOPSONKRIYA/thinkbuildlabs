import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Filter, Cpu, Brain, FlaskConical } from 'lucide-react';
import type { Project } from '@/types';
import { mockDataService } from '@/lib/dataService';

const categories = [
  { id: 'all', label: 'All Projects', icon: Filter },
  { id: 'vlsi', label: 'VLSI Design', icon: Cpu },
  { id: 'ai-robotics', label: 'AI & Robotics', icon: Brain },
  { id: 'research', label: 'Research', icon: FlaskConical },
];

export function Portfolio() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');

  useEffect(() => {
    const fetchProjects = async () => {
      const category = activeCategory === 'all' ? undefined : activeCategory;
      const data = await mockDataService.getProjects(category);
      setProjects(data);
      setLoading(false);
    };
    fetchProjects();
  }, [activeCategory]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

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
            Our Work
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            Portfolio
          </h1>
          <p className="text-white/50 text-sm sm:text-base max-w-2xl mx-auto">
            Explore our projects in VLSI design, AI, robotics, and research. 
            Each project represents our commitment to innovation and excellence.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white text-black'
                    : 'glass text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                {category.label}
              </button>
            );
          })}
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass rounded-2xl h-72 sm:h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    to={`/portfolio/${project.slug}`}
                    className="group block relative overflow-hidden rounded-2xl glass card-hover h-full"
                  >
                    {/* Image */}
                    <div className="relative h-44 sm:h-56 overflow-hidden">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                        <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-white/10 text-white/80">
                          {project.category === 'ai-robotics' ? 'AI & Robotics' : project.category.toUpperCase()}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                        <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
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
                      <h3 className="text-base sm:text-xl font-semibold text-white mb-1.5 sm:mb-2 group-hover:text-zinc-300 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-white/50 text-xs sm:text-sm line-clamp-2 mb-3 sm:mb-4">
                        {project.shortDescription}
                      </p>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                        {project.techStack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-white/5 text-white/40 text-[10px] sm:text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-white/5 text-white/40 text-[10px] sm:text-xs">
                            +{project.techStack.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <span className="text-white/30 text-[10px] sm:text-xs">
                          {new Date(project.startDate).getFullYear()}
                          {project.endDate && ` - ${new Date(project.endDate).getFullYear()}`}
                        </span>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-white text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          View
                          <ArrowUpRight className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Empty State */}
        {!loading && projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 sm:py-20"
          >
            <p className="text-white/50 text-sm sm:text-lg">No projects found in this category.</p>
          </motion.div>
        )}
      </div>
    </main>
  );
}
