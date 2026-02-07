import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Eye, 
  Lightbulb, 
  CheckCircle2,
  Users,
  BookOpen,
  Hexagon,
  Triangle,
  Command,
  Ghost,
  Gem,
  Cpu,
  Zap,
  Layers
} from 'lucide-react';
import type { AboutData } from '@/types';
import { mockDataService } from '@/lib/dataService';

// Partner logos using Lucide icons
const PARTNER_ICONS = [
  { name: "NVIDIA", icon: Hexagon },
  { name: "Intel", icon: Triangle },
  { name: "AMD", icon: Command },
  { name: "Qualcomm", icon: Ghost },
  { name: "TSMC", icon: Gem },
  { name: "Samsung", icon: Cpu },
  { name: "Google", icon: Zap },
  { name: "Microsoft", icon: Layers },
];

export function About() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await mockDataService.getAboutData();
      setAboutData(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <main className="relative min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-2xl h-72 sm:h-96 animate-pulse" />
        </div>
      </main>
    );
  }

  if (!aboutData) return null;

  return (
    <main className="relative min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20">
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="text-white/40 text-xs sm:text-sm font-medium tracking-wider uppercase mb-2 block">
            About Us
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            thinkbuildlabs
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-white/50 max-w-3xl mx-auto">
            {aboutData.description}
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-16"
        >
          <div className="glass rounded-xl sm:rounded-2xl p-5 sm:p-8">
            <div className="w-10 sm:w-14 h-10 sm:h-14 rounded-lg sm:rounded-xl bg-white/5 flex items-center justify-center mb-4 sm:mb-6">
              <Target className="w-5 sm:w-7 h-5 sm:h-7 text-white/60" />
            </div>
            <h2 className="text-lg sm:text-2xl font-semibold text-white mb-2 sm:mb-4">Our Mission</h2>
            <p className="text-white/50 text-sm sm:text-base leading-relaxed">{aboutData.mission}</p>
          </div>
          <div className="glass rounded-xl sm:rounded-2xl p-5 sm:p-8">
            <div className="w-10 sm:w-14 h-10 sm:h-14 rounded-lg sm:rounded-xl bg-white/5 flex items-center justify-center mb-4 sm:mb-6">
              <Eye className="w-5 sm:w-7 h-5 sm:h-7 text-white/60" />
            </div>
            <h2 className="text-lg sm:text-2xl font-semibold text-white mb-2 sm:mb-4">Our Vision</h2>
            <p className="text-white/50 text-sm sm:text-base leading-relaxed">{aboutData.vision}</p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10 sm:mb-16"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {aboutData.stats.map((stat, index) => {
              const icons: Record<string, React.ElementType> = {
                CheckCircle: CheckCircle2,
                FileText: BookOpen,
                Users: Users,
                Award: Lightbulb,
              };
              const Icon = icons[stat.icon] || CheckCircle2;
              
              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center card-hover"
                >
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Icon className="w-5 sm:w-6 h-5 sm:h-6 text-white/40" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <p className="text-white/40 text-xs sm:text-sm">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* History Timeline */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-10 sm:mb-16"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6 sm:mb-8 text-center">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-0.5 bg-white/10 hidden sm:block" />
            <div className="space-y-4 sm:space-y-6">
              {aboutData.history.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="relative flex items-start gap-3 sm:gap-6"
                >
                  <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-white flex-shrink-0 mt-1.5 sm:mt-2 hidden sm:block" />
                  <div className="glass rounded-lg sm:rounded-xl p-4 sm:p-6 flex-1">
                    <span className="text-white/40 text-xs sm:text-sm font-medium">{event.year}</span>
                    <h3 className="text-white text-sm sm:text-base font-semibold mt-0.5 sm:mt-1">{event.title}</h3>
                    <p className="text-white/40 text-xs sm:text-sm mt-1 sm:mt-2">{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Facilities */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-10 sm:mb-16"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6 sm:mb-8 text-center">Our Facilities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {aboutData.facilities.map((facility, index) => (
              <motion.div
                key={facility.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="glass rounded-xl sm:rounded-2xl overflow-hidden card-hover"
              >
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <img
                    src={facility.image}
                    alt={facility.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-xl font-semibold text-white mb-1 sm:mb-2">{facility.name}</h3>
                  <p className="text-white/50 text-xs sm:text-sm">{facility.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Partners - Horizontal Marquee */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6 sm:mb-8 text-center">Our Partners</h2>
          <div className="glass rounded-xl sm:rounded-2xl py-6 sm:py-8 overflow-hidden">
            <div 
              className="relative flex overflow-hidden"
              style={{
                maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
              }}
            >
              <div className="animate-marquee flex gap-8 sm:gap-12 whitespace-nowrap px-4">
                {[...PARTNER_ICONS, ...PARTNER_ICONS, ...PARTNER_ICONS].map((partner, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-2 sm:gap-3 opacity-40 hover:opacity-100 transition-all hover:scale-105 cursor-default"
                  >
                    <partner.icon className="h-5 sm:h-8 w-5 sm:w-8 text-white" />
                    <span className="text-base sm:text-xl font-bold text-white tracking-tight">
                      {partner.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
