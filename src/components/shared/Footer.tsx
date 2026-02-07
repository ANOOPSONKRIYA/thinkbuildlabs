import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, Mail, MapPin, Phone, Github, Linkedin, Twitter, Instagram, ArrowUpRight, Code2, Heart, Globe, BookOpen } from 'lucide-react';
import { useLongPress } from '@/hooks/use-long-press';
import { getSettings } from '@/lib/settings';
import type { SiteSettings, SocialLink } from '@/types';

const footerLinks = {
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Team', href: '/team' },
    { label: 'About', href: '/about' },
  ],
  categories: [
    { label: 'VLSI Design', href: '/portfolio?category=vlsi' },
    { label: 'AI & Robotics', href: '/portfolio?category=ai-robotics' },
    { label: 'Research', href: '/portfolio?category=research' },
  ],
};

const SOCIAL_ICON_MAP: Record<SocialLink['platform'], typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  portfolio: Globe,
  'google-scholar': BookOpen,
  email: Mail,
};

// Navigation section with secret admin access
function NavigationSection() {
  const navigate = useNavigate();
  
  const { handlers, isPressing } = useLongPress({
    onLongPress: () => {
      navigate('/admin');
    },
    delay: 1000, // 1 second
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h3 
        className={`font-semibold mb-4 sm:mb-6 select-none transition-colors cursor-default ${
          isPressing ? 'text-white/80' : 'text-white'
        }`}
        {...handlers}
        title="Hold for 1 second to access admin"
      >
        Navigation
      </h3>
      <ul className="space-y-2 sm:space-y-3">
        {footerLinks.navigation.map((link) => (
          <li key={link.href}>
            <Link
              to={link.href}
              className="text-white/50 hover:text-white transition-colors text-sm flex items-center gap-1 group"
            >
              {link.label}
              <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      const data = await getSettings();
      if (mounted) setSettings(data);
    };

    loadSettings();

    const handleSettingsUpdate = () => {
      loadSettings();
    };

    window.addEventListener('site-settings-updated', handleSettingsUpdate);
    return () => {
      mounted = false;
      window.removeEventListener('site-settings-updated', handleSettingsUpdate);
    };
  }, []);

  const footerDescription =
    settings?.footerDescription ||
    'Pushing the boundaries of silicon and intelligence through innovative research and collaborative learning.';
  const footerSocialLinks = settings?.footerSocialLinks || [];
  const contactEmail = settings?.contactEmail || 'contact@lab.edu';
  const contactPhone = settings?.contactPhone || '+1 (555) 123-4567';
  const contactAddress =
    settings?.contactAddress || 'Engineering Building, Room 405\nUniversity Campus, CA 94305';

  return (
    <footer className="relative z-10 border-t border-white/10">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="sm:col-span-2 lg:col-span-1"
          >
            <Link to="/" className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <Cpu className="w-6 h-6 text-black" />
              </div>
              <span className="font-bold text-xl text-white">
                {settings?.siteName || 'thinkbuildlabs'}
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-4 sm:mb-6">
              {footerDescription}
            </p>
            <div className="flex items-center gap-3">
              {footerSocialLinks.map((item) => {
                const Icon = SOCIAL_ICON_MAP[item.platform] || Globe;
                return (
                  <a
                    key={`${item.platform}-${item.url}`}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Navigation with secret admin access */}
          <NavigationSection />

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-semibold text-white mb-4 sm:mb-6">Categories</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/50 hover:text-white transition-colors text-sm flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="font-semibold text-white mb-4 sm:mb-6">Contact</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-white/40 mt-0.5 flex-shrink-0" />
                <span className="text-white/50 text-sm">
                  {contactAddress.split('\n').map((line, index) => (
                    <span key={`${line}-${index}`} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-white/40 flex-shrink-0" />
                <a href={`mailto:${contactEmail}`} className="text-white/50 hover:text-white transition-colors text-sm">
                  {contactEmail}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-white/40 flex-shrink-0" />
                <a href={`tel:${contactPhone}`} className="text-white/50 hover:text-white transition-colors text-sm">
                  {contactPhone}
                </a>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs sm:text-sm text-center sm:text-left">
              (c) {new Date().getFullYear()} {settings?.siteName || 'thinkbuildlabs'}. All rights reserved.
            </p>
            
            {/* Developer Credit */}
            <a 
              href="https://thinkbuildlabs.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
            >
              <Code2 className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
              <span className="text-white/50 group-hover:text-white/80 text-xs sm:text-sm transition-colors">
                Website Developed & Maintained by
              </span>
              <span className="font-semibold text-white group-hover:text-white text-xs sm:text-sm flex items-center gap-1">
                Anoop Sonkriya
                <Heart className="w-3 h-3 text-red-500 fill-red-500" />
              </span>
            </a>
            
            <div className="flex items-center gap-4 sm:gap-6">
              <Link to="/privacy" className="text-white/30 hover:text-white text-xs sm:text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-white/30 hover:text-white text-xs sm:text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
