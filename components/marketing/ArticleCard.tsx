import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  href: string;
  icon?: LucideIcon;
}

export function ArticleCard({ title, excerpt, category, date, href, icon: Icon }: ArticleCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="bg-white rounded-xl border border-primary-200 overflow-hidden transition-all duration-200 hover:shadow-card-hover h-full">
        <div className="h-40 bg-primary-100 flex items-center justify-center relative overflow-hidden">
          {Icon ? (
            <div className="w-16 h-16 rounded-xl bg-accent-100 flex items-center justify-center">
              <Icon className="text-accent-700" size={32} />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-xl bg-accent-100 flex items-center justify-center">
              <span className="font-display font-bold text-accent-700" style={{ fontSize: '1.5rem' }}>
                {title.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-sans font-semibold text-accent-600 uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>
              {category}
            </span>
            <span className="text-primary-300">·</span>
            <span className="font-sans text-primary-400" style={{ fontSize: '0.8rem' }}>
              {date}
            </span>
          </div>
          <h3 className="font-sans font-semibold text-primary-900 text-base mb-2 group-hover:text-accent-700 transition-colors">
            {title}
          </h3>
          <p className="font-sans text-primary-500 text-sm leading-relaxed line-clamp-2">
            {excerpt}
          </p>
        </div>
      </div>
    </Link>
  );
}
