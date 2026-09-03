'use client';

import { Target, Wrench, User, TrendingUp } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import type { SearchApplication } from '@/lib/mock/applications';

interface ApplicationIntelligenceProps {
  application: SearchApplication;
}

export function ApplicationIntelligence({ application: app }: ApplicationIntelligenceProps) {
  return (
    <Card padding="none" className="overflow-hidden border-accent-200">
      <div className="bg-accent-50 px-5 py-4 border-b border-accent-200">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-600 text-white">
            <Target size={16} />
          </div>
          <div>
            <p className="font-sans font-semibold text-primary-900 text-sm">Application Intelligence</p>
            <p className="font-sans text-xs text-primary-500">Potential work identified from this application</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <Wrench size={13} className="text-accent-600" />
            <p className="font-sans font-semibold text-primary-800 text-xs uppercase tracking-wider">Potential work identified</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {app.potentialWork.map((item, i) => (
              <div key={i} className="rounded-lg border border-primary-200 bg-white p-3">
                <p className="font-sans font-semibold text-primary-900 text-sm">{item.trade}</p>
                {item.count !== undefined && (
                  <p className="font-sans text-2xl font-bold text-accent-700 mt-1">{item.count}</p>
                )}
                {item.detail && (
                  <p className="font-sans text-xs text-primary-500 mt-1">{item.detail}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-accent-200 bg-accent-50/50 p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-100 shrink-0">
            <User size={16} className="text-accent-700" />
          </div>
          <div>
            <p className="font-sans text-xs text-primary-500 uppercase tracking-wider font-semibold">Potential trade</p>
            <p className="font-sans font-semibold text-primary-900 text-sm mt-0.5">{app.potentialTrade}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-primary-200 bg-primary-50 p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-900 text-white shrink-0">
            <TrendingUp size={16} />
          </div>
          <div>
            <p className="font-sans text-xs text-primary-500 uppercase tracking-wider font-semibold">Estimated value</p>
            <p className="font-sans font-semibold text-primary-900 text-sm mt-0.5">{app.estimatedValue}</p>
          </div>
          <div className="ml-auto">
            <Badge variant="accent">{app.tradeTags.length} trade tags</Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
