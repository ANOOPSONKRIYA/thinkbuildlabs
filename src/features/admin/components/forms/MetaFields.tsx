import { useState, useEffect } from 'react';
import { Search, Tag, FileText, AlertCircle } from 'lucide-react';

interface MetaFieldsProps {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  onChange: (values: { metaTitle?: string; metaDescription?: string; keywords?: string[] }) => void;
  defaults?: {
    title?: string;
    description?: string;
  };
}

export function MetaFields({
  metaTitle,
  metaDescription,
  keywords = [],
  onChange,
  defaults,
}: MetaFieldsProps) {
  const [keywordInput, setKeywordInput] = useState('');
  const [charCounts, setCharCounts] = useState({
    title: metaTitle?.length || 0,
    description: metaDescription?.length || 0,
  });

  // Update char counts when values change
  useEffect(() => {
    setCharCounts({
      title: metaTitle?.length || 0,
      description: metaDescription?.length || 0,
    });
  }, [metaTitle, metaDescription]);

  const addKeyword = () => {
    const trimmed = keywordInput.trim().toLowerCase();
    if (trimmed && !keywords.includes(trimmed)) {
      onChange({ metaTitle, metaDescription, keywords: [...keywords, trimmed] });
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    onChange({
      metaTitle,
      metaDescription,
      keywords: keywords.filter((k) => k !== keyword),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  // SEO score calculation
  const calculateScore = () => {
    let score = 0;
    let suggestions: string[] = [];

    if (metaTitle) {
      if (metaTitle.length >= 30 && metaTitle.length <= 60) {
        score += 30;
      } else {
        suggestions.push('Title should be 30-60 characters');
      }
    } else {
      suggestions.push('Add a meta title');
    }

    if (metaDescription) {
      if (metaDescription.length >= 120 && metaDescription.length <= 160) {
        score += 40;
      } else {
        suggestions.push('Description should be 120-160 characters');
      }
    } else {
      suggestions.push('Add a meta description');
    }

    if (keywords.length > 0) {
      score += 20;
      if (keywords.length < 3) {
        suggestions.push('Add more keywords (3-8 recommended)');
      }
    } else {
      suggestions.push('Add some keywords');
    }

    // If using defaults
    if (!metaTitle && defaults?.title) score += 15;
    if (!metaDescription && defaults?.description) score += 20;

    return { score: Math.min(score, 100), suggestions };
  };

  const { score, suggestions } = calculateScore();

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBg = () => {
    if (score >= 80) return 'bg-green-500/20';
    if (score >= 50) return 'bg-amber-500/20';
    return 'bg-red-500/20';
  };

  return (
    <div className="space-y-4">
      {/* SEO Score */}
      <div className={`p-4 rounded-xl ${getScoreBg()} border border-white/5`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-white/60" />
            <span className="text-white/60 text-sm font-medium">SEO Score</span>
          </div>
          <span className={`text-lg font-bold ${getScoreColor()}`}>{score}/100</span>
        </div>
        <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
        {suggestions.length > 0 && (
          <div className="mt-3 space-y-1">
            {suggestions.slice(0, 3).map((suggestion, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-white/40">
                <AlertCircle className="w-3 h-3" />
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Meta Title */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="flex items-center gap-2 text-white/60 text-sm">
            <FileText className="w-4 h-4" />
            Meta Title
          </label>
          <span
            className={`text-xs ${
              charCounts.title > 60 ? 'text-red-400' : charCounts.title < 30 ? 'text-amber-400' : 'text-green-400'
            }`}
          >
            {charCounts.title}/60
          </span>
        </div>
        <input
          type="text"
          value={metaTitle || ''}
          onChange={(e) =>
            onChange({
              metaTitle: e.target.value,
              metaDescription,
              keywords,
            })
          }
          placeholder={defaults?.title || 'Enter meta title...'}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
        />
        <p className="text-white/30 text-xs mt-1">
          Title shown in search engine results. Leave empty to use default title.
        </p>
      </div>

      {/* Meta Description */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-white/60 text-sm">Meta Description</label>
          <span
            className={`text-xs ${
              charCounts.description > 160
                ? 'text-red-400'
                : charCounts.description < 120
                ? 'text-amber-400'
                : 'text-green-400'
            }`}
          >
            {charCounts.description}/160
          </span>
        </div>
        <textarea
          value={metaDescription || ''}
          onChange={(e) =>
            onChange({
              metaTitle,
              metaDescription: e.target.value,
              keywords,
            })
          }
          placeholder={defaults?.description || 'Enter meta description...'}
          rows={3}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20 resize-none"
        />
        <p className="text-white/30 text-xs mt-1">
          Brief description shown in search results. Should be 120-160 characters.
        </p>
      </div>

      {/* Keywords */}
      <div>
        <label className="flex items-center gap-2 text-white/60 text-sm mb-2">
          <Tag className="w-4 h-4" />
          Keywords / Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {keywords.map((keyword) => (
            <span
              key={keyword}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 text-white text-xs"
            >
              {keyword}
              <button
                type="button"
                onClick={() => removeKeyword(keyword)}
                className="p-0.5 hover:bg-white/20 rounded transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add keyword and press Enter..."
            className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
          />
          <button
            type="button"
            onClick={addKeyword}
            disabled={!keywordInput.trim()}
            className="px-3 py-2 bg-white/10 hover:bg-white/15 disabled:opacity-30 rounded-lg text-white text-sm transition-colors"
          >
            Add
          </button>
        </div>
        <p className="text-white/30 text-xs mt-1">
          Keywords help with searchability. Add 3-8 relevant keywords.
        </p>
      </div>
    </div>
  );
}
