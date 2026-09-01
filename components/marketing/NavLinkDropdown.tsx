'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface NavLinkDropdownProps {
  label: string;
  items: { label: string; href: string; description?: string }[];
  transparent: boolean;
}

export function NavLinkDropdown({ label, items, transparent }: NavLinkDropdownProps) {
  const [open, setOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => {
        setEntered(true);
        setOpen(true);
      }}
      onMouseLeave={() => {
        setEntered(false);
        setOpen(false);
      }}
    >
      <button
        className={`font-sans font-medium transition-colors duration-300 inline-flex items-center gap-1 ${
          transparent ? 'text-white/90 hover:text-white' : 'text-primary-600 hover:text-primary-900'
        }`}
        style={{ fontSize: '0.9rem' }}
        onClick={() => setOpen(!open)}
      >
        {label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && entered && (
        <div className="absolute top-full left-0 pt-2 z-50">
          <div className="min-w-[240px] bg-white rounded-xl border border-primary-200 shadow-raised py-2 animate-scale-in">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2.5 hover:bg-primary-50 transition-colors"
              >
                <span className="font-sans font-medium text-primary-900 text-sm block">
                  {item.label}
                </span>
                {item.description && (
                  <span className="font-sans text-primary-400 text-xs block mt-0.5">
                    {item.description}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
