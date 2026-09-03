'use client';

import Link from 'next/link';
import { MapPin, Plus, FileText, PoundSterling, Calendar, Clock } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import type { SearchApplication } from '@/lib/mock/applications';

const statusVariant: Record<SearchApplication['status'], 'success' | 'warning' | 'danger' | 'neutral'> = {
  Approved: 'success',
  Pending: 'warning',
  Refused: 'danger',
  Withdrawn: 'neutral',
};

interface ApplicationResultCardProps {
  application: SearchApplication;
  selected?: boolean;
  hovered?: boolean;
  onSelect?: (id: string) => void;
  onHover?: (id: string | null) => void;
  onAddLead?: (application: SearchApplication) => void;
}

export function ApplicationResultCard({
  application: app,
  selected = false,
  hovered = false,
  onSelect,
  onHover,
  onAddLead,
}: ApplicationResultCardProps) {
  const cardRef = (el: HTMLDivElement | null) => {
    if (el && selected) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => onHover?.(app.id)}
      onMouseLeave={() => onHover?.(null)}
      className={`transition-all duration-200 rounded-xl border ${
        selected
          ? 'border-accent-500 ring-2 ring-accent-500/20 shadow-md'
          : hovered
            ? 'border-primary-300 shadow-card-hover'
            : 'border-primary-200'
      }`}
    >
      <Card padding="md" className="hover:shadow-card-hover transition-shadow duration-200">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <Link href={`/app/applications/${app.id}`} className="group">
              <h3 className="font-sans font-semibold text-primary-900 text-sm group-hover:text-accent-700 transition-colors">
                {app.title}
              </h3>
            </Link>
            <p className="font-mono text-xs text-primary-400 mt-0.5">{app.reference}</p>

            <p className="font-sans text-xs text-primary-500 mt-1.5 flex items-center gap-1">
              <MapPin size={11} className="shrink-0" /> {app.address}, {app.postcode}
            </p>

            <p className="font-sans text-xs text-primary-400 mt-1">{app.council} · {app.ward}</p>

            <p className="font-sans text-xs text-primary-600 mt-2.5 leading-relaxed line-clamp-2">
              {app.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge variant={statusVariant[app.status]}>{app.status}</Badge>
              <Badge variant="neutral">{app.applicationType}</Badge>
              {app.tradeTags.map((tag) => (
                <Badge key={tag} variant="accent">{tag}</Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className="font-sans text-xs text-primary-400 flex items-center gap-1">
              <Calendar size={11} /> {app.dateReceived}
            </span>
            <span className="font-sans text-xs text-primary-500 flex items-center gap-1">
              <Clock size={11} /> {app.distanceMiles} miles
            </span>
            <span className="inline-flex items-center gap-0.5 font-sans text-xs font-semibold text-primary-700">
              <PoundSterling size={11} /> {app.estimatedValue}
            </span>
            <div className="flex flex-col gap-1.5 mt-1">
              <Link href={`/app/applications/${app.id}`}>
                <Button size="sm" variant="outline" leftIcon={<FileText size={13} />}>
                  View
                </Button>
              </Link>
              <Button
                size="sm"
                variant="primary"
                leftIcon={<Plus size={13} />}
                onClick={() => onAddLead?.(app)}
              >
                Add to Leads
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
