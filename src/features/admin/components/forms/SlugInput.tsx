import { useEffect, useState } from 'react';
import { Link2, Check, AlertCircle } from 'lucide-react';

interface SlugInputProps {
  value: string;
  onChange: (value: string) => void;
  sourceValue?: string; // Title to generate slug from
  uniqueCheck?: boolean;
  existingSlugs?: string[];
  currentSlug?: string; // For edit mode - exclude from uniqueness check
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export function SlugInput({
  value,
  onChange,
  sourceValue,
  uniqueCheck = true,
  existingSlugs = [],
  currentSlug,
  label = 'URL Slug',
  placeholder = 'project-url-slug',
  required = true,
}: SlugInputProps) {
  const [isAuto, setIsAuto] = useState(!value);
  const [isUnique, setIsUnique] = useState(true);
  const [hasTouched, setHasTouched] = useState(false);

  // Auto-generate slug from source
  useEffect(() => {
    if (isAuto && sourceValue) {
      const generated = generateSlug(sourceValue);
      onChange(generated);
    }
  }, [sourceValue, isAuto]);

  // Check uniqueness
  useEffect(() => {
    if (uniqueCheck && value) {
      const isTaken = existingSlugs.some(
        (slug) => slug.toLowerCase() === value.toLowerCase() && slug !== currentSlug
      );
      setIsUnique(!isTaken);
    } else {
      setIsUnique(true);
    }
  }, [value, existingSlugs, currentSlug, uniqueCheck]);

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .substring(0, 60); // Limit length
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    onChange(newValue);
    setHasTouched(true);
    setIsAuto(false);
  };

  const handleRegenerate = () => {
    if (sourceValue) {
      setIsAuto(true);
      onChange(generateSlug(sourceValue));
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-white/60 text-sm">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
        <button
          type="button"
          onClick={handleRegenerate}
          disabled={!sourceValue}
          className="text-xs text-white/40 hover:text-white disabled:opacity-30 transition-colors"
        >
          Auto-generate from title
        </button>
      </div>
      
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <Link2 className="w-4 h-4 text-white/30" />
          <span className="text-white/30 text-sm select-none">/portfolio/</span>
        </div>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={() => setHasTouched(true)}
          placeholder={placeholder}
          className={`w-full pl-28 pr-10 py-2.5 rounded-lg bg-white/5 border text-white text-sm focus:outline-none focus:ring-2 transition-all ${
            !isUnique && hasTouched
              ? 'border-red-500/50 focus:ring-red-500/20'
              : isUnique && value && hasTouched
              ? 'border-green-500/50 focus:ring-green-500/20'
              : 'border-white/10 focus:ring-white/10 focus:border-white/20'
          }`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {!isUnique && hasTouched ? (
            <AlertCircle className="w-4 h-4 text-red-400" />
          ) : isUnique && value && hasTouched ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : null}
        </div>
      </div>
      
      {!isUnique && hasTouched && (
        <p className="text-red-400 text-xs">This slug is already in use. Please choose another.</p>
      )}
      
      <p className="text-white/30 text-xs">
        SEO-friendly URL identifier. Used in: /portfolio/{value || 'your-slug'}
      </p>
    </div>
  );
}
