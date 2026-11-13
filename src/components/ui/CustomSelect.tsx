import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';

export interface CustomSelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface CustomSelectProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: (CustomSelectOption<T> | T)[];
  placeholder?: string;
  ariaLabel?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'ghost' | 'compact';
  className?: string;
}

export function CustomSelect<T extends string = string>({
  value,
  onChange,
  options,
  placeholder,
  ariaLabel,
  icon,
  variant = 'default',
  className = '',
}: CustomSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const normalized: CustomSelectOption<T>[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt as T, label: opt } : opt
  );

  const selectedOption = normalized.find((o) => o.value === value);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const triggerStyles =
    variant === 'ghost'
      ? 'w-full flex items-center justify-between gap-2 bg-transparent border-0 p-0 text-xs font-medium text-slate-800 dark:text-white focus:outline-hidden cursor-pointer'
      : variant === 'compact'
      ? 'w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-semibold bg-[#f8fafc] dark:bg-[#0f1c38] border border-[#e2e8f0] dark:border-[#1e335a] hover:border-[#f25922]/60 rounded-lg text-[#0f172a] dark:text-white focus:outline-hidden transition-colors cursor-pointer'
      : 'w-full flex items-center justify-between gap-2 px-3 py-2.5 text-xs font-medium bg-[#f8fafc] dark:bg-[#0f1c38] border border-[#e2e8f0] dark:border-[#1e335a] hover:border-[#f25922]/60 rounded-xl text-[#0f172a] dark:text-white focus:outline-hidden transition-colors cursor-pointer';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={triggerStyles}
      >
        <span className="flex items-center gap-2 truncate">
          {icon && <span className="shrink-0">{icon}</span>}
          <span className="truncate">{selectedOption?.label || placeholder || value}</span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180 text-[#f25922]' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 min-w-[180px] mt-1.5 z-50 bg-white dark:bg-[#13213e] border border-[#e2e8f0] dark:border-[#1e335a] rounded-xl shadow-xl shadow-slate-900/12 dark:shadow-black/50 py-1.5 max-h-60 overflow-y-auto text-left"
          >
            {normalized.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#f25922]/10 text-[#f25922] font-bold'
                      : 'text-[#0f172a] dark:text-slate-200 hover:bg-[#f8fafc] dark:hover:bg-[#0f1c38] font-medium'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#f25922] shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
