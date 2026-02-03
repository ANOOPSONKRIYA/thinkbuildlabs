import { useState, useRef, useEffect } from 'react';
import { X, Plus, Search, Check, Sparkles } from 'lucide-react';

interface TechStackSelectProps {
  selected: string[];
  onChange: (items: string[]) => void;
  presetOptions?: string[];
  label?: string;
  placeholder?: string;
  allowCustom?: boolean;
  maxItems?: number;
}

const DEFAULT_TECH_OPTIONS = [
  'Verilog', 'VHDL', 'SystemVerilog', 'Cadence', 'Synopsys', 'Mentor Graphics',
  'FPGA', 'ASIC', 'Python', 'TensorFlow', 'PyTorch', 'Keras',
  'ROS', 'ROS2', 'OpenCV', 'C++', 'C', 'MATLAB', 'Simulink',
  'CUDA', 'OpenCL', 'Qiskit', 'Cirq', 'Jupyter', 'Pandas', 'NumPy',
  'SolidWorks', 'AutoCAD', 'Blender', 'Unity', 'Gazebo', 'RViz',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'GitHub',
  'Jenkins', 'Jira', 'Confluence', 'LaTeX', 'Markdown',
];

export function TechStackSelect({
  selected,
  onChange,
  presetOptions = DEFAULT_TECH_OPTIONS,
  label = 'Tech Stack',
  placeholder = 'Add technologies...',
  allowCustom = true,
  maxItems,
}: TechStackSelectProps) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter options based on input and selected
  const availableOptions = presetOptions.filter(
    (opt) => !selected.includes(opt) && opt.toLowerCase().includes(inputValue.toLowerCase())
  );
  
  const canAddCustom = allowCustom && 
    inputValue.trim() && 
    !selected.includes(inputValue.trim()) &&
    !presetOptions.some(opt => opt.toLowerCase() === inputValue.toLowerCase());

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addItem = (item: string) => {
    const trimmed = item.trim();
    if (!trimmed || selected.includes(trimmed)) return;
    if (maxItems && selected.length >= maxItems) return;
    
    onChange([...selected, trimmed]);
    setInputValue('');
    setHighlightedIndex(0);
    inputRef.current?.focus();
  };

  const removeItem = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (isOpen && availableOptions.length > 0) {
          addItem(availableOptions[highlightedIndex]);
        } else if (canAddCustom) {
          addItem(inputValue);
        }
        break;
      case 'Backspace':
        if (!inputValue && selected.length > 0) {
          removeItem(selected[selected.length - 1]);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex((prev) => 
          Math.min(prev + 1, availableOptions.length - (canAddCustom ? 0 : 1))
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  // Common tech stack presets
  const PRESETS = [
    { name: 'VLSI Design', items: ['Verilog', 'Cadence', 'Synopsys', 'FPGA', 'ASIC'] },
    { name: 'AI/ML', items: ['Python', 'TensorFlow', 'PyTorch', 'Jupyter', 'Pandas'] },
    { name: 'Robotics', items: ['ROS', 'ROS2', 'OpenCV', 'C++', 'Gazebo'] },
    { name: 'Quantum', items: ['Qiskit', 'Cirq', 'Python', 'CUDA'] },
  ];

  const applyPreset = (items: string[]) => {
    const newItems = [...new Set([...selected, ...items])];
    if (maxItems) {
      onChange(newItems.slice(0, maxItems));
    } else {
      onChange(newItems);
    }
  };

  return (
    <div ref={containerRef} className="space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-white/60 text-sm">{label}</label>
          {maxItems && (
            <span className="text-white/30 text-xs">
              {selected.length}/{maxItems}
            </span>
          )}
        </div>
      )}

      {/* Selected items */}
      <div className="flex flex-wrap gap-2">
        {selected.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm"
          >
            {item}
            <button
              type="button"
              onClick={() => removeItem(item)}
              className="p-0.5 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        
        {/* Input */}
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Search className="w-4 h-4 text-white/30" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsOpen(true);
              setHighlightedIndex(0);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={selected.length === 0 ? placeholder : 'Add more...'}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
          />

          {/* Dropdown */}
          {isOpen && (availableOptions.length > 0 || canAddCustom) && (
            <div className="absolute top-full left-0 right-0 mt-1 py-1 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-50 max-h-60 overflow-auto">
              {availableOptions.map((option, index) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => addItem(option)}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center justify-between ${
                    index === highlightedIndex
                      ? 'bg-white/10 text-white'
                      : 'text-white/70 hover:bg-white/5'
                  }`}
                >
                  {option}
                  {index === highlightedIndex && <Check className="w-4 h-4" />}
                </button>
              ))}
              
              {canAddCustom && (
                <button
                  type="button"
                  onClick={() => addItem(inputValue)}
                  className="w-full px-3 py-2 text-left text-sm text-amber-400 hover:bg-white/5 transition-colors flex items-center gap-2 border-t border-white/5"
                >
                  <Plus className="w-4 h-4" />
                  Add "{inputValue}"
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Presets */}
      {selected.length === 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-white/30 text-xs py-1">Quick add:</span>
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset.items)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              {preset.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Skills Select (similar but for team member skills)
const DEFAULT_SKILLS = [
  'VLSI Design', 'Digital Design', 'Analog Design', 'Low Power Design',
  'FPGA Design', 'ASIC Design', 'Physical Design', 'Verification',
  'Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP',
  'Robotics', 'SLAM', 'Path Planning', 'Control Systems',
  'Embedded Systems', 'RTOS', 'IoT', 'Signal Processing',
  'Quantum Computing', 'Python', 'C++', 'C', 'Verilog',
  'Leadership', 'Team Management', 'Technical Writing',
];

export function SkillsSelect(props: Omit<TechStackSelectProps, 'presetOptions' | 'label'>) {
  return (
    <TechStackSelect
      {...props}
      presetOptions={DEFAULT_SKILLS}
      label="Skills"
      placeholder="Add skills..."
    />
  );
}
