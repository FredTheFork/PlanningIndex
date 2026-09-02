import { MapPin, Plus, PoundSterling } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import type { MockNearbyApplication } from '@/lib/mock/workspace';

const relevanceVariant: Record<MockNearbyApplication['tradeRelevance'], 'success' | 'warning' | 'neutral'> = {
  High: 'success',
  Medium: 'warning',
  Low: 'neutral',
};

function distanceColor(miles: number): string {
  if (miles <= 8) return 'bg-emerald-500';
  if (miles <= 12) return 'bg-amber-500';
  return 'bg-slate-400';
}

function distanceLabel(miles: number): string {
  return `${miles} mile${miles === 1 ? '' : 's'} away`;
}

interface ApplicationsNearYouProps {
  applications: MockNearbyApplication[];
}

export function ApplicationsNearYou({ applications }: ApplicationsNearYouProps) {
  if (applications.length === 0) {
    return (
      <Card padding="md">
        <p className="font-sans text-sm text-primary-500 text-center py-4">
          No nearby applications found. Try expanding your search radius.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {applications.map((app) => (
        <Card key={app.id} padding="md" className="hover:shadow-card-hover transition-shadow">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-sans font-semibold text-primary-900 text-sm truncate">{app.title}</h3>
              <p className="font-mono text-xs text-primary-400 mt-0.5">{app.reference}</p>
              <p className="font-sans text-xs text-primary-500 mt-1.5 flex items-center gap-1">
                <MapPin size={11} className="shrink-0" /> {app.address}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={relevanceVariant[app.tradeRelevance]}>{app.tradeTag}</Badge>
                <span className="inline-flex items-center gap-0.5 font-sans text-xs text-primary-600 font-medium">
                  <PoundSterling size={11} /> {app.estimatedValue}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${distanceColor(app.distanceMiles)}`} />
                <span className="font-sans text-xs text-primary-500">{distanceLabel(app.distanceMiles)}</span>
              </div>
              <Button size="sm" variant="outline" leftIcon={<Plus size={13} />}>
                Leads
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
