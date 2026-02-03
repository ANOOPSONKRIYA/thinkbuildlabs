import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CollapsibleSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  badge?: string | number;
  required?: boolean;
}

export function CollapsibleSection({
  title,
  description,
  icon,
  children,
  defaultOpen = true,
  badge,
  required = false,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-4 sm:p-6 hover:bg-white/[0.02] transition-colors"
      >
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
        
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-medium">
              {title}
              {required && <span className="text-red-400 ml-1">*</span>}
            </h3>
            {badge !== undefined && (
              <span className="px-2 py-0.5 bg-white/10 rounded-full text-white/60 text-xs">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-white/40 text-sm mt-0.5">{description}</p>
          )}
        </div>

        <div className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-white/10' : ''}`}>
          {isOpen ? (
            <ChevronDown className="w-5 h-5 text-white/60" />
          ) : (
            <ChevronRight className="w-5 h-5 text-white/40" />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 border-t border-white/5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple section without collapse
interface SimpleSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: ReactNode;
  required?: boolean;
  className?: string;
}

export function SimpleSection({
  title,
  description,
  icon,
  children,
  required = false,
  className = '',
}: SimpleSectionProps) {
  return (
    <div className={`rounded-2xl bg-white/[0.02] border border-white/10 p-4 sm:p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-white font-medium">
            {title}
            {required && <span className="text-red-400 ml-1">*</span>}
          </h3>
          {description && (
            <p className="text-white/40 text-sm mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
