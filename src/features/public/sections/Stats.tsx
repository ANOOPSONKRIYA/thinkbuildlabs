import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle, FileText, Users, Award, Zap, Cpu } from 'lucide-react';

const stats = [
  { label: 'Projects Completed', value: 25, suffix: '+', icon: CheckCircle },
  { label: 'Research Papers', value: 40, suffix: '+', icon: FileText },
  { label: 'Team Members', value: 15, suffix: '+', icon: Users },
  { label: 'Patents Filed', value: 8, suffix: '', icon: Award },
  { label: 'Chips Taped Out', value: 6, suffix: '', icon: Cpu },
  { label: 'Awards Won', value: 12, suffix: '', icon: Zap },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="text-white/40 text-xs sm:text-sm font-medium tracking-wider uppercase mb-2 block">
            By The Numbers
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Our Impact
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 card-hover">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Icon className="w-5 sm:w-6 h-5 sm:h-6 text-white/60" />
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-white/40 text-[10px] sm:text-xs">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
