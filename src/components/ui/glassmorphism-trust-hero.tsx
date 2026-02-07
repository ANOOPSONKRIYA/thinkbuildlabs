import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Play, 
  Target, 
  Crown, 
  Star,
  Hexagon,
  Triangle,
  Command,
  Ghost,
  Gem,
  Cpu,
  Zap,
  Layers
} from "lucide-react";

// --- MOCK BRANDS ---
const CLIENTS = [
  { name: "NVIDIA", icon: Hexagon },
  { name: "Intel", icon: Triangle },
  { name: "AMD", icon: Command },
  { name: "Qualcomm", icon: Ghost },
  { name: "TSMC", icon: Gem },
  { name: "Samsung", icon: Cpu },
  { name: "Google", icon: Zap },
  { name: "Microsoft", icon: Layers },
];

// --- SUB-COMPONENTS ---
const StatItem = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center justify-center transition-transform hover:-translate-y-1 cursor-default">
    <span className="text-lg sm:text-xl font-bold text-white">{value}</span>
    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-500 font-medium">{label}</span>
  </div>
);

// --- MAIN COMPONENT ---
export default function GlassmorphismTrustHero() {
  return (
    <div className="relative w-full bg-[#050505] text-white overflow-hidden font-sans">
      {/* SCOPED ANIMATIONS */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-fade-in {
          animation: fadeSlideIn 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>

      {/* Background Image with Gradient Mask */}
      <div 
        className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80')] bg-cover bg-center opacity-20"
        style={{
          maskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 md:pt-40 pb-12 sm:pb-16 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8 items-start">
          
          {/* --- LEFT COLUMN --- */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 sm:space-y-8 pt-4 sm:pt-8">
            
            {/* Badge */}
            <div className="animate-fade-in delay-100">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md transition-colors hover:bg-white/10">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  Award-Winning Research
                  <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400 fill-zinc-400" />
                </span>
              </div>
            </div>

            {/* Heading */}
            <h1 
              className="animate-fade-in delay-200 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tighter leading-[0.95] sm:leading-[0.9]"
              style={{
                maskImage: "linear-gradient(180deg, black 0%, black 80%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(180deg, black 0%, black 80%, transparent 100%)"
              }}
            >
              thinkbuild<br />
              <span className="text-zinc-400">
                labs
              </span>
            </h1>

            {/* Description */}
            <p className="animate-fade-in delay-300 max-w-xl text-base sm:text-lg text-zinc-400 leading-relaxed">
              We design cutting-edge silicon and intelligent systems that combine 
              innovation with functionality, creating breakthrough technologies that 
              shape the future of computing.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-in delay-400 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link 
                to="/portfolio"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 sm:px-8 py-3 sm:py-4 text-sm font-semibold text-black transition-all hover:scale-[1.02] hover:bg-zinc-200 active:scale-[0.98]"
              >
                View Portfolio
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <Link 
                to="/team"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 sm:px-8 py-3 sm:py-4 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10 hover:border-white/20"
              >
                <Play className="w-4 h-4 fill-current" />
                Meet Our Team
              </Link>
            </div>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6 mt-10 sm:mt-12 lg:mt-12">
            
            {/* Stats Card */}
            <div className="animate-fade-in delay-500 relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl">
              {/* Card Glow Effect */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 sm:h-64 w-48 sm:w-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-white/10 ring-1 ring-white/20">
                    <Target className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">25+</div>
                    <div className="text-xs sm:text-sm text-zinc-400">Projects Completed</div>
                  </div>
                </div>

                {/* Progress Bar Section */}
                <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-zinc-400">Research Impact</span>
                    <span className="text-white font-medium">98%</span>
                  </div>
                  <div className="h-1.5 sm:h-2 w-full overflow-hidden rounded-full bg-zinc-800/50">
                    <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-zinc-400 to-white" />
                  </div>
                </div>

                <div className="h-px w-full bg-white/10 mb-4 sm:mb-6" />

                {/* Mini Stats Grid */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                  <StatItem value="40+" label="Papers" />
                  <div className="w-px h-full bg-white/10 mx-auto" />
                  <StatItem value="15+" label="Members" />
                  <div className="w-px h-full bg-white/10 mx-auto" />
                  <StatItem value="8" label="Patents" />
                </div>

                {/* Tag Pills */}
                <div className="mt-6 sm:mt-8 flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] font-medium tracking-wide text-zinc-300">
                    <span className="relative flex h-1.5 sm:h-2 w-1.5 sm:w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-full w-full bg-green-500"></span>
                    </span>
                    ACTIVE
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] font-medium tracking-wide text-zinc-300">
                    <Crown className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-zinc-400" />
                    PREMIUM
                  </div>
                </div>
              </div>
            </div>

            {/* Marquee Card */}
            <div className="animate-fade-in delay-500 relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 py-6 sm:py-8 backdrop-blur-xl">
              <h3 className="mb-4 sm:mb-6 px-4 sm:px-8 text-xs sm:text-sm font-medium text-zinc-400">Trusted by Industry Leaders</h3>
              
              <div 
                className="relative flex overflow-hidden"
                style={{
                  maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                  WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
                }}
              >
                <div className="animate-marquee flex gap-6 sm:gap-12 whitespace-nowrap px-4">
                  {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => (
                    <div 
                      key={i}
                      className="flex items-center gap-2 opacity-40 transition-all hover:opacity-100 hover:scale-105 cursor-default grayscale hover:grayscale-0"
                    >
                      <client.icon className="h-4 sm:h-6 w-4 sm:w-6 text-white" />
                      <span className="text-sm sm:text-lg font-bold text-white tracking-tight">
                        {client.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
