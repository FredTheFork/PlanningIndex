import { Lightbulb, AlertCircle, Info, Check } from 'lucide-react';
import type { BlogSection } from '@/lib/blog';

const calloutConfig = {
  tip: { icon: Lightbulb, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', iconColor: 'text-emerald-600' },
  warning: { icon: AlertCircle, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', iconColor: 'text-amber-600' },
  info: { icon: Info, bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-800', iconColor: 'text-sky-600' },
};

export function ArticleBody({ sections }: { sections: BlogSection[] }) {
  return (
    <div className="space-y-8">
      {sections.map((section, index) => {
        if (section.type === 'callout') {
          const config = calloutConfig[section.calloutType || 'info'];
          const Icon = config.icon;
          return (
            <div key={index} className={`flex items-start gap-4 rounded-xl border p-5 ${config.bg} ${config.border}`}>
              <span className={`shrink-0 mt-0.5 ${config.iconColor}`}>
                <Icon size={20} />
              </span>
              <div className={config.text}>
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="font-sans text-sm leading-relaxed">{p}</p>
                ))}
              </div>
            </div>
          );
        }

        if (section.type === 'steps') {
          return (
            <div key={index}>
              {section.heading && (
                <h2 className="font-display font-bold text-primary-900 text-h3 mb-4">{section.heading}</h2>
              )}
              {section.paragraphs.map((p, i) => (
                <p key={i} className="font-sans text-primary-600 leading-relaxed mb-4" style={{ fontSize: '1.05rem' }}>{p}</p>
              ))}
              <ol className="space-y-3 mt-4">
                {section.steps?.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-900 text-white font-mono text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="font-sans text-primary-600 leading-relaxed pt-0.5" style={{ fontSize: '1.05rem' }}>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          );
        }

        if (section.type === 'list') {
          return (
            <div key={index}>
              {section.heading && (
                <h2 className="font-display font-bold text-primary-900 text-h3 mb-4">{section.heading}</h2>
              )}
              {section.paragraphs.map((p, i) => (
                <p key={i} className="font-sans text-primary-600 leading-relaxed mb-4" style={{ fontSize: '1.05rem' }}>{p}</p>
              ))}
              <ul className="space-y-2.5 mt-4">
                {section.items?.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <Check size={12} className="text-emerald-600" />
                    </span>
                    <span className="font-sans text-primary-600 leading-relaxed" style={{ fontSize: '1.05rem' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        return (
          <div key={index}>
            {section.heading && (
              <h2 className="font-display font-bold text-primary-900 text-h3 mb-4">{section.heading}</h2>
            )}
            {section.paragraphs.map((p, i) => (
              <p key={i} className="font-sans text-primary-600 leading-relaxed mb-4" style={{ fontSize: '1.05rem' }}>{p}</p>
            ))}
          </div>
        );
      })}
    </div>
  );
}
