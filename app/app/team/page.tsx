'use client';

import { IceCream as Team } from 'lucide-react';
import { EmptyState, Button } from '@/components/ui';

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-primary-900 text-h2">Team</h1>
        <p className="font-sans text-primary-500 text-sm mt-1">
          Manage team members, roles, and permissions.
        </p>
      </div>

      <div className="rounded-xl border border-primary-200 bg-white">
        <EmptyState
          icon={Team}
          title="No team members yet"
          description="Invite team members to share leads, proposals, and collaborate on your pipeline."
          action={
            <Button size="sm">Invite Member</Button>
          }
        />
      </div>
    </div>
  );
}
